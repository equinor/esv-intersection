import { HoleSizeLayer } from '../../../../src/layers/HoleSizeLayer';
import { HoleSize, HoleSizeLayerOptions, OnRescaleEvent } from '../../../../src/interfaces';
import { createRootContainer, createLayerContainer } from '../../utils';
import { ZoomPanHandler } from '../../../../src/control/ZoomPanHandler';
import { IntersectionReferenceSystem } from '../../../../src';

import { getWellborePath } from '../../data';

export const Holes = () => {
  const width = 400;
  const height = 800;
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  getWellborePath().then((data) => {
    const referenceSystem = new IntersectionReferenceSystem(data);

    const options: HoleSizeLayerOptions = {
      order: 1,
      referenceSystem,
    };
    const holeSizeLayer = new HoleSizeLayer('webgl', options);

    holeSizeLayer.onMount({ elm: container, height, width });
    holeSizeLayer.onUpdate({ elm: root, data: getData() });

    const zoomHandler = new ZoomPanHandler(root, (event: OnRescaleEvent) => {
      holeSizeLayer.onRescale(event);
    });
    zoomHandler.setBounds([0, 1000], [0, 1000]);
    zoomHandler.adjustToSize(width, height);
    zoomHandler.zFactor = 1;
    zoomHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
    zoomHandler.enableTranslateExtent = false;
    zoomHandler.setViewport(1000, 1000, 5000);
  });

  root.appendChild(container);

  return root;
};

export const HoleSizeLayerWithSampleData = () => {
  const width: number = 1280;
  const height: number = 1024;
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  getWellborePath().then((data) => {
    const referenceSystem = new IntersectionReferenceSystem(data);

    const options: HoleSizeLayerOptions = {
      order: 1,
      referenceSystem,
    };
    const holeSizeLayer = new HoleSizeLayer('webgl', options);

    holeSizeLayer.onMount({ elm: container, height, width });

    holeSizeLayer.onUpdate({ elm: root, data: getSampleDataData() });

    const zoomHandler = new ZoomPanHandler(root, (event: OnRescaleEvent) => {
      holeSizeLayer.onRescale(event);
    });
    zoomHandler.setBounds([0, 1000], [0, 1000]);
    zoomHandler.adjustToSize(width, height);
    zoomHandler.zFactor = 1;
    zoomHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
    zoomHandler.enableTranslateExtent = false;
    zoomHandler.setViewport(1000, 1000, 5000);
  });

  root.appendChild(container);

  return root;
};

const getSampleDataData = () => {
  const data: HoleSize[] = [
    { diameter: 36, start: 0, length: 100 },
    { diameter: 28, start: 100, length: 100 },
    { diameter: 34, start: 200, length: 300 },
    { diameter: 15, start: 500, length: 100 },
    { diameter: 10, start: 600, length: 600 },
    { diameter: 8.5, start: 1200, length: 600 },
    { diameter: 7.5, start: 1600, length: 600 },
  ];
  data.forEach((x) => (x.end = x.start + x.length));

  return data;
};

const getData = () => {
  const data: HoleSize[] = [
    { diameter: 30 + 0, start: 0, length: 50 },
    { diameter: 20 + 0, start: 50, length: 70 },
    { diameter: 30 + 0, start: 130, length: 150 },
    { diameter: 55 + 0, start: 280, length: 130 },
    { diameter: 25 + 0, start: 410, length: 150 },
    { diameter: 15 + 0, start: 560, length: 50 },
    { diameter: 10 + 0, start: 610, length: 50 },
    { diameter: 8 + 0, start: 660, length: 50 },
    { diameter: 6.5 + 0, start: 710, length: 50 },
  ];
  data.forEach((x) => (x.end = x.start + x.length));
  return data;
};
