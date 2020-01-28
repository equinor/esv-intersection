import * as d3 from 'd3';
import GridLayer from '../../src/layers/GridLayer';

const width = 400;
const height = 500;

export default {
  title: 'Canvas',
};
const xbounds = [0, 1000];
const ybounds = [0, 1000];

export const Grid = () => {
  const gridLayer = new GridLayer('grid', {
    majorColor: 'black',
    minorColor: 'black',
    majorWidth: 0.5,
    minorWidth: 0.5,
  });

  const root = document.createElement('div');
  root.className = 'grid-container';
  root.setAttribute('style', `height: ${height}px; width: ${width}px;background-color: #eee;`);
  root.setAttribute('height', `${height}`);
  root.setAttribute('width', `${width}`);

  gridLayer.onMount({ elm : root });

  /**
   * .onUpdate(...) sets width and height of the canvas, currently .render() uses default dimensions (150, 300)
   */
  gridLayer.onUpdate(createEventObj());

  return root;
};

//
const createEventObj = () => {
  const xscale = d3.scaleLinear().domain(xbounds).range([0, 500]);
  const yscale = d3.scaleLinear().domain(ybounds).range([0, 500]);

  return {
    xscale: xscale.copy(),
    yscale: yscale.copy(),
  };
}
