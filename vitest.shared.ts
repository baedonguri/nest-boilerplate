import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

/**
 * Nest loads class-transformer / class-validator with a native import (their CJS `main`), while Vite would resolve app code to
 * their ESM `module` builds; two instances mean decorator metadata (e.g. `@Exclude` on password) is invisible to Nest.
 * Pin both to the CJS entry so tests see exactly what `node dist/main.js` sees.
 */
export const sharedResolveAlias = {
  'class-transformer': require.resolve('class-transformer'),
  'class-validator': require.resolve('class-validator'),
};
