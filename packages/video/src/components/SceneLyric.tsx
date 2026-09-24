import React from 'react';
import { useVideoConfig } from 'remotion';
import type { LyricTreatment, StyleId } from '@reverie/contracts';
import { PALETTE } from '../constants';
import {
  DualLineLyric,
  HandwrittenLyric,
  KineticLyric,
  LyricBacklight,
  LyricParticleDrift,
  MinimalLyric,
  TypewriterLyric,
} from '../lyrics';

import { getStyleDefinition } from '../styles';

interface SceneLyricProps {
  lyric: { text: string; startMs: number; endMs: number } | null;
  treatment: LyricTreatment;
  sceneStartMs: number;
  sceneDurationMs: number;
  styleId: StyleId;
  contextText?: string | null;
}

export const SceneLyric: React.FC<SceneLyricProps> = ({
  lyric,
  treatment,
  sceneStartMs,
  sceneDurationMs,
  styleId,
  contextText,
}) => {
  const { fps, width } = useVideoConfig();

  if (!lyric || treatment === 'none') {
    return null;
  }

  // Calculate local frames relative to the scene sequence
  const relStartMs = Math.max(0, lyric.startMs - sceneStartMs);
  const relEndMs = Math.min(
    sceneDurationMs,
    Math.max(relStartMs + 1000, lyric.endMs - sceneStartMs),
  );

  const startFrame = Math.round((relStartMs / 1000) * fps);
  const endFrame = Math.round((relEndMs / 1000) * fps);

  const styleDef = getStyleDefinition(styleId);
  const isLight = styleDef.isLight;
  const textColor = styleDef.palette.primary;


  const renderTypography = () => {
    if (contextText) {
      return (
        <DualLineLyric
          primaryText={lyric.text}
          contextText={contextText}
          startFrame={startFrame}
          endFrame={endFrame}
          textColor={textColor}
        />
      );
    }

    switch (treatment) {
      case 'handwritten_reveal':
        return (
          <HandwrittenLyric
            text={lyric.text}
            startFrame={startFrame}
            endFrame={endFrame}
            textColor={textColor}
          />
        );
      case 'kinetic':
        return (
          <KineticLyric
            text={lyric.text}
            startFrame={startFrame}
            endFrame={endFrame}
            textColor={textColor}
          />
        );
      case 'typewriter':
        return (
          <TypewriterLyric
            text={lyric.text}
            startFrame={startFrame}
            endFrame={endFrame}
            textColor={textColor}
          />
        );
      case 'minimal':
      default:
        return (
          <MinimalLyric
            text={lyric.text}
            startFrame={startFrame}
            endFrame={endFrame}
            textColor={textColor}
          />
        );
    }
  };

  return (
    <>
      {/* Contrast backlight overlay */}
      <LyricBacklight
        startFrame={startFrame}
        endFrame={endFrame}
        isLight={isLight}
      />

      {/* Atmospheric micro-particle drift */}
      <LyricParticleDrift
        startFrame={startFrame}
        endFrame={endFrame}
        seed={Math.round(relStartMs + lyric.text.length)}
      />

      {/* Foreground typography container */}
      <div
        style={{
          position: 'absolute',
          bottom: 320,
          left: 0,
          width,
          padding: '0 60px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        {renderTypography()}
      </div>
    </>
  );
};

