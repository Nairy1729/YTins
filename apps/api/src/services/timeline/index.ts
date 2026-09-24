import { SEGMENT_LIMITS, timelineSchema } from '@reverie/contracts';
import type { Lyrics, Timeline, TimedLine, TimelineKind } from '@reverie/contracts';
import { buildTimedLines, detectGaps, estimateTimedLines } from './build.js';
import { selectSegment } from './segment.js';

export { buildTimedLines, estimateTimedLines, detectGaps } from './build.js';
export { selectSegment } from './segment.js';

export function buildTimeline(
  lyrics: Lyrics,
  trackDurationSeconds: number,
  targetMs: number = SEGMENT_LIMITS.DEFAULT_MS,
): Timeline {
  const totalDurationMs = Math.max(0, Math.round(trackDurationSeconds * 1000));

  let kind: TimelineKind = 'instrumental';
  let lines: TimedLine[] = [];

  if (lyrics.lineCount > 0 && !lyrics.instrumental) {
    if (lyrics.synced) {
      kind = 'timed';
      lines = buildTimedLines(lyrics.lines, totalDurationMs);
    } else {
      kind = 'estimated';
      lines = estimateTimedLines(lyrics.lines, totalDurationMs);
    }
  }

  if (lines.length === 0) kind = 'instrumental';

  const segment = selectSegment(lines, totalDurationMs, targetMs);

  const segmentLineCount = lines.filter(
    (line) => line.startMs >= segment.startMs && line.endMs <= segment.endMs,
  ).length;

  return timelineSchema.parse({
    kind,
    lineCount: lines.length,
    segmentLineCount,
    totalDurationMs,
    segment,
    lines,
    gaps: detectGaps(lines, totalDurationMs),
  });
}