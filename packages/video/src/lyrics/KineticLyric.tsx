import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { PALETTE } from '../constants';

interface KineticLyricProps {
  text: string;
  startFrame: number;
  endFrame: number;
  textColor: string;
}

export const KineticLyric: React.FC<KineticLyricProps> = ({
  text,
  startFrame,
  endFrame,
  textColor,
}) => {
  const frame = useCurrentFrame();

  const words = text.split(' ');
  const wordCount = words.length;

  const totalRevealFrames = Math.min(28, Math.max(14, wordCount * 3.5));
  const framesPerWord = totalRevealFrames / Math.max(1, wordCount);

  const easeOutBack = { easing: Easing.bezier(0.34, 1.4, 0.64, 1) };
  const fadeOutDuration = 10;

  // Master fade out for the whole line
  const lineFadeOut = interpolate(
    frame,
    [Math.max(startFrame + totalRevealFrames, endFrame - fadeOutDuration), endFrame],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <div
      style={{
        opacity: lineFadeOut,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        columnGap: 16,
        rowGap: 10,
        maxWidth: 960,
      }}
    >
      {words.map((word, index) => {
        const wordStart = startFrame + index * framesPerWord;
        const popDuration = 8;

        const opacity = interpolate(
          frame,
          [wordStart, wordStart + 4],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );

        const scale = interpolate(
          frame,
          [wordStart, wordStart + popDuration],
          [0.82, 1],
          { ...easeOutBack, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );

        const translateY = interpolate(
          frame,
          [wordStart, wordStart + popDuration],
          [20, 0],
          { ...easeOutBack, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );

        // Word rhythm highlight: words briefly flash brass tint during their arrival
        const isHighlight = frame >= wordStart && frame < wordStart + popDuration + 4;
        const color = isHighlight ? PALETTE.brass : textColor;

        return (
          <span
            key={`${word}-${index}`}
            style={{
              display: 'inline-block',
              fontFamily: '"Inter Tight", Inter, system-ui, sans-serif',
              fontWeight: 500,
              fontSize: 54,
              lineHeight: 1.3,
              letterSpacing: '-0.02em',
              color,
              opacity,
              transform: `translate3d(0, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`,
              textShadow: '0 2px 24px rgba(0, 0, 0, 0.85), 0 0 35px rgba(0, 0, 0, 0.5)',
              transition: 'color 0.15s ease',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
