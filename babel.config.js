// Babel configuration for jest tests
// Build script does not use babel to transpile, but TypeScript's tsc with rollup-plugin-typescript2
module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
};
