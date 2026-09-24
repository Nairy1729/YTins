import type { Lyrics, Timeline, Track } from '@reverie/contracts';
import { jobStore } from './job-store.js';
import { resolveAudioSource } from '../services/audio-source/index.js';
import { fetchLyricsForTrack } from '../services/lyrics/index.js';
import { buildTimeline } from '../services/timeline/index.js';
import { directScenes } from '../services/visual-director/index.js';
import { AppError } from '../lib/app-error.js';
import { logger } from '../lib/logger.js';
import { env } from '../config/env.js';

const STUB_TRACK: Track = {
  sourceId: 'stub0000000',
  sourceKind: 'youtube',
  title: 'Stub Track',
  artist: 'Reverie',
  durationSeconds: 180,
  thumbnailUrl: null,
  webUrl: null,
};

const STUB_LYRICS: Lyrics = {
  source: 'lrclib',
  synced: true,
  instrumental: false,
  lineCount: 2,
  matchedTitle: 'Stub Track',
  matchedArtist: 'Reverie',
  lines: [
    { text: 'I still remember your face', startMs: 1000 },
    { text: 'Walking alone in the rain', startMs: 4500 },
  ],
};

const isStub = env.PIPELINE_MODE === 'stub';
const SPEED = isStub ? 0.02 : 1;

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, Math.max(1, Math.round(ms * SPEED))));

function formatClock(ms: number): string {
  const total = Math.round(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return minutes + ':' + String(seconds).padStart(2, '0');
}

function describeLyrics(lyrics: Lyrics): string {
  if (lyrics.instrumental) return 'Instrumental track, visuals will follow the mood';
  if (lyrics.lineCount === 0) return 'No lyrics found, switching to instrumental treatment';
  if (lyrics.synced) return lyrics.lineCount + ' lines with timing';
  return lyrics.lineCount + ' lines, no timing available';
}

function describeTimeline(timeline: Timeline): string {
  const length = Math.round(timeline.segment.durationMs / 1000);
  const from = formatClock(timeline.segment.startMs);

  if (timeline.kind === 'instrumental') {
    return 'Chose a ' + length + ' second window from ' + from;
  }

  return (
    'Chose a ' +
    length +
    ' second window from ' +
    from +
    ' with ' +
    timeline.segmentLineCount +
    ' lines'
  );
}

async function ingest(jobId: string, url: string): Promise<Track> {
  if (isStub) {
    jobStore.update(jobId, { track: STUB_TRACK, detail: 'Audio ready', progress: 0.2 });
    return STUB_TRACK;
  }

  const source = resolveAudioSource(url);
  const track = await source.probe();

  jobStore.update(jobId, { track, detail: 'Fetching audio', progress: 0.1 });

  const asset = await source.fetchAudio();
  jobStore.update(jobId, { audioPath: asset.filePath, detail: 'Audio ready', progress: 0.2 });

  return track;
}

async function getLyrics(jobId: string, track: Track): Promise<Lyrics> {
  jobStore.update(jobId, {
    state: 'processing_lyrics',
    detail: 'Looking for lyrics',
    progress: 0.28,
  });

  const lyrics = isStub ? STUB_LYRICS : await fetchLyricsForTrack(track);

  jobStore.update(jobId, { lyrics, detail: describeLyrics(lyrics), progress: 0.38 });
  return lyrics;
}

function synchronise(jobId: string, lyrics: Lyrics, track: Track): Timeline {
  const timeline = buildTimeline(lyrics, track.durationSeconds);

  jobStore.update(jobId, {
    state: 'analyzing',
    detail: describeTimeline(timeline),
    progress: 0.56,
    timeline,
  });

  return timeline;
}

export async function runPipeline(jobId: string): Promise<void> {
  const job = jobStore.get(jobId);
  if (!job) return;

  try {
    jobStore.update(jobId, {
      state: 'processing_song',
      detail: 'Identifying the song',
      progress: 0.04,
    });

    const track = await ingest(jobId, job.input.url);
    const lyrics = await getLyrics(jobId, track);
    const timeline = synchronise(jobId, lyrics, track);

    logger.info(
      { jobId, kind: timeline.kind, lines: timeline.lineCount, segment: timeline.segment },
      'Timeline built',
    );

    await delay(1200);

    const instrumental = timeline.kind === 'instrumental';

    // Stage 4: AI Visual Director
    jobStore.update(jobId, {
      state: 'generating_visuals',
      detail: instrumental ? 'Composing scenes from mood' : 'Composing scenes from the lyrics',
      progress: 0.68,
    });

    const directorResult = await directScenes({
      track,
      lyrics,
      timeline,
      styleId: job.input.styleId,
    });

    jobStore.update(jobId, {
      scenePlan: directorResult.scenePlan,
      detail: `Composed ${directorResult.scenePlan.scenes.length} scenes (${directorResult.analysis.dominantEmotion})`,
      progress: 0.82,
    });
    await delay(600);

    jobStore.update(jobId, {
      state: 'rendering',
      detail: 'Rendering 1080x1920',
      progress: 0.92,
    });
    await delay(2200);

    if (job.input.simulate === 'failure') {
      throw new AppError('RENDER_FAILED', 'Simulated rendering failure', {
        userMessage: 'We could not finish this reel. Trying again usually works.',
        recoverable: true,
      });
    }

    jobStore.update(jobId, {
      state: 'completed',
      progress: 1,
      detail: undefined,
      outputUrl: '/api/media/' + jobId + '.mp4',
    });
  } catch (err) {
    const appError =
      err instanceof AppError ? err : AppError.internal('Pipeline failure', { cause: err });

    logger.error({ jobId, code: appError.code, err }, 'Pipeline failed');

    jobStore.update(jobId, {
      state: 'failed',
      error: {
        code: appError.code,
        userMessage: appError.userMessage,
        recoverable: appError.recoverable,
      },
    });
  }
}