module.exports = {
  stories: ['../.storybook/src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [],
  staticDirs: ['../public'],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
};
