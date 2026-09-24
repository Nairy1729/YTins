import { z } from 'zod';

export const SOURCE_KINDS = ['youtube', 'upload'] as const;
export const sourceKindSchema = z.enum(SOURCE_KINDS);
export type SourceKind = z.infer<typeof sourceKindSchema>;

export const trackSchema = z.object({
  sourceId: z.string().min(1),
  sourceKind: sourceKindSchema,
  title: z.string().min(1),
  artist: z.string().nullable(),
  durationSeconds: z.number().int().min(0),
  thumbnailUrl: z.string().nullable(),
  webUrl: z.string().nullable(),
});
export type Track = z.infer<typeof trackSchema>;