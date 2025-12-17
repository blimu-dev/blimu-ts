import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)'],
  addons: ['@storybook/addon-links'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: ['../.storybook/public'],
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [
        tailwindcss(), // Add Tailwind CSS Vite plugin
        tsconfigPaths(),
      ],
      resolve: {
        alias: {
          '@': resolve(__dirname, '../src'),
        },
      },
      optimizeDeps: {
        exclude: ['lodash'], // Exclude lodash from optimization to prevent missing file errors
      },
    });
  },
};

export default config;
