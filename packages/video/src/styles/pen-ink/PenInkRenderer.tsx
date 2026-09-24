import React from 'react';
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { getPenInkMotif } from './PenInkMotifLibrary';
import { PEN_INK_THEME } from './pen-ink.theme';

interface PenInkMotifItem {
  ref: string;
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
  drawInMs?: number;
  delayMs?: number;
}

interface PenInkRendererProps {
  motif: PenInkMotifItem;
}

export const PenInkRenderer: React.FC<PenInkRendererProps> = ({ motif }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const paths = getPenInkMotif(motif.ref);

  const posX = motif.x * width;
  const posY = motif.y * height;
  const scale = motif.scale ?? 1;
  const rotation = motif.rotation ?? 0;

  const delayFrames = Math.round(((motif.delayMs ?? 0) / 1000) * fps);
  const totalDrawFrames = Math.max(12, Math.round(((motif.drawInMs ?? 1000) / 1000) * fps));

  // Sort paths by drawing order
  const sortedPaths = [...paths].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Stagger per-path timing
  const stepFrames = Math.max(2, Math.floor((totalDrawFrames * 0.4) / Math.max(1, sortedPaths.length)));
  const easeSketch = { easing: Easing.bezier(0.2, 0.8, 0.25, 1) };

  return (
    <div
      style={{
        position: 'absolute',
        left: posX,
        top: posY,
        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
        width: 240,
        height: 240,
        pointerEvents: 'none',
      }}
    >
      <svg
        width="240"
        height="240"
        viewBox="0 0 200 200"
        style={{
          overflow: 'visible',
          filter: 'drop-shadow(0 4px 18px rgba(0, 0, 0, 0.6))',
        }}
      >
        {sortedPaths.map((p, pIdx) => {
          const pathStart = delayFrames + pIdx * stepFrames;
          const pathDuration = Math.max(8, totalDrawFrames - pIdx * stepFrames);

          const offset = interpolate(
            frame,
            [pathStart, pathStart + pathDuration],
            [p.length, 0],
            { ...easeSketch, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          );

          const opacity = interpolate(
            frame,
            [pathStart, pathStart + 4],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          );

          const strokeColor = p.accent
            ? PEN_INK_THEME.colors.brassAccent
            : PEN_INK_THEME.colors.inkLight;

          return (
            <g key={pIdx}>
              {/* Main hand-drawn stroke */}
              <path
                d={p.d}
                fill="none"
                stroke={strokeColor}
                strokeWidth={p.strokeWidth ?? 2}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={p.length}
                strokeDashoffset={offset}
                opacity={opacity}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
