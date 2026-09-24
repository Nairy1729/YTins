import React from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { PENCIL_SKETCH_PALETTE } from './pencil-sketch.theme';

interface PencilSketchCanvasProps {
  emotion?: string;
}

export const PencilSketchCanvas: React.FC<PencilSketchCanvasProps> = ({ emotion }) => {
  const { width, height } = useVideoConfig();
  const margin = 48;

  // Graphite emotional tone wash
  let washColor = 'rgba(56, 53, 49, 0.05)';
  if (emotion === 'melancholy' || emotion === 'longing') {
    washColor = 'rgba(70, 75, 85, 0.08)';
  } else if (emotion === 'warmth' || emotion === 'devotion') {
    washColor = 'rgba(156, 91, 67, 0.07)';
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PENCIL_SKETCH_PALETTE.canvas,
        overflow: 'hidden',
      }}
    >
      {/* SVG filter for graphite paper roughness */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <filter id="pencil-paper-texture">
          <feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves="4" result="noise" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.22   0 0 0 0 0.21   0 0 0 0 0.19  0 0 0 0.08 0"
          />
        </filter>
      </svg>

      {/* Textured noise overlay */}
      <AbsoluteFill
        style={{
          filter: 'url(#pencil-paper-texture)',
          opacity: 0.85,
          pointerEvents: 'none',
        }}
      />

      {/* Atmospheric radial graphite wash */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 45%, transparent 35%, ${washColor} 100%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Organic hand-sketched border */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
      >
        {/* Subtle multi-pass graphite border lines */}
        <rect
          x={margin}
          y={margin}
          width={width - margin * 2}
          height={height - margin * 2}
          fill="none"
          stroke={PENCIL_SKETCH_PALETTE.lead}
          strokeWidth={1.2}
          opacity={0.35}
          strokeDasharray="18 4 32 3"
        />
        <rect
          x={margin + 2}
          y={margin + 2}
          width={width - (margin + 2) * 2}
          height={height - (margin + 2) * 2}
          fill="none"
          stroke={PENCIL_SKETCH_PALETTE.lead}
          strokeWidth={0.8}
          opacity={0.25}
          strokeDasharray="12 6 24 5"
        />

        {/* Diagonal corner graphite shading ticks */}
        <line x1={margin} y1={margin + 16} x2={margin + 16} y2={margin} stroke={PENCIL_SKETCH_PALETTE.lead} strokeWidth={1} opacity={0.4} />
        <line x1={margin + 6} y1={margin + 22} x2={margin + 22} y2={margin + 6} stroke={PENCIL_SKETCH_PALETTE.lead} strokeWidth={0.8} opacity={0.3} />
        <line x1={width - margin} y1={margin + 16} x2={width - margin - 16} y2={margin} stroke={PENCIL_SKETCH_PALETTE.lead} strokeWidth={1} opacity={0.4} />
        <line x1={width - margin - 6} y1={margin + 22} x2={width - margin - 22} y2={margin + 6} stroke={PENCIL_SKETCH_PALETTE.lead} strokeWidth={0.8} opacity={0.3} />
      </svg>
    </AbsoluteFill>
  );
};

