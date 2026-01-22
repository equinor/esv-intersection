import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import pkg from './package.json';

type PackageJson = typeof pkg;

export const getPeerDeps = (pkg: PackageJson) => Object.keys(pkg.peerDependencies || {});

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs', 'umd'],
      name: 'esvintersection',
      fileName: (format) => {
        const fileName = 'index';
        switch (format) {
          case 'es':
            return `${fileName}.mjs`;
          case 'cjs':
            return `${fileName}.cjs`;
          case 'umd':
            return `${fileName}.umd.js`;
          default:
            return `${fileName}.js`;
        }
      },
    },
    rollupOptions: {
      external: getPeerDeps(pkg),
    },
  },
  plugins: [
    dts({
      tsconfigPath: './src/tsconfig.json',
    }),
  ], // Generates typescript d.ts files with tsc
});
