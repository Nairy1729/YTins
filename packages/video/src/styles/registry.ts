import type { StyleId } from '@reverie/contracts';
import type { StyleDefinition } from './types';

// Style Implementations
import {
  PenInkCanvas,
  PenInkRenderer,
  PEN_INK_PALETTE,
  PEN_INK_TYPOGRAPHY,
} from './pen-ink';

import {
  MinimalTypeCanvas,
  MinimalTypeRenderer,
  MINIMAL_TYPE_PALETTE,
  MINIMAL_TYPE_TYPOGRAPHY,
} from './minimal-type';

import {
  PencilSketchCanvas,
  PencilSketchRenderer,
  PENCIL_SKETCH_PALETTE,
  PENCIL_SKETCH_TYPOGRAPHY,
} from './pencil-sketch';

import {
  GraphAbstractCanvas,
  GraphAbstractRenderer,
  GRAPH_ABSTRACT_PALETTE,
  GRAPH_ABSTRACT_TYPOGRAPHY,
} from './graph-abstract';

import {
  NotebookCanvas,
  NotebookRenderer,
  NOTEBOOK_PALETTE,
  NOTEBOOK_TYPOGRAPHY,
} from './notebook';

import {
  CinematicCanvas,
  CinematicRenderer,
  CINEMATIC_PALETTE,
  CINEMATIC_TYPOGRAPHY,
} from './cinematic';

