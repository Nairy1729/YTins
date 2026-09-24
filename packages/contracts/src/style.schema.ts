import { z } from 'zod';

export const STYLE_IDS = [
  'pen-ink',
  'pencil-sketch',
  'hand-drawn',
  'graph-abstract',
  'minimal-type',
  'cinematic',
  'notebook',
  'lyrical-animation',
] as const;
export const styleIdSchema = z.enum(STYLE_IDS);
export type StyleId = z.infer<typeof styleIdSchema>;

export const LYRIC_TREATMENTS = [
  'none',
  'minimal',
  'handwritten_reveal',
  'kinetic',
  'typewriter',
] as const;
export const lyricTreatmentSchema = z.enum(LYRIC_TREATMENTS);
export type LyricTreatment = z.infer<typeof lyricTreatmentSchema>;

export const CAMERA_MOVES = [
  'none',
  'slow_push_in',
  'slow_pull_out',
  'pan_left',
  'pan_right',
  'drift',
] as const;
export const cameraMoveSchema = z.enum(CAMERA_MOVES);
export type CameraMove = z.infer<typeof cameraMoveSchema>;

export const TRANSITIONS = ['cut', 'fade', 'ink_fade', 'wipe', 'dissolve'] as const;
export const transitionSchema = z.enum(TRANSITIONS);
export type Transition = z.infer<typeof transitionSchema>;

export const styleSummarySchema = z.object({
  id: styleIdSchema,
  displayName: z.string(),
  description: z.string(),
  available: z.boolean(),
});
export type StyleSummary = z.infer<typeof styleSummarySchema>;