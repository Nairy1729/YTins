import type { Gap, LyricsLine, TimedLine } from '@reverie/contracts';

const MAX_LINE_MS = 8000;
const MIN_LINE_MS = 400;
const TAIL_LINE_MS = 4000;
const MIN_GAP_MS = 4000;

/** Turns timestamped lyric lines into lines with real durations. */
export function buildTimedLines(lines: LyricsLine[], trackDurationMs: number): TimedLine[] {
  const stamped: { text: string; startMs: number }[] = [];

  for (const line of lines) {
    if (line.startMs === null) continue;
    if (line.startMs >= trackDurationMs) continue;
    stamped.push({ text: line.text, startMs: line.startMs });
  }

  stamped.sort((a, b) => a.startMs - b.startMs);

  const out: TimedLine[] = [];

  for (let index = 0; index < stamped.length; index += 1) {
    const line = stamped[index];
    if (!line) continue;

    const next = stamped[index + 1];
    const naturalEnd = next ? next.startMs : line.startMs + TAIL_LINE_MS;

    let endMs = Math.min(naturalEnd, line.startMs + MAX_LINE_MS, trackDurationMs);
    if (endMs - line.startMs < MIN_LINE_MS) {
      endMs = Math.min(line.startMs + MIN_LINE_MS, trackDurationMs);
    }

    const durationMs = endMs - line.startMs;
    if (durationMs < 1) continue;

    out.push({ text: line.text, startMs: line.startMs, endMs, durationMs });
  }

  return out;
}

/**
 * For plain lyrics with no timing, spread lines evenly across the body of
 * the track. Deliberately crude and flagged as 'estimated'.
 */
export function estimateTimedLines(lines: LyricsLine[], trackDurationMs: number): TimedLine[] {
  if (lines.length === 0 || trackDurationMs <= 0) return [];

  const start = Math.round(trackDurationMs * 0.08);
  const end = Math.round(trackDurationMs * 0.95);
  const span = end - start;
  if (span <= 0) return [];

  const per = Math.max(MIN_LINE_MS, Math.floor(span / lines.length));
  const out: TimedLine[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line) continue;

    const startMs = start + index * per;
    if (startMs >= trackDurationMs) break;

    const endMs = Math.min(startMs + per, trackDurationMs);
    const durationMs = endMs - startMs;
    if (durationMs < 1) continue;

    out.push({ text: line.text, startMs, endMs, durationMs });
  }

  return out;
}

/** Instrumental breaks worth knowing about when composing scenes. */
export function detectGaps(
  lines: TimedLine[],
  trackDurationMs: number,
  minGapMs: number = MIN_GAP_MS,
): Gap[] {
  const gaps: Gap[] = [];

  if (lines.length === 0) {
    if (trackDurationMs >= minGapMs) {
      gaps.push({ startMs: 0, endMs: trackDurationMs, durationMs: trackDurationMs });
    }
    return gaps;
  }

  const first = lines[0];
  if (first && first.startMs >= minGapMs) {
    gaps.push({ startMs: 0, endMs: first.startMs, durationMs: first.startMs });
  }

  for (let index = 0; index < lines.length - 1; index += 1) {
    const current = lines[index];
    const next = lines[index + 1];
    if (!current || !next) continue;

    const durationMs = next.startMs - current.endMs;
    if (durationMs >= minGapMs) {
      gaps.push({ startMs: current.endMs, endMs: next.startMs, durationMs });
    }
  }

  const last = lines[lines.length - 1];
  if (last && trackDurationMs - last.endMs >= minGapMs) {
    gaps.push({
      startMs: last.endMs,
      endMs: trackDurationMs,
      durationMs: trackDurationMs - last.endMs,
    });
  }

  return gaps;
}