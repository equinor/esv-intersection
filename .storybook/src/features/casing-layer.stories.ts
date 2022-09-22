import { CasingLayer, Casing, OnRescaleEvent, CasingLayerOptions, ZoomPanHandler, IntersectionReferenceSystem, Controller, PixiRenderApplication } from '../../../src/';

import { createRootContainer, createLayerContainer, createFPSLabel, createHelpText } from '../utils';

import { getWellborePath, getCasings } from '../data';

const width: number = 700;
const height: number = 600;

export const CasingUsingLowLevelInterface = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  Promise.all([getWellborePath(), getCasings()]).then((values) => {
    const [path, casings] = values;
    const referenceSystem = new IntersectionReferenceSystem(path);

    const options: CasingLayerOptions<Casing[]> = {
      order: 1,
      referenceSystem,
    };
    const renderer = new PixiRenderApplication();
    const casingLayer = new CasingLayer(renderer, 'webgl', options);

    casingLayer.onMount({ elm: container, height, width });
    casingLayer.onUpdate({
      data: casings,
    });

    const zoomHandler = new ZoomPanHandler(container, (event: OnRescaleEvent) => {
      casingLayer.onRescale(event);
    });
    zoomHandler.setBounds([0, 1000], [0, 1000]);
    zoomHandler.adjustToSize(width, height);
    zoomHandler.zFactor = 1;
    zoomHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
    zoomHandler.enableTranslateExtent = false;
    zoomHandler.setViewport(1000, 1000, 5000);
  });

  root.appendChild(createHelpText('Low level interface for creating and displaying casing. This layer is made using webGL.'));
  root.appendChild(container);
  root.appendChild(createFPSLabel());

  return root;
};

export const CasingUsingHighLevelInterface = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  Promise.all([getWellborePath(), getCasings()]).then((values) => {
    const [path, casings] = values;
    const referenceSystem = new IntersectionReferenceSystem(path);

    const options: CasingLayerOptions<Casing[]> = {
      order: 1,
      referenceSystem,
    };
    const renderer = new PixiRenderApplication();
    const casingLayer = new CasingLayer(renderer, 'webgl', options);


    const controller = new Controller({ container, layers: [casingLayer] });
    casingLayer.setData(casings);

    controller.setBounds([0, 1000], [0, 1000]);
    controller.adjustToSize(width, height);
    controller.zoomPanHandler.zFactor = 1;
    controller.zoomPanHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
    controller.zoomPanHandler.enableTranslateExtent = false;
    controller.setViewport(1000, 1000, 5000);
  });


  root.appendChild(createHelpText('High level interface for creating and displaying casing. This layer is made using webGL.'));
  root.appendChild(container);
  root.appendChild(createFPSLabel());

  return root;
};
