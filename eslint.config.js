// https://docs.expo.dev/guides/using-eslint/
const expoConfig = require('eslint-config-expo/flat');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const { defineConfig } = require('eslint/config');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'ios/*', 'android/*', '.expo/*', 'node_modules/*'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      // Missing/incorrect effect dependencies caused real bugs here (stale
      // `db` handles, counters that never refreshed), so this is an error
      // rather than the default warning.
      'react-hooks/exhaustive-deps': 'error',

      // The base rule doesn't understand TypeScript declaration signatures and
      // flags every parameter name in an interface, so use the TS-aware one.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { args: 'after-used', argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
]);
