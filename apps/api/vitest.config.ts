import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    testTimeout: 30000,
    env: {
      LOG_LEVEL: 'fatal',
      PIPELINE_MODE: 'stub',
    },
  },
});