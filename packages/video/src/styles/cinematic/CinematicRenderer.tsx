import React from 'react';
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import type { MotifItem } from '../../components/SceneMotifs';
import { CINEMATIC_PALETTE } from './cinematic.theme';
import { getCinematicMotif } from './CinematicMotifLibrary';

interface CinematicRendererProps {
  motif: MotifItem;
}

export const CinematicRenderer: React.FC<CinematicRendererProps> = ({ motif }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const paths = getCinematicMotif(motif.ref);
  const posX = motif.x * width;
  const posY = motif.y * height;
  const scale = motif.scale ?? 1;
  const rotation = motif.rotation ?? 0;

  const delayFrames = Math.round(((motif.delayMs ?? 0) / 1000) * fps);
  const drawFrames = Math.max(12, Math.round(((motif.drawInMs ?? 800) / 1000) * fps));
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
        <defs>
          <filter id="cinematic-bloom">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

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
            [pathDelay, pathDelay + 10],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          );

          const strokeColor = p.accent ? CINEMATIC_PALETTE.amber : CINEMATIC_PALETTE.primary;

          return (
            <React.Fragment key={idx}>
              {/* Bloom halo */}
              <path
                d={p.d}
                fill="none"
                stroke={strokeColor}
                strokeWidth={(p.strokeWidth ?? 1.5) + 2}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={p.length}
                strokeDashoffset={strokeOffset}
                opacity={opacity * 0.3}
                filter="url(#cinematic-bloom)"
              />
              {/* Clean foreground stroke */}
              <path
                d={p.d}
                fill="none"
                stroke={strokeColor}
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

