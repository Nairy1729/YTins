import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { PALETTE } from '../constants';

interface DualLineLyricProps {
  primaryText: string;
  contextText?: string | null;
  startFrame: number;
  endFrame: number;
  textColor: string;
}

export const DualLineLyric: React.FC<DualLineLyricProps> = ({
  primaryText,
  contextText,
  startFrame,
  endFrame,
  textColor,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 12, Math.max(startFrame + 12, endFrame - 10), endFrame],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const contextOpacity = interpolate(
    frame,
    [startFrame, startFrame + 15, Math.max(startFrame + 15, endFrame - 8), endFrame],
    [0, 0.38, 0.38, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <div
      style={{
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        maxWidth: 960,
      }}
    >
      {contextText ? (
        <span
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 34,
            fontWeight: 300,
            letterSpacing: '0.02em',
            color: PALETTE.muted,
            opacity: contextOpacity,
            textAlign: 'center',
          }}
        >
          {contextText}
        </span>
      ) : null}

      <span
        style={{
          fontFamily: '"Instrument Serif", Georgia, serif',
          fontStyle: 'italic',
          fontSize: 56,
          fontWeight: 400,
          lineHeight: 1.3,
          color: textColor,
          textAlign: 'center',
          textShadow: '0 2px 24px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 0, 0, 0.5)',
        }}
      >
        {primaryText}
      </span>
    </div>
  );
};
