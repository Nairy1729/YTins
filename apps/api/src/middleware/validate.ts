import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../lib/app-error.js';

export function validateBody(schema: ZodType): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || '(root)',
        message: issue.message,
      }));

      next(
        new AppError('VALIDATION_FAILED', 'Request body failed validation', {
          status: 400,
          userMessage: details[0]?.message ?? 'Some details were not valid.',
          recoverable: true,
          details,
        }),
      );
      return;
    }

    req.body = result.data;
    next();
  };
}