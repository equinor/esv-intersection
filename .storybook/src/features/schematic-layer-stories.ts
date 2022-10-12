import {
  IntersectionReferenceSystem,
  Controller,
  PixiRenderApplication,
  SchematicLayerOptions,
  SchematicData,
  SchematicLayer,
  HoleSizeLayerOptions,
  HoleSize,
  HoleSizeLayer,
} from '../../../src';

import { createRootContainer, createLayerContainer, createFPSLabel, createHelpText } from '../utils';

import { getWellborePath, getCasings, getCement, getHolesize, getCompletion } from '../data';

const width: number = 700;
const height: number = 600;

export const SchematicLayerUsingLowLevelInterface = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  Promise.all([getWellborePath(), getHolesize(), getCasings(), getCement(), getCompletion() ]).then(([wbp, holeSizes, casings, cements, completion]) => {
    const referenceSystem = new IntersectionReferenceSystem(wbp);
    const renderer = new PixiRenderApplication({ width, height });

    const holeOptions: HoleSizeLayerOptions<HoleSize[]> = {
      order: 1,
      referenceSystem,
      data: holeSizes
    };
    const holeSizeLayer = new HoleSizeLayer(renderer, 'holesize-webgl', holeOptions);

    const schematicData: SchematicData = { holeSizes, cements, casings, completion }
    const options: SchematicLayerOptions<SchematicData> = {
      order: 2,
      referenceSystem,
      data: schematicData
    };
    const schematicLayer = new SchematicLayer(renderer, 'schematic-webgl-layer', options);

    const controller = new Controller({ container, layers: [holeSizeLayer, schematicLayer] });

    controller.setBounds([0, 1000], [0, 1000]);
    controller.adjustToSize(width, height);
    controller.zoomPanHandler.zFactor = 1;
    controller.zoomPanHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
    controller.zoomPanHandler.enableTranslateExtent = false;
    controller.setViewport(1000, 1000, 5000);
  });

  root.appendChild(createHelpText('High level interface for creating and displaying schematic. This layer is made using webGL.'));
  root.appendChild(container);
  root.appendChild(createFPSLabel());

  return root;
};
