import typescript from 'rollup-plugin-typescript2'
import terser from '@rollup/plugin-terser';

import pkg from './package.json' assert { type: "json" };

const peerDeps = Object.keys(pkg.peerDependencies || {})

export default [
  {
    input: 'src/index.ts',
    external: peerDeps,
    output: [
      {
        file: pkg.exports.require,
        format: 'cjs',
      },
      {
        file: pkg.exports.import,
        format: 'esm',
      },
    ],
    plugins: [
      typescript(),
      terser({
        mangle: false,
      }),
    ],
  },
  {
    input: 'src/index.ts',
    external: peerDeps,
    output: {
      name: 'Esv-intersection',
      file: pkg.exports.browser,
      format: 'umd',
    },
    plugins: [
      typescript(),
      terser({
        mangle: false,
      }),
    ],
  },
];
