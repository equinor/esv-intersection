const preview = {
  parameters: {
    docs: {
      codePanel: true,
      source: {
        transform: async (source) => {
          const prettier = await import('prettier/standalone');
          const prettierPluginBabel = await import('prettier/plugins/babel');
          const prettierPluginEstree = await import('prettier/plugins/estree');

          return prettier.format(source, {
            parser: 'babel',
            plugins: [prettierPluginBabel, prettierPluginEstree],
          });
        },
      },
    },
  },
};

export default preview;
