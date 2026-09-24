import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { PALETTE } from '../constants';

interface MinimalLyricProps {
  text: string;
  startFrame: number;
  endFrame: number;
  textColor: string;
}

export const MinimalLyric: React.FC<MinimalLyricProps> = ({
  text,
  startFrame,
  endFrame,
  textColor,
}) => {
  const frame = useCurrentFrame();

  const fadeInDuration = 14;
  const fadeOutDuration = 12;
  const ease = { easing: Easing.bezier(0.16, 1, 0.3, 1) };

  // Opacity
  const opacity = interpolate(
    frame,
    [
      startFrame,
      startFrame + fadeInDuration,
      Math.max(startFrame + fadeInDuration, endFrame - fadeOutDuration),
      endFrame,
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Optical blur from soft focus to crisp focus
  const blur = interpolate(
    frame,
    [startFrame, startFrame + fadeInDuration],
    [10, 0],
    { ...ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Tracking / Letter-spacing contraction
  const letterSpacingEm = interpolate(
    frame,
    [startFrame, startFrame + fadeInDuration * 1.5],
    [0.12, 0.04],
    { ...ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Gentle upward float
  const translateY = interpolate(
    frame,
    [startFrame, endFrame],
    [12, -8],
    { easing: Easing.linear, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <div
      style={{
        opacity,
        filter: blur > 0.1 ? `blur(${blur.toFixed(2)}px)` : 'none',
        transform: `translate3d(0, ${translateY.toFixed(2)}px, 0)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <span
        style={{
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          fontWeight: 300,
          fontSize: 52,
          lineHeight: 1.35,
          letterSpacing: `${letterSpacingEm.toFixed(4)}em`,
          color: textColor,
          textShadow: '0 2px 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 0, 0, 0.5)',
          textAlign: 'center',
        }}
      >
        {text}
      </span>

      {/* Understated hairline accent */}
      <div
        style={{
          width: 48,
          height: 1,
          backgroundColor: PALETTE.brass,
          opacity: 0.6,
        }}
      />
    </div>
  );
};
