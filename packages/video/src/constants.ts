import { SEGMENT_LIMITS, VIDEO } from '@reverie/contracts';

export const WIDTH = VIDEO.WIDTH;
export const HEIGHT = VIDEO.HEIGHT;
export const FPS = VIDEO.FPS;

export const SMOKE_DURATION_IN_FRAMES = FPS * 4;
export const DEFAULT_DURATION_IN_FRAMES = Math.round((SEGMENT_LIMITS.DEFAULT_MS / 1000) * FPS);

export const PALETTE = {
  void: '#08080a',
  ink: '#ecebe8',
  muted: '#8a8994',
  brass: '#c8a97e',
  paper: '#f6f4ee',
} as const;