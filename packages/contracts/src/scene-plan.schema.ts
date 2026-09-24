import { z } from 'zod';
import { SCHEMA_VERSION, SEGMENT_LIMITS, idSchema, msSchema, unitSchema } from './common.js';
import {
  cameraMoveSchema,
  lyricTreatmentSchema,
  styleIdSchema,
  transitionSchema,
} from './style.schema.js';

/**
 * PLACEHOLDER - v0. Finalised in Phase 11 (AI Visual Director).
 * Present now only so api, web and video compile against one shape.
 */

export const motifPlacementSchema = z.object({
  ref: idSchema,
  x: unitSchema,
  y: unitSchema,
  scale: z.number().min(0.1).max(4).default(1),
  rotation: z.number().min(-180).max(180).default(0),
  drawInMs: msSchema.default(800),
  delayMs: msSchema.default(0),
});
export type MotifPlacement = z.infer<typeof motifPlacementSchema>;

export const lyricLineSchema = z.object({
  text: z.string().max(240),
  startMs: msSchema,
  endMs: msSchema,
});
export type LyricLine = z.infer<typeof lyricLineSchema>;

export const sceneSchema = z.object({
  id: idSchema,
  startMs: msSchema,
  durationMs: msSchema.min(200),
  lyric: lyricLineSchema.nullable().default(null),
  emotion: z.string().max(40).default('neutral'),
  motifs: z.array(motifPlacementSchema).max(6).default([]),
  camera: z
    .object({ move: cameraMoveSchema.default('none'), amount: unitSchema.default(0) })
    .default({ move: 'none', amount: 0 }),
  lyricTreatment: lyricTreatmentSchema.default('minimal'),
  transitionOut: transitionSchema.default('fade'),
});
export type Scene = z.infer<typeof sceneSchema>;

export const scenePlanSchema = z.object({
  version: z.literal(SCHEMA_VERSION),
  styleId: styleIdSchema,
  /** All randomness derives from this. Guarantees preview === render. */
  seed: z.number().int().min(0),
  audio: z.object({
    sourceId: idSchema,
    startMs: msSchema,
    durationMs: msSchema.min(SEGMENT_LIMITS.MIN_MS).max(SEGMENT_LIMITS.MAX_MS),
  }),
  scenes: z.array(sceneSchema).min(1).max(120),
});
export type ScenePlan = z.infer<typeof scenePlanSchema>;