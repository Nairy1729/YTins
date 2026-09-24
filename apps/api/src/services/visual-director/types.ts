import type {
  CameraMove,
  LyricTreatment,
  Lyrics,
  ScenePlan,
  StyleId,
  Timeline,
  Track,
  Transition,
} from '@reverie/contracts';

export interface VisualDirectorInput {
  track: Track;
  lyrics: Lyrics;
  timeline: Timeline;
  styleId: StyleId;
  seed?: number;
}

export interface EmotionAnalysis {
  dominantEmotion: string;
  valence: number; // -1 (very dark/sad) to +1 (joyous/triumphant)
  arousal: number; // 0 (ambient/still) to 1 (intense/explosive)
  tags: string[];
  themeDescription: string;
}

export interface VisualDirectorResult {
  scenePlan: ScenePlan;
  provider: 'gemini' | 'heuristic';
  analysis: EmotionAnalysis;
}

export interface VisualDirectorService {
  readonly name: string;
  direct(input: VisualDirectorInput): Promise<VisualDirectorResult>;
}

export interface StyleDirectorProfile {
  styleId: StyleId;
  displayName: string;
  aestheticPrompt: string;
  preferredLyricTreatment: LyricTreatment;
  allowedMotifs: readonly string[];
  defaultMotifs: readonly string[];
  preferredCameraMoves: readonly CameraMove[];
  preferredTransitions: readonly Transition[];
  emotionMotifMap: Record<string, readonly string[]>;
  maxMotifsPerScene: number;
}
