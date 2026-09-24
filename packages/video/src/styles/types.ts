import React from 'react';
import type { StyleId } from '@reverie/contracts';
import type { MotifItem } from '../components/SceneMotifs';

export interface StylePalette {
  background: string;
  canvas?: string;
  primary: string;
  secondary: string;
  accent: string;
  faint: string;
}

export interface StyleFontFamily {
  display: string;
  body: string;
  mono?: string;
}

export interface StyleDefinition {
  id: StyleId;
  name: string;
  isLight: boolean;
  palette: StylePalette;
  fontFamily: StyleFontFamily;
  BackgroundComponent: React.FC<{ emotion?: string }>;
  MotifRenderer: React.FC<{ motif: MotifItem }>;
}