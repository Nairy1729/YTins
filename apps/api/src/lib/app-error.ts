import type { ErrorCode } from '@reverie/contracts';

interface AppErrorOptions {
  status?: number;
  userMessage?: string;
  recoverable?: boolean;
  details?: unknown;
  cause?: unknown;
}

const DEFAULT_USER_MESSAGE = 'Something went wrong. Please try again.';

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly userMessage: string;
  readonly recoverable: boolean;
  readonly details?: unknown;

  constructor(code: ErrorCode, message: string, options: AppErrorOptions = {}) {
    super(message, { cause: options.cause });
    this.name = 'AppError';
    this.code = code;
    this.status = options.status ?? 500;
    this.userMessage = options.userMessage ?? DEFAULT_USER_MESSAGE;
    this.recoverable = options.recoverable ?? false;
    this.details = options.details;
  }

  static badRequest(message: string, userMessage = 'That request was not valid.'): AppError {
    return new AppError('BAD_REQUEST', message, {
      status: 400,
      userMessage,
      recoverable: true,
    });
  }

  static notFound(
    message: string,
    userMessage = 'We could not find what you were looking for.',
  ): AppError {
    return new AppError('NOT_FOUND', message, {
      status: 404,
      userMessage,
      recoverable: false,
    });
  }

  static internal(message: string, options: AppErrorOptions = {}): AppError {
    return new AppError('INTERNAL_ERROR', message, { status: 500, ...options });
  }
}