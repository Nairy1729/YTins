import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { PEN_INK_THEME } from './pen-ink.theme';

interface PenInkCanvasProps {
  emotion?: string;
}

export const PenInkCanvas: React.FC<PenInkCanvasProps> = ({ emotion }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Subtle breathing contrast over time
  const grainOpacity = interpolate(
    Math.sin(frame * 0.05),
    [-1, 1],
    [0.038, 0.052],
  );

  const margin = 56;
  const frameWidth = width - margin * 2;
  const frameHeight = height - margin * 2;

  // Emotion-specific subtle atmospheric warmth
  let radialCenterColor = 'rgba(28, 25, 34, 0.4)';
  if (emotion === 'yearning' || emotion === 'devotion') {
    radialCenterColor = 'rgba(38, 30, 24, 0.45)'; // subtle warm amber wash
  } else if (emotion === 'solitude' || emotion === 'acceptance') {
    radialCenterColor = 'rgba(22, 28, 36, 0.45)'; // subtle cool indigo wash
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PEN_INK_THEME.colors.canvas,
        backgroundImage: `radial-gradient(ellipse 900px 1400px at 50% 45%, ${radialCenterColor} 0%, rgba(7, 7, 9, 0.95) 85%)`,
      }}
    >
      {/* Procedural SVG Paper Tooth & Grain Filter */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: grainOpacity,
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
        }}
      >
        <filter id="paper-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-grain)" />
      </svg>

      {/* Artist Framing Margin & Registration Guides */}
      <svg
        width={width}
        height={height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          opacity: 0.4,
        }}
      >
        {/* Subtle framing box */}
        <rect
          x={margin}
          y={margin}
          width={frameWidth}
          height={frameHeight}
          fill="none"
          stroke={PEN_INK_THEME.colors.borderGuide}
          strokeWidth={0.75}
          strokeDasharray="4 8"
        />

        {/* Top-left corner registration marks */}
        <path
          d={`M ${margin - 16} ${margin} L ${margin + 16} ${margin} M ${margin} ${margin - 16} L ${margin} ${margin + 16}`}
          stroke={PEN_INK_THEME.colors.brassAccent}
          strokeWidth={1}
          opacity={0.7}
        />
        {/* Top-right corner registration */}
        <path
          d={`M ${width - margin - 16} ${margin} L ${width - margin + 16} ${margin} M ${width - margin} ${margin - 16} L ${width - margin} ${margin + 16}`}
          stroke={PEN_INK_THEME.colors.brassAccent}
          strokeWidth={1}
          opacity={0.7}
        />
        {/* Bottom-left corner registration */}
        <path
          d={`M ${margin - 16} ${height - margin} L ${margin + 16} ${height - margin} M ${margin} ${height - margin - 16} L ${margin} ${height - margin + 16}`}
          stroke={PEN_INK_THEME.colors.brassAccent}
          strokeWidth={1}
          opacity={0.7}
        />
        {/* Bottom-right corner registration */}
        <path
          d={`M ${width - margin - 16} ${height - margin} L ${width - margin + 16} ${height - margin} M ${width - margin} ${height - margin - 16} L ${width - margin} ${height - margin + 16}`}
          stroke={PEN_INK_THEME.colors.brassAccent}
          strokeWidth={1}
          opacity={0.7}
        />
      </svg>

      {/* Dark vignette border */}
      <AbsoluteFill
        style={{
          boxShadow: 'inset 0 0 200px rgba(0, 0, 0, 0.75)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
