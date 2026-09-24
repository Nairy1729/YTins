import { SCHEMA_VERSION, scenePlanSchema } from '@reverie/contracts';
import type { ScenePlan, StyleId } from '@reverie/contracts';


/**
 * Benchmark Reference ScenePlan for:
 * YouTube: https://youtu.be/RQbnPl5E5No
 * Track: "Tere Bina Na Guzara" - Satinder Sartaaj & Neeru Bajwa
 */
export const REFERENCE_TRACK_URL = 'https://youtu.be/RQbnPl5E5No';
export const REFERENCE_TRACK_ID = 'RQbnPl5E5No';

export const REFERENCE_SCENE_PLAN: ScenePlan = scenePlanSchema.parse({
  version: SCHEMA_VERSION,
  styleId: 'pen-ink',
  seed: 108,
  audio: {
    sourceId: REFERENCE_TRACK_ID,
    startMs: 27000,
    durationMs: 36000,
  },
  scenes: [
    {
      id: 'scene-longing',
      startMs: 0,
      durationMs: 8500,
      lyric: {
        text: 'Tere bina na guzara ho sakeya',
        startMs: 1000,
        endMs: 7800,
      },
      emotion: 'yearning',
      motifs: [
        {
          ref: 'rain-droplets',
          x: 0.5,
          y: 0.28,
          scale: 1.4,
          rotation: -2,
          drawInMs: 1400,
          delayMs: 150,
        },
        {
          ref: 'solitary-figure',
          x: 0.5,
          y: 0.45,
          scale: 1.25,
          rotation: 0,
          drawInMs: 1600,
          delayMs: 350,
        },
      ],
      camera: { move: 'slow_push_in', amount: 0.45 },
      lyricTreatment: 'handwritten_reveal',
      transitionOut: 'fade',
    },
    {
      id: 'scene-devotion',
      startMs: 8500,
      durationMs: 9000,
      lyric: {
        text: 'Duniya te hor koyi na pyara ho sakeya',
        startMs: 9500,
        endMs: 16800,
      },
      emotion: 'devotion',
      motifs: [
        {
          ref: 'rose-and-thorns',
          x: 0.5,
          y: 0.4,
          scale: 1.35,
          rotation: 4,
          drawInMs: 1600,
          delayMs: 200,
        },
        {
          ref: 'lantern-glow',
          x: 0.5,
          y: 0.42,
          scale: 1.15,
          rotation: 0,
          drawInMs: 1400,
          delayMs: 400,
        },
      ],
      camera: { move: 'pan_left', amount: 0.35 },
      lyricTreatment: 'kinetic',
      transitionOut: 'dissolve',
    },
    {
      id: 'scene-memory',
      startMs: 17500,
      durationMs: 9000,
      lyric: {
        text: 'Asi taan saari umar tere naam likhi',
        startMs: 18500,
        endMs: 25800,
      },
      emotion: 'nostalgia',
      motifs: [
        {
          ref: 'quill-and-inkwell',
          x: 0.5,
          y: 0.42,
          scale: 1.35,
          rotation: -5,
          drawInMs: 1800,
          delayMs: 200,
        },
        {
          ref: 'clock-face-antique',
          x: 0.5,
          y: 0.36,
          scale: 1.1,
          rotation: 0,
          drawInMs: 1500,
          delayMs: 450,
        },
      ],
      camera: { move: 'drift', amount: 0.4 },
      lyricTreatment: 'handwritten_reveal',
      transitionOut: 'fade',
    },
    {
      id: 'scene-shore',
      startMs: 26500,
      durationMs: 9500,
      lyric: {
        text: 'Tere ton bina na koyi kinara ho sakeya',
        startMs: 27500,
        endMs: 35000,
      },
      emotion: 'acceptance',
      motifs: [
        {
          ref: 'shoreline-horizon',
          x: 0.5,
          y: 0.44,
          scale: 1.45,
          rotation: 0,
          drawInMs: 1600,
          delayMs: 200,
        },
        {
          ref: 'bird-in-flight',
          x: 0.5,
          y: 0.28,
          scale: 1.2,
          rotation: 6,
          drawInMs: 1300,
          delayMs: 450,
        },
      ],
      camera: { move: 'slow_pull_out', amount: 0.5 },
      lyricTreatment: 'minimal',
      transitionOut: 'fade',
    },
  ],
});

