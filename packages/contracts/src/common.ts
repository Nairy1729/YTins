import { z } from 'zod';

export const SCHEMA_VERSION = '0.1.0';

export const VIDEO = {
  WIDTH: 1080,
  HEIGHT: 1920,
  FPS: 30,
  ASPECT: '9:16',
} as const;

/** MVP renders a segment, not the full song. See decision D3 (30–45s). */
export const SEGMENT_LIMITS = {
  MIN_MS: 30_000,
  MAX_MS: 45_000,
  DEFAULT_MS: 40_000,
} as const;

export const idSchema = z.string().min(1).max(64);
export const msSchema = z.number().int().min(0);
export const unitSchema = z.number().min(0).max(1);