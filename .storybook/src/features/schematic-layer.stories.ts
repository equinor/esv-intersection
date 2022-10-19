import {
  IntersectionReferenceSystem,
  Controller,
  PixiRenderApplication,
  SchematicLayerOptions,
  SchematicData,
  SchematicLayer,
} from '../../../src';

import { createRootContainer, createLayerContainer, createFPSLabel, createHelpText } from '../utils';

import { getWellborePath, getCasings, getCement, getHolesize, getCompletion, getCementSqueezes } from '../data';

const width: number = 700;
const height: number = 600;

export const SchematicLayerUsingHighLevelInterface = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  Promise.all([getWellborePath(), getHolesize(), getCasings(), getCement(), getCompletion(), getCementSqueezes()]).then(
    ([wbp, holeSizes, casings, cements, completion, cementSqueezes]) => {
      const referenceSystem = new IntersectionReferenceSystem(wbp);
      referenceSystem.offset = wbp[0][2];
      const renderer = new PixiRenderApplication({ width, height });

      const CSDSVGs = {
        completionSymbol1:
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xMCAwSDkwVjEwMEgxMFYwWiIgZmlsbD0iI0Q5RDlEOSIvPgo8cGF0aCBkPSJNMCAyNUgxMFY3NUgwVjI1WiIgZmlsbD0iI0I1QjJCMiIvPgo8cGF0aCBkPSJNNDUgMjVINTVWNzVINDVWMjVaIiBmaWxsPSIjQjVCMkIyIi8+CjxwYXRoIGQ9Ik05MCAyNUgxMDBWNzVIOTBWMjVaIiBmaWxsPSIjQjVCMkIyIi8+Cjwvc3ZnPgo=',
        completionSymbol2: 'tubing1.svg', // Fetched from URL. Full URL with protocol and hostname is allowed.
        completionSymbol3:
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xMCAwSDkwVjEwMEgxMFYwWiIgZmlsbD0iI0Q5RDlEOSIvPgo8cGF0aCBkPSJNMCAyNUgxMFY3NUgwVjI1WiIgZmlsbD0iI0I1QjJCMiIvPgo8cGF0aCBkPSJNNDUgMjVINTVWNzVINDVWMjVaIiBmaWxsPSIjQjVCMkIyIi8+CjxwYXRoIGQ9Ik0yNSA2NUgzMFY4MEgyNVY2NVoiIGZpbGw9IiMzMTMxMzEiLz4KPHBhdGggZD0iTTI1IDQySDMwVjU3SDI1VjQyWiIgZmlsbD0iIzMxMzEzMSIvPgo8cGF0aCBkPSJNMjUgMjFIMzBWMzZIMjVWMjFaIiBmaWxsPSIjMzEzMTMxIi8+CjxwYXRoIGQ9Ik03MCA2NEg3NVY3OUg3MFY2NFoiIGZpbGw9IiMzMTMxMzEiLz4KPHBhdGggZD0iTTcwIDQxSDc1VjU2SDcwVjQxWiIgZmlsbD0iIzMxMzEzMSIvPgo8cGF0aCBkPSJNNzAgMjBINzVWMzVINzBWMjBaIiBmaWxsPSIjMzEzMTMxIi8+CjxwYXRoIGQ9Ik05MCAyNUgxMDBWNzVIOTBWMjVaIiBmaWxsPSIjQjVCMkIyIi8+Cjwvc3ZnPgo=',
      };

      const completionSymbols = [
        {
          kind: 'completion-symbol',
          id: 'completion-svg-1',
          start: 5250,
          end: 5252,
          diameter: 8.5,
          symbolKey: 'completionSymbol1',
        },
        {
          kind: 'completion-symbol',
          id: 'completion-svg-2',
          start: 5252,
          end: 5274,
          diameter: 8.5,
          symbolKey: 'completionSymbol2',
        },
        {
          kind: 'completion-symbol',
          id: 'completion-svg-3',
          start: 5274,
          end: 5276,
          diameter: 8.5,
          symbolKey: 'completionSymbol3',
        },
      ];

      const pAndASVGs = {
        mechanicalPlug:
          'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMSAxSDk5Vjk5SDFWMVoiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl81MF81KSIvPgo8cGF0aCBkPSJNMSAxSDk5Vjk5SDFWMVoiIGZpbGw9InVybCgjcGFpbnQxX2xpbmVhcl81MF81KSIgZmlsbC1vcGFjaXR5PSIwLjIiLz4KPHBhdGggZD0iTTEgMUg5OVY5OUgxVjFaIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiLz4KPGxpbmUgeDE9IjEuNzEwNzIiIHkxPSIxLjI5NjUzIiB4Mj0iOTguNzEwNyIgeTI9Ijk5LjI5NjUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIvPgo8bGluZSB4MT0iOTguNzA3MSIgeTE9IjAuNzA3MTA3IiB4Mj0iMC43MDcxIiB5Mj0iOTguNzA3MSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfNTBfNSIgeDE9IjAiIHkxPSI1MCIgeDI9IjUwIiB5Mj0iNTAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0NDMjYyNiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGRjQ3MUEiLz4KPC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDFfbGluZWFyXzUwXzUiIHgxPSI1MCIgeTE9IjUwIiB4Mj0iMTAwIiB5Mj0iNTAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0ZGNDcxQSIvPgo8c3RvcCBvZmZzZXQ9IjAuOTk5OSIgc3RvcC1jb2xvcj0iI0NDMjYyNiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGRjQ3MUEiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K',
      };

      const pAndASymbols = [
        {
          kind: 'pAndA-symbol' as const,
          id: 'mechanical-plug-1',
          start: 5100,
          end: 5110,
          diameter: 8.5,
          symbolKey: 'mechanicalPlug',
        },
        { kind: 'cementPlug' as const,
          id: 'cement-plug-2',
          top: 5000,
          bottom: 5110,
          casingId: '7',
        }
      ];

      const schematicData: SchematicData = {
        holeSizes,
        cements,
        casings,
        completion: [...completion, ...completionSymbols],
        pAndA: [...pAndASymbols, ...cementSqueezes],
        symbols: { ...CSDSVGs, ...pAndASVGs },
      };
      const options: SchematicLayerOptions<SchematicData> = {
        order: 2,
        referenceSystem,
      };
      const schematicLayer = new SchematicLayer(renderer, 'schematic-webgl-layer', options);

      const controller = new Controller({ container, layers: [schematicLayer] });

      schematicLayer.setData(schematicData);
      controller.setBounds([0, 1000], [0, 1000]);
      controller.adjustToSize(width, height);
      controller.zoomPanHandler.zFactor = 1;
      controller.zoomPanHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
      controller.zoomPanHandler.enableTranslateExtent = false;
      controller.setViewport(1000, 1000, 5000);
    },
  );

  root.appendChild(createHelpText('High level interface for creating and displaying a wellbore schematic. This layer is made using webGL.'));
  root.appendChild(container);
  root.appendChild(createFPSLabel());

  return root;
};
