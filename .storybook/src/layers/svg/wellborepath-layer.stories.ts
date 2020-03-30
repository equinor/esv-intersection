import { scaleLinear } from 'd3-scale';
import { WellborepathLayer } from '../../../../src/layers';
import { WellborepathLayerOptions, OnRescaleEvent } from '../../../../src/interfaces';
import { generateProjectedWellborePath } from '../../../../src/datautils/trajectory';
import { ZoomPanHandler } from '../../../../src/control/ZoomPanHandler';

import { createRootContainer, createLayerContainer, createFPSLabel } from '../../utils';

import poslog from '../../exampledata/poslog.json';

const width = 400;
const height = 500;
const xbounds = [0, 200];
const ybounds = [0, 200];

const createEventObj = (elm: any) => {
  const xscale = scaleLinear().domain(xbounds).range([0, width]);
  const yscale = scaleLinear().domain(ybounds).range([0, height]);
  const data = [
    [50, 0],
    [50, 10],
    [50, 20],
    [50, 30],
    [50, 40],
    [50, 50],
    [55, 60],
    [60, 70],
    [65, 80],
    [65, 90],
    [85, 100],
    [95, 110],
    [115, 110],
    [115, 110],
    [120, 110],
  ];

  return {
    xScale: xscale.copy(),
    yScale: yscale.copy(),
    elm,
    data,
  };
};

export const Wellborepath = () => {
  const options: WellborepathLayerOptions = {
    order: 1,
    strokeWidth: '5px',
    stroke: 'black',
  };
  const layer = new WellborepathLayer('wellborepath', options);

  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  layer.onMount({ elm: container });
  layer.onUpdate(createEventObj(container));

  root.appendChild(container);

  return root;
};

export const WellborepathWithSampleDataAndZoom = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();
  const wellborePath = generateProjectedWellborePath(poslog);

  const options: WellborepathLayerOptions = {
    order: 1,
    strokeWidth: '5px',
    stroke: 'black',
  };
  const wellborePathLayer = new WellborepathLayer('wellborepath', options);
  wellborePathLayer.onMount({ elm: container, width, height });
  wellborePathLayer.onUpdate({ ...createEventObj(container), data: wellborePath });

  const zoomHandler = new ZoomPanHandler(container, (event: OnRescaleEvent) => {
    wellborePathLayer.onRescale({ ...event, data: wellborePath });
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
