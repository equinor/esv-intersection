import { GeomodelLayer } from '../../src/layers/GeoModelLayer';
import { scaleLinear } from 'd3-scale';
import { GeoModelData, GeomodelLayerOptions } from '../../src/interfaces';
import { SurfaceGenerator } from '../src/utils/surfaceGenerator';

export default {
  title: 'PIXI JS WebGL Layer',
};

const width = 400;
const height = 500;

const xbounds = [0, 1000];
const ybounds = [0, 1000];

export const GeoModel = () => {
  const options: GeomodelLayerOptions = { order: 1 };
  const geoModelLayer = new GeomodelLayer('webgl', options);

  const root = document.createElement('div');
  root.className = 'grid-container';
  root.setAttribute(
    'style',
    `height: ${height}px; width: ${width}px;background-color: #eee;`,
  );
  root.setAttribute('height', `${height}`);
  root.setAttribute('width', `${width}`);

  geoModelLayer.onMount({ elm: root, height, width });
  const strat1: [number[], number[]] = [[0], [1]];
  const data: [
    number[],
    number[],
    number[],
  ][] = new SurfaceGenerator().generateData();

  geoModelLayer.onUpdate(createEventObj(root, data));

  return root;
};

const createEventObj = (elm: any, inputData: any) => {
  console.log('inputData', inputData);
  const xScale = scaleLinear()
    .domain(xbounds)
    .range([0, width]);
  const yScale = scaleLinear()
    .domain(ybounds)
    .range([0, height]);
  const data: GeoModelData[] = [
    {
      name: 'strat 1',
      color: 0xff000,
      data: inputData[1],
    },
    {
      name: 'strat 2',
      color: 0xffff0,
      data: inputData[2],
    },
    {
      name: 'strat 3',
      color: 0xff00ff,
      data: inputData[3],
    },
    {
      name: 'strat 4',
      color: 0x0330ff,
      data: inputData[3],
    },
    {
      name: 'strat 5',
      color: 0x113322,
      data: inputData[4],
    },
    {
      name: 'strat 6',
      color: 0x155512,
      data: inputData[5],
    },
  ];
  return {
    xScale: xScale.copy(),
    yScale: yScale.copy(),
    elm,
    data,
  };
};
