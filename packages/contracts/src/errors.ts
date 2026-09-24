import { z } from 'zod';

export const ERROR_CODES = [
  'BAD_REQUEST',
  'VALIDATION_FAILED',
  'NOT_FOUND',
  'RATE_LIMITED',
  'INTERNAL_ERROR',
  'INVALID_SOURCE_URL',
  'SOURCE_UNAVAILABLE',
  'SOURCE_TOO_LONG',
  'AUDIO_FETCH_FAILED',
  'LYRICS_UNAVAILABLE',
  'TIMING_UNAVAILABLE',
  'DIRECTOR_FAILED',
  'DIRECTOR_INVALID_OUTPUT',
  'RENDER_FAILED',
  'JOB_TIMEOUT',
] as const;

export const errorCodeSchema = z.enum(ERROR_CODES);
export type ErrorCode = z.infer<typeof errorCodeSchema>;

export const apiErrorSchema = z.object({
  code: errorCodeSchema,
  userMessage: z.string(),
  recoverable: z.boolean(),
  requestId: z.string().optional(),
  details: z.unknown().optional(),
});
export type ApiError = z.infer<typeof apiErrorSchema>;

export const apiErrorResponseSchema = z.object({ error: apiErrorSchema });
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;