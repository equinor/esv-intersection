import GeoModelLayer from '../../src/layers/GeoModelLayer';
import { scaleLinear } from 'd3-scale';
import { GeoModelData } from '../../src/interfaces';

export default {
  title: 'PIXI JS WebGL Layer',
};

const width = 400;
const height = 500;

const xbounds = [0, 1000];
const ybounds = [0, 1000];

export const GeoModel = () => {
  const geoModelLayer = new GeoModelLayer('webgl', {});

  const root = document.createElement('div');
  root.className = 'grid-container';
  root.setAttribute(
    'style',
    `height: ${height}px; width: ${width}px;background-color: #eee;`,
  );
  root.setAttribute('height', `${height}`);
  root.setAttribute('width', `${width}`);

  geoModelLayer.onMount({ elm: root, height, width });
  geoModelLayer.onUpdate(createEventObj(root));

  return root;
};

const createEventObj = (elm: any) => {
  const xscale = scaleLinear()
    .domain(xbounds)
    .range([0, width]);
  const yscale = scaleLinear()
    .domain(ybounds)
    .range([0, height]);
  const data: GeoModelData[] = [
    {
      name: 'strat 1',
      color: 0xff000,
      md: [70, 90, 100, 110, 100, 100],
      pos: [
        [0, 99],
        [100, 99],
        [200, 99],
        [450, 99],
        [600, 99],
        [1000, 99],
      ],
    },
    {
      name: 'strat 2',
      color: 0xffff0,
      md: [100 + 50, 120 + 50, 100 + 50, 140 + 50, 100 + 50, 120 + 50],
      pos: [
        [0, 99],
        [140, 99],
        [200, 99],
        [400, 99],
        [750, 99],
        [1000, 99],
      ],
    },
    {
      name: 'strat 3',
      color: 0xff00ff,
      md: [100 + 150, 120 + 120, 100 + 170, 140 + 150, 100 + 150, 177 + 150],
      pos: [
        [0, 99],
        [190, 99],
        [200, 99],
        [520, 99],
        [850, 99],
        [1000, 99],
      ],
    },
    {
      name: 'strat 4',
      color: 0x0330ff,
      md: [100 + 250, 120 + 220, 100 + 270, 100 + 250, 140 + 250, 177 + 250],
      pos: [
        [0, 99],
        [200, 99],
        [210, 99],
        [300, 99],
        [750, 99],
        [1000, 99],
      ],
    },
  ];
  return {
    xscale: xscale.copy(),
    yscale: yscale.copy(),
    elm,
    data,
  };
};
