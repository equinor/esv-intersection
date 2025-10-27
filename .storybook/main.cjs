module.exports = {
  stories: ['../.storybook/src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  staticDirs: ['../public'],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  features: {
    controls: false,
    actions: false,
    interactions: false,
  },
};
