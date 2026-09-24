import type { RequestHandler } from 'express';
import { AppError } from '../lib/app-error.js';

interface Bucket {
  count: number;
  resetAt: number;
}

export function rateLimit(max: number, windowMs: number): RequestHandler {
  const buckets = new Map<string, Bucket>();

  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt < now) buckets.delete(key);
    }
  }, windowMs).unref();

  return (req, _res, next) => {
    const key = req.ip ?? 'unknown';
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt < now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    bucket.count += 1;

    if (bucket.count > max) {
      next(
        new AppError('RATE_LIMITED', 'Rate limit exceeded for ' + key, {
          status: 429,
          userMessage: 'That is a lot of reels at once. Give it a minute.',
          recoverable: true,
        }),
      );
      return;
    }

    next();
  };
}