module.exports = {
  stories: ['../.storybook/src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['storybook-dark-mode'],
  staticDirs: ['../public'],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
};
