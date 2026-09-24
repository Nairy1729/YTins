import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import type { CameraMove } from '@reverie/contracts';

interface CameraRigProps {
  move: CameraMove;
  amount: number;
  children: React.ReactNode;
}

export const CameraRig: React.FC<CameraRigProps> = ({ move, amount, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const ease = { easing: Easing.bezier(0.25, 0.1, 0.25, 1) };
  const safeAmount = Math.max(0, Math.min(1, amount));

  let scale = 1;
  let translateX = 0;
  let translateY = 0;

  switch (move) {
    case 'slow_push_in': {
      const maxScale = 1 + safeAmount * 0.12;
      scale = interpolate(frame, [0, durationInFrames], [1, maxScale], ease);
      break;
    }
    case 'slow_pull_out': {
      const maxScale = 1 + safeAmount * 0.12;
      scale = interpolate(frame, [0, durationInFrames], [maxScale, 1], ease);
      break;
    }
    case 'pan_left': {
      const shift = safeAmount * 60;
      translateX = interpolate(frame, [0, durationInFrames], [shift, -shift], ease);
      break;
    }
    case 'pan_right': {
      const shift = safeAmount * 60;
      translateX = interpolate(frame, [0, durationInFrames], [-shift, shift], ease);
      break;
    }
    case 'drift': {
      const shiftX = safeAmount * 30;
      const shiftY = safeAmount * 20;
      translateX = interpolate(frame, [0, durationInFrames], [-shiftX, shiftX], ease);
      translateY = interpolate(frame, [0, durationInFrames], [shiftY, -shiftY], ease);
      scale = interpolate(frame, [0, durationInFrames], [1, 1 + safeAmount * 0.05], ease);
      break;
    }
    case 'none':
    default:
      break;
  }

  return (
    <AbsoluteFill
      style={{
        transform: `translate3d(${translateX.toFixed(2)}px, ${translateY.toFixed(2)}px, 0px) scale(${scale.toFixed(4)})`,
        transformOrigin: 'center center',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
