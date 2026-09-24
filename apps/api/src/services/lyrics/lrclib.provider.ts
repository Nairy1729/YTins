import { lyricsSchema } from '@reverie/contracts';
import type { Lyrics, Track } from '@reverie/contracts';
import { logger } from '../../lib/logger.js';
import { buildSearchCandidates, isModifiedUpload } from './title.js';
import type { TitleGuess } from './title.js';
import { parseLrc, parsePlain } from './lrc.js';
import { normalizeLines } from './normalize.js';

const BASE = 'https://lrclib.net/api';
const TIMEOUT_MS = 8000;
const DURATION_TOLERANCE_S = 8;
const USER_AGENT = 'Reverie/0.1 (song to visual story prototype)';

interface LrclibRecord {
  trackName?: string;
  artistName?: string;
  duration?: number;
  instrumental?: boolean;
  plainLyrics?: string | null;
  syncedLyrics?: string | null;
}

export function emptyLyrics(): Lyrics {
  return {
    source: 'none',
    synced: false,
    instrumental: false,
    lineCount: 0,
    matchedTitle: null,
    matchedArtist: null,
    lines: [],
  };
}

async function getJson<T>(url: string): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function toLyrics(record: LrclibRecord): Lyrics | null {
  const matchedTitle = record.trackName ?? null;
  const matchedArtist = record.artistName ?? null;

  if (record.instrumental === true) {
    return lyricsSchema.parse({
      source: 'lrclib',
      synced: false,
      instrumental: true,
      lineCount: 0,
      matchedTitle,
      matchedArtist,
      lines: [],
    });
  }

  if (record.syncedLyrics && record.syncedLyrics.trim().length > 0) {
    const lines = normalizeLines(
      parseLrc(record.syncedLyrics).map((line) => ({ text: line.text, startMs: line.startMs })),
    );
    if (lines.length > 0) {
      return lyricsSchema.parse({
        source: 'lrclib',
        synced: true,
        instrumental: false,
        lineCount: lines.length,
        matchedTitle,
        matchedArtist,
        lines,
      });
    }
  }

  if (record.plainLyrics && record.plainLyrics.trim().length > 0) {
    const lines = normalizeLines(
      parsePlain(record.plainLyrics).map((text) => ({ text, startMs: null })),
    );
    if (lines.length > 0) {
      return lyricsSchema.parse({
        source: 'lrclib',
        synced: false,
        instrumental: false,
        lineCount: lines.length,
        matchedTitle,
        matchedArtist,
        lines,
      });
    }
  }

  return null;
}

async function tryCandidate(
  candidate: TitleGuess,
  durationSeconds: number,
  strictDuration: boolean,
): Promise<Lyrics | null> {
  if (candidate.artist) {
    const exact = new URL(BASE + '/get');
    exact.searchParams.set('artist_name', candidate.artist);
    exact.searchParams.set('track_name', candidate.title);
    if (strictDuration) exact.searchParams.set('duration', String(durationSeconds));

    const record = await getJson<LrclibRecord>(exact.toString());
    if (record) {
      const lyrics = toLyrics(record);
      if (lyrics) return lyrics;
    }
  }

  const search = new URL(BASE + '/search');
  search.searchParams.set('q', [candidate.artist, candidate.title].filter(Boolean).join(' '));

  const results = await getJson<LrclibRecord[]>(search.toString());
  if (!Array.isArray(results) || results.length === 0) return null;

  const ranked = results
    .map((record) => ({
      record,
      gap: Math.abs((record.duration ?? 0) - durationSeconds),
    }))
    .sort((a, b) => a.gap - b.gap);

  for (const entry of ranked) {
    if (strictDuration && entry.gap > DURATION_TOLERANCE_S) break;
    const lyrics = toLyrics(entry.record);
    if (lyrics) return lyrics;
  }

  return null;
}

export async function fetchFromLrclib(track: Track): Promise<Lyrics> {
  const modified = isModifiedUpload(track.title);
  const candidates = buildSearchCandidates(track.title, track.artist);

  logger.debug(
    { modified, candidates: candidates.map((c) => c.artist + ' / ' + c.title) },
    'Lyrics candidates',
  );

  for (const candidate of candidates) {
    const lyrics = await tryCandidate(candidate, track.durationSeconds, !modified);
    if (lyrics) {
      logger.debug(
        { matched: lyrics.matchedArtist + ' / ' + lyrics.matchedTitle, synced: lyrics.synced },
        'Lyrics matched',
      );
      return lyrics;
    }
  }

  return emptyLyrics();
}