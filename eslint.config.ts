import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import prettierConfig from 'eslint-config-prettier';
import unusedImports from 'eslint-plugin-unused-imports';
import prettier from 'eslint-plugin-prettier';

export default defineConfig(
  prettierConfig,
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.changeset/**',
      '**/*.config.ts',
      '**/scripts/**',
    ],
  },
  eslintPluginPrettierRecommended,
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    files: ['**/*.{ts,tsx,js,mjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'unused-imports': unusedImports,
      prettier,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
          // Allow regular imports for classes used in constructor parameters
          // This is necessary for NestJS dependency injection which requires
          // runtime class references for decorator metadata
          disallowTypeAnnotations: false,
        },
      ],
      'prettier/prettier': 'error',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    // Relaxed rules for test files
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: false, // Disable project service for test files as they may be excluded from tsconfig
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
    },
  },
  {
    // Scripts directory - no type checking
    files: ['scripts/**/*.{js,mjs}'],
    languageOptions: {
      parserOptions: {
        projectService: false,
      },
    },
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  {
    // Disable consistent-type-imports for NestJS services and controllers
    // These files need regular imports for constructor dependency injection
    // to work properly with decorator metadata
    files: [
      '**/*.controller.ts',
      '**/*.decorator.ts',
      '**/*.service.ts',
      '**/*.module.ts',
      '**/*.guard.ts',
      '**/*.interceptor.ts',
      '**/*.filter.ts',
      '**/*.command.ts',
    ],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'off',
    },
  },
);
