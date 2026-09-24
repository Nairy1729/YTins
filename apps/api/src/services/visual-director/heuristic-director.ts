import {
  SCHEMA_VERSION,
  scenePlanSchema,
  type CameraMove,
  type MotifPlacement,
  type Scene,
  type ScenePlan,
  type Transition,
} from '@reverie/contracts';
import type {
  VisualDirectorInput,
  VisualDirectorResult,
  VisualDirectorService,
} from './types.js';
import { getStyleDirectorProfile } from './style-profiles.js';
import { analyzeEmotion, detectLineEmotion } from './emotion-analyzer.js';

function computeDeterministicSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

// Simple seeded pseudo-random number generator for deterministic visuals
function createRng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export class HeuristicVisualDirector implements VisualDirectorService {
  readonly name = 'heuristic';

  async direct(input: VisualDirectorInput): Promise<VisualDirectorResult> {
    const { track, lyrics, timeline, styleId } = input;
    const profile = getStyleDirectorProfile(styleId);
    const analysis = analyzeEmotion(track, lyrics);

    const seed =
      input.seed ??
      computeDeterministicSeed(
        `${track.title}_${track.artist}_${styleId}_${timeline.segment.startMs}`,
      );
    const nextRandom = createRng(seed);

    const segmentStartMs = timeline.segment.startMs;
    const segmentDurationMs = timeline.segment.durationMs;
    const segmentEndMs = segmentStartMs + segmentDurationMs;

    // Filter lines falling inside the chosen segment
    const segmentLines = (lyrics.lines ?? []).filter((line) => {
      const lineStart = line.startMs;
      return typeof lineStart === 'number' && lineStart >= segmentStartMs - 500 && lineStart < segmentEndMs;
    });

    const scenes: Scene[] = [];

    if (segmentLines.length >= 2 && !lyrics.instrumental) {
      // 1. Build scenes synchronized to lyric lines
      for (let i = 0; i < segmentLines.length; i++) {
        const line = segmentLines[i];
        if (!line) continue;
        const nextLine = segmentLines[i + 1];

        const lineStart = line.startMs ?? segmentStartMs;
        const relativeStartMs = Math.max(0, lineStart - segmentStartMs);
        const nextStart = nextLine && typeof nextLine.startMs === 'number' ? nextLine.startMs : null;
        const relativeEndMs = nextStart !== null
          ? Math.max(relativeStartMs + 1000, nextStart - segmentStartMs)
          : segmentDurationMs;

        const durationMs = Math.max(1200, relativeEndMs - relativeStartMs);
        const sceneEmotion = detectLineEmotion(line.text, analysis.dominantEmotion);

        // Select motifs based on scene emotion & style
        const motifs = this.generateMotifs(
          profile,
          sceneEmotion,
          i,
          durationMs,
          nextRandom,
        );

        // Alternate camera moves smoothly
        const cameraMove: CameraMove =
          profile.preferredCameraMoves[i % profile.preferredCameraMoves.length] ??
          'slow_push_in';
        const cameraAmount = Number((0.06 + nextRandom() * 0.08).toFixed(2));

        // Select transition
        const transition: Transition =
          profile.preferredTransitions[i % profile.preferredTransitions.length] ??
          'fade';

        scenes.push({
          id: `scene-${i + 1}`,
          startMs: relativeStartMs,
          durationMs,
          lyric: {
            text: line.text,
            startMs: relativeStartMs,
            endMs: Math.min(relativeStartMs + durationMs, relativeStartMs + 4500),
          },
          emotion: sceneEmotion,
          motifs,
          camera: {
            move: cameraMove,
            amount: cameraAmount,
          },
          lyricTreatment: profile.preferredLyricTreatment,
          transitionOut: transition,
        });
      }
    } else {
      // 2. Instrumental or unsynced treatment: generate 4 progressive atmospheric scenes
      const sceneCount = 4;
      const sceneDuration = Math.round(segmentDurationMs / sceneCount);
      const moodProgressions = [
        'contemplation',
        analysis.dominantEmotion,
        analysis.dominantEmotion === 'longing' ? 'melancholy' : 'intensity',
        'peace',
      ];

      for (let i = 0; i < sceneCount; i++) {
        const relativeStartMs = i * sceneDuration;
        const durationMs =
          i === sceneCount - 1 ? segmentDurationMs - relativeStartMs : sceneDuration;
        const sceneEmotion = moodProgressions[i] ?? analysis.dominantEmotion;

        const motifs = this.generateMotifs(
          profile,
          sceneEmotion,
          i,
          durationMs,
          nextRandom,
        );

        const cameraMove: CameraMove =
          profile.preferredCameraMoves[i % profile.preferredCameraMoves.length] ?? 'drift';
        const cameraAmount = Number((0.08 + nextRandom() * 0.07).toFixed(2));

        const transition: Transition =
          profile.preferredTransitions[i % profile.preferredTransitions.length] ?? 'fade';

        scenes.push({
          id: `scene-${i + 1}`,
          startMs: relativeStartMs,
          durationMs,
          lyric: null,
          emotion: sceneEmotion,
          motifs,
          camera: {
            move: cameraMove,
            amount: cameraAmount,
          },
          lyricTreatment: 'none',
          transitionOut: transition,
        });
      }
    }

    // Ensure scenes are chronologically sorted and fill the duration
    scenes.sort((a, b) => a.startMs - b.startMs);
    const firstScene = scenes[0];
    if (firstScene && firstScene.startMs > 0) {
      // Extend first scene to start at 0
      firstScene.durationMs += firstScene.startMs;
      firstScene.startMs = 0;
    }

    const rawScenePlan = {
      version: SCHEMA_VERSION,
      styleId,
      seed,
      audio: {
        sourceId: track.sourceId,
        startMs: segmentStartMs,
        durationMs: segmentDurationMs,
      },
      scenes,
    };

    // Validate strictly against contract schema
    const scenePlan = scenePlanSchema.parse(rawScenePlan);

    return {
      scenePlan,
      provider: 'heuristic',
      analysis,
    };
  }

  private generateMotifs(
    profile: ReturnType<typeof getStyleDirectorProfile>,
    emotion: string,
    sceneIndex: number,
    sceneDurationMs: number,
    nextRandom: () => number,
  ): MotifPlacement[] {
    const candidateList =
      profile.emotionMotifMap[emotion] ?? profile.defaultMotifs;
    const allowed = profile.allowedMotifs;

    // Filter to valid motifs in this style
    const validCandidates = candidateList.filter((m) => allowed.includes(m));
    const pool = validCandidates.length > 0 ? validCandidates : allowed;
    if (pool.length === 0) return [];

    const motifCount = Math.min(
      profile.maxMotifsPerScene,
      1 + Math.floor(nextRandom() * 2), // 1 or 2 motifs
    );

    const result: MotifPlacement[] = [];
    const used = new Set<string>();

    // Placement zones that avoid overlapping the central lyric zone (y: 0.38 - 0.58)
    const zones = [
      { x: 0.5, y: 0.72 }, // Lower center primary
      { x: 0.78, y: 0.28 }, // Upper right accent
      { x: 0.22, y: 0.78 }, // Lower left secondary
      { x: 0.5, y: 0.26 }, // Upper center
    ];

    for (let m = 0; m < motifCount; m++) {
      const available = pool.filter((ref) => !used.has(ref));
      const fallbackRef =
        pool[sceneIndex % pool.length] ?? profile.defaultMotifs[0] ?? 'solitary-figure';
      const chosen =
        available.length > 0
          ? available[Math.floor(nextRandom() * available.length)] ?? fallbackRef
          : fallbackRef;

      used.add(chosen);

      const zone = zones[(sceneIndex + m) % zones.length] ?? { x: 0.5, y: 0.72 };
      const jitterX = (nextRandom() - 0.5) * 0.12;
      const jitterY = (nextRandom() - 0.5) * 0.08;

      const posX = Math.max(0.12, Math.min(0.88, Number((zone.x + jitterX).toFixed(2))));
      const posY = Math.max(0.15, Math.min(0.85, Number((zone.y + jitterY).toFixed(2))));

      const scale = Number((0.85 + nextRandom() * 0.35).toFixed(2));
      const rotation = Number(((nextRandom() - 0.5) * 12).toFixed(1));
      const drawInMs = Math.min(1000, Math.round(sceneDurationMs * 0.4));
      const delayMs = m * 300;

      result.push({
        ref: chosen,
        x: posX,
        y: posY,
        scale,
        rotation,
        drawInMs,
        delayMs,
      });
    }

    return result;
  }
}
