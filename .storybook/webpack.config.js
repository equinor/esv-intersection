module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve('awesome-typescript-loader'),
      },
    ],
  });
  config.module.rules.push({
    test: /\.stories\.ts?$/,
    loaders: [require.resolve('@storybook/source-loader')],
    enforce: 'pre',
  });
  config.resolve.extensions.push('.ts', '.tsx');
  return config;
  };
