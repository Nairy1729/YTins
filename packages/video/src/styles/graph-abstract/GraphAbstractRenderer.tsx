import React from 'react';
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import type { MotifItem } from '../../components/SceneMotifs';
import { GRAPH_ABSTRACT_PALETTE } from './graph-abstract.theme';
import { getGraphAbstractMotif } from './GraphAbstractMotifLibrary';

interface GraphAbstractRendererProps {
  motif: MotifItem;
}

export const GraphAbstractRenderer: React.FC<GraphAbstractRendererProps> = ({ motif }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const paths = getGraphAbstractMotif(motif.ref);
  const posX = motif.x * width;
  const posY = motif.y * height;
  const scale = motif.scale ?? 1;
  const rotation = motif.rotation ?? 0;

  const delayFrames = Math.round(((motif.delayMs ?? 0) / 1000) * fps);
  const drawFrames = Math.max(10, Math.round(((motif.drawInMs ?? 600) / 1000) * fps));
  const ease = { easing: Easing.bezier(0.1, 0.9, 0.2, 1) };

  // Digital radar pulse
  const pulse = Math.sin((frame - delayFrames) * 0.15) * 0.15 + 0.85;

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
        <defs>
          <filter id="neon-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

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

          const color = p.accent ? GRAPH_ABSTRACT_PALETTE.accent : GRAPH_ABSTRACT_PALETTE.primary;

          return (
            <React.Fragment key={idx}>
              {/* Glowing vector line */}
              <path
                d={p.d}
                fill="none"
                stroke={color}
                strokeWidth={(p.strokeWidth ?? 1.5) + 1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={p.length}
                strokeDashoffset={strokeOffset}
                opacity={opacity * 0.3 * pulse}
                filter="url(#neon-glow)"
              />
              {/* Sharp core vector */}
              <path
                d={p.d}
                fill="none"
                stroke={color}
                strokeWidth={p.strokeWidth ?? 1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={p.length}
                strokeDashoffset={strokeOffset}
                opacity={opacity}
              />
            </React.Fragment>
          );
        })}
      </svg>
    </div>
  );
};

