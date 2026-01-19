import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig, Plugin } from 'vitest/config';

export default defineConfig({
  plugins: [
    // This plugin resolves TypeScript path mappings from tsconfig.json
    tsconfigPaths() as unknown as Plugin,
  ],
  test: {
    // Test environment - use jsdom for React components
    environment: 'jsdom',

    // Test file patterns - include both .ts and .tsx
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'coverage'],

    // Global setup
    globals: true,

    // Setup files for jest-dom matchers
    setupFiles: ['./src/__tests__/setup.ts'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.*',
        'src/__tests__/',
        'src/**/index.ts',
      ],
    },

    // Test timeout
    testTimeout: 10000,

    // Mock configuration
    clearMocks: true,
    restoreMocks: true,

    // Reporter configuration
    reporters: ['verbose'],
  },

  // Resolve configuration to handle path aliases
  resolve: {
    alias: {
      // Path aliases are handled by tsconfigPaths plugin
    },
  },
});
