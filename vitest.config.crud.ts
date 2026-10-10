import { config } from 'dotenv';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { sharedResolveAlias } from './vitest.shared.js';

/** CRUD library e2e specs: one shared database with dropSchema, so files run sequentially */
export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: { alias: sharedResolveAlias },
  test: {
    globals: true,
    root: './',
    include: ['test/crud/**/*.spec.ts'],
    env: config({ path: './test/crud/.env.test', quiet: true }).parsed,
    fileParallelism: false,
    testTimeout: 120_000,
    hookTimeout: 120_000,
  },
});
