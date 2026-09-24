import type { RequestHandler } from 'express';
import { nanoid } from 'nanoid';
import { logger } from '../lib/logger.js';

export const requestContext: RequestHandler = (req, res, next) => {
  const requestId = nanoid(10);
  res.locals.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);

  const startedAt = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
    logger.debug(
      {
        requestId,
        status: res.statusCode,
        durationMs: Math.round(durationMs),
      },
      req.method + ' ' + req.originalUrl,
    );
  });

  next();
};