import React from 'react';
import { AbsoluteFill, Audio, Sequence, useVideoConfig } from 'remotion';
import type { ScenePlan } from '@reverie/contracts';
import { SceneView } from '../components/SceneView';
import { PALETTE } from '../constants';

export interface ReverieReelProps {
  plan: ScenePlan;
  audioUrl?: string | null;
}

export const ReverieReel: React.FC<ReverieReelProps> = ({ plan, audioUrl }) => {
  const { fps } = useVideoConfig();

  // If audio is provided, align its start point
  const audioStartFrame = Math.max(0, Math.round(((plan.audio.startMs ?? 0) / 1000) * fps));

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.void }}>
      {/* Audio track synchronized to audio.startMs */}
      {audioUrl ? <Audio src={audioUrl} startFrom={audioStartFrame} /> : null}

      {/* Render each scene inside its scheduled Sequence */}
      {plan.scenes.map((scene) => {
        // Offset relative to the reel's audio window
        const relMs = scene.startMs >= plan.audio.startMs
          ? scene.startMs - plan.audio.startMs
          : scene.startMs;

        const fromFrame = Math.max(0, Math.round((relMs / 1000) * fps));
        const durationInFrames = Math.max(1, Math.round((scene.durationMs / 1000) * fps));

        return (
          <Sequence
            key={scene.id}
            from={fromFrame}
            durationInFrames={durationInFrames}
            name={`${scene.id} (${scene.emotion})`}
          >
            <SceneView scene={scene} styleId={plan.styleId} />
          </Sequence>
        );
      })}

      {/* Minimal studio watermark in bottom footer */}
      <div
        style={{
          position: 'absolute',
          bottom: 48,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 18,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: PALETTE.muted,
            opacity: 0.35,
          }}
        >
          REVERIE
        </span>
      </div>
    </AbsoluteFill>
  );
};
