import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface LyricBacklightProps {
  startFrame: number;
  endFrame: number;
  isLight: boolean;
}

export const LyricBacklight: React.FC<LyricBacklightProps> = ({
  startFrame,
  endFrame,
  isLight,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 14, Math.max(startFrame + 14, endFrame - 12), endFrame],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const background = isLight
    ? 'radial-gradient(ellipse 460px 180px at 50% 50%, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0) 70%)'
    : 'radial-gradient(ellipse 480px 200px at 50% 50%, rgba(8, 8, 10, 0.85) 0%, rgba(8, 8, 10, 0.45) 50%, rgba(8, 8, 10, 0) 80%)';

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 240,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 1000,
        height: 360,
        background,
        opacity,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};
