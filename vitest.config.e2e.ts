import { config } from 'dotenv';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { sharedResolveAlias } from './vitest.shared.js';

/** app e2e: test/global-setup.ts migrates + seeds app_test and serves the app; specs share that state, so files run sequentially */
export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: { alias: sharedResolveAlias },
  test: {
    globals: true,
    root: './',
    include: ['test/**/*.e2e-spec.ts'],
    env: config({ path: './.env.test', quiet: true }).parsed,
    globalSetup: ['./test/global-setup.ts'],
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 60_000,
  },
});
