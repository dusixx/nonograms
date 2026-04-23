import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import-x';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';
import path from 'path';

export default [
  js.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
    },
    settings: {
      'import/resolver': {
        alias: {
          map: [
            ['@', path.resolve(__dirname, './src')],
            ['@common', path.resolve(__dirname, './src/common')],
            ['@components', path.resolve(__dirname, 'src/components')],
            ['@utils', path.resolve(__dirname, 'src/utils')],
            ['@styles', path.resolve(__dirname, 'src/styles')],
            ['@data', path.resolve(__dirname, 'src/data')],
          ],
          extensions: ['.js', '.mjs', '.cjs', '.json'],
        },
        node: {
          extensions: ['.js', '.mjs', '.cjs', '.json'],
        },
      },
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'import/no-unresolved': 'error',
      'import/order': 'warn',
    },
  },
  {
    ignores: ['node_modules/**', 'dist/**', '*.min.js', '**/*.config.js'],
  },
];
