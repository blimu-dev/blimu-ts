import { defineConfig } from 'tsup';

export default [
  // CLI entry point (main.ts)
  // Bundle everything for a self-contained CLI tool
  defineConfig({
    entry: ['src/main.ts'],
    format: ['cjs'],
    dts: false, // CLI doesn't need type declarations
    splitting: false,
    sourcemap: true,
    clean: false, // Don't clean on first build
    minify: true,
    outDir: 'dist',
    outExtension({ format }) {
      return format === 'esm' ? { js: '.mjs' } : { js: '.cjs' };
    },
    banner: {
      js: '#!/usr/bin/env node',
    },
    // No externals - bundle all dependencies for self-contained CLI
    // Except undici which is built into Node.js 18+
    external: ['undici'],
  }),
  // Library exports (index.ts)
  defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: false, // Don't clean on second build
    minify: false, // Keep library code readable
    outDir: 'dist',
    outExtension({ format }) {
      return format === 'esm' ? { js: '.mjs' } : { js: '.cjs' };
    },
    external: [
      // Don't bundle dependencies for library
      'zod',
    ],
  }),
];
