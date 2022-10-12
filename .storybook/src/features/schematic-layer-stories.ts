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
  Completion,
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

    const CSDSVGList = {
      completionImage1:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xMCAwSDkwVjEwMEgxMFYwWiIgZmlsbD0iI0Q5RDlEOSIvPgo8cGF0aCBkPSJNMCAyNUgxMFY3NUgwVjI1WiIgZmlsbD0iI0I1QjJCMiIvPgo8cGF0aCBkPSJNNDUgMjVINTVWNzVINDVWMjVaIiBmaWxsPSIjQjVCMkIyIi8+CjxwYXRoIGQ9Ik05MCAyNUgxMDBWNzVIOTBWMjVaIiBmaWxsPSIjQjVCMkIyIi8+Cjwvc3ZnPgo=',
      completionImage2:
        'tubing1.svg', // Fetched from URL. Full URL with protocol and hostname is allowed.
      completionImage3:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xMCAwSDkwVjEwMEgxMFYwWiIgZmlsbD0iI0Q5RDlEOSIvPgo8cGF0aCBkPSJNMCAyNUgxMFY3NUgwVjI1WiIgZmlsbD0iI0I1QjJCMiIvPgo8cGF0aCBkPSJNNDUgMjVINTVWNzVINDVWMjVaIiBmaWxsPSIjQjVCMkIyIi8+CjxwYXRoIGQ9Ik0yNSA2NUgzMFY4MEgyNVY2NVoiIGZpbGw9IiMzMTMxMzEiLz4KPHBhdGggZD0iTTI1IDQySDMwVjU3SDI1VjQyWiIgZmlsbD0iIzMxMzEzMSIvPgo8cGF0aCBkPSJNMjUgMjFIMzBWMzZIMjVWMjFaIiBmaWxsPSIjMzEzMTMxIi8+CjxwYXRoIGQ9Ik03MCA2NEg3NVY3OUg3MFY2NFoiIGZpbGw9IiMzMTMxMzEiLz4KPHBhdGggZD0iTTcwIDQxSDc1VjU2SDcwVjQxWiIgZmlsbD0iIzMxMzEzMSIvPgo8cGF0aCBkPSJNNzAgMjBINzVWMzVINzBWMjBaIiBmaWxsPSIjMzEzMTMxIi8+CjxwYXRoIGQ9Ik05MCAyNUgxMDBWNzVIOTBWMjVaIiBmaWxsPSIjQjVCMkIyIi8+Cjwvc3ZnPgo='
    };

    const completionImages = [
      {
        kind: 'image',
        id: 'completion-svg-1',
        start: 5250,
        end: 5252,
        diameter: 8.5,
        imageKey: 'completionImage1',
      },
      {
        kind: 'image',
        id: 'completion-svg-2',
        start: 5252,
        end: 5274,
        diameter: 8.5,
        imageKey: 'completionImage2',
      },
      {
        kind: 'image',
        id: 'completion-svg-3',
        start: 5274,
        end: 5276,
        diameter: 8.5,
        imageKey: 'completionImage3',
      },
    ]

    const schematicData: SchematicData = { holeSizes, cements, casings, completion: [...completion, ...completionImages], plugAndAbandonment: [], images: {...CSDSVGList} }
    const options: SchematicLayerOptions<SchematicData> = {
      order: 2,
      referenceSystem,
      data: schematicData
    };
    const schematicLayer = new SchematicLayer(renderer, 'schematic-webgl-layer', options);

    const controller = new Controller({ container, layers: [schematicLayer] });

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
