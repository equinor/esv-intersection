module.exports = {
  stories: ['../.storybook/src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-storysource', 'storybook-dark-mode'],
  staticDirs: ['../public'],
  framework: {
    name: '@storybook/html-vite',
    options: {
      build: {
        rollupOptions: {
          cache: false
        }
      }
    }
  },
};
