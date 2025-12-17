import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    tailwind: 'src/tailwind.plugin.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', '@blimu/client'],
  // Don't minify - keep Tailwind classes readable for JIT
  minify: false,
  treeshake: false, // Preserve all exports
  splitting: false,
  banner: {
    js: '"use client";', // Next.js 13+ client component
  },
});
