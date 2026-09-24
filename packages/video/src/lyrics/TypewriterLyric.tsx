import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { PALETTE } from '../constants';

interface TypewriterLyricProps {
  text: string;
  startFrame: number;
  endFrame: number;
  textColor: string;
}

export const TypewriterLyric: React.FC<TypewriterLyricProps> = ({
  text,
  startFrame,
  endFrame,
  textColor,
}) => {
  const frame = useCurrentFrame();

  const typingDuration = Math.min(32, Math.max(16, text.length * 1.2));
  const fadeOutDuration = 10;

  // Calculate typed character count
  const charCount = Math.round(
    interpolate(
      frame,
      [startFrame, startFrame + typingDuration],
      [0, text.length],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    ),
  );

  const visibleText = text.slice(0, charCount);

  // Blinking cursor: cycle every 10 frames
  const cursorVisible = frame >= startFrame && Math.floor((frame - startFrame) / 6) % 2 === 0;

  // Master fade out for the whole line
  const lineFadeOut = interpolate(
    frame,
    [Math.max(startFrame + typingDuration, endFrame - fadeOutDuration), endFrame],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <div
      style={{
        opacity: lineFadeOut,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
        maxWidth: 960,
        padding: '0 40px',
      }}
    >
      <span
        style={{
          fontFamily: '"JetBrains Mono", Consolas, "Courier New", monospace',
          fontWeight: 400,
          fontSize: 48,
          lineHeight: 1.4,
          letterSpacing: '0.02em',
          color: textColor,
          textShadow: '0 2px 20px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 0, 0, 0.5)',
          textAlign: 'center',
        }}
      >
        {visibleText}
        <span
          style={{
            display: 'inline-block',
            width: 14,
            height: '0.85em',
            marginLeft: 4,
            backgroundColor: PALETTE.brass,
            opacity: cursorVisible ? 0.9 : 0,
            verticalAlign: 'middle',
          }}
        />
      </span>
    </div>
  );
};
