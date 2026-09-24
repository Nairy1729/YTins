import pino from 'pino';
import { env, isDev } from '../config/env.js';

const devTransport = {
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname',
    },
  },
};

export const logger = pino({
  level: env.LOG_LEVEL,
  ...(isDev ? devTransport : {}),
});