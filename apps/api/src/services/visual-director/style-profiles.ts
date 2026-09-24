import { STYLE_MOTIFS, type StyleId } from '@reverie/contracts';
import type { StyleDirectorProfile } from './types.js';

export const STYLE_DIRECTOR_PROFILES: Record<StyleId, StyleDirectorProfile> = {
  'pen-ink': {
    styleId: 'pen-ink',
    displayName: 'Pen & Ink',
    aestheticPrompt:
      'Atmospheric hand-drawn black ink illustration on warm textured cream paper with fine hatching, contemplative mood, and brass/gold accents.',
    preferredLyricTreatment: 'handwritten_reveal',
    allowedMotifs: STYLE_MOTIFS['pen-ink'],
    defaultMotifs: ['solitary-figure', 'quill-and-inkwell'],
    preferredCameraMoves: ['slow_push_in', 'drift', 'pan_left', 'slow_pull_out'],
    preferredTransitions: ['ink_fade', 'fade', 'dissolve'],
    maxMotifsPerScene: 3,
    emotionMotifMap: {
      longing: ['solitary-figure', 'umbrella-sketch', 'rain-droplets'],
      solitude: ['solitary-figure', 'shoreline-horizon', 'lantern-glow'],
      love: ['rose-and-thorns', 'lantern-glow', 'bird-in-flight'],
      nostalgia: ['clock-face-antique', 'quill-and-inkwell', 'solitary-figure'],
      melancholy: ['rain-droplets', 'umbrella-sketch', 'solitary-figure'],
      hope: ['bird-in-flight', 'lantern-glow', 'shoreline-horizon'],
      contemplation: ['quill-and-inkwell', 'shoreline-horizon', 'clock-face-antique'],
      intensity: ['sound-ripples', 'rose-and-thorns', 'rain-droplets'],
      peace: ['shoreline-horizon', 'bird-in-flight', 'lantern-glow'],
    },
  },

  'pencil-sketch': {
    styleId: 'pencil-sketch',
    displayName: 'Pencil Sketch',
    aestheticPrompt:
      'Expressive multi-stroke graphite pencil drawing on eggshell paper with delicate cross-hatching, shaded silhouettes, and natural organic jitter.',
    preferredLyricTreatment: 'handwritten_reveal',
    allowedMotifs: STYLE_MOTIFS['pencil-sketch'],
    defaultMotifs: ['sketch-silhouette', 'sketch-tree'],
    preferredCameraMoves: ['drift', 'slow_push_in', 'pan_right'],
    preferredTransitions: ['fade', 'dissolve'],
    maxMotifsPerScene: 2,
    emotionMotifMap: {
      longing: ['sketch-silhouette', 'sketch-crescent-moon', 'sketch-heart'],
      solitude: ['sketch-silhouette', 'sketch-tree'],
      love: ['sketch-heart', 'rose-and-thorns', 'sketch-silhouette'],
      nostalgia: ['sketch-crescent-moon', 'sketch-tree', 'sketch-silhouette'],
      melancholy: ['sketch-silhouette', 'sketch-tree'],
      hope: ['sketch-crescent-moon', 'sketch-guitar', 'sketch-heart'],
      contemplation: ['sketch-tree', 'sketch-silhouette'],
      intensity: ['sketch-guitar', 'sketch-heart'],
      peace: ['sketch-tree', 'sketch-crescent-moon'],
    },
  },

  'hand-drawn': {
    styleId: 'hand-drawn',
    displayName: 'Hand Drawn',
    aestheticPrompt:
      'Spontaneous, loose, human ink illustration with warm organic lines and casual charm.',
    preferredLyricTreatment: 'handwritten_reveal',
    allowedMotifs: STYLE_MOTIFS['hand-drawn'],
    defaultMotifs: ['sketch-silhouette', 'sketch-heart'],
    preferredCameraMoves: ['drift', 'slow_push_in', 'pan_left'],
    preferredTransitions: ['fade', 'dissolve'],
    maxMotifsPerScene: 2,
    emotionMotifMap: {
      longing: ['sketch-silhouette', 'sketch-heart'],
      solitude: ['sketch-silhouette', 'sketch-tree'],
      love: ['sketch-heart', 'sketch-silhouette'],
      nostalgia: ['sketch-tree', 'sketch-silhouette'],
      melancholy: ['sketch-silhouette', 'sound-ripples'],
      hope: ['sketch-heart', 'sketch-guitar'],
      contemplation: ['sketch-tree'],
      intensity: ['sketch-guitar', 'sound-ripples'],
      peace: ['sketch-tree', 'sketch-heart'],
    },
  },

  'graph-abstract': {
    styleId: 'graph-abstract',
    displayName: 'Graph / Abstract',
    aestheticPrompt:
      'Dark blueprint slate canvas with illuminated coordinate grids, precision technical oscilloscope vectors, glowing telemetry, and scanning beams.',
    preferredLyricTreatment: 'kinetic',
    allowedMotifs: STYLE_MOTIFS['graph-abstract'],
    defaultMotifs: ['waveform-scope', 'circular-telemetry'],
    preferredCameraMoves: ['slow_pull_out', 'pan_left', 'slow_push_in', 'drift'],
    preferredTransitions: ['cut', 'fade', 'wipe'],
    maxMotifsPerScene: 3,
    emotionMotifMap: {
      longing: ['waveform-scope', 'constellation-node', 'sound-ripples'],
      solitude: ['constellation-node', 'isometric-cube', 'clock-face-antique'],
      love: ['constellation-node', 'sound-ripples', 'circular-telemetry'],
      nostalgia: ['clock-face-antique', 'waveform-scope', 'vector-compass'],
      melancholy: ['waveform-scope', 'constellation-node'],
      hope: ['constellation-node', 'vector-compass', 'circular-telemetry'],
      contemplation: ['isometric-cube', 'vector-compass', 'clock-face-antique'],
      intensity: ['waveform-scope', 'circular-telemetry', 'sound-ripples'],
      peace: ['constellation-node', 'vector-compass'],
    },
  },

  'minimal-type': {
    styleId: 'minimal-type',
    displayName: 'Minimal Type',
    aestheticPrompt:
      'Ultra-refined editorial typography on deep void black with architectural hairline frames, corner registration ticks, and geometric vector accents.',
    preferredLyricTreatment: 'minimal',
    allowedMotifs: STYLE_MOTIFS['minimal-type'],
    defaultMotifs: ['editorial-crosshair', 'horizon-line'],
    preferredCameraMoves: ['slow_push_in', 'slow_pull_out', 'drift'],
    preferredTransitions: ['cut', 'fade'],
    maxMotifsPerScene: 2,
    emotionMotifMap: {
      longing: ['horizon-line', 'editorial-crosshair', 'minimal-chevron'],
      solitude: ['horizon-line', 'metric-brackets', 'geometric-circle'],
      love: ['geometric-circle', 'sound-bar-matrix'],
      nostalgia: ['horizon-line', 'metric-brackets'],
      melancholy: ['horizon-line', 'editorial-crosshair'],
      hope: ['minimal-chevron', 'geometric-circle', 'horizon-line'],
      contemplation: ['editorial-crosshair', 'metric-brackets', 'horizon-line'],
      intensity: ['sound-bar-matrix', 'minimal-chevron'],
      peace: ['horizon-line', 'geometric-circle'],
    },
  },

  'cinematic': {
    styleId: 'cinematic',
    displayName: 'Cinematic',
    aestheticPrompt:
      '35mm film aesthetic with 2.39:1 letterbox matte bars, anamorphic flare streaks, floating bokeh orbs, camera viewfinder telemetry, and optical blooms.',
    preferredLyricTreatment: 'minimal',
    allowedMotifs: STYLE_MOTIFS['cinematic'],
    defaultMotifs: ['shutter-iris', 'film-frame'],
    preferredCameraMoves: ['slow_push_in', 'drift', 'slow_pull_out', 'pan_right'],
    preferredTransitions: ['dissolve', 'fade'],
    maxMotifsPerScene: 2,
    emotionMotifMap: {
      longing: ['film-frame', 'lantern-glow', 'lens-flare-burst'],
      solitude: ['shutter-iris', 'film-frame'],
      love: ['lens-flare-burst', 'lantern-glow', 'film-frame'],
      nostalgia: ['film-frame', 'shutter-iris', 'lantern-glow'],
      melancholy: ['film-frame', 'lantern-glow'],
      hope: ['lens-flare-burst', 'lantern-glow'],
      contemplation: ['shutter-iris', 'film-frame'],
      intensity: ['lens-flare-burst', 'shutter-iris'],
      peace: ['lantern-glow', 'film-frame'],
    },
  },

  'notebook': {
    styleId: 'notebook',
    displayName: 'Notebook',
    aestheticPrompt:
      'Warm cream paper journal with red vertical margin, faint blue ruled lines, 3-hole punch binder rings, and playful hand-inked doodles.',
    preferredLyricTreatment: 'handwritten_reveal',
    allowedMotifs: STYLE_MOTIFS['notebook'],
    defaultMotifs: ['margin-star-doodle', 'music-note-doodle'],
    preferredCameraMoves: ['drift', 'slow_push_in', 'pan_left'],
    preferredTransitions: ['fade', 'dissolve'],
    maxMotifsPerScene: 3,
    emotionMotifMap: {
      longing: ['margin-star-doodle', 'tape-strip', 'coffee-stain-ring'],
      solitude: ['coffee-stain-ring', 'tape-strip'],
      love: ['margin-star-doodle', 'hand-underlined-scribble', 'music-note-doodle'],
      nostalgia: ['coffee-stain-ring', 'tape-strip', 'margin-star-doodle'],
      melancholy: ['coffee-stain-ring', 'tape-strip'],
      hope: ['margin-star-doodle', 'arrow-scribble', 'music-note-doodle'],
      contemplation: ['tape-strip', 'margin-star-doodle'],
      intensity: ['arrow-scribble', 'music-note-doodle', 'sound-ripples'],
      peace: ['margin-star-doodle', 'music-note-doodle'],
    },
  },

  'lyrical-animation': {
    styleId: 'lyrical-animation',
    displayName: 'Lyrical + Animation',
    aestheticPrompt:
      'High-energy kinetic typography moving to the song beat with vibrant audio reactive pulses.',
    preferredLyricTreatment: 'kinetic',
    allowedMotifs: STYLE_MOTIFS['lyrical-animation'],
    defaultMotifs: ['waveform-scope', 'sound-ripples'],
    preferredCameraMoves: ['slow_push_in', 'slow_pull_out'],
    preferredTransitions: ['cut', 'wipe'],
    maxMotifsPerScene: 2,
    emotionMotifMap: {
      longing: ['waveform-scope', 'sound-ripples'],
      solitude: ['waveform-scope'],
      love: ['sound-ripples'],
      nostalgia: ['waveform-scope'],
      melancholy: ['sound-ripples'],
      hope: ['sound-bar-matrix'],
      contemplation: ['waveform-scope'],
      intensity: ['waveform-scope', 'sound-bar-matrix', 'sound-ripples'],
      peace: ['waveform-scope'],
    },
  },
};

export function getStyleDirectorProfile(styleId: StyleId): StyleDirectorProfile {
  return (
    STYLE_DIRECTOR_PROFILES[styleId] ??
    STYLE_DIRECTOR_PROFILES['pen-ink']
  );
}
