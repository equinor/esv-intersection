import { scaleLinear } from 'd3-scale';
import { GridLayer } from '../../../../src/layers';

import { createRootContainer, createLayerContainer } from '../../utils';

const width = 400;
const height = 500;

const xbounds = [0, 1000];
const ybounds = [0, 1000];

export const CanvasGrid = () => {
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

  /**
   * .onUpdate(...) sets width and height of the canvas, currently .render() uses default dimensions (150, 300)
   */
  gridLayer.onUpdate(createEventObj(container));

  root.appendChild(container);

  return root;
};

/**
 * Creates an event object that contains the element and x- and y-scale
 * @param elm
 */
const createEventObj = (elm: any) => {
  const xscale = scaleLinear().domain(xbounds).range([0, width]);
  const yscale = scaleLinear().domain(ybounds).range([0, width]);

  return {
    xScale: xscale.copy(),
    yScale: yscale.copy(),
    elm,
  };
};
