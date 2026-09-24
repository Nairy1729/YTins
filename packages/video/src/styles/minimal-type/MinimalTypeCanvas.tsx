import React from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { MINIMAL_TYPE_PALETTE, MINIMAL_TYPE_TYPOGRAPHY } from './minimal-type.theme';

interface MinimalTypeCanvasProps {
  emotion?: string;
}

export const MinimalTypeCanvas: React.FC<MinimalTypeCanvasProps> = ({ emotion }) => {
  const { width, height } = useVideoConfig();
  const margin = 56;

  // Emotion-reactive subtle focal tint
  let glowColor = 'rgba(234, 179, 8, 0.04)';
  if (emotion === 'melancholy' || emotion === 'longing') {
    glowColor = 'rgba(148, 163, 184, 0.05)';
  } else if (emotion === 'warmth' || emotion === 'devotion') {
    glowColor = 'rgba(245, 158, 11, 0.06)';
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: MINIMAL_TYPE_PALETTE.void,
        backgroundImage: `radial-gradient(ellipse at 50% 48%, ${glowColor} 0%, rgba(9, 9, 11, 0.95) 70%)`,
        overflow: 'hidden',
      }}
    >
      {/* Precision architectural hairline frame */}
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
        {/* Outer margin border */}
        <rect
          x={margin}
          y={margin}
          width={width - margin * 2}
          height={height - margin * 2}
          fill="none"
          stroke={MINIMAL_TYPE_PALETTE.line}
          strokeWidth={1}
        />

        {/* Corner registration crosses */}
        {/* Top-Left */}
        <line x1={margin - 12} y1={margin} x2={margin + 12} y2={margin} stroke={MINIMAL_TYPE_PALETTE.accent} strokeWidth={1.5} />
        <line x1={margin} y1={margin - 12} x2={margin} y2={margin + 12} stroke={MINIMAL_TYPE_PALETTE.accent} strokeWidth={1.5} />
        {/* Top-Right */}
        <line x1={width - margin - 12} y1={margin} x2={width - margin + 12} y2={margin} stroke={MINIMAL_TYPE_PALETTE.accent} strokeWidth={1.5} />
        <line x1={width - margin} y1={margin - 12} x2={width - margin} y2={margin + 12} stroke={MINIMAL_TYPE_PALETTE.accent} strokeWidth={1.5} />
        {/* Bottom-Left */}
        <line x1={margin - 12} y1={height - margin} x2={margin + 12} y2={height - margin} stroke={MINIMAL_TYPE_PALETTE.accent} strokeWidth={1.5} />
        <line x1={margin} y1={height - margin - 12} x2={margin} y2={height - margin + 12} stroke={MINIMAL_TYPE_PALETTE.accent} strokeWidth={1.5} />
        {/* Bottom-Right */}
        <line x1={width - margin - 12} y1={height - margin} x2={width - margin + 12} y2={height - margin} stroke={MINIMAL_TYPE_PALETTE.accent} strokeWidth={1.5} />
        <line x1={width - margin} y1={height - margin - 12} x2={width - margin} y2={height - margin + 12} stroke={MINIMAL_TYPE_PALETTE.accent} strokeWidth={1.5} />

        {/* Center horizontal guide line segment */}
        <line
          x1={margin}
          y1={height / 2}
          x2={margin + 24}
          y2={height / 2}
          stroke={MINIMAL_TYPE_PALETTE.line}
          strokeWidth={1}
        />
        <line
          x1={width - margin - 24}
          y1={height / 2}
          x2={width - margin}
          y2={height / 2}
          stroke={MINIMAL_TYPE_PALETTE.line}
          strokeWidth={1}
        />
      </svg>

      {/* Modernist typographic corner badges */}
      <div
        style={{
          position: 'absolute',
          top: margin + 16,
          left: margin + 20,
          fontFamily: MINIMAL_TYPE_TYPOGRAPHY.mono,
          fontSize: 11,
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: MINIMAL_TYPE_PALETTE.muted,
          pointerEvents: 'none',
        }}
      >
        REVERIE // SPEC 01
      </div>

      <div
        style={{
          position: 'absolute',
          top: margin + 16,
          right: margin + 20,
          fontFamily: MINIMAL_TYPE_TYPOGRAPHY.mono,
          fontSize: 11,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: MINIMAL_TYPE_PALETTE.accent,
          pointerEvents: 'none',
        }}
      >
        1080 × 1920
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: margin + 16,
          left: margin + 20,
          fontFamily: MINIMAL_TYPE_TYPOGRAPHY.mono,
          fontSize: 10,
          letterSpacing: '0.26em',
          textTransform: 'uppercase',
          color: MINIMAL_TYPE_PALETTE.faint,
          pointerEvents: 'none',
        }}
      >
        SEC // {emotion ? emotion.toUpperCase() : 'NEUTRAL'}
      </div>
    </AbsoluteFill>
  );
};

