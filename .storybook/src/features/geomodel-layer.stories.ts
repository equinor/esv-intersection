import {
  GeomodelCanvasLayer,
  GeomodelLayerV2,
  GeomodelLabelsLayer,
  ZoomPanHandler,
  GeomodelLayerOptions,
  LayerOptions,
  OnRescaleEvent,
  IntersectionReferenceSystem,
  Controller,
} from '../../../src';
import { generateSurfaceData, SurfaceData } from '../../../src/datautils';
import { getSurfaces, getStratColumns, getPositionLog, getWellborePath } from '../data';

import { createRootContainer, createLayerContainer, createFPSLabel, createHelpText } from '../utils';

const width = 700;
const height = 600;

export const GeoModelUsingLowLevelInterface = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();

  const options: GeomodelLayerOptions = { order: 1 };
  const geoModelLayer = new GeomodelLayerV2('webgl', options);
  geoModelLayer.onMount({ elm: container, height, width });

  Promise.all([getWellborePath(), getSurfaces(), getStratColumns(), getPositionLog()]).then((values) => {
    const [path, surfaces, stratColumns] = values;

    const referenceSystem = new IntersectionReferenceSystem(path);
    const displacement = referenceSystem.displacement || 1;
    const extend = 1000 / displacement;
    const steps = surfaces[0]?.data?.values?.length || 1;
    const traj = referenceSystem.getTrajectory(steps, 0, 1 + extend);
    const trajectory: number[][] = IntersectionReferenceSystem.toDisplacement(traj.points, traj.offset);
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

  root.appendChild(createHelpText('Low level interface for creating and displaying geo model (aka surfaces). This layer is made using webGL.'));
  root.appendChild(container);
  root.appendChild(fpsLabel);

  return root;
};

export const GeoModelWithLabelsUsingLowLevelInterface = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();

  const options: GeomodelLayerOptions = { order: 1 };
  const geoModelLayer = new GeomodelLayerV2('geomodels', options);
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

    const referenceSystem = new IntersectionReferenceSystem(path);
    const displacement = referenceSystem.displacement || 1;
    const extend = 1000 / displacement;
    const steps = surfaces[0]?.data?.values?.length || 1;
    const traj = referenceSystem.getTrajectory(steps, 0, 1 + extend);
    const trajectory: number[][] = IntersectionReferenceSystem.toDisplacement(traj.points, traj.offset);
    const geolayerdata: SurfaceData = generateSurfaceData(trajectory, stratColumns, surfaces);

    geoModelLayer.referenceSystem = referenceSystem;
    geoModelLabelsLayer.referenceSystem = referenceSystem;
    geoModelLayer.setData(geolayerdata);
    geoModelLabelsLayer.setData(geolayerdata);
  });

  zoomHandler.setBounds([0, 1000], [0, 1000]);
  zoomHandler.adjustToSize(width, height);
  zoomHandler.zFactor = 1;
  zoomHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
  zoomHandler.enableTranslateExtent = false;
  zoomHandler.setViewport(1000, 1000, 5000);

  root.appendChild(
    createHelpText(
      'Low level interface for creating and displaying geo model (aka surfaces) with labels. The geo model layer is made using webGL and the labels using canvas.',
    ),
  );
  root.appendChild(container);
  root.appendChild(fpsLabel);

  return root;
};

export const GeoModelUsingHighLevelInterface = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();

  const options: GeomodelLayerOptions = { order: 1 };
  const geoModelLayer = new GeomodelLayerV2('webgl', options);

  Promise.all([getWellborePath(), getSurfaces(), getStratColumns(), getPositionLog()]).then((values) => {
    const [path, surfaces, stratColumns] = values;

    const referenceSystem = new IntersectionReferenceSystem(path);
    const displacement = referenceSystem.displacement || 1;
    const extend = 1000 / displacement;
    const steps = surfaces[0]?.data?.values?.length || 1;
    const traj = referenceSystem.getTrajectory(steps, 0, 1 + extend);
    const trajectory: number[][] = IntersectionReferenceSystem.toDisplacement(traj.points, traj.offset);
    const geolayerdata: SurfaceData = generateSurfaceData(trajectory, stratColumns, surfaces);

    geoModelLayer.setData(geolayerdata);
  });

  const controller = new Controller({ container, layers: [geoModelLayer] });

  controller.setBounds([0, 1000], [0, 1000]);
  controller.adjustToSize(width, height);
  controller.zoomPanHandler.zFactor = 1;
  controller.zoomPanHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
  controller.zoomPanHandler.enableTranslateExtent = false;
  controller.setViewport(1000, 1000, 5000);

  root.appendChild(createHelpText('High level interface for creating and displaying geo model (aka surfaces). This layer is made using webGL.'));
  root.appendChild(container);
  root.appendChild(fpsLabel);

  return root;
};

