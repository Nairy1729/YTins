import { z } from 'zod';
import { idSchema, unitSchema } from './common.js';
import { apiErrorSchema } from './errors.js';
import { trackSchema } from './track.schema.js';
import { lyricsSummarySchema } from './lyrics.schema.js';
import { timelineSummarySchema } from './timeline.schema.js';
import { scenePlanSchema } from './scene-plan.schema.js';

export const JOB_STATES = [
  'queued',
  'processing_song',
  'processing_lyrics',
  'analyzing',
  'generating_visuals',
  'rendering',
  'completed',
  'failed',
] as const;

export const jobStateSchema = z.enum(JOB_STATES);
export type JobState = z.infer<typeof jobStateSchema>;

export const TERMINAL_JOB_STATES: readonly JobState[] = ['completed', 'failed'];

export const JOB_STAGE_LABELS: Record<JobState, string> = {
  queued: 'Queued',
  processing_song: 'Identifying the song',
  processing_lyrics: 'Processing lyrics',
  analyzing: 'Understanding the song',
  generating_visuals: 'Designing scenes',
  rendering: 'Rendering your reel',
  completed: 'Complete',
  failed: 'Failed',
};

export const jobSnapshotSchema = z.object({
  jobId: idSchema,
  state: jobStateSchema,
  progress: unitSchema,
  stageLabel: z.string(),
  detail: z.string().optional(),
  track: trackSchema.optional(),
  lyrics: lyricsSummarySchema.optional(),
  timeline: timelineSummarySchema.optional(),
  scenePlan: scenePlanSchema.optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  outputUrl: z.string().optional(),
  error: apiErrorSchema.optional(),
});
export type JobSnapshot = z.infer<typeof jobSnapshotSchema>;