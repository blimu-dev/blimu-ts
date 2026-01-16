import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    hooks: 'src/hooks/index.ts',
    providers: 'src/providers/index.ts',
    components: 'src/components/index.ts',
    types: 'src/types/index.ts',
    tailwind: 'src/tailwind.plugin.ts',
  },
  dts: true,
  format: ['esm', 'cjs'],
  bundle: true,
  clean: true,
  // Don't minify - keep Tailwind classes readable for JIT
  minify: false,
  sourcemap: true,
  external: ['react', 'react-dom', '@blimu/client'],
  treeshake: false, // Preserve all exports
  splitting: false,
  banner: {
    js: '"use client";', // Next.js 13+ client component
  },
});
