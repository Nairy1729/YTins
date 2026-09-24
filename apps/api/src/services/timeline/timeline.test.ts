import { describe, expect, it } from 'vitest';
import { buildTimedLines, estimateTimedLines, detectGaps } from './build.js';
import { selectSegment } from './segment.js';

const line = (text: string, startMs: number | null) => ({ text, startMs });

describe('buildTimedLines', () => {
  it('ends each line where the next begins', () => {
    const result = buildTimedLines([line('a', 0), line('b', 3000)], 10000);
    expect(result[0]).toEqual({ text: 'a', startMs: 0, endMs: 3000, durationMs: 3000 });
  });

  it('caps long lines', () => {
    const result = buildTimedLines([line('a', 0), line('b', 60000)], 120000);
    expect(result[0]?.durationMs).toBe(8000);
  });

  it('gives the final line a tail and respects track length', () => {
    const result = buildTimedLines([line('last', 9000)], 10000);
    expect(result[0]?.endMs).toBe(10000);
  });

  it('ignores lines without timestamps', () => {
    expect(buildTimedLines([line('a', null)], 10000)).toHaveLength(0);
  });

  it('sorts unordered input', () => {
    const result = buildTimedLines([line('b', 5000), line('a', 1000)], 10000);
    expect(result[0]?.text).toBe('a');
  });
});

describe('estimateTimedLines', () => {
  it('spreads lines across the track', () => {
    const result = estimateTimedLines([line('a', null), line('b', null)], 100000);
    expect(result).toHaveLength(2);
    expect(result[0]!.startMs).toBeLessThan(result[1]!.startMs);
    expect(result[1]!.endMs).toBeLessThanOrEqual(100000);
  });

  it('returns nothing for an empty list', () => {
    expect(estimateTimedLines([], 100000)).toHaveLength(0);
  });
});

describe('detectGaps', () => {
  it('finds an intro gap', () => {
    const lines = buildTimedLines([line('a', 12000)], 20000);
    const gaps = detectGaps(lines, 20000);
    expect(gaps[0]).toMatchObject({ startMs: 0, endMs: 12000 });
  });

  it('treats a track with no lines as one long gap', () => {
    expect(detectGaps([], 60000)).toHaveLength(1);
  });
});

describe('selectSegment', () => {
  it('returns the whole track when it is short', () => {
    const segment = selectSegment([], 20000, 40000);
    expect(segment.reason).toBe('whole track');
    expect(segment.startMs).toBe(0);
  });

  it('skips the intro for instrumental tracks', () => {
    const segment = selectSegment([], 200000, 40000);
    expect(segment.startMs).toBeGreaterThan(0);
    expect(segment.durationMs).toBe(40000);
  });

  it('prefers the repeated section', () => {
    const lines = buildTimedLines(
      [
        line('verse one', 0),
        line('verse two', 5000),
        line('chorus', 100000),
        line('chorus', 104000),
        line('chorus', 108000),
        line('outro', 160000),
      ],
      200000,
    );
    const segment = selectSegment(lines, 200000, 40000);
    expect(segment.reason).toBe('repeated section');
    expect(segment.startMs).toBeGreaterThanOrEqual(100000);
  });

  it('never exceeds the target length', () => {
    const lines = buildTimedLines([line('a', 0), line('b', 90000)], 200000);
    expect(selectSegment(lines, 200000, 40000).durationMs).toBeLessThanOrEqual(40000);
  });
});