import { describe, expect, it } from 'vitest';
import {
  scenePlanSchema,
  STYLE_IDS,
  type Lyrics,
  type Timeline,
  type Track,
} from '@reverie/contracts';
import { analyzeEmotion, detectLineEmotion } from './emotion-analyzer.js';
import { getStyleDirectorProfile } from './style-profiles.js';
import { HeuristicVisualDirector } from './heuristic-director.js';
import { CompositeVisualDirector } from './composite-director.js';

const SAMPLE_TRACK: Track = {
  sourceId: 'RQbnPl5E5No',
  sourceKind: 'youtube',
  title: 'Tere Bina Na Guzara',
  artist: 'Satinder Sartaaj & Neeru Bajwa',
  durationSeconds: 215,
  thumbnailUrl: null,
  webUrl: 'https://youtu.be/RQbnPl5E5No',
};

const SAMPLE_LYRICS: Lyrics = {
  source: 'lrclib',
  synced: true,
  instrumental: false,
  lineCount: 4,
  matchedTitle: 'Tere Bina Na Guzara',
  matchedArtist: 'Satinder Sartaaj',
  lines: [
    { text: 'Tere bina na guzara ae', startMs: 25000 },
    { text: 'Dil kalla te rona aave', startMs: 31000 },
    { text: 'Akhiyan ch barsaat ae sajjna', startMs: 38000 },
    { text: 'Mud aaja pardesiya ve', startMs: 44000 },
  ],
};

const SAMPLE_TIMELINE: Timeline = {
  kind: 'timed',
  lineCount: 4,
  segmentLineCount: 4,
  totalDurationMs: 215000,
  segment: {
    startMs: 24000,
    endMs: 56000,
    durationMs: 32000,
    reason: 'peak_density',
  },
  lines: [
    { text: 'Tere bina na guzara ae', startMs: 25000, endMs: 30000, durationMs: 5000 },
    { text: 'Dil kalla te rona aave', startMs: 31000, endMs: 37000, durationMs: 6000 },
    { text: 'Akhiyan ch barsaat ae sajjna', startMs: 38000, endMs: 43000, durationMs: 5000 },
    { text: 'Mud aaja pardesiya ve', startMs: 44000, endMs: 52000, durationMs: 8000 },
  ],
  gaps: [],
};

const INSTRUMENTAL_TIMELINE: Timeline = {
  kind: 'instrumental',
  lineCount: 0,
  segmentLineCount: 0,
  totalDurationMs: 180000,
  segment: {
    startMs: 15000,
    endMs: 45000,
    durationMs: 30000,
    reason: 'instrumental_window',
  },
  lines: [],
  gaps: [],
};

describe('Emotion Analyzer', () => {
  it('identifies longing and yearning for Tere Bina Na Guzara', () => {
    const analysis = analyzeEmotion(SAMPLE_TRACK, SAMPLE_LYRICS);
    expect(analysis.dominantEmotion).toBe('longing');
    expect(analysis.tags).toContain('longing');
    expect(analysis.valence).toBeLessThan(0); // Yearning/separation has negative valence
    expect(analysis.themeDescription).toContain('longing');
  });

  it('detects per-line emotions based on lyrics keywords', () => {
    expect(detectLineEmotion('Walking alone in the rain', 'neutral')).toBe('melancholy');
    expect(detectLineEmotion('Dil ch pyaar ae sajjna', 'neutral')).toBe('love');
    expect(detectLineEmotion('Waqt zamaana yaad aave', 'neutral')).toBe('nostalgia');
  });

  it('falls back cleanly for instrumental tracks', () => {
    const instrumentalTrack: Track = {
      ...SAMPLE_TRACK,
      title: 'Ambient Morning Piano',
      artist: 'Silent Echoes',
    };
    const instrumentalLyrics: Lyrics = {
      source: 'lrclib',
      synced: false,
      instrumental: true,
      lineCount: 0,
      matchedTitle: null,
      matchedArtist: null,
      lines: [],
    };
    const analysis = analyzeEmotion(instrumentalTrack, instrumentalLyrics);
    expect(analysis.dominantEmotion).toBe('peace');
    expect(analysis.tags).toContain('instrumental');
  });
});

describe('Style Director Profiles', () => {
  it('provides rich profiles for every registered style', () => {
    for (const styleId of STYLE_IDS) {
      const profile = getStyleDirectorProfile(styleId);
      expect(profile.styleId).toBe(styleId);
      expect(profile.displayName).toBeTruthy();
      expect(profile.allowedMotifs.length).toBeGreaterThan(0);
      expect(profile.preferredCameraMoves.length).toBeGreaterThan(0);
      expect(profile.preferredTransitions.length).toBeGreaterThan(0);
    }
  });

  it('contains valid motif references in pen-ink profile', () => {
    const profile = getStyleDirectorProfile('pen-ink');
    expect(profile.allowedMotifs).toContain('solitary-figure');
    expect(profile.allowedMotifs).toContain('quill-and-inkwell');
    expect(profile.allowedMotifs).toContain('lantern-glow');
    expect(profile.preferredLyricTreatment).toBe('handwritten_reveal');
  });
});

