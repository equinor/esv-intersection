import { HoleSizeLayer } from '../../../src/layers/HoleSizeLayer';
import { scaleLinear } from 'd3-scale';

export default {
  title: 'Layers',
};

const width = 400;
const height = 800;

const xbounds = [0, 300];
const ybounds = [0, 800];

export const HoleSize = () => {
  const options = { order: 1 };
  const holeSizeLayer = new HoleSizeLayer('webgl', options);

  const root = document.createElement('div');
  root.className = 'grid-container';
  root.setAttribute(
    'style',
    `height: ${height}px; width: ${width}px;background-color: #eee;`,
  );
  root.setAttribute('height', `${height}`);
  root.setAttribute('width', `${width}`);

  holeSizeLayer.onMount({ elm: root, height, width });

  holeSizeLayer.onUpdate(createEventObj(root));

  return root;
};

const createEventObj = (elm: any) => {
  const xScale = scaleLinear()
    .domain(xbounds)
    .range([0, width]);
  const yScale = scaleLinear()
    .domain(ybounds)
    .range([0, height]);
  return {
    xScale: xScale.copy(),
    yScale: yScale.copy(),
    elm,
  };
};
