import {
  CementLayer,
  OnRescaleEvent,
  CementLayerOptions,
  ZoomPanHandler,
  IntersectionReferenceSystem,
  Controller,
  CementData,
  PixiRenderApplication,
} from '../../../src';
import { getWellborePath, getCasings, getCement, getHolesize } from '../data';

import { createRootContainer, createLayerContainer, createFPSLabel, createHelpText } from '../utils';

const width: number = 700;
const height: number = 600;

export const CementLayerUsingLowLevelInterface = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  Promise.all([getWellborePath(), getCement(), getCasings(), getHolesize()]).then(([wbp, cement, casings, holes]) => {
    const referenceSystem = new IntersectionReferenceSystem(wbp);

    const options: CementLayerOptions<CementData> = {
      order: 1,
      referenceSystem,
      data: { cement, casings, holes },
    };

    const pixiContext = new PixiRenderApplication();
    const cementLayer = new CementLayer(pixiContext, 'webgl', options);

    cementLayer.onMount({ elm: container, height, width });
    cementLayer.onUpdate({});

    const zoomHandler = new ZoomPanHandler(root, (event: OnRescaleEvent) => {
      cementLayer.onRescale(event);
    });

    zoomHandler.setBounds([0, 1000], [0, 1000]);
    zoomHandler.adjustToSize(width, height);
    zoomHandler.zFactor = 1;
    zoomHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
    zoomHandler.enableTranslateExtent = false;
    zoomHandler.setViewport(1000, 1000, 5000);
  });

  root.appendChild(createHelpText('Low level interface for creating and displaying cement. This layer is made using webGL.'));
  root.appendChild(container);
  root.appendChild(createFPSLabel());

  return root;
};

export const CementLayerUsingHighLevelInterface = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  Promise.all([getWellborePath(), getCement(), getCasings(), getHolesize()]).then(([wbp, cement, casings, holes]) => {
    const referenceSystem = new IntersectionReferenceSystem(wbp);

    const options: CementLayerOptions<CementData> = {
      order: 1,
      referenceSystem,
      data: { cement, casings, holes },
    };

    const pixiContext = new PixiRenderApplication();
    const cementLayer = new CementLayer(pixiContext, 'webgl', options);

    const controller = new Controller({ container, layers: [cementLayer] });

    controller.setBounds([0, 1000], [0, 1000]);
    controller.adjustToSize(width, height);
    controller.zoomPanHandler.zFactor = 1;
    controller.zoomPanHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
    controller.zoomPanHandler.enableTranslateExtent = false;
    controller.setViewport(1000, 1000, 5000);
  });

  root.appendChild(createHelpText('High level interface for creating and displaying cement. This layer is made using webGL.'));
  root.appendChild(container);
  root.appendChild(createFPSLabel());

  return root;
};
