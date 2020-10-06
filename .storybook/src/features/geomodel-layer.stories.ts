import {
  Annotation,
  CalloutCanvasLayer,
  Controller,
  GeomodelLabelsLayer,
  GeomodelLayer,
  GeomodelLayerOptions,
  IntersectionReferenceSystem,
  LayerOptions,
  OnRescaleEvent,
  WellborepathLayer,
  ZoomPanHandler,
} from '../../../src';
import {convertColor, generateSurfaceData, SurfaceArea, SurfaceData, SurfaceLine} from '../../../src/datautils';
import {getPositionLog, getStratColumns, getSurfaces, getWellborePath} from '../data';

import {createFPSLabel, createHelpText, createLayerContainer, createRootContainer} from '../utils';

import pozoData from '../exampledata/POZO/intersection.json';
import pozoPosLog from '../exampledata/POZO/positionLog D-32.json';
import pozoPlannedWellMarkers from '../exampledata/POZO/plannedWellMarkers D-32.json';

const width = 700;
const height = 600;

export const GeoModelUsingLowLevelInterface = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();

  const options: GeomodelLayerOptions = {order: 1};
  const geoModelLayer = new GeomodelLayer('webgl', options);
  geoModelLayer.onMount({elm: container, height, width});

  Promise.all([getWellborePath(), getSurfaces(), getStratColumns(), getPositionLog()]).then((values) => {
    const [path, surfaces, stratColumns] = values;

    const referenceSystem = new IntersectionReferenceSystem(path);
    const displacement = referenceSystem.displacement || 1;
    const extend = 1000 / displacement;
    const steps = surfaces[0]?.data?.values?.length || 1;
    const traj = referenceSystem.getTrajectory(steps, 0, 1 + extend);
    const trajectory: number[][] = IntersectionReferenceSystem.toDisplacement(traj.points, traj.offset);
    const geolayerdata: SurfaceData = generateSurfaceData(trajectory, stratColumns, surfaces);

    geoModelLayer.onUpdate({data: geolayerdata});
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

  const options: GeomodelLayerOptions = {order: 1};
  const geoModelLayer = new GeomodelLayer('geomodels', options);
  geoModelLayer.onMount({elm: container, height, width});

  const options2: LayerOptions = {order: 1};
  const geoModelLabelsLayer = new GeomodelLabelsLayer('labels', options2);
  geoModelLabelsLayer.onMount({elm: container});

  const zoomHandler = new ZoomPanHandler(root, (event: OnRescaleEvent) => {
    geoModelLayer.onRescale(event);
    geoModelLabelsLayer.onRescale({...event});
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

    geoModelLayer.setData(geolayerdata);
    geoModelLabelsLayer.setData(geolayerdata);
    geoModelLayer.referenceSystem = referenceSystem;
    geoModelLabelsLayer.referenceSystem = referenceSystem;
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

  const options: GeomodelLayerOptions = {order: 1};
  const geoModelLayer = new GeomodelLayer('webgl', options);

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

  const controller = new Controller({container, layers: [geoModelLayer]});

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

  const options: GeomodelLayerOptions = {order: 1};
  const geoModelLayer = new GeomodelLayer('geomodels', options);
  geoModelLayer.onMount({elm: container, height, width});

  const options2: LayerOptions = {order: 1};
  const geoModelLabelsLayer = new GeomodelLabelsLayer('labels', options2);
  geoModelLabelsLayer.onMount({elm: container});

  Promise.all([getWellborePath(), getSurfaces(), getStratColumns()]).then((values) => {
    const [path, surfaces, stratColumns] = values;

    const referenceSystem = new IntersectionReferenceSystem(path);
    const displacement = referenceSystem.displacement || 1;
    const extend = 1000 / displacement;
    const steps = surfaces[0]?.data?.values?.length || 1;
    const traj = referenceSystem.getTrajectory(steps, 0, 1 + extend);
    const trajectory: number[][] = IntersectionReferenceSystem.toDisplacement(traj.points, traj.offset);
    const geolayerdata: SurfaceData = generateSurfaceData(trajectory, stratColumns, surfaces);

    geoModelLayer.setData(geolayerdata);
    geoModelLabelsLayer.setData(geolayerdata);

    const controller = new Controller({container, layers: [geoModelLayer, geoModelLabelsLayer]});

    controller.setReferenceSystem(referenceSystem);

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

export const GeoModelWithLabelsUsingPozoData = () => {
  const xBounds: [number, number] = [0, 1000];
  const yBounds: [number, number] = [0, 1000];

  const scaleOptions = {xBounds, yBounds};
  const axisOptions = {
    xLabel: 'Displacement',
    yLabel: 'TVD MSL',
    unitOfMeasure: 'm',
  };

  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();

  const referenceSystem = new IntersectionReferenceSystem(pozoPosLog.sort((a, b) => b.md - a.md).map((d) => [d.easting, d.northing, d.tvdMsl]));
  referenceSystem.offset = pozoPosLog[0].tvdMsl;

  const options: GeomodelLayerOptions = {order: 1};
  const geoModelLayer = new GeomodelLayer('geomodels', options);
  geoModelLayer.onMount({elm: container, height, width});

  const options2: LayerOptions = {order: 2};
  const geoModelLabelsLayer = new GeomodelLabelsLayer('labels', options2);
  geoModelLabelsLayer.onMount({elm: container});

  const wellboreLayer = new WellborepathLayer('wellborepath', {order: 3, strokeWidth: '2px', stroke: 'red'});

  const picksLayer = new CalloutCanvasLayer('picks', {order: 4});

  const lines: SurfaceLine[] = pozoData.lines.map((p) => ({
    id: p.label,
    label: p.label,
    width: 2,
    color: convertColor(p.color),
    data: p.data.map((d) => [d.xl, d.yt]),
  }));
  const areas: SurfaceArea[] = pozoData.areas
    .filter((p) => p.exclude == false)
    .map((p) => ({
      id: p.label,
      label: p.label,
      color: convertColor(p.color),
      data: p.data.map((d) => [d.xl, d.yt, d.yb]),
    }));

  const geolayerdata: SurfaceData = {
    lines,
    areas,
  };

  const datumElevation = 74.3;
  const picksdata: Annotation[] = pozoPlannedWellMarkers.map(m => ({
    title: m.markerName,
    label: Math.round((m.markerDepthMdMsl + datumElevation) * 10) / 10 + 'm MD RKB',
    md: m.markerDepthMdMsl + datumElevation,
    group: 'picks',
    color: 'black'
  }))

  const opts = {
    scaleOptions,
    axisOptions,
    container,
    referenceSystem,
    layers: [geoModelLayer, geoModelLabelsLayer, wellboreLayer, picksLayer],
  };

  const controller = new Controller(opts);
  controller.setReferenceSystem(referenceSystem);

  geoModelLayer.setData(geolayerdata);
  geoModelLabelsLayer.setData(geolayerdata);
  picksLayer.setData(picksdata);

  controller.adjustToSize(width, height);
  controller.zoomPanHandler.zFactor = 3;
  controller.zoomPanHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
  controller.zoomPanHandler.enableTranslateExtent = false;
  controller.setViewport(2250, 1400, 5000);

  root.appendChild(createHelpText('High level interface for creating and displaying geo model in dataformat used by POZO.'));
  root.appendChild(container);
  root.appendChild(fpsLabel);

  return root;
};
