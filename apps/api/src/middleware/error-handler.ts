import type { ErrorRequestHandler, RequestHandler } from 'express';
import { AppError } from '../lib/app-error.js';
import { logger } from '../lib/logger.js';

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(AppError.notFound('No route matches ' + req.method + ' ' + req.originalUrl));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const requestId = typeof res.locals.requestId === 'string' ? res.locals.requestId : undefined;

  const appError =
    err instanceof AppError ? err : AppError.internal('Unhandled application error', { cause: err });

  if (appError.status >= 500) {
    logger.error({ requestId, code: appError.code, err }, appError.message);
  } else {
    logger.warn({ requestId, code: appError.code }, appError.message);
  }

  // Stack traces are logged, never returned to the client.
  res.status(appError.status).json({
    error: {
      code: appError.code,
      userMessage: appError.userMessage,
      recoverable: appError.recoverable,
      requestId,
      ...(appError.details !== undefined ? { details: appError.details } : {}),
    },
  });
};