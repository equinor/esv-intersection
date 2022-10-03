import {
  CompletionLayer,
  ZoomPanHandler,
  CompletionLayerOptions,
  OnRescaleEvent,
  IntersectionReferenceSystem,
  Controller,
  CompletionData,
  PixiRenderApplication,
} from '../../../src';
import { getWellborePath, getCompletion } from '../data';

import { createRootContainer, createLayerContainer, createFPSLabel, createHelpText } from '../utils';

const width: number = 700;
const height: number = 600;

export const CompletionLayerUsingLowLevelInterface = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();

  Promise.all([getWellborePath(), getCompletion()]).then((values) => {
    const [path, completion] = values;
    const referenceSystem = new IntersectionReferenceSystem(path);

    const options: CompletionLayerOptions<CompletionData[]> = {
      order: 1,
      referenceSystem,
    };
    const pixiContext = new PixiRenderApplication({ width, height });
    const completionLayer = new CompletionLayer(pixiContext, 'webgl', options);
    completionLayer.onMount({ elm: container, height, width });

    completionLayer.onUpdate({ data: completion });
    const zoomHandler = new ZoomPanHandler(container, (event: OnRescaleEvent) => {
      completionLayer.onRescale(event);
    });
    zoomHandler.setBounds([0, 1000], [0, 1000]);
    zoomHandler.adjustToSize(width, height);
    zoomHandler.zFactor = 1;
    zoomHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
    zoomHandler.enableTranslateExtent = false;
    zoomHandler.setViewport(1000, 1000, 5000);
  });

  root.appendChild(createHelpText('Low level interface for creating and displaying completion. This layer is made using webGL.'));
  root.appendChild(container);
  root.appendChild(fpsLabel);

  return root;
};

export const CompletionLayerUsingHighLevelInterface = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();

  Promise.all([getWellborePath(), getCompletion()]).then((values) => {
    const [path, completion] = values;
    const referenceSystem = new IntersectionReferenceSystem(path);

    const options: CompletionLayerOptions<CompletionData[]> = {
      order: 1,
      referenceSystem,
      data: completion,
    };

    const pixiContext = new PixiRenderApplication({ width, height });
    const completionLayer = new CompletionLayer(pixiContext, 'webgl', options);

    const controller = new Controller({ container, layers: [completionLayer] });

    controller.setBounds([0, 1000], [0, 1000]);
    controller.adjustToSize(width, height);
    controller.zoomPanHandler.zFactor = 1;
    controller.zoomPanHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
    controller.zoomPanHandler.enableTranslateExtent = false;
    controller.setViewport(1000, 1000, 5000);
  });

  root.appendChild(createHelpText('High level interface for creating and displaying completion. This layer is made using webGL.'));
  root.appendChild(container);
  root.appendChild(fpsLabel);

  return root;
};
