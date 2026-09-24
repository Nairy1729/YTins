import React from 'react';
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import type { MotifItem } from '../../components/SceneMotifs';
import { MINIMAL_TYPE_PALETTE } from './minimal-type.theme';
import { getMinimalTypeMotif } from './MinimalTypeMotifLibrary';

interface MinimalTypeRendererProps {
  motif: MotifItem;
}

export const MinimalTypeRenderer: React.FC<MinimalTypeRendererProps> = ({ motif }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const paths = getMinimalTypeMotif(motif.ref);
  const posX = motif.x * width;
  const posY = motif.y * height;
  const scale = motif.scale ?? 1;
  const rotation = motif.rotation ?? 0;

  const delayFrames = Math.round(((motif.delayMs ?? 0) / 1000) * fps);
  const drawFrames = Math.max(10, Math.round(((motif.drawInMs ?? 600) / 1000) * fps));
  const ease = { easing: Easing.bezier(0.16, 1, 0.3, 1) };

  // Subtle entry scale pop
  const entryScale = interpolate(
    frame,
    [delayFrames, delayFrames + 12],
    [0.92, 1],
    { ...ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: posX,
        top: posY,
        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale * entryScale})`,
        width: 200,
        height: 200,
        pointerEvents: 'none',
      }}
    >
      <svg width="200" height="200" viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
        {paths.map((p, idx) => {
          const pathDelay = delayFrames + idx * 3;
          const strokeOffset = interpolate(
            frame,
            [pathDelay, pathDelay + drawFrames],
            [p.length, 0],
            { ...ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          );

          const opacity = interpolate(
            frame,
            [pathDelay, pathDelay + 6],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          );

          return (
            <path
              key={idx}
              d={p.d}
              fill="none"
              stroke={p.accent ? MINIMAL_TYPE_PALETTE.accent : MINIMAL_TYPE_PALETTE.ink}
              strokeWidth={p.strokeWidth ?? 1.2}
              strokeLinecap="square"
              strokeLinejoin="miter"
              strokeDasharray={p.length}
              strokeDashoffset={strokeOffset}
              opacity={opacity}
            />
          );
        })}
      </svg>
    </div>
  );
};

