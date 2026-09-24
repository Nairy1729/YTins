import type {
  VisualDirectorInput,
  VisualDirectorResult,
  VisualDirectorService,
} from './types.js';
import { HeuristicVisualDirector } from './heuristic-director.js';
import { GeminiVisualDirector } from './gemini-director.js';
import { logger } from '../../lib/logger.js';
import { env } from '../../config/env.js';

export class CompositeVisualDirector implements VisualDirectorService {
  readonly name = 'composite';
  private readonly heuristic: HeuristicVisualDirector;
  private readonly gemini: GeminiVisualDirector | null = null;

  constructor() {
    this.heuristic = new HeuristicVisualDirector();

    if (env.GEMINI_API_KEY && env.VISUAL_DIRECTOR_PROVIDER !== 'heuristic') {
      try {
        this.gemini = new GeminiVisualDirector(env.GEMINI_API_KEY, env.GEMINI_MODEL);
        logger.info(
          { model: env.GEMINI_MODEL },
          'Gemini Visual Director enabled with API key',
        );
      } catch (err) {
        logger.warn({ err }, 'Failed to initialize Gemini Visual Director; falling back to heuristic');
      }
    } else {
      logger.info(
        { provider: env.VISUAL_DIRECTOR_PROVIDER },
        'Visual Director operating in heuristic/offline mode',
      );
    }
  }

  async direct(input: VisualDirectorInput): Promise<VisualDirectorResult> {
    const providerPref = env.VISUAL_DIRECTOR_PROVIDER;

    if (this.gemini && providerPref !== 'heuristic') {
      try {
        const result = await this.gemini.direct(input);
        logger.info(
          {
            provider: 'gemini',
            scenes: result.scenePlan.scenes.length,
            dominantEmotion: result.analysis.dominantEmotion,
          },
          'AI Visual Director generated scenes via Gemini',
        );
        return result;
      } catch (err) {
        logger.warn(
          { err },
          'Gemini Visual Director call failed; falling back to deterministic heuristic director',
        );
      }
    }

    // Heuristic fallback
    const result = await this.heuristic.direct(input);
    logger.info(
      {
        provider: 'heuristic',
        scenes: result.scenePlan.scenes.length,
        dominantEmotion: result.analysis.dominantEmotion,
      },
      'Visual Director generated scenes via Heuristic Director',
    );
    return result;
  }
}

export const defaultVisualDirector = new CompositeVisualDirector();

export async function directScenes(input: VisualDirectorInput): Promise<VisualDirectorResult> {
  return defaultVisualDirector.direct(input);
}
