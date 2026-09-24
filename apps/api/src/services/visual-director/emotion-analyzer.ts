import type { Lyrics, Track } from '@reverie/contracts';
import type { EmotionAnalysis } from './types.js';

interface KeywordRule {
  emotion: string;
  keywords: string[];
  valenceDelta: number;
  arousalDelta: number;
  tags: string[];
}

const EMOTION_RULES: KeywordRule[] = [
  {
    emotion: 'longing',
    keywords: [
      'tere bina',
      'bina',
      'guzara',
      'remember',
      'miss',
      'waiting',
      'wait',
      'longing',
      'distance',
      'far away',
      'yaad',
      'intezar',
      'akhiyan',
      'without you',
      'call your name',
      'absence',
    ],
    valenceDelta: -0.3,
    arousalDelta: 0.4,
    tags: ['longing', 'yearning', 'separation'],
  },
  {
    emotion: 'love',
    keywords: [
      'love',
      'heart',
      'baby',
      'forever',
      'kiss',
      'darling',
      'ishq',
      'pyaar',
      'pyar',
      'mohabbat',
      'sajna',
      'soniya',
      'jaan',
      'beloved',
      'adore',
      'hold me',
      'embrace',
    ],
    valenceDelta: 0.6,
    arousalDelta: 0.5,
    tags: ['romance', 'devotion', 'affection'],
  },
  {
    emotion: 'melancholy',
    keywords: [
      'rain',
      'rainy',
      'crying',
      'cry',
      'tears',
      'sad',
      'sorrow',
      'alone',
      'pain',
      'broken',
      'darkness',
      'grief',
      'dard',
      'haye',
      'ansu',
      'tanha',
      'shattered',
      'barsaat',
      'barsat',
      'barish',
    ],
    valenceDelta: -0.6,
    arousalDelta: 0.3,
    tags: ['melancholy', 'sadness', 'solitude'],
  },
  {
    emotion: 'nostalgia',
    keywords: [
      'old',
      'photograph',
      'yesterday',
      'years ago',
      'childhood',
      'past',
      'memories',
      'memory',
      'rewind',
      'forgotten',
      'zamaana',
      'waqt',
      'purani',
      'once upon',
    ],
    valenceDelta: 0.1,
    arousalDelta: 0.2,
    tags: ['nostalgia', 'memory', 'reflection'],
  },
  {
    emotion: 'hope',
    keywords: [
      'sun',
      'morning',
      'light',
      'fly',
      'wings',
      'freedom',
      'hope',
      'rising',
      'tomorrow',
      'shine',
      'dream',
      'roshni',
      'umeed',
      'asman',
      'sky',
      'soar',
    ],
    valenceDelta: 0.7,
    arousalDelta: 0.6,
    tags: ['hope', 'optimism', 'uplifting'],
  },
  {
    emotion: 'contemplation',
    keywords: [
      'walk',
      'walking',
      'think',
      'wonder',
      'path',
      'horizon',
      'silence',
      'quiet',
      'shadow',
      'river',
      'wind',
      'raah',
      'khamoshi',
      'soch',
    ],
    valenceDelta: 0.0,
    arousalDelta: 0.2,
    tags: ['contemplation', 'pensive', 'depth'],
  },
  {
    emotion: 'intensity',
    keywords: [
      'fire',
      'burn',
      'electric',
      'storm',
      'beat',
      'dance',
      'loud',
      'run',
      'wild',
      'fast',
      'aag',
      'junoon',
      'josh',
      'blast',
    ],
    valenceDelta: 0.2,
    arousalDelta: 0.8,
    tags: ['intensity', 'energetic', 'drive'],
  },
  {
    emotion: 'peace',
    keywords: [
      'calm',
      'ocean',
      'gentle',
      'breathe',
      'sleep',
      'rest',
      'serene',
      'still',
      'sukoon',
      'chain',
      'shanti',
    ],
    valenceDelta: 0.4,
    arousalDelta: 0.1,
    tags: ['peace', 'serenity', 'ambient'],
  },
];

export function analyzeEmotion(track: Track, lyrics: Lyrics): EmotionAnalysis {
  // Aggregate text sources
  const titleText = (track.title + ' ' + track.artist).toLowerCase();
  const lyricText = (lyrics.lines?.map((l) => l.text).join(' ') ?? '').toLowerCase();
  const combinedText = titleText + ' ' + lyricText;

  const scores: Record<string, number> = {
    longing: 0,
    love: 0,
    melancholy: 0,
    nostalgia: 0,
    hope: 0,
    contemplation: 0,
    intensity: 0,
    peace: 0,
  };

  let valence = 0;
  let arousal = 0.3;
  const tagSet = new Set<string>();

  for (const rule of EMOTION_RULES) {
    let matchCount = 0;
    for (const kw of rule.keywords) {
      if (titleText.includes(kw)) {
        matchCount += 3; // Title matches have high weight
      }
      if (lyricText.includes(kw)) {
        matchCount += 1;
      }
    }

    if (matchCount > 0) {
      scores[rule.emotion] = (scores[rule.emotion] ?? 0) + matchCount;
      valence += rule.valenceDelta * Math.min(matchCount, 3);
      arousal += rule.arousalDelta * Math.min(matchCount, 2);
      rule.tags.forEach((t) => tagSet.add(t));
    }
  }

  // Find dominant emotion
  let dominant = 'contemplation';
  let maxScore = 0;

  for (const [emotion, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      dominant = emotion;
    }
  }

  // Handle instrumental or no-match default
  if (lyrics.instrumental || maxScore === 0) {
    if (titleText.includes('bina') || titleText.includes('tere')) {
      dominant = 'longing';
      tagSet.add('longing');
      tagSet.add('romance');
    } else {
      dominant = 'peace';
      tagSet.add('instrumental');
      tagSet.add('ambient');
    }
  }

  // Clamp values
  const clampedValence = Math.max(-1, Math.min(1, Number(valence.toFixed(2))));
  const clampedArousal = Math.max(0.1, Math.min(1, Number(arousal.toFixed(2))));

  return {
    dominantEmotion: dominant,
    valence: clampedValence,
    arousal: clampedArousal,
    tags: Array.from(tagSet),
    themeDescription: `Song conveys ${dominant} with ${tagSet.size > 0 ? Array.from(tagSet).slice(0, 3).join(', ') : 'reflective'} nuances`,
  };
}

function matchesKeyword(text: string, kw: string): boolean {
  if (kw.includes(' ')) {
    return text.includes(kw);
  }
  const regex = new RegExp(`\\b${kw}\\b`, 'i');
  return regex.test(text);
}

export function detectLineEmotion(lineText: string, fallback: string): string {
  const lower = lineText.toLowerCase();
  let bestEmotion = fallback;
  let maxScore = 0;

  for (const rule of EMOTION_RULES) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (matchesKeyword(lower, kw)) {
        score += kw.length;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestEmotion = rule.emotion;
    }
  }

  return bestEmotion;
}