export function createReferenceScenePlan(styleId: StyleId): ScenePlan {
  switch (styleId) {
    case 'minimal-type':
      return scenePlanSchema.parse({
        ...REFERENCE_SCENE_PLAN,
        styleId: 'minimal-type',
        scenes: [
          {
            ...REFERENCE_SCENE_PLAN.scenes[0],
            lyricTreatment: 'minimal',
            motifs: [
              { ref: 'editorial-crosshair', x: 0.5, y: 0.35, scale: 1.3, drawInMs: 1200, delayMs: 100 },
              { ref: 'metric-brackets', x: 0.5, y: 0.35, scale: 1.6, drawInMs: 1400, delayMs: 250 },
            ],
          },
          {
            ...REFERENCE_SCENE_PLAN.scenes[1],
            lyricTreatment: 'kinetic',
            motifs: [
              { ref: 'geometric-circle', x: 0.5, y: 0.38, scale: 1.35, drawInMs: 1300, delayMs: 150 },
              { ref: 'sound-bar-matrix', x: 0.5, y: 0.42, scale: 1.2, drawInMs: 1500, delayMs: 300 },
            ],
          },
          {
            ...REFERENCE_SCENE_PLAN.scenes[2],
            lyricTreatment: 'minimal',
            motifs: [
              { ref: 'horizon-line', x: 0.5, y: 0.38, scale: 1.5, drawInMs: 1200, delayMs: 100 },
              { ref: 'minimal-chevron', x: 0.5, y: 0.28, scale: 1.2, drawInMs: 1000, delayMs: 250 },
            ],
          },
          {
            ...REFERENCE_SCENE_PLAN.scenes[3],
            lyricTreatment: 'minimal',
            motifs: [
              { ref: 'editorial-crosshair', x: 0.5, y: 0.36, scale: 1.4, drawInMs: 1300, delayMs: 150 },
              { ref: 'horizon-line', x: 0.5, y: 0.45, scale: 1.3, drawInMs: 1400, delayMs: 300 },
            ],
          },
        ],
      });

    case 'pencil-sketch':
    case 'hand-drawn':
      return scenePlanSchema.parse({
        ...REFERENCE_SCENE_PLAN,
        styleId: 'pencil-sketch',
        scenes: [
          {
            ...REFERENCE_SCENE_PLAN.scenes[0],
            lyricTreatment: 'handwritten_reveal',
            motifs: [
              { ref: 'sketch-silhouette', x: 0.5, y: 0.42, scale: 1.3, drawInMs: 1500, delayMs: 150 },
            ],
          },
          {
            ...REFERENCE_SCENE_PLAN.scenes[1],
            lyricTreatment: 'handwritten_reveal',
            motifs: [
              { ref: 'sketch-heart', x: 0.5, y: 0.4, scale: 1.35, drawInMs: 1500, delayMs: 150 },
              { ref: 'sketch-crescent-moon', x: 0.5, y: 0.26, scale: 1.1, drawInMs: 1300, delayMs: 350 },
            ],
          },
          {
            ...REFERENCE_SCENE_PLAN.scenes[2],
            lyricTreatment: 'handwritten_reveal',
            motifs: [
              { ref: 'sketch-guitar', x: 0.5, y: 0.42, scale: 1.25, drawInMs: 1600, delayMs: 150 },
            ],
          },
          {
            ...REFERENCE_SCENE_PLAN.scenes[3],
            lyricTreatment: 'handwritten_reveal',
            motifs: [
              { ref: 'sketch-tree', x: 0.5, y: 0.42, scale: 1.35, drawInMs: 1600, delayMs: 150 },
            ],
          },
        ],
      });

    case 'graph-abstract':
    case 'lyrical-animation':
      return scenePlanSchema.parse({
        ...REFERENCE_SCENE_PLAN,
        styleId: 'graph-abstract',
        scenes: [
          {
            ...REFERENCE_SCENE_PLAN.scenes[0],
            lyricTreatment: 'kinetic',
            motifs: [
              { ref: 'waveform-scope', x: 0.5, y: 0.38, scale: 1.4, drawInMs: 1200, delayMs: 100 },
              { ref: 'vector-compass', x: 0.5, y: 0.26, scale: 1.1, drawInMs: 1300, delayMs: 300 },
            ],
          },
          {
            ...REFERENCE_SCENE_PLAN.scenes[1],
            lyricTreatment: 'kinetic',
            motifs: [
              { ref: 'circular-telemetry', x: 0.5, y: 0.38, scale: 1.35, drawInMs: 1400, delayMs: 150 },
              { ref: 'constellation-node', x: 0.5, y: 0.38, scale: 1.25, drawInMs: 1500, delayMs: 350 },
            ],
          },
          {
            ...REFERENCE_SCENE_PLAN.scenes[2],
            lyricTreatment: 'kinetic',
            motifs: [
              { ref: 'isometric-cube', x: 0.5, y: 0.36, scale: 1.3, drawInMs: 1300, delayMs: 150 },
              { ref: 'waveform-scope', x: 0.5, y: 0.46, scale: 1.2, drawInMs: 1400, delayMs: 350 },
            ],
          },
          {
            ...REFERENCE_SCENE_PLAN.scenes[3],
            lyricTreatment: 'kinetic',
            motifs: [
              { ref: 'constellation-node', x: 0.5, y: 0.36, scale: 1.35, drawInMs: 1400, delayMs: 150 },
              { ref: 'circular-telemetry', x: 0.5, y: 0.36, scale: 1.2, drawInMs: 1300, delayMs: 350 },
            ],
          },
        ],
      });

    case 'notebook':
      return scenePlanSchema.parse({
        ...REFERENCE_SCENE_PLAN,
        styleId: 'notebook',
        scenes: [
          {
            ...REFERENCE_SCENE_PLAN.scenes[0],
            lyricTreatment: 'handwritten_reveal',
            motifs: [
              { ref: 'margin-star-doodle', x: 0.55, y: 0.35, scale: 1.2, drawInMs: 1300, delayMs: 150 },
              { ref: 'music-note-doodle', x: 0.55, y: 0.45, scale: 1.25, drawInMs: 1400, delayMs: 350 },
            ],
          },
          {
            ...REFERENCE_SCENE_PLAN.scenes[1],
            lyricTreatment: 'handwritten_reveal',
            motifs: [
              { ref: 'arrow-scribble', x: 0.55, y: 0.35, scale: 1.3, drawInMs: 1300, delayMs: 150 },
              { ref: 'coffee-stain-ring', x: 0.55, y: 0.44, scale: 1.35, drawInMs: 1500, delayMs: 350 },
            ],
          },
          {
            ...REFERENCE_SCENE_PLAN.scenes[2],
            lyricTreatment: 'handwritten_reveal',
            motifs: [
              { ref: 'hand-underlined-scribble', x: 0.55, y: 0.42, scale: 1.4, drawInMs: 1200, delayMs: 150 },
              { ref: 'tape-strip', x: 0.55, y: 0.28, scale: 1.2, drawInMs: 1300, delayMs: 300 },
            ],
          },
          {
            ...REFERENCE_SCENE_PLAN.scenes[3],
            lyricTreatment: 'handwritten_reveal',
            motifs: [
              { ref: 'music-note-doodle', x: 0.55, y: 0.36, scale: 1.3, drawInMs: 1400, delayMs: 150 },
              { ref: 'margin-star-doodle', x: 0.55, y: 0.45, scale: 1.2, drawInMs: 1300, delayMs: 350 },
            ],
          },
        ],
      });

    case 'cinematic':
      return scenePlanSchema.parse({
        ...REFERENCE_SCENE_PLAN,
        styleId: 'cinematic',
        scenes: [
          {
            ...REFERENCE_SCENE_PLAN.scenes[0],
            lyricTreatment: 'minimal',
            motifs: [
              { ref: 'shutter-iris', x: 0.5, y: 0.38, scale: 1.3, drawInMs: 1400, delayMs: 150 },
            ],
          },
          {
            ...REFERENCE_SCENE_PLAN.scenes[1],
            lyricTreatment: 'minimal',
            motifs: [
              { ref: 'lens-flare-burst', x: 0.5, y: 0.38, scale: 1.35, drawInMs: 1400, delayMs: 150 },
              { ref: 'film-frame', x: 0.5, y: 0.38, scale: 1.25, drawInMs: 1500, delayMs: 350 },
            ],
          },
          {
            ...REFERENCE_SCENE_PLAN.scenes[2],
            lyricTreatment: 'minimal',
            motifs: [
              { ref: 'shutter-iris', x: 0.5, y: 0.38, scale: 1.25, drawInMs: 1300, delayMs: 150 },
            ],
          },
          {
            ...REFERENCE_SCENE_PLAN.scenes[3],
            lyricTreatment: 'minimal',
            motifs: [
              { ref: 'film-frame', x: 0.5, y: 0.38, scale: 1.35, drawInMs: 1400, delayMs: 150 },
              { ref: 'lens-flare-burst', x: 0.5, y: 0.38, scale: 1.2, drawInMs: 1300, delayMs: 350 },
            ],
          },
        ],
      });

    case 'pen-ink':
    default:
      return REFERENCE_SCENE_PLAN;
  }
}

export const REFERENCE_MINIMAL_PLAN = createReferenceScenePlan('minimal-type');
export const REFERENCE_SKETCH_PLAN = createReferenceScenePlan('pencil-sketch');
export const REFERENCE_GRAPH_PLAN = createReferenceScenePlan('graph-abstract');
export const REFERENCE_NOTEBOOK_PLAN = createReferenceScenePlan('notebook');
export const REFERENCE_CINEMATIC_PLAN = createReferenceScenePlan('cinematic');

