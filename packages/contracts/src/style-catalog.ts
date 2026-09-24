import type { StyleId } from './style.schema.js';

export interface StyleCatalogEntry {
  id: StyleId;
  displayName: string;
  description: string;
  available: boolean;
}

export const STYLE_CATALOG: StyleCatalogEntry[] = [
  {
    id: 'pen-ink',
    displayName: 'Pen & Ink',
    description: 'Lyrics interpreted as drawn illustrations. Lines appear as if sketched.',
    available: true,
  },
  {
    id: 'minimal-type',
    displayName: 'Minimal Type',
    description: 'Typography alone. Restrained, precise, entirely about the words.',
    available: true,
  },
  {
    id: 'pencil-sketch',
    displayName: 'Pencil Sketch',
    description: 'Soft graphite hatching with paper grain and shading.',
    available: true,
  },
  {
    id: 'hand-drawn',
    displayName: 'Hand Drawn',
    description: 'Loose, imperfect linework with a human wobble.',
    available: true,
  },
  {
    id: 'graph-abstract',
    displayName: 'Graph',
    description: 'Geometry, grids and plotted motion. Cold and architectural.',
    available: true,
  },
  {
    id: 'cinematic',
    displayName: 'Cinematic',
    description: 'Filmic imagery, depth and camera movement.',
    available: true,
  },
  {
    id: 'notebook',
    displayName: 'Notebook',
    description: 'Margins, ruled lines and handwriting. Intimate and personal.',
    available: true,
  },
  {
    id: 'lyrical-animation',
    displayName: 'Lyrical + Animation',
    description: 'Kinetic type driven by the rhythm of the track.',
    available: false,
  },
];

export function isStyleAvailable(id: StyleId): boolean {
  return STYLE_CATALOG.some((entry) => entry.id === id && entry.available);
}

export const STYLE_MOTIFS: Record<StyleId, readonly string[]> = {
  'pen-ink': [
    'solitary-figure',
    'umbrella-sketch',
    'rain-droplets',
    'lantern-glow',
    'quill-and-inkwell',
    'shoreline-horizon',
    'rose-and-thorns',
    'clock-face-antique',
    'bird-in-flight',
    'sound-ripples',
  ],
  'pencil-sketch': [
    'sketch-silhouette',
    'solitary-figure',
    'sketch-tree',
    'sketch-crescent-moon',
    'sketch-guitar',
    'sketch-heart',
    'rose-and-thorns',
  ],
  'hand-drawn': [
    'sketch-silhouette',
    'solitary-figure',
    'sketch-tree',
    'sketch-guitar',
    'sketch-heart',
    'sound-ripples',
  ],
  'graph-abstract': [
    'waveform-scope',
    'sound-ripples',
    'circular-telemetry',
    'clock-face-antique',
    'constellation-node',
    'isometric-cube',
    'vector-compass',
  ],
  'minimal-type': [
    'editorial-crosshair',
    'metric-brackets',
    'horizon-line',
    'sound-bar-matrix',
    'geometric-circle',
    'minimal-chevron',
  ],
  'cinematic': [
    'shutter-iris',
    'film-frame',
    'lens-flare-burst',
    'lantern-glow',
  ],
  'notebook': [
    'margin-star-doodle',
    'music-note-doodle',
    'sound-ripples',
    'arrow-scribble',
    'tape-strip',
    'coffee-stain-ring',
    'hand-underlined-scribble',
  ],
  'lyrical-animation': [
    'waveform-scope',
    'sound-ripples',
    'sound-bar-matrix',
  ],
};

export function getStyleMotifs(id: StyleId): readonly string[] {
  return STYLE_MOTIFS[id] ?? [];
}

export function isMotifValidForStyle(id: StyleId, motifRef: string): boolean {
  const motifs = STYLE_MOTIFS[id];
  return Boolean(motifs && motifs.includes(motifRef));
}