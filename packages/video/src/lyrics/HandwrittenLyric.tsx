import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';

interface HandwrittenLyricProps {
  text: string;
  startFrame: number;
  endFrame: number;
  textColor: string;
}

export const HandwrittenLyric: React.FC<HandwrittenLyricProps> = ({
  text,
  startFrame,
  endFrame,
  textColor,
}) => {
  const frame = useCurrentFrame();

  const words = text.split(' ');
  const wordCount = words.length;

  const totalRevealFrames = Math.min(24, Math.max(12, wordCount * 3));
  const framesPerWord = totalRevealFrames / Math.max(1, wordCount);

  const ease = { easing: Easing.bezier(0.2, 0.9, 0.3, 1) };
  const fadeOutDuration = 12;

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
        columnGap: 14,
        rowGap: 8,
        maxWidth: 920,
      }}
    >
      {words.map((word, index) => {
        const wordStart = startFrame + index * framesPerWord;
        const wordEnd = wordStart + 10;

        const opacity = interpolate(
          frame,
          [wordStart, wordEnd],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );

        const translateY = interpolate(
          frame,
          [wordStart, wordEnd],
          [16, 0],
          { ...ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );

        const rotate = interpolate(
          frame,
          [wordStart, wordEnd],
          [-1.5, 0],
          { ...ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );

        return (
          <span
            key={`${word}-${index}`}
            style={{
              display: 'inline-block',
              fontFamily: '"Instrument Serif", Georgia, "Times New Roman", serif',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 58,
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
              color: textColor,
              opacity,
              transform: `translate3d(0, ${translateY.toFixed(2)}px, 0) rotate(${rotate.toFixed(2)}deg)`,
              textShadow: '0 3px 25px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 0, 0, 0.4)',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
