import { scaleLinear } from 'd3-scale';

import { GeomodelLayer } from '../../../../src/layers/GeomodelLayer';
import { GeomodelCanvasLayer } from '../../../../src/layers/GeomodelCanvasLayer';
import { GeomodelLayerV2 } from '../../../../src/layers/GeomodelLayerV2';
import { GeomodelLabelsLayer } from '../../../../src/layers/GeomodelLabelsLayer';
import { SurfaceGenerator } from '../../utils/surfaceGenerator';
import { ZoomPanHandler } from '../../../../src/control/ZoomPanHandler';
import { GeomodelLayerOptions, OnUpdateEvent, LayerOptions, OnRescaleEvent } from '../../../../src/interfaces';
import { createRootContainer, createLayerContainer, createFPSLabel } from '../../utils';
import { generateSurfaceData, generateProjectedTrajectory, SurfaceData, generateProjectedWellborePath } from '../../../../src/datautils';

//Data
import { getSurfaces, getWellborePath, getStratColumns } from '../../data';

const width: number = 800;
const height: number = 600;

const xbounds: number[] = [0, 1000];
const ybounds: number[] = [0, 1000];

export const GeoModel = () => {
  const options: GeomodelLayerOptions = { order: 1 };
  const geoModelLayer = new GeomodelLayer('webgl', options);

  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  const data: [number[], number[], number[]][] = new SurfaceGenerator().generateData();

  geoModelLayer.onMount({ elm: container, height, width });
  geoModelLayer.onUpdate(createEventObj(root, data));
  geoModelLayer.onRescale(createEventObj(root));

  root.appendChild(container);

  return root;
};

function transformData(inData: [number[], number[], number[]]) {
  const data = inData[0].map((v, index) => [v, inData[1][index], inData[2][index]]);
  return data;
}

const createEventObj = (elm: any, inputData?: any): OnUpdateEvent => {
  const xScale = scaleLinear().domain(xbounds).range([0, width]);
  const yScale = scaleLinear().domain(ybounds).range([0, height]);

  let event = {
    xScale: xScale.copy(),
    yScale: yScale.copy(),
    elm,
    transform: {
      x: 0,
      y: 0,
    },
    xRatio: width / xbounds[1],
    yRatio: height / ybounds[1],
  };

  if (inputData) {
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
    event = { ...event, data };
  }
  return event;
};

export const GeoModelWithSampleData = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();

  const options: GeomodelLayerOptions = { order: 1 };
  const geoModelLayer = new GeomodelLayer('webgl', options);
  geoModelLayer.onMount({ elm: container, height, width });

  Promise.all([getWellborePath(), getSurfaces(), getStratColumns()]).then((values) => {
    const [path, surfaces, stratColumns] = values;
    const poslog = path.map((coords) => [{ easting: coords[0], northing: coords[1], tvd: coords[2], md: coords[2] }]);
    const trajectory: number[][] = generateProjectedTrajectory(poslog, 45);
    const geolayerdata: SurfaceData = generateSurfaceData(trajectory, stratColumns, surfaces);

    geoModelLayer.onUpdate({ data: geolayerdata });
  });
  const zoomHandler = new ZoomPanHandler(container, (event: OnRescaleEvent) => {
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

export const GeoModelWithLabels = () => {
  const root = createRootContainer(800);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();

  const options: GeomodelLayerOptions = { order: 1 };
  const geoModelLayer = new GeomodelLayer('geomodels', options);
  geoModelLayer.onMount({ elm: container, height, width });

  const options2: LayerOptions = { order: 1 };
  const geoModelLabelsLayer = new GeomodelLabelsLayer('labels', options2);
  geoModelLabelsLayer.onMount({ elm: container });

  const zoomHandler = new ZoomPanHandler(root, (event: OnRescaleEvent) => {
    geoModelLayer.onRescale(event);
    geoModelLabelsLayer.onRescale({ ...event });
  });

  Promise.all([getWellborePath(), getSurfaces(), getStratColumns()]).then((values) => {
    const [path, surfaces, stratColumns] = values;
    const poslog = path.map((coords) => [{ easting: coords[0], northing: coords[1], tvd: coords[2], md: coords[2] }]);
    const trajectory: number[][] = generateProjectedTrajectory(poslog, 45);
    const geolayerdata: SurfaceData = generateSurfaceData(trajectory, stratColumns, surfaces);
    const wellborePath = generateProjectedWellborePath([]);

    geoModelLayer.onUpdate({ ...createEventObj(container), data: geolayerdata, wellborePath });
    geoModelLabelsLayer.onUpdate({ ...createEventObj(container), data: geolayerdata, wellborePath });
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

export const GeoModelWithLabelsUsingCanvas = () => {
  const root = createRootContainer(800);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();

  const options: GeomodelLayerOptions = { order: 1 };
  const geoModelLayer = new GeomodelCanvasLayer('geomodels', options);
  geoModelLayer.onMount({ elm: container, height, width });

  const options2: LayerOptions = { order: 1 };
  const geoModelLabelsLayer = new GeomodelLabelsLayer('labels', options2);
  geoModelLabelsLayer.onMount({ elm: container });

  const zoomHandler = new ZoomPanHandler(root, (event: OnRescaleEvent) => {
    geoModelLayer.onRescale(event);
    geoModelLabelsLayer.onRescale({ ...event });
  });

  Promise.all([getWellborePath(), getSurfaces(), getStratColumns()]).then((values) => {
    const [path, surfaces, stratColumns] = values;
    const poslog = path.map((coords) => [{ easting: coords[0], northing: coords[1], tvd: coords[2], md: coords[2] }]);
    const trajectory: number[][] = generateProjectedTrajectory(poslog, 45);
    const geolayerdata: SurfaceData = generateSurfaceData(trajectory, stratColumns, surfaces);
    const wellborePath = generateProjectedWellborePath([]);

    geoModelLayer.onUpdate({ ...createEventObj(container), data: geolayerdata, wellborePath });
    geoModelLabelsLayer.onUpdate({ ...createEventObj(container), data: geolayerdata, wellborePath });
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

export const GeoModelWithLabelsUsingVersion2 = () => {
  const root = createRootContainer(800);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();

  const options: GeomodelLayerOptions = { order: 1 };
  const geoModelLayer = new GeomodelLayerV2('geomodels', options);
  geoModelLayer.onMount({ elm: container, height, width });

  const options2: LayerOptions = { order: 1 };
  const geoModelLabelsLayer = new GeomodelLabelsLayer('labels', options2);
  geoModelLabelsLayer.onMount({ elm: container });

  const zoomHandler = new ZoomPanHandler(container, (event: OnRescaleEvent) => {
    geoModelLayer.onRescale(event);
    geoModelLabelsLayer.onRescale({ ...event });
  });

  Promise.all([getWellborePath(), getSurfaces(), getStratColumns()]).then((values) => {
    const [path, surfaces, stratColumns] = values;
    const poslog = path.map((coords) => [{ easting: coords[0], northing: coords[1], tvd: coords[2], md: coords[2] }]);
    const trajectory: number[][] = generateProjectedTrajectory(poslog, 45);
    const geolayerdata: SurfaceData = generateSurfaceData(trajectory, stratColumns, surfaces);
    const wellborePath = generateProjectedWellborePath([]);

    geoModelLayer.onUpdate({ ...createEventObj(container), data: geolayerdata, wellborePath });
    geoModelLabelsLayer.onUpdate({ ...createEventObj(container), data: geolayerdata, wellborePath });
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
