import GeoModelLayer from '../../src/layers/GeoModelLayer';
import { scaleLinear } from 'd3-scale';

export default {
  title: 'PIXI JS WebGL Layer',
};

const width = 400;
const height = 500;

const xbounds = [0, 1000];
const ybounds = [0, 1000];

export const Grid = () => {
  const geoModelLayer = new GeoModelLayer('webgl', {});

  const root = document.createElement('div');
  root.className = 'grid-container';
  root.setAttribute(
    'style',
    `height: ${height}px; width: ${width}px;background-color: #eee;`,
  );
  root.setAttribute('height', `${height}`);
  root.setAttribute('width', `${width}`);

  geoModelLayer.onMount({ elm: root });

  /**
   * .onUpdate(...) sets width and height of the canvas, currently .render() uses default dimensions (150, 300)
   */
  geoModelLayer.onUpdate(createEventObj(root));

  return root;
};

const createEventObj = (elm: any) => {
  const xscale = scaleLinear()
    .domain(xbounds)
    .range([0, 500]);
  const yscale = scaleLinear()
    .domain(ybounds)
    .range([0, 500]);

  return {
    xscale: xscale.copy(),
    yscale: yscale.copy(),
    elm,
  };
};
