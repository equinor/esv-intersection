const preview = {
  parameters: {
    docs: {
      codePanel: true,
      source: {
        transform: async (source) => {
          const prettier = await import('prettier/standalone');

          return prettier.format(source, {
            parser: 'babel',
          });
        },
      },
    },
  },
};

export default preview;
