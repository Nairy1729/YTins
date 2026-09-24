import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { GRAPH_ABSTRACT_PALETTE, GRAPH_ABSTRACT_TYPOGRAPHY } from './graph-abstract.theme';

interface GraphAbstractCanvasProps {
  emotion?: string;
}

export const GraphAbstractCanvas: React.FC<GraphAbstractCanvasProps> = ({ emotion }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Subtle scanning radar sweep angle
  const scanY = (frame * 3) % height;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: GRAPH_ABSTRACT_PALETTE.void,
        backgroundImage: 'radial-gradient(ellipse at 50% 50%, rgba(56, 189, 248, 0.08) 0%, rgba(6, 11, 20, 0.98) 75%)',
        overflow: 'hidden',
      }}
    >
      {/* Precision Blueprint Grid */}
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
        <defs>
          <pattern id="grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke={GRAPH_ABSTRACT_PALETTE.gridLine}
              strokeWidth="0.75"
            />
            {/* Fine sub-grid dot */}
            <circle cx="30" cy="30" r="0.8" fill={GRAPH_ABSTRACT_PALETTE.gridLine} />
          </pattern>
        </defs>

        {/* Fill entire background with the grid pattern */}
        <rect width={width} height={height} fill="url(#grid-pattern)" />

        {/* Major Central Coordinate Axes */}
        <line
          x1={width / 2}
          y1={0}
          x2={width / 2}
          y2={height}
          stroke={GRAPH_ABSTRACT_PALETTE.primary}
          strokeWidth="1"
          opacity={0.3}
          strokeDasharray="8 6"
        />
        <line
          x1={0}
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke={GRAPH_ABSTRACT_PALETTE.primary}
          strokeWidth="1"
          opacity={0.3}
          strokeDasharray="8 6"
        />

        {/* Animated Horizontal Scan Beam */}
        <line
          x1={0}
          y1={scanY}
          x2={width}
          y2={scanY}
          stroke={GRAPH_ABSTRACT_PALETTE.accent}
          strokeWidth="1.5"
          opacity={0.22}
        />
      </svg>

      {/* Edge telemetry readings */}
      <div
        style={{
          position: 'absolute',
          top: 48,
          left: 54,
          fontFamily: GRAPH_ABSTRACT_TYPOGRAPHY.mono,
          fontSize: 10,
          letterSpacing: '0.22em',
          color: GRAPH_ABSTRACT_PALETTE.primary,
          pointerEvents: 'none',
        }}
      >
        SYS.GRAPH // VECTOR MATRIX
      </div>

      <div
        style={{
          position: 'absolute',
          top: 48,
          right: 54,
          fontFamily: GRAPH_ABSTRACT_TYPOGRAPHY.mono,
          fontSize: 10,
          letterSpacing: '0.22em',
          color: GRAPH_ABSTRACT_PALETTE.telemetry,
          pointerEvents: 'none',
        }}
      >
        FRM: {String(frame).padStart(4, '0')} // 30 FPS
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 48,
          left: 54,
          fontFamily: GRAPH_ABSTRACT_TYPOGRAPHY.mono,
          fontSize: 10,
          letterSpacing: '0.22em',
          color: GRAPH_ABSTRACT_PALETTE.secondary,
          pointerEvents: 'none',
        }}
      >
        EMOTION // {emotion ? emotion.toUpperCase() : 'TELEMETRY'}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 48,
          right: 54,
          fontFamily: GRAPH_ABSTRACT_TYPOGRAPHY.mono,
          fontSize: 10,
          letterSpacing: '0.22em',
          color: GRAPH_ABSTRACT_PALETTE.accent,
          pointerEvents: 'none',
        }}
      >
        COORD: 31.52°N 75.98°E
      </div>
    </AbsoluteFill>
  );
};

