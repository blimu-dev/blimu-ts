import { defineConfig } from 'tsup';

export default [
  // CLI entry point (main.ts)
  // Build as ESM to support Ink's yoga-layout dependency (uses top-level await)
  defineConfig({
    entry: ['src/main.ts'],
    format: ['esm'],
    dts: false, // CLI doesn't need type declarations
    splitting: false,
    sourcemap: true,
    clean: true, // Clean dist folder before building
    minify: true,
    outDir: 'dist',
    outExtension({ format }) {
      return format === 'esm' ? { js: '.mjs' } : { js: '.cjs' };
    },
    banner: {
      js: '#!/usr/bin/env node',
    },
    // External dependencies that can't be bundled or are better left external
    external: [
      'undici', // Built into Node.js 18+
      'react', // Required by Ink, can't bundle due to ESM issues
      'ink', // Ink and its ecosystem
      'ink-spinner',
      'yoga-layout', // Used by Ink, has top-level await
      'clipboardy', // Uses child_process, can't be bundled
    ],
    esbuildOptions(options) {
      // Ensure React JSX is transformed correctly for Ink
      options.jsx = 'transform';
      options.jsxFactory = 'React.createElement';
      options.jsxFragment = 'React.Fragment';
    },
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
