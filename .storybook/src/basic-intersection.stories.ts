import { GridLayer } from '../../src/layers';
import { Controller } from '../../src';
import { createRootContainer, createLayerContainer } from './utils';

export default {
  title: 'Basic Intersection setup',
};

const width = 400;
const height = 500;

export const BasicSetup = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const overlayElementGetter = () => document.getElementById('overlay');

  const controller = new Controller({ container, overlayElementGetter });
  controller.addLayer(new GridLayer('grid'));
  controller.adjustToSize(width, height);

  root.appendChild(container);
  return root;
};
