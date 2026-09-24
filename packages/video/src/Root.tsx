import React from 'react';
import { Composition } from 'remotion';
import { z } from 'zod';
import { scenePlanSchema } from '@reverie/contracts';
import { BlankReel } from './compositions/BlankReel';
import { ReverieReel } from './compositions/ReverieReel';
import { FPS, HEIGHT, SMOKE_DURATION_IN_FRAMES, WIDTH } from './constants';
import { SAMPLE_SCENE_PLAN } from './sample-plan';

import {
  REFERENCE_CINEMATIC_PLAN,
  REFERENCE_GRAPH_PLAN,
  REFERENCE_MINIMAL_PLAN,
  REFERENCE_NOTEBOOK_PLAN,
  REFERENCE_SCENE_PLAN,
  REFERENCE_SKETCH_PLAN,
} from './reference-track';

export const reelCompositionSchema = z.object({
  plan: scenePlanSchema,
  audioUrl: z.string().nullable().optional(),
});

export const RemotionRoot: React.FC = () => {
  const sampleDurationInFrames = Math.round(
    (SAMPLE_SCENE_PLAN.audio.durationMs / 1000) * FPS,
  );
  const referenceDurationInFrames = Math.round(
    (REFERENCE_SCENE_PLAN.audio.durationMs / 1000) * FPS,
  );

  return (
    <>
      <Composition<typeof reelCompositionSchema, z.infer<typeof reelCompositionSchema>>
        id="TereBinaReel"
        component={ReverieReel}
        schema={reelCompositionSchema}
        durationInFrames={referenceDurationInFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{
          plan: REFERENCE_SCENE_PLAN,
          audioUrl: null,
        }}
        calculateMetadata={({ props }) => {
          const durationMs = props.plan?.audio?.durationMs ?? REFERENCE_SCENE_PLAN.audio.durationMs;
          return {
            durationInFrames: Math.max(1, Math.round((durationMs / 1000) * FPS)),
          };
        }}
      />

      <Composition<typeof reelCompositionSchema, z.infer<typeof reelCompositionSchema>>
        id="TereBinaMinimal"
        component={ReverieReel}
        schema={reelCompositionSchema}
        durationInFrames={referenceDurationInFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{
          plan: REFERENCE_MINIMAL_PLAN,
          audioUrl: null,
        }}
      />

      <Composition<typeof reelCompositionSchema, z.infer<typeof reelCompositionSchema>>
        id="TereBinaSketch"
        component={ReverieReel}
        schema={reelCompositionSchema}
        durationInFrames={referenceDurationInFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{
          plan: REFERENCE_SKETCH_PLAN,
          audioUrl: null,
        }}
      />

      <Composition<typeof reelCompositionSchema, z.infer<typeof reelCompositionSchema>>
        id="TereBinaGraph"
        component={ReverieReel}
        schema={reelCompositionSchema}
        durationInFrames={referenceDurationInFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{
          plan: REFERENCE_GRAPH_PLAN,
          audioUrl: null,
        }}
      />

      <Composition<typeof reelCompositionSchema, z.infer<typeof reelCompositionSchema>>
        id="TereBinaNotebook"
        component={ReverieReel}
        schema={reelCompositionSchema}
        durationInFrames={referenceDurationInFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{
          plan: REFERENCE_NOTEBOOK_PLAN,
          audioUrl: null,
        }}
      />

      <Composition<typeof reelCompositionSchema, z.infer<typeof reelCompositionSchema>>
        id="TereBinaCinematic"
        component={ReverieReel}
        schema={reelCompositionSchema}
        durationInFrames={referenceDurationInFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{
          plan: REFERENCE_CINEMATIC_PLAN,
          audioUrl: null,
        }}
      />


      <Composition<typeof reelCompositionSchema, z.infer<typeof reelCompositionSchema>>
        id="ReverieReel"
        component={ReverieReel}
        schema={reelCompositionSchema}
        durationInFrames={sampleDurationInFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{
          plan: SAMPLE_SCENE_PLAN,
          audioUrl: null,
        }}
        calculateMetadata={({ props }) => {
          const durationMs = props.plan?.audio?.durationMs ?? SAMPLE_SCENE_PLAN.audio.durationMs;
          return {
            durationInFrames: Math.max(1, Math.round((durationMs / 1000) * FPS)),
          };
        }}
      />

      <Composition
        id="BlankReel"
        component={BlankReel}
        durationInFrames={SMOKE_DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ label: 'Reverie' }}
      />
    </>
  );
};