import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';

export { RemotionRoot } from './Root';
export { ReverieReel } from './compositions/ReverieReel';
export type { ReverieReelProps } from './compositions/ReverieReel';
export { BlankReel } from './compositions/BlankReel';
export type { BlankReelProps } from './compositions/BlankReel';
export { SAMPLE_SCENE_PLAN } from './sample-plan';
export * from './reference-track';
export * from './lyrics';
export * from './styles';
export * from './constants';


registerRoot(RemotionRoot);