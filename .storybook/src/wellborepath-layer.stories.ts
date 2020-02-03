import { scaleLinear } from 'd3-scale';
import WellborepathLayer from '../../src/layers/WellborePathLayer';

export default {
  title: 'Wellborepath layer',
};

const width = 400;
const height = 500;

const xbounds = [0, 200];
const ybounds = [0, 200];

export const Wellborepath = () => {
  const layer = new WellborepathLayer('wellborepath', {});

  const root = document.createElement('div');
  root.className = 'grid-container';
  root.setAttribute(
    'style',
    `height: ${height}px; width: ${width}px;background-color: #eee;`,
  );
  root.setAttribute('height', `${height}`);
  root.setAttribute('width', `${width}`);

  layer.onMount({ elm: root });

  /**
   * .onUpdate(...) sets width and height of the canvas, currently .render() uses default dimensions (150, 300)
   */
  layer.onUpdate(createEventObj(root));

  return root;
};

const createEventObj = (elm: any) => {
  const xscale = scaleLinear()
    .domain(xbounds)
    .range([0, width]);
  const yscale = scaleLinear()
    .domain(ybounds)
    .range([0, height]);

  const data = [
    [50, 0],
    [50, 10],
    [50, 20],
    [50, 30],
    [50, 40],
    [50, 50],
    [55, 60],
    [60, 70],
    [65, 80],
    [65, 90],
    [85, 100],
    [95, 110],
    [115, 110],
    [115, 110],
    [120, 110],
  ];
  return {
    xscale: xscale.copy(),
    yscale: yscale.copy(),
    elm,
    data,
  };
};
