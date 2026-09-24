import React from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { NOTEBOOK_PALETTE, NOTEBOOK_TYPOGRAPHY } from './notebook.theme';

interface NotebookCanvasProps {
  emotion?: string;
}

export const NotebookCanvas: React.FC<NotebookCanvasProps> = ({ emotion }) => {
  const { width, height } = useVideoConfig();
  const marginX = 140;
  const lineSpacing = 44;
  const headerTop = 160;

  // Calculate ruled lines
  const lines: number[] = [];
  for (let y = headerTop; y < height - 60; y += lineSpacing) {
    lines.push(y);
  }

  // 3 standard binder holes
  const binderHoles = [250, 960, 1670];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: NOTEBOOK_PALETTE.canvas,
        overflow: 'hidden',
      }}
    >
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
        {/* Horizontal Blue Ruled Lines */}
        {lines.map((y, idx) => (
          <line
            key={idx}
            x1={0}
            y1={y}
            x2={width}
            y2={y}
            stroke={NOTEBOOK_PALETTE.blueLine}
            strokeWidth={1.2}
          />
        ))}

        {/* Double Header Top Divider */}
        <line
          x1={0}
          y1={headerTop - 4}
          x2={width}
          y2={headerTop - 4}
          stroke={NOTEBOOK_PALETTE.blueLine}
          strokeWidth={1.5}
        />

        {/* Left Vertical Red Margin Line */}
        <line
          x1={marginX}
          y1={0}
          x2={marginX}
          y2={height}
          stroke={NOTEBOOK_PALETTE.marginRed}
          strokeWidth={1.6}
        />

        {/* Binder Punch Holes */}
        {binderHoles.map((holeY, idx) => (
          <g key={idx}>
            {/* Hole cut shadow */}
            <circle cx="60" cy={holeY} r="18" fill={NOTEBOOK_PALETTE.binderHole} stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
            <circle cx="60" cy={holeY} r="15" fill="#f0ebe0" opacity="0.6" />
          </g>
        ))}
      </svg>

      {/* Top Page Header Date & Label */}
      <div
        style={{
          position: 'absolute',
          top: headerTop - 54,
          left: marginX + 24,
          fontFamily: NOTEBOOK_TYPOGRAPHY.display,
          fontSize: 26,
          color: NOTEBOOK_PALETTE.ink,
          opacity: 0.85,
          pointerEvents: 'none',
        }}
      >
        Journal Entry ~ {emotion ? emotion.toUpperCase() : 'MEMOIR'}
      </div>

      <div
        style={{
          position: 'absolute',
          top: headerTop - 50,
          right: 60,
          fontFamily: NOTEBOOK_TYPOGRAPHY.body,
          fontSize: 20,
          color: NOTEBOOK_PALETTE.faint,
          pointerEvents: 'none',
        }}
      >
        p. 01
      </div>
    </AbsoluteFill>
  );
};

