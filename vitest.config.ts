/// <reference types="vitest" />
import { mergeConfig } from 'vite';
import { defineConfig, configDefaults } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      watch: false,
      setupFiles: ['./__mocks__/pixi.js.ts', '__mocks__/canvas.ts'],
      deps: {
        inline: ['vitest-canvas-mock'],
      },
    },
  }),
);
