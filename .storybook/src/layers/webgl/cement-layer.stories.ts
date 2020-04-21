import { CementLayer } from '../../../../src/layers/CementLayer';
import { Cement, OnRescaleEvent, CementLayerOptions } from '../../../../src/interfaces';

import { ZoomPanHandler } from '../../../../src/control/ZoomPanHandler';
import { createRootContainer, createLayerContainer } from '../../utils';
import { IntersectionReferenceSystem } from '../../../../src';

import { poslog, mockedWellborePath, casingData, holeSizeData, cementData } from '../../exampledata/exampledata';

const defaultOptions = {
  defaultIntersectionAngle: 135,
  tension: 0.75,
  arcDivisions: 5000,
  thresholdDirectionDist: 0.001,
};

export const CementLayerBasic = () => {
  const referenceSystem = new IntersectionReferenceSystem(poslog || mockedWellborePath, defaultOptions);

  const options: CementLayerOptions = {
    order: 1,
    referenceSystem,
  };
  const cementLayer = new CementLayer('webgl', options);

  const width = 400;
  const height = 800;

  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  cementLayer.onMount({ elm: root, height, width });

  cementLayer.onUpdate({ elm: root, data: getData() });

  const zoomHandler = new ZoomPanHandler(root, (event: OnRescaleEvent) => {
    cementLayer.onRescale(event);
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

// export const CementLayerWithSampleData = () => {
//   const referenceSystem = new IntersectionReferenceSystem(poslog || mockWellborePath, defaultOptions);

//   const options: CementLayerOptions = {
//     order: 1,
//     referenceSystem,
//   };
//   const cementLayer = new CementLayer('webgl', options);

//   const width: number = 1280;
//   const height: number = 1024;
//   const root = createRootContainer(width);
//   const container = createLayerContainer(width, height);

//   cementLayer.onMount({ elm: root, height, width });
//   cementLayer.onUpdate({
//     elm: root,
//     data: getSampleDataData(),
//   });

//   const zoomHandler = new ZoomPanHandler(root, (event: OnRescaleEvent) => {
//     cementLayer.onRescale(event);
//   });
//   zoomHandler.setBounds([0, 1000], [0, 1000]);
//   zoomHandler.adjustToSize(width, height);
//   zoomHandler.zFactor = 1;
//   zoomHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
//   zoomHandler.enableTranslateExtent = false;
//   zoomHandler.setViewport(1000, 1000, 5000);

//   root.appendChild(container);

//   return root;
// };

const getData = () => {
  // Cement requires data casing and holes to create cement width
  casingData.forEach((c: any) => {
    c.end = c.start + c.length;
    c.casingId = c.end;
  });
  holeSizeData.map((h) => (h.end = h.start + h.length));
  for (let i = 0; i < casingData.length; i++) {
    cementData[i].casingId = casingData[i].end;
  }
  return { cement: cementData, casings: casingData, holes: holeSizeData };
};

// const getSampleDataData = () => {
//   const data: Cement[] = [
//     { diameter: 30, start: 0, length: 500, hasShoe: false, innerDiameter: 30 - 1 },
//     { diameter: 29, start: 500, length: 500, hasShoe: false, innerDiameter: 29 - 1 },
//     { diameter: 28, start: 1000, length: 500, hasShoe: true, innerDiameter: 28 - 1 },
//     { diameter: 26, start: 1500, length: 500, hasShoe: true, innerDiameter: 26 - 1 },
//     { diameter: 20, start: 2000, length: 500, hasShoe: true, innerDiameter: 20 - 1 },
//     { diameter: 18, start: 2500, length: 500, hasShoe: true, innerDiameter: 18 - 1 },
//     { diameter: 16, start: 3000, length: 500, hasShoe: true, innerDiameter: 16 - 1 },
//     { diameter: 10, start: 3500, length: 500, hasShoe: true, innerDiameter: 10 - 1 },
//   ];
//   data.forEach((x) => (x.end = x.start + x.length));
//   return data;
// };
