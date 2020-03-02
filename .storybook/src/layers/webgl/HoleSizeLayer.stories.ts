import { HoleSizeLayer } from '../../../../src/layers/HoleSizeLayer';
import { scaleLinear } from 'd3-scale';
import { HoleSize } from '../../../../src/interfaces';

const width = 400;
const height = 800;

const xbounds = [0, 300];
const ybounds = [0, 800];

export const Holes = () => {
  const options = { order: 1 };
  const holeSizeLayer = new HoleSizeLayer('webgl', options);

  const root = document.createElement('div');
  root.className = 'grid-container';
  root.setAttribute('style', `height: ${height}px; width: ${width}px;background-color: #eee;`);
  root.setAttribute('height', `${height}`);
  root.setAttribute('width', `${width}`);

  holeSizeLayer.onMount({ elm: root, height, width });

  holeSizeLayer.onUpdate(createEventObj(root));

  return root;
};

const createEventObj = (elm: any) => {
  const data: HoleSize[] = [
    { diameter: 30 + 0, start: 0, length: 50 },
    { diameter: 20 + 0, start: 50, length: 70 },
    { diameter: 30 + 0, start: 120, length: 150 },
    { diameter: 55 + 0, start: 270, length: 130 },
    { diameter: 25 + 0, start: 400, length: 150 },
    { diameter: 15 + 0, start: 550, length: 50 },
    { diameter: 10 + 0, start: 600, length: 50 },
    { diameter: 8 + 0, start: 650, length: 50 },
    { diameter: 6.5 + 0, start: 700, length: 50 },
  ];

  const wellborePath: [number, number][] = [
    [50, 50],
    [50, 100],
    [100, 150],
    [150, 190],
    [200, 160],
    [250, 150],
    [300, 350],
    [150, 450],
    [120, 450],
  ];

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
    data,
    wellborePath,
  };
};
