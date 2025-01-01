import typescriptEslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import love from 'eslint-config-love';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends('prettier'),
  {
    ...love,

    plugins: {
      '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2025,
      },

      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    rules: {},
  },
  {
    files: ['**/.eslintrc.{js,cjs}'],

    languageOptions: {
      globals: {
        ...globals.node,
      },

      ecmaVersion: 5,
      sourceType: 'module',
    },
  },
];
