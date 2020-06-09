import { HoleSizeLayer, HoleSizeLayerOptions, OnRescaleEvent, ZoomPanHandler, IntersectionReferenceSystem, Controller } from '../../../src';
import { getWellborePath, getHolesize } from '../data';

import { createRootContainer, createLayerContainer, createFPSLabel, createHelpText } from '../utils';

const width: number = 700;
const height: number = 600;

export const HoleSizeLayerUsingLowLevelInterface = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  Promise.all([getWellborePath(), getHolesize()]).then((values) => {
    const [path, holesize] = values;
    const referenceSystem = new IntersectionReferenceSystem(path);

    const options: HoleSizeLayerOptions = {
      order: 1,
      referenceSystem,
    };
    const holeSizeLayer = new HoleSizeLayer('webgl', options);

    holeSizeLayer.onMount({ elm: container, height, width });

    holeSizeLayer.setData(holesize);

    const zoomHandler = new ZoomPanHandler(container, (event: OnRescaleEvent) => {
      holeSizeLayer.onRescale(event);
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

export const HoleSizeLayerUsingHighLevelInterface = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  Promise.all([getWellborePath(), getHolesize()]).then((values) => {
    const [path, holesize] = values;
    const referenceSystem = new IntersectionReferenceSystem(path);

    const options: HoleSizeLayerOptions = {
      order: 1,
      referenceSystem,
      data: holesize
    };
    const holeSizeLayer = new HoleSizeLayer('webgl', options);

    const controller = new Controller({ container, layers: [holeSizeLayer] });

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
