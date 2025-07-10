module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    // project: './tsconfig.json',
    project: './client/tsconfig.json'
  },
  plugins: ['svelte3', '@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
    },
  ],
  settings: {
    'svelte3/typescript': require('typescript'),
  },
  rules: {
    'prettier/prettier': 'error',
    semi: ['error', 'always'],
  },
  ignorePatterns: ['node_modules', 'dist', 'build'],
};
