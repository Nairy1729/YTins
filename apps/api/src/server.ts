import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { ensureStorageDirs, STORAGE_ROOT } from './lib/storage.js';

async function main(): Promise<void> {
  await ensureStorageDirs();
  logger.debug({ storage: STORAGE_ROOT }, 'Storage ready');

  const app = createApp();

  const server = app.listen(env.PORT, env.HOST, () => {
    logger.info(
      {
        url: 'http://'+env.HOST+':'+env.PORT,
        env: env.NODE_ENV,
        node: process.version,
      },
      'Reverie API ready',
    );
  });

  const shutdown = (signal: string): void => {
    logger.info({ signal }, 'Shutting down');
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('unhandledRejection', (reason) => {
    logger.error({ reason }, 'Unhandled rejection');
  });
}

main().catch((err) => {
  logger.error({ err }, 'Failed to start API');
  process.exit(1);
});