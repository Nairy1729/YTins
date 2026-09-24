import { GoogleGenAI } from '@google/genai';
import {
  SCHEMA_VERSION,
  scenePlanSchema,
  type ScenePlan,
} from '@reverie/contracts';
import type {
  VisualDirectorInput,
  VisualDirectorResult,
  VisualDirectorService,
} from './types.js';
import { getStyleDirectorProfile } from './style-profiles.js';
import { analyzeEmotion } from './emotion-analyzer.js';
import { logger } from '../../lib/logger.js';
import { env } from '../../config/env.js';

export class GeminiVisualDirector implements VisualDirectorService {
  readonly name = 'gemini';
  private readonly client: GoogleGenAI;
  private readonly modelName: string;

  constructor(apiKey?: string, modelName?: string) {
    const key = apiKey ?? env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY is required for GeminiVisualDirector');
    }
    this.client = new GoogleGenAI({ apiKey: key });
    this.modelName = modelName ?? env.GEMINI_MODEL ?? 'gemini-3.8-flash';
  }

  async direct(input: VisualDirectorInput): Promise<VisualDirectorResult> {
    const { track, lyrics, timeline, styleId } = input;
    const profile = getStyleDirectorProfile(styleId);
    const analysis = analyzeEmotion(track, lyrics);

    const segmentStartMs = timeline.segment.startMs;
    const segmentDurationMs = timeline.segment.durationMs;
    const segmentEndMs = segmentStartMs + segmentDurationMs;

    const segmentLines = (lyrics.lines ?? []).filter((line) => {
      const start = line.startMs;
      return typeof start === 'number' && start >= segmentStartMs - 500 && start < segmentEndMs;
    });

    const systemInstruction = `You are Reverie's Master AI Visual Director.
Reverie turns music into evocative, vertical 9:16 short-form reels.
Your job is not to generate random images, but to act as a cinematic film director:
1. Deconstruct the lyrics, emotion, and musical dynamics.
2. Select visual motifs from the PROVIDED CATALOG ONLY. Do NOT invent new motif names.
3. Choose purposeful camera movements and scene transitions matching the visual style.
4. Compose scenes that synchronize with the lyrics, leaving the vertical center (y: 0.38 - 0.58) free for readable typography.
5. Return ONLY a single valid JSON object adhering to the specified ScenePlan schema.`;

    const prompt = `Song Title: "${track.title}"
Artist: "${track.artist}"
Detected Dominant Mood: ${analysis.dominantEmotion} (${analysis.tags.join(', ')})
Visual Style: "${profile.displayName}" (${profile.styleId})
Style Aesthetic Description: ${profile.aestheticPrompt}

CRITICAL CONSTRAINTS (STRICT):
- Allowed Motifs (You MUST choose ONLY from this list): ${JSON.stringify(profile.allowedMotifs)}
- Allowed Camera Moves: ${JSON.stringify(profile.preferredCameraMoves)}
- Allowed Transitions: ${JSON.stringify(profile.preferredTransitions)}
- Allowed Lyric Treatment: "${profile.preferredLyricTreatment}"
- Target Highlight Segment: ${segmentDurationMs}ms total (from original song offset ${segmentStartMs}ms)
- Motifs per scene: 1 to ${profile.maxMotifsPerScene}.
- Motif coordinate system: x in [0.15, 0.85], y in [0.15, 0.85]. Keep clear of center y in [0.38, 0.58] for lyric text.
- Motif scales: between 0.8 and 1.5.

${
  segmentLines.length > 0 && !lyrics.instrumental
    ? `Synchronized Lines in this Segment:
${segmentLines
  .map(
    (l, idx) =>
      `  [Line ${idx + 1}] startMs: ${Math.max(0, (l.startMs ?? 0) - segmentStartMs)}, text: "${l.text}"`,
  )
  .join('\n')}`
    : `This track is instrumental or has no line-level timestamps. Direct 4-5 progressive atmospheric scenes across the ${segmentDurationMs}ms window.`
}

Return a JSON object with this exact shape:
{
  "version": "${SCHEMA_VERSION}",
  "styleId": "${styleId}",
  "seed": ${input.seed ?? 42},
  "audio": {
    "sourceId": "${track.sourceId}",
    "startMs": ${segmentStartMs},
    "durationMs": ${segmentDurationMs}
  },
  "scenes": [
    {
      "id": "scene-1",
      "startMs": 0,
      "durationMs": 4000,
      "lyric": {
        "text": "first line text",
        "startMs": 0,
        "endMs": 3500
      },
      "emotion": "${analysis.dominantEmotion}",
      "motifs": [
        {
          "ref": "${profile.allowedMotifs[0] ?? 'solitary-figure'}",
          "x": 0.5,
          "y": 0.75,
          "scale": 1.1,
          "rotation": 0,
          "drawInMs": 800,
          "delayMs": 0
        }
      ],
      "camera": {
        "move": "${profile.preferredCameraMoves[0] ?? 'slow_push_in'}",
        "amount": 0.1
      },
      "lyricTreatment": "${profile.preferredLyricTreatment}",
      "transitionOut": "${profile.preferredTransitions[0] ?? 'fade'}"
    }
  ]
}`;

    logger.info(
      { model: this.modelName, styleId, trackTitle: track.title },
      'Requesting AI scene direction from Gemini',
    );

    const response = await this.client.models.generateContent({
      model: this.modelName,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        systemInstruction,
        temperature: 0.6,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Gemini returned an empty response');
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(responseText);
    } catch (parseErr) {
      logger.error({ parseErr, responseText }, 'Failed to parse Gemini JSON output');
      throw new Error('Invalid JSON from Gemini Visual Director');
    }

    // Sanitize any hallucinations where the LLM might have picked an unlisted motif
    const sanitized = this.sanitizeScenePlan(parsedJson, profile);

    // Validate with Zod
    const scenePlan = scenePlanSchema.parse(sanitized);

    return {
      scenePlan,
      provider: 'gemini',
      analysis,
    };
  }

  private sanitizeScenePlan(
    raw: unknown,
    profile: ReturnType<typeof getStyleDirectorProfile>,
  ): unknown {
    if (!raw || typeof raw !== 'object') return raw;
    const plan = raw as Record<string, unknown>;

    if (Array.isArray(plan.scenes)) {
      plan.scenes = plan.scenes.map((scene, idx) => {
        if (!scene || typeof scene !== 'object') return scene;
        const s = { ...scene } as Record<string, unknown>;

        if (!s.id) s.id = `scene-${idx + 1}`;

        if (Array.isArray(s.motifs)) {
          s.motifs = s.motifs.map((motif) => {
            if (!motif || typeof motif !== 'object') return motif;
            const m = { ...motif } as Record<string, unknown>;
            // If motif ref is not in allowedMotifs, replace with a valid default motif
            if (!profile.allowedMotifs.includes(String(m.ref))) {
              m.ref =
                profile.defaultMotifs[0] ?? profile.allowedMotifs[0] ?? 'solitary-figure';
            }
            return m;
          });
        }

        return s;
      });
    }

    return plan;
  }
}
