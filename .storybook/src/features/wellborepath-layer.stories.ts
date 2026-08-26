import { WellborepathLayer, WellborepathLayerOptions, OnRescaleEvent, ZoomPanHandler, IntersectionReferenceSystem, Controller } from '../../../src';
import { getWellborePath } from '../data';

import { createRootContainer, createLayerContainer, createFPSLabel } from '../utils';

const width: number = 800;
const height: number = 600;

export const WellborepathUsingLowLevelInterface = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();

  getWellborePath().then((data) => {
    const referenceSystem = new IntersectionReferenceSystem(data);

    const options: WellborepathLayerOptions<[number, number][]> = {
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
    zoomHandler.adjustToSize(width, height, false);
    zoomHandler.setViewport(2000, 2000, 7000);

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

    const options: WellborepathLayerOptions<[number, number][]> = {
      order: 1,
      strokeWidth: '2px',
      stroke: 'black',
      referenceSystem,
    };
    const wellborePathLayer = new WellborepathLayer('wellborepath', options);

    const controller = new Controller({ container, layers: [wellborePathLayer] });
    controller.setBounds([0, 1000], [0, 1000]);
    controller.adjustToSize(width, height);
    controller.setViewport(2000, 2000, 7000);

    root.appendChild(container);
    root.appendChild(fpsLabel);
  });

  return root;
};

export const WellborepathWithExtrapolation = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();

  getWellborePath().then((data) => {
    const referenceSystem = new IntersectionReferenceSystem(data);
    const projectedPath = referenceSystem.projectedPath as [number, number][];

    // Extend the trajectory linearly from the last segment to simulate an extrapolated tail.
    const extrapolatedPoints: [number, number][] = [];
    if (projectedPath.length >= 2) {
      const last = projectedPath[projectedPath.length - 1];
      const prev = projectedPath[projectedPath.length - 2];
      const dx = last[0] - prev[0];
      const dy = last[1] - prev[1];
      const steps = 30;
      const stepScale = 5;
      for (let i = 1; i <= steps; i++) {
        extrapolatedPoints.push([last[0] + dx * stepScale * i, last[1] + dy * stepScale * i]);
      }
    }

    const combined: [number, number][] = [...projectedPath, ...extrapolatedPoints];

    const options: WellborepathLayerOptions<[number, number][]> = {
      order: 1,
      strokeWidth: '2px',
      stroke: 'red',
      extrapolationStartIndex: projectedPath.length,
      extrapolatedStroke: '#000',
      extrapolatedStrokeWidth: '2px',
      extrapolatedOpacity: 1,
      extrapolatedStrokeDasharray: '6 4',
    };
    const wellborePathLayer = new WellborepathLayer('wellborepath', options);
    wellborePathLayer.setData(combined);

    const controller = new Controller({ container, layers: [wellborePathLayer] });
    controller.setBounds([0, 1000], [0, 1000]);
    controller.adjustToSize(width, height);
    controller.setViewport(3000, 3000, 10000);

    root.appendChild(container);
    root.appendChild(fpsLabel);
  });

  return root;
};

export default {
  title: 'ESV Intersection/Features/Wellborepath',
  component: WellborepathUsingLowLevelInterface,
};
