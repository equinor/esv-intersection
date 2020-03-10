import { HoleSizeLayer } from '../../../../src/layers/HoleSizeLayer';
import { scaleLinear } from 'd3-scale';
import { Casing, HoleSizeLayerOptions } from '../../../../src/interfaces';

import poslog from '../../exampledata/polog.json';
import { generateProjectedWellborePath, generateProjectedTrajectory } from '../../../../src/datautils';

const width = 400;
const height = 800;

const xbounds = [0, 300];
const ybounds = [0, 800];

export const CasingLayer = () => {
  const options: HoleSizeLayerOptions = {
    order: 1,
    firstColor: '#777788', // maybe not needed, refactor holesizelayer
    secondColor: '#EEEEFF',
    lineColor: 0x575757,
    topBottomLineColor: 0x575757,
    maxTextureDiameterScale: 1.5,
  };
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

export const CasingLayerWithSampleData = () => {
  const options: HoleSizeLayerOptions = {
    order: 1,
    firstColor: '#777788', // maybe not needed, refactor holesizelayer
    secondColor: '#EEEEFF',
    lineColor: 0x575757,
    topBottomLineColor: 0x575757,
    maxTextureDiameterScale: 1.5,
  };
  const holeSizeLayer = new HoleSizeLayer('webgl', options);

  const width: number = 1280;
  const height: number = 1024;

  const xbounds: number[] = [0, 1000];
  const ybounds: number[] = [-500, 4000];

  const root = document.createElement('div');
  root.className = 'grid-container';
  root.setAttribute('style', `height: ${height}px; width: ${width}px;background-color: #eee;`);
  root.setAttribute('height', `${height}`);
  root.setAttribute('width', `${width}`);

  const xScale = scaleLinear()
    .domain(xbounds)
    .range([0, width]);
  const yScale = scaleLinear()
    .domain(ybounds)
    .range([0, height]);

  holeSizeLayer.onMount({ elm: root, height, width, xScale: xScale.copy(), yScale: yScale.copy() });

  holeSizeLayer.onUpdate(createEventWithSampleDataObj(root));

  return root;
};

const createEventWithSampleDataObj = (elm: any) => {
  const data: Casing[] = [
    { diameter: 30, start: 0, length: 500, hasShoe: false, innerDiameter: 29 },
    { diameter: 28, start: 1510, length: 500, hasShoe: true, innerDiameter: 26 },
  ];

  const wellborePath: [number, number][] = (generateProjectedTrajectory(poslog, 45) as [number, number][])
    .reverse()
    .map(arr => [arr[1] + 200, arr[0]]);

  return {
    elm,
    data,
    wellborePath,
  };
};

const createEventObj = (elm: any) => {
  const data: Casing[] = [
    { diameter: 30 + 0, innerDiameter: 29, start: 0, length: 50, hasShoe: true },
    { diameter: 20 + 0, innerDiameter: 19, start: 50, length: 70, hasShoe: true },
    { diameter: 30 + 0, innerDiameter: 29, start: 120, length: 150, hasShoe: false },
    { diameter: 55 + 0, innerDiameter: 52, start: 270, length: 130, hasShoe: true },
    { diameter: 25 + 0, innerDiameter: 20, start: 400, length: 150, hasShoe: false },
    { diameter: 15 + 0, innerDiameter: 13, start: 550, length: 50, hasShoe: false },
    { diameter: 10 + 0, innerDiameter: 8, start: 600, length: 50, hasShoe: true },
    { diameter: 8 + 0, innerDiameter: 7, start: 650, length: 50, hasShoe: true },
    { diameter: 6.5 + 0, innerDiameter: 2, start: 700, length: 50, hasShoe: true },
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
