import { WellborepathLayer, WellborepathLayerOptions, OnRescaleEvent, ZoomPanHandler, IntersectionReferenceSystem, Controller } from '../../../src';
import { getWellborePath } from '../data';

import { createRootContainer, createLayerContainer, createFPSLabel } from '../utils';

const width: number = 700;
const height: number = 600;

export const WellborepathUsingLowLevelInterface = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();

  getWellborePath().then((data) => {
    const referenceSystem = new IntersectionReferenceSystem(data);

    const options: WellborepathLayerOptions<[number,number][]> = {
      order: 1,
      strokeWidth: '2px',
      stroke: 'black',
      referenceSystem,
    };
    const wellborePathLayer = new WellborepathLayer('wellborepath', options);
    wellborePathLayer.onMount({ elm: container, width, height });

    const zoomHandler = new ZoomPanHandler(container, (event: OnRescaleEvent) => {
      wellborePathLayer.onRescale(event);
    });
    zoomHandler.setBounds([0, 1000], [0, 1000]);
    zoomHandler.adjustToSize(width, height);
    zoomHandler.setViewport(1000, 1000, 5000);

    root.appendChild(container);
    root.appendChild(fpsLabel);
  });

  return root;
};

export const WellborepathUsingHighLevelInterface = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();

  getWellborePath().then((data) => {
    const referenceSystem = new IntersectionReferenceSystem(data);

    const options: WellborepathLayerOptions<[number,number][]> = {
      order: 1,
      strokeWidth: '2px',
      stroke: 'black',
      referenceSystem,
    };
    const wellborePathLayer = new WellborepathLayer('wellborepath', options);

    const controller = new Controller({ container, layers: [wellborePathLayer] });
    controller.setBounds([0, 1000], [0, 1000]);
    controller.adjustToSize(width, height);
    controller.setViewport(1000, 1000, 5000);

    root.appendChild(container);
    root.appendChild(fpsLabel);
  });

  return root;
};
