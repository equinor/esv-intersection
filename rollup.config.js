import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';

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
      resolve(),
      commonjs(),
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
      resolve({ browser: true }),
      typescript(),
      commonjs(),
      terser({
        mangle: false,
      }),
    ],
  },
];
