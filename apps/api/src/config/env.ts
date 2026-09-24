import 'dotenv/config';
import { z } from 'zod';

const LOG_LEVELS = ['fatal', 'error', 'warn', 'info', 'debug', 'trace'] as const;
const NODE_ENVS = ['development', 'test', 'production'] as const;

const envSchema = z.object({
  NODE_ENV: z.enum(NODE_ENVS).default('development'),
  HOST: z.string().min(1).default('127.0.0.1'),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  LOG_LEVEL: z.enum(LOG_LEVELS).default('info'),
  WEB_ORIGIN: z.string().min(1).default('http://localhost:5173'),
  STORAGE_DIR: z.string().min(1).default('storage'),

  /** 'stub' skips real ingestion. Used by tests so they stay deterministic. */
  PIPELINE_MODE: z.enum(['real', 'stub']).default('real'),

  YTDLP_PATH: z.string().min(1).default('yt-dlp'),
  YTDLP_MODULE: z.string().min(1).optional(),
  FFMPEG_PATH: z.string().min(1).optional(),
  MAX_SOURCE_SECONDS: z.coerce.number().int().min(30).max(3600).default(900),
  SOURCE_TIMEOUT_MS: z.coerce.number().int().min(5000).default(120000),

  /** AI Visual Director config */
  GEMINI_API_KEY: z.string().min(1).optional(),
  GEMINI_MODEL: z.string().min(1).default('gemini-3.8-flash'),
  VISUAL_DIRECTOR_PROVIDER: z.enum(['auto', 'gemini', 'heuristic']).default('auto'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const lines = parsed.error.issues
    .map((issue) => '  - ' + (issue.path.join('.') || '(root)') + ': ' + issue.message)
    .join('\n');
  console.error('\nInvalid environment configuration:\n' + lines + '\n');
  process.exit(1);
}

export const env = parsed.data;
export const isDev = env.NODE_ENV === 'development';