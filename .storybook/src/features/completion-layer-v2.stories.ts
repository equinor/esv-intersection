import {
  CompletionLayerV2,
  ZoomPanHandler,
  CompletionLayerV2Options,
  OnRescaleEvent,
  IntersectionReferenceSystem,
  PixiRenderApplication,
  Completion,
} from '../../../src';
import { getWellborePath, getCompletionV2 } from '../data';

import { createRootContainer, createLayerContainer, createFPSLabel, createHelpText } from '../utils';

const width: number = 700;
const height: number = 600;

export const CompletionLayerV2Interface = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();

  Promise.all([getWellborePath(), getCompletionV2()]).then((values) => {
    const [path, completion] = values;
    const referenceSystem = new IntersectionReferenceSystem(path);

    const options: CompletionLayerV2Options<Completion[]> = {
      order: 1,
      referenceSystem,
    };
    const pixiContext = new PixiRenderApplication({ width, height });
    const completionLayer = new CompletionLayerV2(pixiContext, 'webgl', options);
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
    zoomHandler.rescale();
  });

  root.appendChild(createHelpText('Low level interface for creating and displaying completion. This layer is made using webGL.'));
  root.appendChild(container);
  root.appendChild(fpsLabel);

  return root;
};
