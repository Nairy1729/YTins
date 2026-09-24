import type { Lyrics, Track } from '@reverie/contracts';
import { logger } from '../../lib/logger.js';
import { emptyLyrics, fetchFromLrclib } from './lrclib.provider.js';

export { emptyLyrics } from './lrclib.provider.js';

/**
 * Never throws. Missing lyrics is a supported outcome, not an error:
 * the product falls back to an instrumental visual treatment.
 */
export async function fetchLyricsForTrack(track: Track): Promise<Lyrics> {
  try {
    return await fetchFromLrclib(track);
  } catch (err) {
    logger.warn({ err, sourceId: track.sourceId }, 'Lyrics lookup failed');
    return emptyLyrics();
  }
}