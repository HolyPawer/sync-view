module.exports = {
  root: true,
  parser: 'svelte-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    extraFileExtensions: ['.svelte'],
    project: './tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['svelte', '@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  overrides: [
    {
      files: ['*.svelte'],
      rules: {
        'prettier/prettier': 'error',
      },
    },
  ],
  rules: {
    'prettier/prettier': 'error',
    semi: ['error', 'always'],
  },
};
