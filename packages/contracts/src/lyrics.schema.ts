import { z } from 'zod';

export const LYRICS_SOURCES = ['lrclib', 'none'] as const;
export const lyricsSourceSchema = z.enum(LYRICS_SOURCES);
export type LyricsSource = z.infer<typeof lyricsSourceSchema>;

export const lyricsLineSchema = z.object({
  text: z.string().min(1).max(400),
  startMs: z.number().int().min(0).nullable(),
});
export type LyricsLine = z.infer<typeof lyricsLineSchema>;

export const lyricsSummarySchema = z.object({
  source: lyricsSourceSchema,
  synced: z.boolean(),
  instrumental: z.boolean(),
  lineCount: z.number().int().min(0),
  matchedTitle: z.string().nullable(),
  matchedArtist: z.string().nullable(),
});
export type LyricsSummary = z.infer<typeof lyricsSummarySchema>;

export const lyricsSchema = lyricsSummarySchema.extend({
  lines: z.array(lyricsLineSchema),
});
export type Lyrics = z.infer<typeof lyricsSchema>;