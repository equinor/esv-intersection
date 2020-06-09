import { GridLayer, Controller, ZoomPanHandler, OnRescaleEvent } from '../../../src';

import { createRootContainer, createLayerContainer, createHelpText } from '../utils';

const width: number = 700;
const height: number = 600;

export const GridUsingLowLevelInterface = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  const gridLayer = new GridLayer('grid', {
    order: 1,
    majorColor: 'black',
    minorColor: 'black',
    majorWidth: 0.5,
    minorWidth: 0.5,
  });

  gridLayer.onMount({ elm: container, width, height });

  const zoomHandler = new ZoomPanHandler(container, (event: OnRescaleEvent) => {
    gridLayer.onRescale(event);
  });

  zoomHandler.adjustToSize(width, height);

  root.appendChild(createHelpText('Low level interface to create and display grid. This layer is made using canvas.'));
  root.appendChild(container);

  return root;
};

export const GridUsingHighLevelInterface = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  const gridLayer = new GridLayer('grid', {
    order: 1,
    majorColor: 'black',
    minorColor: 'black',
    majorWidth: 0.5,
    minorWidth: 0.5,
  });

  const controller = new Controller({ container, layers: [gridLayer] });

  controller.adjustToSize(width, height);

  root.appendChild(createHelpText('High level interface to create and display grid. This layer is made using canvas.'));
  root.appendChild(container);

  return root;
};
