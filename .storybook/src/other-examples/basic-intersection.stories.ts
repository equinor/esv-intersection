import { GridLayer } from '../../../src/layers';
import { Controller } from '../../../src';
import { createRootContainer, createLayerContainer, createHelpText } from '../utils';

const width: number = 700;
const height: number = 600;

export const BasicSetup = () => {
  const root = createRootContainer(width);
  // this is merely a html element with some basic styling
  const container = createLayerContainer(width, height);

  const controller = new Controller({ container });
  controller.addLayer(new GridLayer('grid'));
  controller.adjustToSize(width, height);

  root.appendChild(createHelpText('A basic example of setting up the controller along with a layer. The only required input is an HTML container.'));
  root.appendChild(container);
  return root;
};


export default {
  title: 'ESV Intersection/Other examples',
  component: BasicSetup
}
