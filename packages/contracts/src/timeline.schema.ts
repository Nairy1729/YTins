import { z } from 'zod';

export const TIMELINE_KINDS = ['timed', 'estimated', 'instrumental'] as const;
export const timelineKindSchema = z.enum(TIMELINE_KINDS);
export type TimelineKind = z.infer<typeof timelineKindSchema>;

export const timedLineSchema = z.object({
  text: z.string().min(1).max(400),
  startMs: z.number().int().min(0),
  endMs: z.number().int().min(0),
  durationMs: z.number().int().min(1),
});
export type TimedLine = z.infer<typeof timedLineSchema>;

export const segmentSchema = z.object({
  startMs: z.number().int().min(0),
  endMs: z.number().int().min(0),
  durationMs: z.number().int().min(1),
  reason: z.string(),
});
export type Segment = z.infer<typeof segmentSchema>;

export const gapSchema = z.object({
  startMs: z.number().int().min(0),
  endMs: z.number().int().min(0),
  durationMs: z.number().int().min(1),
});
export type Gap = z.infer<typeof gapSchema>;

export const timelineSummarySchema = z.object({
  kind: timelineKindSchema,
  lineCount: z.number().int().min(0),
  segmentLineCount: z.number().int().min(0),
  totalDurationMs: z.number().int().min(0),
  segment: segmentSchema,
});
export type TimelineSummary = z.infer<typeof timelineSummarySchema>;

export const timelineSchema = timelineSummarySchema.extend({
  lines: z.array(timedLineSchema),
  gaps: z.array(gapSchema),
});
export type Timeline = z.infer<typeof timelineSchema>;