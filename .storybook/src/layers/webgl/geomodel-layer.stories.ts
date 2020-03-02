import { GeomodelLayer } from '../../../../src/layers/GeomodelLayer';
import { scaleLinear } from 'd3-scale';
import { GeomodelLayerOptions, OnUpdateEvent } from '../../../../src/interfaces';
import { SurfaceGenerator } from '../../utils/surfaceGenerator';
import { ZoomPanHandler } from '../../../../src/control/ZoomPanHandler';

import { generateSurfaceData, generateProjectedTrajectory, SurfaceData } from '../../../../src/datautils';
import { createRootContainer, createLayerContainer, createFPSLabel } from '../../utils';

//Data
import poslog from '../../exampledata/polog.json';
import stratColumn from '../../exampledata/stratcolumn.json';
import surfaceValues from '../../exampledata/surfaces.json';

const trajectory: number[][] = generateProjectedTrajectory(poslog, 45);
const geolayerdata: SurfaceData = generateSurfaceData(trajectory, stratColumn, surfaceValues);

const width: number = 1280;
const height: number = 1024;

const xbounds: number[] = [0, 1000];
const ybounds: number[] = [0, 1000];

export const GeoModel = () => {
  const options: GeomodelLayerOptions = { order: 1 };
  const geoModelLayer = new GeomodelLayer('webgl', options);

  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  geoModelLayer.onMount({ elm: container, height, width });
  const strat1: [number[], number[]] = [[0], [1]];
  const data: [number[], number[], number[]][] = new SurfaceGenerator().generateData();

  geoModelLayer.onUpdate(createEventObj(root, data));

  root.appendChild(container);

  return root;
};

function transformData(inData: [number[], number[], number[]]) {
  const data = inData[0].map((v, index) => [v, inData[1][index], inData[2][index]]);
  return data;
}

const createEventObj = (elm: any, inputData: any) => {
  const xScale = scaleLinear()
    .domain(xbounds)
    .range([0, width]);
  const yScale = scaleLinear()
    .domain(ybounds)
    .range([0, height]);

  if (!inputData) return;

  const data = {
    lines: [],
    areas: [
      {
        name: 'strat 1',
        color: 0xff000,
        data: transformData(inputData[1]),
      },
      {
        name: 'strat 2',
        color: 0xffff0,
        data: transformData(inputData[2]),
      },
      {
        name: 'strat 3',
        color: 0xff00ff,
        data: transformData(inputData[3]),
      },
      {
        name: 'strat 4',
        color: 0x0330ff,
        data: transformData(inputData[3]),
      },
      {
        name: 'strat 5',
        color: 0x113322,
        data: transformData(inputData[4]),
      },
      {
        name: 'strat 6',
        color: 0x155512,
        data: transformData(inputData[5]),
      },
    ],
  };
  return {
    xScale: xScale.copy(),
    yScale: yScale.copy(),
    elm,
    data,
  };
};

export const GeoModelWithSampleData = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();

  const options: GeomodelLayerOptions = { order: 1 };
  const geoModelLayer = new GeomodelLayer('webgl', options);
  geoModelLayer.onMount({ elm: container, height, width });

  const zoomHandler = new ZoomPanHandler(container, (event: OnUpdateEvent) => {
    geoModelLayer.onUpdate({ ...event, data: geolayerdata });
    geoModelLayer.onRescale(event);
  });
  zoomHandler.setBounds([0, 1000], [0, 1000]);
  zoomHandler.adjustToSize(width, height);
  zoomHandler.zFactor = 1;
  zoomHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
  zoomHandler.enableTranslateExtent = false;
  zoomHandler.setViewport(1000, 1000, 5000);

  root.appendChild(container);
  root.appendChild(fpsLabel);

  return root;
};
