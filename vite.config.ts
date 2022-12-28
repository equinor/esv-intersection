import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

import pkg from './package.json'

export const getPeerDeps = pkg => Object.keys(pkg.peerDependencies || {})

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs', 'umd'],
      name: 'esvintersection',
      fileName: 'index',
    },
    rollupOptions: {
      external: getPeerDeps(pkg),
      output: {
        sourcemap: true,
        globals: {
          'pixi.js': 'PIXI',
          'pixi-dashed-line': 'pixiDashedLine',
        },
      },
    },
  },
  plugins: [dts()], // Generates typescript d.ts files with tsc
})
