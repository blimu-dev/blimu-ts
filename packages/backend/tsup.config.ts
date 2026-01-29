import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/services/*.ts', 'src/schema.ts', 'src/client.ts', 'src/utils.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  tsconfig: './tsconfig.json',
  outExtension({ format }) {
    return format === 'esm' ? { js: '.mjs' } : { js: '.cjs' };
  },
  // External dependencies should not be bundled
  // This ensures proper type resolution and smaller bundle sizes
  external: [],
});
