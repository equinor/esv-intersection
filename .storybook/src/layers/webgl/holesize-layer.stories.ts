import { HoleSizeLayer } from '../../../../src/layers/HoleSizeLayer';
import { scaleLinear } from 'd3-scale';
import { HoleSize, HoleSizeLayerOptions, OnRescaleEvent } from '../../../../src/interfaces';
import { createRootContainer, createLayerContainer } from '../../utils';
import { ZoomPanHandler } from '../../../../src/control/ZoomPanHandler';
import { generateProjectedWellborePath } from '../../../../src/datautils';
import { CurveInterpolator } from 'curve-interpolator';

import poslog from '../../exampledata/poslog.json';

const width = 400;
const height = 800;

const xbounds = [0, 300];
const ybounds = [0, 800];

export const Holes = () => {
  const options = {
    order: 1,
  };
  const holeSizeLayer = new HoleSizeLayer('webgl', options);

  const root = document.createElement('div');
  root.className = 'grid-container';
  root.setAttribute('style', `height: ${height}px; width: ${width}px;background-color: #eee;`);
  root.setAttribute('height', `${height}`);
  root.setAttribute('width', `${width}`);

  const xScale = scaleLinear().domain(xbounds).range([0, width]);
  const yScale = scaleLinear().domain(ybounds).range([0, height]);

  holeSizeLayer.onMount({ elm: root, height, width, xScale: xScale.copy(), yScale: yScale.copy() });

  holeSizeLayer.onUpdate(createEventObj(root));

  return root;
};

export const HoleSizeLayerWithSampleData = () => {
  const options: HoleSizeLayerOptions = {
    order: 1,
  };
  const holeSizeLayer = new HoleSizeLayer('webgl', options);

  const width: number = 1280;
  const height: number = 1024;

  const xbounds: number[] = [0, 1000];
  const ybounds: number[] = [-500, 4000];

  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  const xScale = scaleLinear().domain(xbounds).range([0, width]);
  const yScale = scaleLinear().domain(ybounds).range([0, height]);

  holeSizeLayer.onMount({ elm: root, height, width, xScale: xScale.copy(), yScale: yScale.copy() });

  holeSizeLayer.onUpdate(createEventWithSampleDataObj(root));

  const zoomHandler = new ZoomPanHandler(root, (event: OnRescaleEvent) => {
    holeSizeLayer.onRescale(event);
  });
  zoomHandler.setBounds([0, 1000], [0, 1000]);
  zoomHandler.adjustToSize(width, height);
  zoomHandler.zFactor = 1;
  zoomHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
  zoomHandler.enableTranslateExtent = false;
  zoomHandler.setViewport(1000, 1000, 5000);

  root.appendChild(container);

  return root;
};

const createEventWithSampleDataObj = (elm: any) => {
  const data: HoleSize[] = [
    { diameter: 36, start: 0, length: 100 },
    { diameter: 28, start: 100, length: 100 },
    { diameter: 34, start: 200, length: 300 },
    { diameter: 15, start: 500, length: 100 },
    { diameter: 10, start: 600, length: 600 },
    { diameter: 8.5, start: 1200, length: 600 },
    { diameter: 7.5, start: 1600, length: 600 },
  ];
  const wellborePath: [number, number][] = generateProjectedWellborePath(poslog) as [number, number][];

  return {
    elm,
    data,
    wellborePath,
  };
};

const createEventObj = (elm: any) => {
  const data: HoleSize[] = [
    { diameter: 30 + 0, start: 0, length: 50 },
    { diameter: 20 + 0, start: 50, length: 70 },
    { diameter: 30 + 0, start: 130, length: 150 },
    { diameter: 55 + 0, start: 280, length: 130 },
    { diameter: 25 + 0, start: 410, length: 150 },
    { diameter: 15 + 0, start: 560, length: 50 },
    { diameter: 10 + 0, start: 610, length: 50 },
    { diameter: 8 + 0, start: 660, length: 50 },
    { diameter: 6.5 + 0, start: 710, length: 50 },
  ];

  const wellborePathCoords: [number, number][] = [
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
  const tension = 0.2;
  const numPoints = 999;
  const wbpInterp = new CurveInterpolator(wellborePathCoords, tension);
  const wellborePath = wbpInterp.getPoints(numPoints);

  const xScale = scaleLinear().domain(xbounds).range([0, width]);
  const yScale = scaleLinear().domain(ybounds).range([0, height]);
  return {
    xScale: xScale.copy(),
    yScale: yScale.copy(),
    elm,
    data,
    wellborePath,
  };
};