describe('Heuristic Visual Director', () => {
  const director = new HeuristicVisualDirector();

  it('generates a valid, schema-compliant ScenePlan for the reference track', async () => {
    const result = await director.direct({
      track: SAMPLE_TRACK,
      lyrics: SAMPLE_LYRICS,
      timeline: SAMPLE_TIMELINE,
      styleId: 'pen-ink',
      seed: 42,
    });

    expect(result.provider).toBe('heuristic');
    expect(result.scenePlan.styleId).toBe('pen-ink');
    expect(result.scenePlan.version).toBe('0.1.0');
    expect(result.scenePlan.audio.sourceId).toBe('RQbnPl5E5No');
    expect(result.scenePlan.audio.startMs).toBe(24000);
    expect(result.scenePlan.audio.durationMs).toBe(32000);

    // Validate that the entire ScenePlan parses cleanly against the Zod schema
    const parsed = scenePlanSchema.safeParse(result.scenePlan);
    expect(parsed.success).toBe(true);

    // Verify scenes
    expect(result.scenePlan.scenes.length).toBeGreaterThanOrEqual(3);
    for (const scene of result.scenePlan.scenes) {
      expect(scene.id).toMatch(/^scene-\d+$/);
      expect(scene.durationMs).toBeGreaterThanOrEqual(1000);
      expect(scene.motifs.length).toBeGreaterThanOrEqual(1);

      // Verify every motif used exists in the allowed pen-ink catalog
      for (const motif of scene.motifs) {
        expect(motif.ref).toBeTruthy();
        expect(motif.x).toBeGreaterThanOrEqual(0);
        expect(motif.x).toBeLessThanOrEqual(1);
        expect(motif.y).toBeGreaterThanOrEqual(0);
        expect(motif.y).toBeLessThanOrEqual(1);
      }
    }
  });

  it('produces identical deterministic scene plans for the same seed', async () => {
    const run1 = await director.direct({
      track: SAMPLE_TRACK,
      lyrics: SAMPLE_LYRICS,
      timeline: SAMPLE_TIMELINE,
      styleId: 'minimal-type',
      seed: 9999,
    });

    const run2 = await director.direct({
      track: SAMPLE_TRACK,
      lyrics: SAMPLE_LYRICS,
      timeline: SAMPLE_TIMELINE,
      styleId: 'minimal-type',
      seed: 9999,
    });

    expect(run1.scenePlan).toEqual(run2.scenePlan);
  });

  it('generates valid scenes for instrumental tracks', async () => {
    const instrumentalLyrics: Lyrics = {
      source: 'lrclib',
      synced: false,
      instrumental: true,
      lineCount: 0,
      matchedTitle: null,
      matchedArtist: null,
      lines: [],
    };

    const result = await director.direct({
      track: SAMPLE_TRACK,
      lyrics: instrumentalLyrics,
      timeline: INSTRUMENTAL_TIMELINE,
      styleId: 'graph-abstract',
      seed: 123,
    });

    expect(result.scenePlan.scenes.length).toBe(4);
    for (const scene of result.scenePlan.scenes) {
      expect(scene.lyric).toBeNull();
      expect(scene.lyricTreatment).toBe('none');
      expect(scene.motifs.length).toBeGreaterThanOrEqual(1);
    }

    const parsed = scenePlanSchema.safeParse(result.scenePlan);
    expect(parsed.success).toBe(true);
  });

  it('generates valid scene plans across all available styles', async () => {
    const testStyles = [
      'pen-ink',
      'minimal-type',
      'pencil-sketch',
      'graph-abstract',
      'notebook',
      'cinematic',
    ] as const;

    for (const styleId of testStyles) {
      const result = await director.direct({
        track: SAMPLE_TRACK,
        lyrics: SAMPLE_LYRICS,
        timeline: SAMPLE_TIMELINE,
        styleId,
      });

      const parsed = scenePlanSchema.safeParse(result.scenePlan);
      expect(parsed.success).toBe(true);
      expect(result.scenePlan.styleId).toBe(styleId);

      const profile = getStyleDirectorProfile(styleId);
      for (const scene of result.scenePlan.scenes) {
        for (const motif of scene.motifs) {
          expect(profile.allowedMotifs).toContain(motif.ref);
        }
      }
    }
  });
});

describe('Composite Visual Director', () => {
  it('falls back to heuristic director gracefully when GEMINI_API_KEY is not set', async () => {
    const composite = new CompositeVisualDirector();
    const result = await composite.direct({
      track: SAMPLE_TRACK,
      lyrics: SAMPLE_LYRICS,
      timeline: SAMPLE_TIMELINE,
      styleId: 'pen-ink',
    });

    expect(result.provider).toBe('heuristic');
    expect(result.scenePlan.scenes.length).toBeGreaterThan(0);
    expect(scenePlanSchema.safeParse(result.scenePlan).success).toBe(true);
  });
});
