import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { CINEMATIC_PALETTE, CINEMATIC_TYPOGRAPHY } from './cinematic.theme';

interface CinematicCanvasProps {
  emotion?: string;
}

export const CinematicCanvas: React.FC<CinematicCanvasProps> = ({ emotion }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const letterboxHeight = 120;

  // Anamorphic horizontal flare drift
  const flareX = interpolate(
    Math.sin(frame * 0.04),
    [-1, 1],
    [width * 0.35, width * 0.65],
  );

  // Anamorphic flare glow tint
  const flareColor =
    emotion === 'warmth' || emotion === 'devotion'
      ? 'rgba(245, 158, 11, 0.16)'
      : 'rgba(6, 182, 212, 0.14)';

  return (
    <AbsoluteFill
      style={{
        backgroundColor: CINEMATIC_PALETTE.void,
        backgroundImage: `radial-gradient(circle at ${flareX}px 48%, ${flareColor} 0%, rgba(5, 5, 7, 0.98) 65%)`,
        overflow: 'hidden',
      }}
    >
      {/* Horizontal Anamorphic Lens Flare Streak */}
      <div
        style={{
          position: 'absolute',
          top: height * 0.48,
          left: 0,
          width: '100%',
          height: 3,
          background: `linear-gradient(90deg, transparent 0%, rgba(6, 182, 212, 0.25) 30%, rgba(255, 255, 255, 0.75) 50%, rgba(245, 158, 11, 0.25) 70%, transparent 100%)`,
          filter: 'blur(1.5px)',
          opacity: 0.6 + Math.sin(frame * 0.08) * 0.2,
          pointerEvents: 'none',
        }}
      />

      {/* Floating Bokeh Orbs */}
      <div
        style={{
          position: 'absolute',
          top: height * 0.35 + Math.sin(frame * 0.03) * 30,
          left: width * 0.25,
          width: 140,
          height: 140,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%)',
          filter: 'blur(8px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: height * 0.58 + Math.cos(frame * 0.03) * 25,
          right: width * 0.2,
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
          filter: 'blur(10px)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Letterbox Bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: letterboxHeight,
          backgroundColor: CINEMATIC_PALETTE.letterbox,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          zIndex: 5,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 54,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontFamily: CINEMATIC_TYPOGRAPHY.mono,
            fontSize: 11,
            letterSpacing: '0.22em',
            color: '#ef4444',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              opacity: frame % 30 < 15 ? 1 : 0.2,
            }}
          />
          REC
        </div>

        <div
          style={{
            position: 'absolute',
            top: 40,
            right: 54,
            fontFamily: CINEMATIC_TYPOGRAPHY.mono,
            fontSize: 11,
            letterSpacing: '0.2em',
            color: CINEMATIC_PALETTE.secondary,
          }}
        >
          4K // 2.39:1
        </div>
      </div>

      {/* Bottom Letterbox Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: letterboxHeight,
          backgroundColor: CINEMATIC_PALETTE.letterbox,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          zIndex: 5,
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: 54,
            fontFamily: CINEMATIC_TYPOGRAPHY.mono,
            fontSize: 10,
            letterSpacing: '0.22em',
            color: CINEMATIC_PALETTE.secondary,
          }}
        >
          ISO 800 • F/1.8 • 1/48s
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 54,
            fontFamily: CINEMATIC_TYPOGRAPHY.mono,
            fontSize: 10,
            letterSpacing: '0.2em',
            color: CINEMATIC_PALETTE.amber,
          }}
        >
          RAW // ANAMORPHIC
        </div>
      </div>
    </AbsoluteFill>
  );
};

