import React, { useMemo } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { PALETTE } from '../constants';

interface Particle {
  id: number;
  initialX: number;
  initialY: number;
  radius: number;
  speed: number;
  driftX: number;
  opacityMax: number;
}

interface LyricParticleDriftProps {
  startFrame: number;
  endFrame: number;
  seed?: number;
}

export const LyricParticleDrift: React.FC<LyricParticleDriftProps> = ({
  startFrame,
  endFrame,
  seed = 42,
}) => {
  const frame = useCurrentFrame();

  const particles: Particle[] = useMemo(() => {
    const list: Particle[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      // Deterministic pseudo-randomness based on seed
      const pseudoRand = (offset: number) => {
        const x = Math.sin(seed * 997 + i * 43 + offset) * 10000;
        return x - Math.floor(x);
      };

      list.push({
        id: i,
        initialX: (pseudoRand(1) - 0.5) * 600,
        initialY: (pseudoRand(2) - 0.5) * 160,
        radius: 1 + pseudoRand(3) * 2,
        speed: 0.3 + pseudoRand(4) * 0.5,
        driftX: (pseudoRand(5) - 0.5) * 40,
        opacityMax: 0.2 + pseudoRand(6) * 0.35,
      });
    }
    return list;
  }, [seed]);

  const globalFade = interpolate(
    frame,
    [startFrame, startFrame + 15, Math.max(startFrame + 15, endFrame - 15), endFrame],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 340,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 800,
        height: 200,
        pointerEvents: 'none',
        opacity: globalFade,
      }}
    >
      {particles.map((p) => {
        const progress = (frame - startFrame) * p.speed;
        const currentY = p.initialY - progress;
        const currentX = p.initialX + Math.sin(progress * 0.05) * p.driftX;

        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `calc(50% + ${currentX.toFixed(1)}px)`,
              top: `calc(50% + ${currentY.toFixed(1)}px)`,
              width: p.radius * 2,
              height: p.radius * 2,
              borderRadius: '50%',
              backgroundColor: PALETTE.brass,
              opacity: p.opacityMax,
              boxShadow: `0 0 ${p.radius * 3}px ${PALETTE.brass}`,
            }}
          />
        );
      })}
    </div>
  );
};