export const STYLE_REGISTRY: Record<StyleId, StyleDefinition> = {
  'pen-ink': {
    id: 'pen-ink',
    name: 'Pen & Ink',
    isLight: true,
    palette: {
      background: PEN_INK_PALETTE.canvas,
      canvas: PEN_INK_PALETTE.canvas,
      primary: PEN_INK_PALETTE.void,
      secondary: PEN_INK_PALETTE.inkLight,
      accent: PEN_INK_PALETTE.brassAccent,
      faint: 'rgba(22, 20, 18, 0.35)',
    },
    fontFamily: {
      display: PEN_INK_TYPOGRAPHY.display,
      body: PEN_INK_TYPOGRAPHY.body,
      mono: 'monospace',
    },
    BackgroundComponent: PenInkCanvas,
    MotifRenderer: PenInkRenderer,
  },

  'minimal-type': {
    id: 'minimal-type',
    name: 'Minimal Type',
    isLight: false,
    palette: {
      background: MINIMAL_TYPE_PALETTE.void,
      primary: MINIMAL_TYPE_PALETTE.ink,
      secondary: MINIMAL_TYPE_PALETTE.muted,
      accent: MINIMAL_TYPE_PALETTE.accent,
      faint: MINIMAL_TYPE_PALETTE.faint,
    },
    fontFamily: {
      display: MINIMAL_TYPE_TYPOGRAPHY.display,
      body: MINIMAL_TYPE_TYPOGRAPHY.body,
      mono: MINIMAL_TYPE_TYPOGRAPHY.mono,
    },
    BackgroundComponent: MinimalTypeCanvas,
    MotifRenderer: MinimalTypeRenderer,
  },

  'pencil-sketch': {
    id: 'pencil-sketch',
    name: 'Pencil Sketch',
    isLight: true,
    palette: {
      background: PENCIL_SKETCH_PALETTE.canvas,
      canvas: PENCIL_SKETCH_PALETTE.canvas,
      primary: PENCIL_SKETCH_PALETTE.charcoal,
      secondary: PENCIL_SKETCH_PALETTE.lead,
      accent: PENCIL_SKETCH_PALETTE.accent,
      faint: PENCIL_SKETCH_PALETTE.faint,
    },
    fontFamily: {
      display: PENCIL_SKETCH_TYPOGRAPHY.display,
      body: PENCIL_SKETCH_TYPOGRAPHY.body,
      mono: PENCIL_SKETCH_TYPOGRAPHY.mono,
    },
    BackgroundComponent: PencilSketchCanvas,
    MotifRenderer: PencilSketchRenderer,
  },

  'graph-abstract': {
    id: 'graph-abstract',
    name: 'Graph / Abstract',
    isLight: false,
    palette: {
      background: GRAPH_ABSTRACT_PALETTE.void,
      primary: GRAPH_ABSTRACT_PALETTE.primary,
      secondary: GRAPH_ABSTRACT_PALETTE.secondary,
      accent: GRAPH_ABSTRACT_PALETTE.accent,
      faint: GRAPH_ABSTRACT_PALETTE.faint,
    },
    fontFamily: {
      display: GRAPH_ABSTRACT_TYPOGRAPHY.display,
      body: GRAPH_ABSTRACT_TYPOGRAPHY.body,
      mono: GRAPH_ABSTRACT_TYPOGRAPHY.mono,
    },
    BackgroundComponent: GraphAbstractCanvas,
    MotifRenderer: GraphAbstractRenderer,
  },

  notebook: {
    id: 'notebook',
    name: 'Notebook',
    isLight: true,
    palette: {
      background: NOTEBOOK_PALETTE.canvas,
      canvas: NOTEBOOK_PALETTE.canvas,
      primary: NOTEBOOK_PALETTE.ink,
      secondary: NOTEBOOK_PALETTE.void,
      accent: NOTEBOOK_PALETTE.accent,
      faint: NOTEBOOK_PALETTE.faint,
    },
    fontFamily: {
      display: NOTEBOOK_TYPOGRAPHY.display,
      body: NOTEBOOK_TYPOGRAPHY.body,
      mono: NOTEBOOK_TYPOGRAPHY.mono,
    },
    BackgroundComponent: NotebookCanvas,
    MotifRenderer: NotebookRenderer,
  },

  cinematic: {
    id: 'cinematic',
    name: 'Cinematic',
    isLight: false,
    palette: {
      background: CINEMATIC_PALETTE.void,
      primary: CINEMATIC_PALETTE.primary,
      secondary: CINEMATIC_PALETTE.secondary,
      accent: CINEMATIC_PALETTE.amber,
      faint: CINEMATIC_PALETTE.faint,
    },
    fontFamily: {
      display: CINEMATIC_TYPOGRAPHY.display,
      body: CINEMATIC_TYPOGRAPHY.body,
      mono: CINEMATIC_TYPOGRAPHY.mono,
    },
    BackgroundComponent: CinematicCanvas,
    MotifRenderer: CinematicRenderer,
  },

  'hand-drawn': {
    id: 'hand-drawn',
    name: 'Hand Drawn',
    isLight: true,
    palette: {
      background: PENCIL_SKETCH_PALETTE.canvas,
      canvas: PENCIL_SKETCH_PALETTE.canvas,
      primary: PENCIL_SKETCH_PALETTE.charcoal,
      secondary: PENCIL_SKETCH_PALETTE.lead,
      accent: PENCIL_SKETCH_PALETTE.accent,
      faint: PENCIL_SKETCH_PALETTE.faint,
    },
    fontFamily: {
      display: PENCIL_SKETCH_TYPOGRAPHY.display,
      body: PENCIL_SKETCH_TYPOGRAPHY.body,
      mono: PENCIL_SKETCH_TYPOGRAPHY.mono,
    },
    BackgroundComponent: PencilSketchCanvas,
    MotifRenderer: PencilSketchRenderer,
  },

  'lyrical-animation': {
    id: 'lyrical-animation',
    name: 'Lyrical + Animation',
    isLight: false,
    palette: {
      background: GRAPH_ABSTRACT_PALETTE.void,
      primary: GRAPH_ABSTRACT_PALETTE.primary,
      secondary: GRAPH_ABSTRACT_PALETTE.secondary,
      accent: GRAPH_ABSTRACT_PALETTE.accent,
      faint: GRAPH_ABSTRACT_PALETTE.faint,
    },
    fontFamily: {
      display: GRAPH_ABSTRACT_TYPOGRAPHY.display,
      body: GRAPH_ABSTRACT_TYPOGRAPHY.body,
      mono: GRAPH_ABSTRACT_TYPOGRAPHY.mono,
    },
    BackgroundComponent: GraphAbstractCanvas,
    MotifRenderer: GraphAbstractRenderer,
  },
};

export function getStyleDefinition(styleId: StyleId): StyleDefinition {
  const def = STYLE_REGISTRY[styleId];
  if (!def) {
    return STYLE_REGISTRY['pen-ink'];
  }
  return def;
}