export const GeoModelWithLabelsUsingHighLevelInterface = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();

  const options: GeomodelLayerOptions = { order: 1 };
  const geoModelLayer = new GeomodelLayerV2('geomodels', options);
  geoModelLayer.onMount({ elm: container, height, width });

  const options2: LayerOptions = { order: 1 };
  const geoModelLabelsLayer = new GeomodelLabelsLayer('labels', options2);
  geoModelLabelsLayer.onMount({ elm: container });

  Promise.all([getWellborePath(), getSurfaces(), getStratColumns()]).then((values) => {
    const [path, surfaces, stratColumns] = values;

    const referenceSystem = new IntersectionReferenceSystem(path);
    const displacement = referenceSystem.displacement || 1;
    const extend = 1000 / displacement;
    const steps = surfaces[0]?.data?.values?.length || 1;
    const traj = referenceSystem.getTrajectory(steps, 0, 1 + extend);
    const trajectory: number[][] = IntersectionReferenceSystem.toDisplacement(traj.points, traj.offset);
    const geolayerdata: SurfaceData = generateSurfaceData(trajectory, stratColumns, surfaces);

    const controller = new Controller({ container, layers: [geoModelLayer, geoModelLabelsLayer] });

    controller.setReferenceSystem(referenceSystem);

    geoModelLayer.setData(geolayerdata);
    geoModelLabelsLayer.setData(geolayerdata);

    controller.setBounds([0, 1000], [0, 1000]);
    controller.adjustToSize(width, height);
    controller.zoomPanHandler.zFactor = 1;
    controller.zoomPanHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
    controller.zoomPanHandler.enableTranslateExtent = false;
    controller.setViewport(1000, 1000, 5000);
  });

  root.appendChild(
    createHelpText(
      'High level interface for creating and displaying geo model (aka surfaces) with labels. The geo model layer is made using webGL and the labels using canvas.',
    ),
  );
  root.appendChild(container);
  root.appendChild(fpsLabel);

  return root;
};

export const GeoModelCanvasUsingHighLevelInterface = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();

  const options: GeomodelLayerOptions = { order: 1 };
  const geoModelLayer = new GeomodelCanvasLayer('canvas', options);

  Promise.all([getWellborePath(), getSurfaces(), getStratColumns(), getPositionLog()]).then((values) => {
    const [path, surfaces, stratColumns] = values;

    const referenceSystem = new IntersectionReferenceSystem(path);
    const displacement = referenceSystem.displacement || 1;
    const extend = 1000 / displacement;
    const steps = surfaces[0]?.data?.values?.length || 1;
    const traj = referenceSystem.getTrajectory(steps, 0, 1 + extend);
    const trajectory: number[][] = IntersectionReferenceSystem.toDisplacement(traj.points, traj.offset);
    const geolayerdata: SurfaceData = generateSurfaceData(trajectory, stratColumns, surfaces);

    geoModelLayer.setData(geolayerdata);
  });

  const controller = new Controller({ container, layers: [geoModelLayer] });

  controller.setBounds([0, 1000], [0, 1000]);
  controller.adjustToSize(width, height);
  controller.zoomPanHandler.zFactor = 1;
  controller.zoomPanHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
  controller.zoomPanHandler.enableTranslateExtent = false;
  controller.setViewport(1000, 1000, 5000);

  root.appendChild(
    createHelpText(
      'High level interface for creating and displaying geo model (aka surfaces). This layer is made using plain HTML canvas. GeomodelLayer is preferred for rendering geo models if your browser supports WebGL.',
    ),
  );
  root.appendChild(container);
  root.appendChild(fpsLabel);

  return root;
};
