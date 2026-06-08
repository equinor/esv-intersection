import { defineConfig } from 'oxlint';

export default defineConfig({
  plugins: ['import', 'typescript', 'oxc', 'eslint'],
  ignorePatterns: ['dist/**', '.storybook/**'],
  categories: {
    correctness: 'error',
    suspicious: 'off',
    pedantic: 'off',
    // perf: 'warn',
    // style: 'warn',
    // restriction: 'warn',
    // nursery: 'warn',
  },
  rules: {
    'typescript/no-non-null-asserted-optional-chain': 'off',
    'no-unused-expressions': [
      'error',
      { allowTernary: true, allowShortCircuit: true },
    ],
  },
});
