import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],

  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        hooks: resolve(__dirname, 'src/hooks/index.ts'),
        providers: resolve(__dirname, 'src/providers/index.ts'),
        components: resolve(__dirname, 'src/components/index.ts'),
      },
      formats: ['es', 'cjs'],
      // IMPORTANT: ensure ESM and CJS don't write to the same filenames.
      // Otherwise the CJS build overwrites the ESM build, and browsers importing ESM
      // will see "does not provide an export named ...".
      fileName: (format, entryName) => (format === 'es' ? `${entryName}.js` : `${entryName}.cjs`),
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'tailwindcss', '@blimu/client'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        // Note: leave entryFileNames unset so Vite can apply `lib.fileName` per-format.
        assetFileNames: (assetInfo) => {
          if (assetInfo.names?.[0]?.endsWith('.css')) {
            return 'styles/[name].[extname]';
          }
          return 'assets/[name].[extname]';
        },
      },
    },
    sourcemap: true,
    outDir: 'dist',
    emptyOutDir: true,
  },
});
