import { CasingLayer } from '../../../../src/layers/CasingLayer';
import { Casing, OnRescaleEvent, CasingLayerOptions } from '../../../../src/interfaces';

import { ZoomPanHandler } from '../../../../src/control/ZoomPanHandler';
import { createRootContainer, createLayerContainer } from '../../utils';
import { IntersectionReferenceSystem } from '../../../../src';

import { getWellborePath } from '../../data';

export const CasingLayerBasic = () => {
  const width = 400;
  const height = 800;
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  getWellborePath().then((data) => {
    const referenceSystem = new IntersectionReferenceSystem(data);

    const options: CasingLayerOptions = {
      order: 1,
      referenceSystem,
    };
    const casingLayer = new CasingLayer('webgl', options);

    casingLayer.onMount({ elm: root, height, width });

    casingLayer.onUpdate({ elm: root, data: getData() });

    const zoomHandler = new ZoomPanHandler(root, (event: OnRescaleEvent) => {
      casingLayer.onRescale(event);
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

export const CasingLayerWithSampleData = () => {
  const width: number = 1280;
  const height: number = 1024;
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  getWellborePath().then((data) => {
    const referenceSystem = new IntersectionReferenceSystem(data);

    const options: CasingLayerOptions = {
      order: 1,
      referenceSystem,
    };
    const casingLayer = new CasingLayer('webgl', options);

    casingLayer.onMount({ elm: root, height, width });
    casingLayer.onUpdate({
      elm: root,
      data: getSampleDataData(),
    });

    const zoomHandler = new ZoomPanHandler(root, (event: OnRescaleEvent) => {
      casingLayer.onRescale(event);
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

const getData = () => {
  const data: Casing[] = [
    { diameter: 30 + 0, innerDiameter: 29, start: 0, length: 50, hasShoe: true },
    { diameter: 20 + 0, innerDiameter: 19, start: 50, length: 70, hasShoe: true },
    { diameter: 30 + 0, innerDiameter: 29, start: 120, length: 150, hasShoe: false },
    { diameter: 55 + 0, innerDiameter: 52, start: 270, length: 130, hasShoe: true },
    { diameter: 25 + 0, innerDiameter: 20, start: 400, length: 150, hasShoe: false },
    { diameter: 15 + 0, innerDiameter: 13, start: 550, length: 50, hasShoe: false },
    { diameter: 10 + 0, innerDiameter: 8, start: 600, length: 50, hasShoe: true },
    { diameter: 8 + 0, innerDiameter: 7, start: 650, length: 50, hasShoe: true },
    { diameter: 6.5 + 0, innerDiameter: 2, start: 700, length: 50, hasShoe: true },
  ];
  data.forEach((x) => (x.end = x.start + x.length));
  return data;
};

const getSampleDataData = () => {
  const data: Casing[] = [
    { diameter: 30, start: 0, length: 500, hasShoe: false, innerDiameter: 30 - 1 },
    { diameter: 29, start: 500, length: 500, hasShoe: false, innerDiameter: 29 - 1 },
    { diameter: 28, start: 1000, length: 500, hasShoe: true, innerDiameter: 28 - 1 },
    { diameter: 26, start: 1500, length: 500, hasShoe: true, innerDiameter: 26 - 1 },
    { diameter: 20, start: 2000, length: 500, hasShoe: true, innerDiameter: 20 - 1 },
    { diameter: 18, start: 2500, length: 500, hasShoe: true, innerDiameter: 18 - 1 },
    { diameter: 16, start: 3000, length: 500, hasShoe: true, innerDiameter: 16 - 1 },
    { diameter: 10, start: 3500, length: 500, hasShoe: true, innerDiameter: 10 - 1 },
  ];
  data.forEach((x) => (x.end = x.start + x.length));
  return data;
};
