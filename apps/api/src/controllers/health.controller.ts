import type { RequestHandler } from 'express';
import { SCHEMA_VERSION, VIDEO } from '@reverie/contracts';
import type { HealthResponse } from '@reverie/contracts';
import { env } from '../config/env.js';
import { AppError } from '../lib/app-error.js';

const startedAt = Date.now();

export const getHealth: RequestHandler = (_req, res) => {
  const body: HealthResponse = {
    status: 'ok',
    service: 'reverie-api',
    version: '0.1.0',
    environment: env.NODE_ENV,
    node: process.version,
    schemaVersion: SCHEMA_VERSION,
    video: {
      width: VIDEO.WIDTH,
      height: VIDEO.HEIGHT,
      fps: VIDEO.FPS,
    },
    uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
    timestamp: new Date().toISOString(),
  };

  res.json(body);
};

// Dev only. Proves the error envelope works end to end.
export const errorProbe: RequestHandler = () => {
  throw AppError.internal('Deliberate error probe', {
    userMessage: 'Deliberate error probe — ignore in development.',
    recoverable: true,
  });
};