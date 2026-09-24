import { SEGMENT_LIMITS } from '@reverie/contracts';
import type { Segment, TimedLine } from '@reverie/contracts';

function normalise(text: string): string {
  return text.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, '').trim();
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Picks the most visually promising window. Density plus repetition is a
 * decent proxy for the chorus, which is usually the emotional peak.
 */
export function selectSegment(
  lines: TimedLine[],
  trackDurationMs: number,
  targetMs: number = SEGMENT_LIMITS.DEFAULT_MS,
): Segment {
  const target = clamp(targetMs, SEGMENT_LIMITS.MIN_MS, SEGMENT_LIMITS.MAX_MS);

  if (trackDurationMs <= target) {
    return {
      startMs: 0,
      endMs: Math.max(1, trackDurationMs),
      durationMs: Math.max(1, trackDurationMs),
      reason: 'whole track',
    };
  }

  if (lines.length === 0) {
    const startMs = clamp(Math.round(trackDurationMs * 0.25), 0, trackDurationMs - target);
    return {
      startMs,
      endMs: startMs + target,
      durationMs: target,
      reason: 'instrumental window',
    };
  }

  const counts = new Map<string, number>();
  for (const line of lines) {
    const key = normalise(line.text);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  let best: { segment: Segment; score: number } | null = null;

  for (const anchor of lines) {
    const windowStart = anchor.startMs;
    const windowEnd = Math.min(windowStart + target, trackDurationMs);

    const inside = lines.filter((line) => line.startMs >= windowStart && line.endMs <= windowEnd);
    const first = inside[0];
    const last = inside[inside.length - 1];
    if (!first || !last) continue;

    let repeated = 0;
    for (const line of inside) {
      if ((counts.get(normalise(line.text)) ?? 1) > 1) repeated += 1;
    }

    const coverage = (last.endMs - first.startMs) / target;
    const score = inside.length + repeated * 1.5 + coverage * 4;

    let startMs = first.startMs;
    let endMs = last.endMs;
    if (endMs - startMs < SEGMENT_LIMITS.MIN_MS) {
      endMs = Math.min(startMs + target, trackDurationMs);
      startMs = Math.max(0, endMs - target);
    }

    const candidate: Segment = {
      startMs,
      endMs,
      durationMs: endMs - startMs,
      reason: repeated > 0 ? 'repeated section' : 'densest section',
    };

    if (!best || score > best.score) best = { segment: candidate, score };
  }

  if (best) return best.segment;

  const fallbackStart = clamp(Math.round(trackDurationMs * 0.25), 0, trackDurationMs - target);
  return {
    startMs: fallbackStart,
    endMs: fallbackStart + target,
    durationMs: target,
    reason: 'fallback window',
  };
}