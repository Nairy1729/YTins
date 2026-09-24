import { SCHEMA_VERSION, scenePlanSchema } from '@reverie/contracts';
import type { ScenePlan } from '@reverie/contracts';

/**
 * High-quality default ScenePlan for local preview, Remotion Studio,
 * and smoke rendering tests.
 */
export const SAMPLE_SCENE_PLAN: ScenePlan = scenePlanSchema.parse({
  version: SCHEMA_VERSION,
  styleId: 'pen-ink',
  seed: 42,
  audio: {
    sourceId: 'demo-sample-track',
    startMs: 0,
    durationMs: 30000,
  },
  scenes: [
    {
      id: 'scene-1',
      startMs: 0,
      durationMs: 6500,
      lyric: {
        text: 'I still remember your face',
        startMs: 1200,
        endMs: 5800,
      },
      emotion: 'nostalgia',
      motifs: [
        {
          ref: 'rain-droplets',
          x: 0.5,
          y: 0.35,
          scale: 1.2,
          rotation: 0,
          drawInMs: 1200,
          delayMs: 200,
        },
      ],
      camera: { move: 'slow_push_in', amount: 0.4 },
      lyricTreatment: 'handwritten_reveal',
      transitionOut: 'fade',
    },
    {
      id: 'scene-2',
      startMs: 6500,
      durationMs: 7000,
      lyric: {
        text: 'Walking alone in the rain',
        startMs: 7500,
        endMs: 12500,
      },
      emotion: 'solitude',
      motifs: [
        {
          ref: 'umbrella-sketch',
          x: 0.5,
          y: 0.45,
          scale: 1.0,
          rotation: -4,
          drawInMs: 1500,
          delayMs: 300,
        },
      ],
      camera: { move: 'pan_left', amount: 0.3 },
      lyricTreatment: 'minimal',
      transitionOut: 'dissolve',
    },
    {
      id: 'scene-3',
      startMs: 13500,
      durationMs: 8000,
      lyric: {
        text: 'Echoes of words that you whispered',
        startMs: 14200,
        endMs: 20500,
      },
      emotion: 'yearning',
      motifs: [
        {
          ref: 'sound-ripples',
          x: 0.5,
          y: 0.4,
          scale: 1.4,
          rotation: 12,
          drawInMs: 1400,
          delayMs: 100,
        },
      ],
      camera: { move: 'drift', amount: 0.5 },
      lyricTreatment: 'kinetic',
      transitionOut: 'fade',
    },
    {
      id: 'scene-4',
      startMs: 21500,
      durationMs: 8500,
      lyric: {
        text: 'Before the light faded away',
        startMs: 22400,
        endMs: 28500,
      },
      emotion: 'acceptance',
      motifs: [
        {
          ref: 'lantern-glow',
          x: 0.5,
          y: 0.38,
          scale: 1.1,
          rotation: 0,
          drawInMs: 1600,
          delayMs: 400,
        },
      ],
      camera: { move: 'slow_pull_out', amount: 0.4 },
      lyricTreatment: 'handwritten_reveal',
      transitionOut: 'fade',
    },
  ],
});
