import React from 'react';
import { useVideoConfig } from 'remotion';
import type { StyleId } from '@reverie/contracts';
import { getStyleDefinition } from '../styles';

export interface MotifItem {
  ref: string;
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
  drawInMs?: number;
  delayMs?: number;
}

interface SceneMotifsProps {
  motifs: MotifItem[];
  styleId: StyleId;
}


export const SceneMotifs: React.FC<SceneMotifsProps> = ({ motifs, styleId }) => {
  const { width, height } = useVideoConfig();

  if (motifs.length === 0) {
    return null;
  }

  const styleDef = getStyleDefinition(styleId);
  const Renderer = styleDef.MotifRenderer;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height,
        pointerEvents: 'none',
      }}
    >
      {motifs.map((motif, index) => (
        <Renderer key={`${motif.ref}-${index}`} motif={motif} />
      ))}
    </div>
  );
};

