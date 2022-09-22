import { Axis } from '../../../src/components';
import { select, Selection } from 'd3-selection';
import { ZoomPanHandler, OnRescaleEvent, Controller } from '../../../src';
import { createFPSLabel, createRootContainer, createLayerContainer, createHelpText } from '../utils';
import { HORIZONTAL_AXIS_MARGIN, VERTICAL_AXIS_MARGIN } from '../../../src/constants';

const width = 500;
const height = 300;

export const AxisUsingLowLevelInterface = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  const mainGroup = (select(container).append('svg').attr('height', `${height}px`).attr('width', `${width}px`).style('background-color', '#eee') as unknown) as Selection<SVGElement, unknown, null, undefined>;
  const showLabels = true;

  const xLabel = 'x';
  const yLabel = 'y';
  const unitOfMeasure = 'm';

  const axis = new Axis(mainGroup, showLabels, xLabel, yLabel, unitOfMeasure);

  const zoomHandler = new ZoomPanHandler(container, (event: OnRescaleEvent) => {
    axis.onRescale(event);
  });

  // overrides the default bounds of [0, 1]
  zoomHandler.setBounds([0, 1000], [0, 1000]);
  // adjusts the dimensions of the axis
  zoomHandler.adjustToSize(width - HORIZONTAL_AXIS_MARGIN, height - VERTICAL_AXIS_MARGIN);

  root.appendChild(createHelpText('Low level interface for creating and displaying an axis, there is also a zoom and pan handler connected'));
  root.appendChild(container);
  root.appendChild(createFPSLabel());

  return root;
};

export const AxisUsingHighLevelInterface = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  // axisOptions passed into the controller when created is currently the only way to create the axis via the controller
  const axisOptions = { xLabel: 'x', yLabel: 'y', unitOfMeasure: 'm' };
  const controller = new Controller({ container, axisOptions });

  // overrides the default bounds of [0, 1]
  controller.setBounds([0, 1000], [0, 1000]);
  // displays the axis (and any other connected layers)
  controller.adjustToSize(width, height);

  root.appendChild(createHelpText('High level interface for creating and displaying an axis, there is also a zoom and pan handler connected'));
  root.appendChild(container);
  root.appendChild(createFPSLabel());

  return root;
};
