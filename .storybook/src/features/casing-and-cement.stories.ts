import {
  CasingAndCementLayerOptions,
  CasingAndCementLayer,
  CasingAndCementData,
  IntersectionReferenceSystem,
  Controller,
  PixiRenderApplication,
} from '../../../src';

import { createRootContainer, createLayerContainer, createFPSLabel, createHelpText } from '../utils';

import { getWellborePath, getCasings, getCement, getHolesize } from '../data';

const width: number = 700;
const height: number = 600;

export const CasingAndCementInterface = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  Promise.all([getWellborePath(), getCement(), getCasings(), getHolesize()]).then(([wbp, cements, casings, holeSizes]) => {
    const referenceSystem = new IntersectionReferenceSystem(wbp);

    const options: CasingAndCementLayerOptions<CasingAndCementData> = {
      order: 1,
      referenceSystem,
    };
    const renderer = new PixiRenderApplication({ width, height });
    const casingLayer = new CasingAndCementLayer(renderer, 'webgl', options);

    const controller = new Controller({ container, layers: [casingLayer] });
    casingLayer.setData({ holeSizes, cements, casings });

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
