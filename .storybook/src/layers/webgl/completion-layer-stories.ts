import { scaleLinear } from 'd3-scale';

import { CompletionLayer } from '../../../../src/layers/CompletionLayer';
import { ZoomPanHandler } from '../../../../src/control/ZoomPanHandler';
import { CompletionLayerOptions, OnUpdateEvent, LayerOptions, OnRescaleEvent } from '../../../../src/interfaces';
import { createRootContainer, createLayerContainer, createFPSLabel } from '../../utils';
import { generateSurfaceData, generateProjectedTrajectory, SurfaceLine, SurfaceData, generateProjectedWellborePath } from '../../../../src/datautils';

//Data
import poslog from '../../exampledata/poslog.json';

const wellborePath = generateProjectedWellborePath(poslog);

const width: number = 800;
const height: number = 600;

const xbounds: number[] = [0, 1000];
const ybounds: number[] = [0, 1000];

export const CompletionLayer = () => {
  const options: CompletionLayerOptions = { order: 1 };
  const completionLayer = new CompletionLayer('webgl', options);

  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  completionLayer.onMount({ elm: container, height, width });

  completionLayer.onUpdate(createEventObj(root, data: wellborePath));

  root.appendChild(container);

  return root;
};

const createEventObj = (elm: any, inputData?: any): OnUpdateEvent => {
  const xScale = scaleLinear()
    .domain(xbounds)
    .range([0, width]);
  const yScale = scaleLinear()
    .domain(ybounds)
    .range([0, height]);

  let event = {
    xScale: xScale.copy(),
    yScale: yScale.copy(),
    elm,
  };

  

  return event;
};

export const CompletionLayerWithSampleData = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();

  const options: CompletionLayerOptions = { order: 1 };
  const completionLayer = new CompletionLayer('webgl', options);
  completionLayer.onMount({ elm: container, height, width });

  completionLayer.onUpdate({ data });
  const zoomHandler = new ZoomPanHandler(container, (event: OnRescaleEvent) => {
    completionLayer.onRescale(event);
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
