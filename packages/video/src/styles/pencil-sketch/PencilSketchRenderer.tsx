import React from 'react';
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import type { MotifItem } from '../../components/SceneMotifs';
import { PENCIL_SKETCH_PALETTE } from './pencil-sketch.theme';
import { getPencilSketchMotif } from './PencilSketchMotifLibrary';

interface PencilSketchRendererProps {
  motif: MotifItem;
}

export const PencilSketchRenderer: React.FC<PencilSketchRendererProps> = ({ motif }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const paths = getPencilSketchMotif(motif.ref);
  const posX = motif.x * width;
  const posY = motif.y * height;
  const scale = motif.scale ?? 1;
  const rotation = motif.rotation ?? 0;

  const delayFrames = Math.round(((motif.delayMs ?? 0) / 1000) * fps);
  const drawFrames = Math.max(10, Math.round(((motif.drawInMs ?? 750) / 1000) * fps));
  const ease = { easing: Easing.bezier(0.25, 0.1, 0.25, 1) };

  // Micro jitter for graphite wobble
  const jitter = Math.sin(frame * 0.4) * 0.4;

  return (
    <div
      style={{
        position: 'absolute',
        left: posX + jitter,
        top: posY + jitter,
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
            [0, p.isShading ? 0.6 : 0.95],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          );

          return (
            <React.Fragment key={idx}>
              {/* Secondary faint pencil trace (simulates sketching over the line twice) */}
              <path
                d={p.d}
                fill="none"
                stroke={PENCIL_SKETCH_PALETTE.charcoal}
                strokeWidth={(p.strokeWidth ?? 1.8) + 0.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={p.length}
                strokeDashoffset={strokeOffset}
                opacity={opacity * 0.25}
                transform="translate(0.5, 0.5)"
              />
              {/* Primary graphite stroke */}
              <path
                d={p.d}
                fill="none"
                stroke={p.isShading ? PENCIL_SKETCH_PALETTE.lead : PENCIL_SKETCH_PALETTE.charcoal}
                strokeWidth={p.strokeWidth ?? 1.8}
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

