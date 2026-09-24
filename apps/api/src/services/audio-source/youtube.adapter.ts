import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import ffmpegStatic from 'ffmpeg-static';
import { canonicalYouTubeUrl, trackSchema } from '@reverie/contracts';
import type { Track } from '@reverie/contracts';
import { env } from '../../config/env.js';
import { AppError } from '../../lib/app-error.js';
import { logger } from '../../lib/logger.js';
import { STORAGE_PATHS } from '../../lib/storage.js';
import { runYtDlp } from './ytdlp.js';
import type { AudioAsset, AudioSource } from './types.js';

const AUDIO_EXTENSIONS = ['m4a', 'webm', 'opus', 'mp3', 'ogg', 'mp4', 'aac'];

// ffmpeg-static exports a bare string via module.exports, which NodeNext
// types as a namespace. Narrow it at runtime rather than casting blindly.
const BUNDLED_FFMPEG: string | null = typeof ffmpegStatic === 'string' ? ffmpegStatic : null;

interface ExistingAudio {
  filePath: string;
  format: string;
  bytes: number;
}

function firstString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) return value.trim();
  }
  return null;
}

function ffmpegArgs(): string[] {
  const binary = env.FFMPEG_PATH ?? BUNDLED_FFMPEG;
  return binary ? ['--ffmpeg-location', path.dirname(binary)] : [];
}

export class YouTubeAudioSource implements AudioSource {
  readonly kind = 'youtube' as const;

  constructor(readonly sourceId: string) {}

  async probe(): Promise<Track> {
    const { stdout } = await runYtDlp([
      '--dump-single-json',
      '--skip-download',
      '--no-playlist',
      '--no-warnings',
      canonicalYouTubeUrl(this.sourceId),
    ]);

    let raw: unknown;
    try {
      raw = JSON.parse(stdout);
    } catch {
      throw AppError.internal('yt-dlp returned unparseable metadata');
    }

    const info = raw as Record<string, unknown>;
    const duration = Math.round(Number(info.duration ?? 0));

    if (!Number.isFinite(duration) || duration <= 0) {
      throw new AppError('SOURCE_UNAVAILABLE', 'No duration reported', {
        status: 422,
        userMessage: 'We could not read that video. Live streams are not supported.',
        recoverable: true,
      });
    }

    if (duration > env.MAX_SOURCE_SECONDS) {
      const limit =
        env.MAX_SOURCE_SECONDS >= 60
          ? Math.floor(env.MAX_SOURCE_SECONDS / 60) + ' minutes'
          : env.MAX_SOURCE_SECONDS + ' seconds';

      throw new AppError('SOURCE_TOO_LONG', 'Duration ' + duration + 's exceeds limit', {
        status: 422,
        userMessage: 'That video is longer than we support. Try something under ' + limit + '.',
        recoverable: true,
      });
    }

    return trackSchema.parse({
      sourceId: this.sourceId,
      sourceKind: 'youtube',
      title: firstString(info.track, info.title) ?? 'Unknown track',
      artist: firstString(info.artist, info.creator, info.uploader, info.channel),
      durationSeconds: duration,
      thumbnailUrl: firstString(info.thumbnail),
      webUrl: canonicalYouTubeUrl(this.sourceId),
    });
  }

  private async findExisting(): Promise<ExistingAudio | null> {
    const entries = await readdir(STORAGE_PATHS.audio).catch(() => [] as string[]);

    for (const name of entries) {
      if (!name.startsWith(this.sourceId + '.')) continue;

      const format = name.slice(this.sourceId.length + 1).toLowerCase();
      if (!AUDIO_EXTENSIONS.includes(format)) continue;

      const full = path.join(STORAGE_PATHS.audio, name);
      const info = await stat(full).catch(() => null);
      if (info && info.size > 0) {
        return { filePath: full, format, bytes: info.size };
      }
    }

    return null;
  }

  async fetchAudio(): Promise<AudioAsset> {
    const cached = await this.findExisting();
    if (cached) {
      logger.debug({ sourceId: this.sourceId }, 'Audio cache hit');
      return { sourceId: this.sourceId, ...cached };
    }

    // No -x and no --audio-format, so yt-dlp performs no post-processing
    // and therefore needs neither ffmpeg nor ffprobe at this stage.
    await runYtDlp([
      '-f',
      'bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio',
      '--no-playlist',
      '--no-warnings',
      ...ffmpegArgs(),
      '-o',
      path.join(STORAGE_PATHS.audio, this.sourceId + '.%(ext)s'),
      canonicalYouTubeUrl(this.sourceId),
    ]);

    const written = await this.findExisting();
    if (!written) {
      throw new AppError('AUDIO_FETCH_FAILED', 'No audio file produced for ' + this.sourceId, {
        status: 502,
        userMessage: 'The audio could not be prepared. Please try again.',
        recoverable: true,
      });
    }

    logger.info(
      { sourceId: this.sourceId, format: written.format, bytes: written.bytes },
      'Audio downloaded',
    );

    return { sourceId: this.sourceId, ...written };
  }
}