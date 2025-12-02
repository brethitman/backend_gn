/* eslint-disable @typescript-eslint/no-require-imports */
// eslint.config.cjs (ESLint v9 - Flat Config - CommonJS)
const js = require('@eslint/js');
const eslintConfigPrettier = require('eslint-config-prettier');
const importPlugin = require('eslint-plugin-import');
const tseslint = require('typescript-eslint');

module.exports = [
  // Ignorar (reemplaza .eslintignore)
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'eslint.config.cjs' // ⬅️ ignora el propio archivo de config
    ],
  },

  // Base JS
  js.configs.recommended,

  // Base TS
  ...tseslint.configs.recommended,

  // Extras para imports y reglas del backend
  {
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': { typescript: true },
    },
    rules: {
      'import/order': [
        'error',
        { 'newlines-between': 'always', alphabetize: { order: 'asc' } },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      // ⬇️ OPCIONAL: mientras tipas, puedes bajar no-explicit-any a 'warn' para no bloquear
      // '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // Desactiva choques con Prettier
  eslintConfigPrettier,
];
