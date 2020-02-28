import { scaleLinear } from 'd3-scale';
import { GridLayer } from '../../../src/layers';

const width = 400;
const height = 500;

const xbounds = [0, 1000];
const ybounds = [0, 1000];

export const CanvasGrid = () => {
  const gridLayer = new GridLayer('grid', {
    order: 1,
    majorColor: 'black',
    minorColor: 'black',
    majorWidth: 0.5,
    minorWidth: 0.5,
  });

  const root = document.createElement('div');
  root.className = 'grid-container';
  root.setAttribute('style', `height: ${height}px; width: ${width}px;background-color: #eee;position: relative;`);
  root.setAttribute('height', `${height}`);
  root.setAttribute('width', `${width}`);

  gridLayer.onMount({ elm: root });

  /**
   * .onUpdate(...) sets width and height of the canvas, currently .render() uses default dimensions (150, 300)
   */
  gridLayer.onUpdate(createEventObj(root));

  return root;
};

/**
 * Creates an event object that contains the element and x- and y-scale
 * @param elm
 */
const createEventObj = (elm: any) => {
  const xscale = scaleLinear()
    .domain(xbounds)
    .range([0, 500]);
  const yscale = scaleLinear()
    .domain(ybounds)
    .range([0, 500]);

  return {
    xScale: xscale.copy(),
    yScale: yscale.copy(),
    elm,
  };
};
