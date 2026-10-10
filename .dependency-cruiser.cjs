/** module boundary rules; run with `pnpm lint:arch`, enforced in CI */
module.exports = {
  forbidden: [
    {
      name: 'no-cross-module-internals',
      comment:
        'A module under src/modules may use another module only through its public API (src/modules/<name>/index.ts).',
      severity: 'error',
      from: { path: '^src/modules/([^/]+)/' },
      to: {
        path: '^src/modules/([^/]+)/',
        pathNot: ['^src/modules/$1/', '^src/modules/[^/]+/index\\.ts$'],
      },
    },
    {
      name: 'common-is-a-shared-kernel',
      comment:
        'src/common holds context-free code only; it must not depend on business modules.',
      severity: 'error',
      from: { path: '^src/common/' },
      to: { path: '^src/modules/' },
    },
    {
      name: 'crud-lib-is-standalone',
      comment:
        'src/lib/crud is a self-contained library; it must not import application code.',
      severity: 'error',
      from: { path: '^src/lib/crud/' },
      to: { path: '^src/', pathNot: '^src/lib/crud/' },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsConfig: { fileName: 'tsconfig.json' },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      extensions: ['.ts', '.js'],
    },
  },
};
