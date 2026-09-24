import { STYLE_CATALOG } from '@reverie/contracts';
import type { StyleCatalogEntry, StyleId } from '@reverie/contracts';

export interface StyleOption extends StyleCatalogEntry {
  glyph: string[];
}

const GLYPHS: Record<StyleId, string[]> = {
  'pen-ink': ['M 24 6 L 34 30 L 24 42 L 14 30 Z', 'M 24 20 L 24 34'],
  'minimal-type': ['M 12 16 L 36 16', 'M 24 16 L 24 36'],
  'pencil-sketch': ['M 10 34 L 26 10', 'M 16 38 L 32 14', 'M 22 40 L 38 16'],
  'hand-drawn': ['M 12 24 C 12 12, 36 12, 36 24 C 36 36, 12 36, 12 24'],
  'graph-abstract': ['M 8 40 L 40 40', 'M 8 8 L 8 40', 'M 10 32 L 20 20 L 28 26 L 40 10'],
  cinematic: ['M 8 14 L 40 14 L 40 34 L 8 34 Z', 'M 16 14 L 16 34', 'M 32 14 L 32 34'],
  notebook: ['M 12 8 L 36 8 L 36 40 L 12 40 Z', 'M 18 18 L 30 18', 'M 18 26 L 30 26'],
  'lyrical-animation': ['M 8 24 Q 16 12 24 24 Q 32 36 40 24', 'M 14 34 L 34 34'],
};

export const STYLE_OPTIONS: StyleOption[] = STYLE_CATALOG.map((entry) => ({
  ...entry,
  glyph: GLYPHS[entry.id],
}));