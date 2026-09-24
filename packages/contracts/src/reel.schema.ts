import { z } from 'zod';
import { jobSnapshotSchema } from './job.schema.js';
import { lyricTreatmentSchema, styleIdSchema } from './style.schema.js';
import { youtubeUrlSchema } from './youtube.js';

export const ANIMATION_INTENSITIES = ['subtle', 'balanced', 'expressive'] as const;
export const animationIntensitySchema = z.enum(ANIMATION_INTENSITIES);
export type AnimationIntensity = z.infer<typeof animationIntensitySchema>;

export const createReelRequestSchema = z.object({
  url: youtubeUrlSchema,
  styleId: styleIdSchema,
  lyricTreatment: lyricTreatmentSchema.default('minimal'),
  animationIntensity: animationIntensitySchema.default('balanced'),
  /** Development only. Ignored outside development. */
  simulate: z.enum(['success', 'failure']).optional(),
});
export type CreateReelRequest = z.infer<typeof createReelRequestSchema>;

export const createReelResponseSchema = jobSnapshotSchema;
export type CreateReelResponse = z.infer<typeof createReelResponseSchema>;