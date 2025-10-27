import { defineConfig } from 'eslint/config';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';

export default defineConfig([
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintPluginPrettier,
  {
    ignores: ['dist/', 'node_modules/', 'package-lock.json', '**/*.cjs'],
  },
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-namespace': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { args: 'all', varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true, allowShortCircuit: true }],
      /* NOTE(Kevin): Currently needed after enabling strict mode, as there were over 1500 Typescript errors.
            *
            * Fixing all these errors properly, would
            * 1) result in a necessary api changes with regards to most of the public interfaces
            * 2) require drastic changes in implementation details, with an even higher risk
            * of introducing regressions.
            *
            * Therefore I opted to make minimal implementation detail changes in attempt to not
            * break existing code, while still adhering to Typescript's strict mode.

            * But why enable strict mode?
            * We've seen a couple bugs now that could have been prevented with strict mode. So
            * everywhere in the code where there isn't heavily escaped code with `?` or `!` to
            * force a `fake, correct type` the Typescript compiler will catch those mistakes.
            * However, type mismatches might still happen in these cases where there's heavy use
            * of `?` and `!` and those typing mistakes were already existing bugs, that were
            * waiting to be fixed regardless. Once these bug surface in these areas, it's desired
            * to remove the `!` and properly fix the types on a case by case basis.

            * These eslint below are metrics in form of warnings on how these are progressing.
            * The initial warning amount is 297 warnings, slowly this number should be decreasing,
            * as usage of `!` is not recommended and an escape hatch we needed in order to enable
            * strict typing on all the other areas of the codebase.
            *
            */
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    },
  },
]);
