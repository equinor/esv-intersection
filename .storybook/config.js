
import { configure } from '@storybook/html';

configure(require.context('./src', true, /\.stories\.ts$/), module);
