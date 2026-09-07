/// <reference types="vitest" />
import { mergeConfig } from 'vite';
import dts from 'unplugin-dts/vite';

import { defineConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      include: [
        '(src|test)/**/__tests__/**/*.?(c|m)[jt]s?(x)',
        '(src|test)/**/?(*.){test,spec}.?(c|m)[jt]s?(x)',
      ],
      environment: 'jsdom',
      watch: false,
      reporters: ['default', 'junit'],
      outputFile: {
        junit: 'test-results/junit.xml',
      },
      coverage: {
        provider: 'v8',
        reporter: [['cobertura', { file: 'Cobertura.xml' }]],
        reportsDirectory: 'coverage',
      },
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
