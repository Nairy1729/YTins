import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import type { Scene, StyleId } from '@reverie/contracts';
import { CameraRig } from './CameraRig';
import { SceneBackground } from './SceneBackground';
import { SceneLyric } from './SceneLyric';
import { SceneMotifs } from './SceneMotifs';

interface SceneViewProps {
  scene: Scene;
  styleId: StyleId;
}

export const SceneView: React.FC<SceneViewProps> = ({ scene, styleId }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Handle transition out (default 12 frames before scene end)
  const transitionFrames = Math.min(15, Math.floor(durationInFrames * 0.2));
  const ease = { easing: Easing.bezier(0.25, 0.1, 0.25, 1) };

  let opacity = 1;
  if (scene.transitionOut === 'fade' || scene.transitionOut === 'ink_fade' || scene.transitionOut === 'dissolve') {
    opacity = interpolate(
      frame,
      [durationInFrames - transitionFrames, durationInFrames],
      [1, 0],
      { ...ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    );
  }

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Background layer */}
      <SceneBackground styleId={styleId} emotion={scene.emotion} />

      {/* Dynamic content inside Camera Rig */}
      <CameraRig move={scene.camera.move} amount={scene.camera.amount}>
        {/* Motifs layer */}
        <SceneMotifs motifs={scene.motifs} styleId={styleId} />

        {/* Lyric line display */}
        <SceneLyric
          lyric={scene.lyric}
          treatment={scene.lyricTreatment}
          sceneStartMs={scene.startMs}
          sceneDurationMs={scene.durationMs}
          styleId={styleId}
        />
      </CameraRig>
    </AbsoluteFill>
  );
};
