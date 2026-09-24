import { spawn } from 'node:child_process';
import { env } from '../../config/env.js';
import { AppError } from '../../lib/app-error.js';
import { logger } from '../../lib/logger.js';

interface RunResult {
  stdout: string;
  stderr: string;
}

const UNAVAILABLE = [
  'video unavailable',
  'private video',
  'has been removed',
  'not available in your country',
  'sign in to confirm your age',
  'members-only',
  'this live event',
  'requested format is not available',
];

export async function runYtDlp(args: string[]): Promise<RunResult> {
  return new Promise<RunResult>((resolve, reject) => {
    const child = spawn(env.YTDLP_PATH, args, { windowsHide: true });

    let stdout = '';
    let stderr = '';
    let settled = false;

    const timer = setTimeout(() => {
      settled = true;
      child.kill('SIGKILL');
      reject(
        new AppError('JOB_TIMEOUT', 'yt-dlp timed out', {
          status: 504,
          userMessage: 'That took too long to fetch. Try a shorter video.',
          recoverable: true,
        }),
      );
    }, env.SOURCE_TIMEOUT_MS);

    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    child.on('error', (err: NodeJS.ErrnoException) => {
      clearTimeout(timer);
      if (settled) return;
      settled = true;

      if (err.code === 'ENOENT') {
        reject(
          new AppError('INTERNAL_ERROR', 'yt-dlp not found at: ' + env.YTDLP_PATH, {
            userMessage: 'Audio processing is unavailable right now.',
          }),
        );
        return;
      }
      reject(AppError.internal('yt-dlp failed to start', { cause: err }));
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      if (settled) return;
      settled = true;

      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }

      const lower = stderr.toLowerCase();

      if (UNAVAILABLE.some((pattern) => lower.includes(pattern))) {
        reject(
          new AppError('SOURCE_UNAVAILABLE', 'yt-dlp: ' + stderr.slice(0, 400), {
            status: 422,
            userMessage:
              'That video cannot be accessed. It may be private, age restricted, or removed.',
            recoverable: true,
          }),
        );
        return;
      }

      logger.warn({ code, stderr: stderr.slice(0, 600) }, 'yt-dlp non zero exit');

      reject(
        new AppError('AUDIO_FETCH_FAILED', 'yt-dlp exited with code ' + code, {
          status: 502,
          userMessage: 'We could not fetch the audio for that link.',
          recoverable: true,
        }),
      );
    });
  });
}