import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

// Flat config (ESLint 9+). Ignores build output, the legacy mockup folder
// (plain browser JS, linted separately) and vendored dependencies.
export default [
  { ignores: ['dist', 'coverage', 'node_modules', 'mockups'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: 'detect' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      // mark variables as used when referenced in JSX (React 17+ runtime:
      // no React import needed, so these rules do the variable tracking)
      ...react.configs.flat.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      // plain-JS project (no TypeScript): prop validation is covered by
      // component tests instead of PropTypes boilerplate
      'react/prop-types': 'off',
      'react/jsx-no-target-blank': 'warn',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': 'warn',
    },
  },
];
