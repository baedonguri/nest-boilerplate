import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { sharedResolveAlias } from './vitest.shared.js';

export default defineConfig({
  // Resolves the path aliases declared in tsconfig.json, including the ones
  // added by `nest g library`.
  plugins: [tsconfigPaths()],
  resolve: { alias: sharedResolveAlias },
  test: {
    globals: true,
    root: './',
    include: ['src/**/*.spec.ts'],
  },
});
