import { CompletionLayer } from '../../../../src/layers/CompletionLayer';
import { ZoomPanHandler } from '../../../../src/control/ZoomPanHandler';
import { CompletionLayerOptions, OnRescaleEvent } from '../../../../src/interfaces';
import { createRootContainer, createLayerContainer, createFPSLabel } from '../../utils';
import { IntersectionReferenceSystem } from '../../../../src';

// Data
import { poslog, mockedWellborePath, completionData } from '../../exampledata/exampledata';

const defaultOptions = {
  defaultIntersectionAngle: 135,
  tension: 0.75,
  arcDivisions: 5000,
  thresholdDirectionDist: 0.001,
};

export const CompletionLayerSample = () => {
  const data = [
    { start: 500, end: 520, diameter: 6 },
    { start: 700, end: 720, diameter: 8 },
    { start: 790, end: 800, diameter: 12 },
  ];

  const referenceSystem = new IntersectionReferenceSystem(
    poslog.map((coords) => [coords.easting, coords.northing, coords.tvd]) || mockWellborePath,
    defaultOptions,
  );

  const options: CompletionLayerOptions = {
    order: 1,
    data,
    referenceSystem,
  };

  const completionLayer = new CompletionLayer('webgl', options);

  const width: number = 800;
  const height: number = 600;
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

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

  return root;
};

export const CompletionLayerWithSampleData = () => {
  const width: number = 800;
  const height: number = 600;
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();

  const referenceSystem = new IntersectionReferenceSystem(
    poslog.map((coords) => [coords.easting, coords.northing, coords.tvd]) || mockWellborePath,
    defaultOptions,
  );

  const options: CompletionLayerOptions = {
    order: 1,
    referenceSystem,
  };
  const completionLayer = new CompletionLayer('webgl', options);
  completionLayer.onMount({ elm: container, height, width });

  const data = completionData.map((c: any) => ({ start: c.mdTop, end: c.mdBottom, diameter: c.odMax })); //.filter((d: any) => d.start > 400 && d.end < 1800); //.filter(c => c.diameter != 0 && c.start > 0);

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
