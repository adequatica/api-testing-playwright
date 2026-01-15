import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import pluginImport from 'eslint-plugin-import';
import playwright from 'eslint-plugin-playwright';
import globals from 'globals';
import ts from 'typescript-eslint';

export default defineConfig([
  {
    files: ['**/*.{js,ts,tsx}'],
    extends: [js.configs.recommended, ts.configs.recommended],
    plugins: {
      import: pluginImport,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'newline-before-return': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      // Import Order plugin
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node.js built-ins
            'external', // npm packages
            'internal', // Internal aliases
            'parent', // ../
            'sibling', // ./
            'index', // ./index
            'type', // TypeScript type imports
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  {
    files: ['tests/**'],
    extends: [playwright.configs['flat/recommended']],
  },
]);
