import { select } from 'd3-selection';
import { scaleLinear, ScaleLinear } from 'd3-scale';
import { OnUpdateEvent, WellborepathLayerOptions, Annotation } from '../../src/interfaces';
import { Axis } from '../../src/components';
import { ZoomPanHandler } from '../../src/control/ZoomPanHandler';
import { GridLayer, WellborepathLayer, CalloutCanvasLayer, ImageLayer } from '../../src/layers';

import { createButton, createButtonContainer, createFPSLabel, createLayerContainer, createRootContainer } from './utils';

export default {
  title: 'Intersection',
};

const bg1Img = require('./resources/bg1.jpeg');
const bg2Img = require('./resources/bg2.jpg');

const annotations: Annotation[] = [
  {
    title: 'Heidur Top',
    md: 1234.3,
    tvd: 1234,
    mdUnit: 'm',
    depthReferencePoint: 'RKB',
    group: 'strat-picks',
    data: [150, 160],
  },
  {
    title: 'Balder Fm. Top',
    md: 1234.3,
    tvd: 1234,
    mdUnit: 'm',
    depthReferencePoint: 'RKB',
    group: 'strat-picks',
    data: [460, 110],
  },
  {
    title: 'Odin Fm. Top',
    md: 1234.3,
    tvd: 1234,
    mdUnit: 'm',
    depthReferencePoint: 'RKB',
    group: 'strat-picks',
    data: [350, 60],
  },
  {
    title: 'Loke Fm. 2.1 Top',
    md: 1234,
    tvd: 1234,
    mdUnit: 'm',
    depthReferencePoint: 'RKB',
    group: 'strat-picks',
    data: [40, 70],
  },
  {
    title: 'Balder Fm. 1.1 SB Top',
    md: 1234.7,
    tvd: 1234,
    mdUnit: 'm',
    depthReferencePoint: 'RKB',
    group: 'strat-picks',
    data: [200, 300],
  },
  {
    title: 'Balder Fm. 1.1 SB Base',
    md: 1234.59,
    tvd: 1234.75,
    mdUnit: 'm',
    depthReferencePoint: 'RKB',
    group: 'strat-picks',
    data: [115, 110],
  },
];

const margin = {
  top: 0,
  right: 40,
  bottom: 26,
  left: 0,
};

const wellborePath = [
  [30, 40],
  [40, 70],
  [45, 100],
  [50, 110],
  [55, 140],
  [95, 110],
  [115, 110],
  [115, 110],
  [120, 110],
  [150, 160],
  [200, 300],
  [210, 240],
  [300, 150],
  [320, 120],
  [340, 50],
  [350, 60],
  [360, 70],
  [370, 80],
  [375, 90],
  [400, 100],
  [420, 110],
  [440, 110],
  [460, 110],
  [490, 110],
];

const xbounds: [number, number] = [0, 1000];
const ybounds: [number, number] = [0, 1000];

const xRange = 600;
const yRange = 500;

const width = 700;
const height = 600;

const createScale = (xMin: number, xMax: number, yMin: number, yMax: number, height: number, width: number) => {
  return [
    scaleLinear()
      .domain([xMin, xMax])
      .range([0, width]),
    scaleLinear()
      .domain([yMin, yMax])
      .range([0, height]),
  ];
};

export const intersection = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const btnContainer = createButtonContainer(width);

  const [scaleX, scaleY] = createScale(xbounds[0], xbounds[1], ybounds[0], ybounds[1], yRange, xRange);

  // Instantiate and mount layers
  const axis = createAxis(container, scaleX, scaleY);
  const gridLayer = createGridLayer(container);
  const wellboreLayer = createWellboreLayer(container);
  const calloutLayer = createCanvasCallout(container);
  const image1Layer = createImageLayer(container, 'bg1Img', bg1Img, 1);
  const image2Layer = createImageLayer(container, 'bg2Img', bg2Img, 2);

  wellboreLayer.onUpdate({
    xScale: scaleX,
    yScale: scaleY,
    data: wellborePath,
  });

  const zoomHandler = new ZoomPanHandler(container, (event: OnUpdateEvent) => {
    axis.onRescale(event);

    gridLayer.onUpdate(event);
    wellboreLayer.onRescale(event);
    calloutLayer.onUpdate({
      ...event,
      data: annotations,
      annotations,
      isLeftToRight: true,
      margin,
      scale: 0,
    });
    image1Layer.onUpdate({
      ...event,
      x: -50,
      y: -150,
    });
    image2Layer.onUpdate({
      ...event,
      x: -50,
      y: -150,
    });
  });

  zoomHandler.setBounds(xbounds, ybounds);
  zoomHandler.adjustToSize(xRange, yRange);
  zoomHandler.setViewport(250, 150, 600);

  const FPSLabel = createFPSLabel();

  const onMountEvent = {
    elm: container,
  };
  const imgParams = {
    margin,
    scale: 0,
    x: -50,
    y: -150,
  };

  const btnCallout = createButton(calloutLayer, zoomHandler, 'Callout', { annotations }, onMountEvent);
  const btnWellbore = createButton(wellboreLayer, zoomHandler, 'Wellbore', { data: wellborePath }, onMountEvent);
  const btnImage1 = createButton(image1Layer, zoomHandler, 'Image 1', { ...imgParams, url: bg1Img }, onMountEvent);
  const btnImage2 = createButton(image2Layer, zoomHandler, 'Image 2', { ...imgParams, url: bg2Img }, onMountEvent);

  btnContainer.appendChild(btnCallout);
  btnContainer.appendChild(btnWellbore);
  btnContainer.appendChild(btnImage1);
  btnContainer.appendChild(btnImage2);

  root.appendChild(container);
  root.appendChild(btnContainer);
  root.appendChild(FPSLabel);

  return root;
};

const createImageLayer = (container: HTMLElement, id: string, img: any, zIndex: number) => {
  const layer = new ImageLayer(id, {
    order: zIndex,
    layerOpacity: 0.5,
  });
  layer.onMount({
    elm: container,
    url: img,
  });

  return layer;
};

const createCanvasCallout = (container: HTMLElement) => {
  const layer = new CalloutCanvasLayer('callout', { order: 4 });
  layer.onMount({
    elm: container,
    annotations,
    isLeftToRight: true,
    margin,
    scale: 0,
  });

  return layer;
};

const createWellboreLayer = (container: HTMLElement) => {
  const options: WellborepathLayerOptions = {
    order: 3,
    strokeWidth: '5px',
    stroke: 'black',
  };
  const layer = new WellborepathLayer('wellborepath', options);

  layer.onMount({ elm: container });

  return layer;
};

const createGridLayer = (container: HTMLElement) => {
  const gridLayer = new GridLayer('grid', {
    majorColor: 'black',
    minorColor: 'gray',
    majorWidth: 0.5,
    minorWidth: 0.5,
    order: 1,
  });

  gridLayer.onMount({ elm: container });

  return gridLayer;
};

const createAxis = (container: HTMLElement, scaleX: ScaleLinear<number, number>, scaleY: ScaleLinear<number, number>) => {
  const svgContainer = document.createElement('div');
  svgContainer.setAttribute('style', 'position: absolute;');
  container.appendChild(svgContainer);

  const svg = select(svgContainer)
    .append('svg')
    .attr('height', `${height}px`)
    .attr('width', `${width}px`);

  const showLabels = true;

  const axis = new Axis(svg, scaleX, scaleY, showLabels, 'Displacement', 'TVD MSL', 'm');

  axis.render();

  return axis;
};
