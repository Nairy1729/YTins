import React from 'react';
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import type { MotifItem } from '../../components/SceneMotifs';
import { NOTEBOOK_PALETTE } from './notebook.theme';
import { getNotebookMotif } from './NotebookMotifLibrary';

interface NotebookRendererProps {
  motif: MotifItem;
}

export const NotebookRenderer: React.FC<NotebookRendererProps> = ({ motif }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const paths = getNotebookMotif(motif.ref);
  const posX = motif.x * width;
  const posY = motif.y * height;
  const scale = motif.scale ?? 1;
  const rotation = motif.rotation ?? 0;

  const delayFrames = Math.round(((motif.delayMs ?? 0) / 1000) * fps);
  const drawFrames = Math.max(10, Math.round(((motif.drawInMs ?? 700) / 1000) * fps));
  const ease = { easing: Easing.bezier(0.25, 0.1, 0.25, 1) };

  return (
    <div
      style={{
        position: 'absolute',
        left: posX,
        top: posY,
        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
        width: 200,
        height: 200,
        pointerEvents: 'none',
      }}
    >
      <svg width="200" height="200" viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
        {paths.map((p, idx) => {
          const pathDelay = delayFrames + idx * 4;
          const strokeOffset = interpolate(
            frame,
            [pathDelay, pathDelay + drawFrames],
            [p.length, 0],
            { ...ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          );

          const opacity = interpolate(
            frame,
            [pathDelay, pathDelay + 6],
            [0, 0.9],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          );

          const strokeColor = p.accent ? NOTEBOOK_PALETTE.accent : NOTEBOOK_PALETTE.ink;

          return (
            <path
              key={idx}
              d={p.d}
              fill="none"
              stroke={strokeColor}
              strokeWidth={p.strokeWidth ?? 2}
              strokeLinecap="round"
              strokeLinejoin="round"
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

