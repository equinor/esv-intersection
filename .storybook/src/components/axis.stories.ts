import { Axis } from '../../../src/components';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { ZoomPanHandler, OnRescaleEvent } from '../../../src';
import { createFPSLabel } from '../utils';

export default {
  title: 'Axis',
};

const width = 800;
const height = 600;

export const SingleAxis = () => {
  const div = document.createElement('div');
  div.setAttribute('style', `background-color: white; width: ${width}px;`);

  const svg = select(div).append('svg').attr('height', `${height}px`).attr('width', `${width}px`);

  const mainGroup = svg;
  const showLabels = true;

  const axis = new Axis(mainGroup, showLabels, 'Displacement', 'TVD MSL', 'm');
  const resizeEvent = { width, height };
  axis.onResize(resizeEvent);

  const zoomHandler = new ZoomPanHandler(div, (event: OnRescaleEvent) => {
    axis.onRescale(event);
  });
  zoomHandler.setBounds([0, 1000], [0, 1000]);
  zoomHandler.adjustToSize(width - 40, height - 30);

  div.appendChild(createFPSLabel());

  return div;
};
