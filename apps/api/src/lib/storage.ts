import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from '../config/env.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(currentDir, '..', '..');

export const STORAGE_ROOT = path.isAbsolute(env.STORAGE_DIR)
  ? env.STORAGE_DIR
  : path.resolve(packageRoot, env.STORAGE_DIR);

export const STORAGE_PATHS = {
  root: STORAGE_ROOT,
  audio: path.join(STORAGE_ROOT, 'audio'),
  renders: path.join(STORAGE_ROOT, 'renders'),
  tmp: path.join(STORAGE_ROOT, 'tmp'),
} as const;

export async function ensureStorageDirs(): Promise<void> {
  const dirs = Object.values(STORAGE_PATHS);
  for (const dir of dirs) {
    await mkdir(dir, { recursive: true });
  }
}