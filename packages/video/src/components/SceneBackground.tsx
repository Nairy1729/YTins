import React from 'react';
import type { StyleId } from '@reverie/contracts';
import { getStyleDefinition } from '../styles';

interface SceneBackgroundProps {
  styleId: StyleId;
  emotion?: string;
}

export const SceneBackground: React.FC<SceneBackgroundProps> = ({ styleId, emotion }) => {
  const styleDef = getStyleDefinition(styleId);
  const BackgroundComponent = styleDef.BackgroundComponent;

  return <BackgroundComponent emotion={emotion} />;
};

