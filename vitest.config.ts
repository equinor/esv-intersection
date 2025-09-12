/// <reference types="vitest" />
import { mergeConfig } from 'vite';
import dts from 'vite-plugin-dts';

import { defineConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      include: ['(src|test)/**/__tests__/**/*.?(c|m)[jt]s?(x)', '(src|test)/**/?(*.){test,spec}.?(c|m)[jt]s?(x)'],
      environment: 'jsdom',
      watch: false,
      setupFiles: ['./__mocks__/pixi.js.ts', '__mocks__/canvas.ts'],
      deps: {
        optimizer: {
          web: {
            include: ['vitest-canvas-mock'],
          },
        },
      },
    },
    plugins: [
      dts({
        tsconfigPath: './test/tsconfig.json',
      }),
    ], // Generates typescript d.ts files with tsc
  }),
);
