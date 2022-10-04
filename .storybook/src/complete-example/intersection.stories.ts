import { IntersectionReferenceSystem, Controller } from '../../../src/control';
import {
  GridLayer,
  WellborepathLayer,
  GeomodelLayerV2,
  GeomodelLabelsLayer,
  Layer,
  SeismicCanvasLayer,
  HoleSizeLayer,
  CalloutCanvasLayer,
  PixiRenderApplication,
  CompletionLayer,
} from '../../../src/layers';

import { createButtonContainer, createFPSLabel, createLayerContainer, createRootContainer, createHelpText } from '../utils';

import {
  generateSurfaceData,
  SurfaceData,
  getSeismicInfo,
  generateSeismicSliceImage,
  transformFormationData,
  getPicksData,
  getSeismicOptions,
} from '../../../src/datautils';

//Data
import { seismicColorMap } from '../exampledata';

import { getSeismic, getSurfaces, getWellborePath, getStratColumns, getHolesize, getCasings, getCement, getPicks, getCompletion } from '../data';
import { Annotation, CasingAndCementData, CasingAndCementLayer, Completion, HoleSize, ImageComponentLayer } from '../../../src';

export const intersection = () => {
  const xBounds: [number, number] = [0, 1000];
  const yBounds: [number, number] = [0, 1000];

  const scaleOptions = { xBounds, yBounds };

  return renderIntersection(scaleOptions);
};

export const intersectionFlipX = () => {
  const xBounds: [number, number] = [1000, 0];
  const yBounds: [number, number] = [0, 1000];

  const scaleOptions = { xBounds, yBounds };

  return renderIntersection(scaleOptions);
};

const renderIntersection = (scaleOptions: any) => {
  const axisOptions = {
    xLabel: 'Displacement',
    yLabel: 'TVD MSL',
    unitOfMeasure: 'm',
  };

  const width = 700;
  const height = 600;

  // helper container elements
  const root = createRootContainer(width);
  const btnToggleContainer = createButtonContainer(width);
  const btnAdjustSizeContainer = createButtonContainer(width);
  const btnMiscContainer = createButtonContainer(width);
  const container = createLayerContainer(width, height);

  const promises = [
    getWellborePath(),
    getCompletion(),
    getSeismic(),
    getSurfaces(),
    getStratColumns(),
    getCasings(),
    getHolesize(),
    getCement(),
    getPicks(),
  ];
  Promise.all(promises).then((values) => {
    const [path, completion, seismic, surfaces, stratColumns, casings, holeSizes, cement, picks] = values;
    const referenceSystem = new IntersectionReferenceSystem(path);
    referenceSystem.offset = path[0][2]; // Offset should be md at start of path
    const displacement = referenceSystem.displacement || 1;
    const extend = 1000 / displacement;
    const steps = surfaces[0]?.data?.values?.length || 1;
    const traj = referenceSystem.getTrajectory(steps, 0, 1 + extend);
    const trajectory: number[][] = IntersectionReferenceSystem.toDisplacement(traj.points, traj.offset);
    const geolayerdata: SurfaceData = generateSurfaceData(trajectory, stratColumns, surfaces);
    const seismicInfo = getSeismicInfo(seismic, trajectory);

    const transformedPicksData = transformFormationData(picks, stratColumns);
    const picksData = getPicksData(transformedPicksData);

    const pixiContext = new PixiRenderApplication({ width, height });

    // Instantiate layers
    const gridLayer = new GridLayer('grid', {
      majorColor: 'black',
      minorColor: 'gray',
      majorWidth: 0.5,
      minorWidth: 0.5,
      order: 1,
      referenceSystem,
    });
    const geomodelLayer = new GeomodelLayerV2<SurfaceData>(pixiContext, 'geomodel', { order: 2, layerOpacity: 0.6, data: geolayerdata });
    const wellboreLayer = new WellborepathLayer('wellborepath', { order: 3, strokeWidth: '2px', stroke: 'red', referenceSystem });
    const holeSizeLayer = new HoleSizeLayer<HoleSize[]>(pixiContext, 'holesize', { order: 4, data: holeSizes, referenceSystem });
    const geomodelLabelsLayer = new GeomodelLabelsLayer<SurfaceData>('geomodellabels', { order: 3, data: geolayerdata });
    const seismicLayer = new SeismicCanvasLayer('seismic', { order: 1 });
    const casingAndCementLayer = new CasingAndCementLayer<CasingAndCementData>(pixiContext, 'casingAndCement', {
      order: 5,
      data: {
        holeSizes,
        casings,
        cements: cement,
      },
      referenceSystem,
    });
    const completionLayer = new CompletionLayer<Completion[]>(pixiContext, 'completion', { order: 6, data: completion, referenceSystem });
    const calloutLayer = new CalloutCanvasLayer<Annotation[]>('callout', { order: 100, data: picksData, referenceSystem });


    const CSDSVGList = {
      completionImage1:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xMCAwSDkwVjEwMEgxMFYwWiIgZmlsbD0iI0Q5RDlEOSIvPgo8cGF0aCBkPSJNMCAyNUgxMFY3NUgwVjI1WiIgZmlsbD0iI0I1QjJCMiIvPgo8cGF0aCBkPSJNNDUgMjVINTVWNzVINDVWMjVaIiBmaWxsPSIjQjVCMkIyIi8+CjxwYXRoIGQ9Ik05MCAyNUgxMDBWNzVIOTBWMjVaIiBmaWxsPSIjQjVCMkIyIi8+Cjwvc3ZnPgo=',
      completionImage2:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwIDBIOTBWMTAwSDEwVjBaIiBmaWxsPSIjRDlEOUQ5Ii8+PC9zdmc+Cg==',
      completionImage3:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xMCAwSDkwVjEwMEgxMFYwWiIgZmlsbD0iI0Q5RDlEOSIvPgo8cGF0aCBkPSJNMCAyNUgxMFY3NUgwVjI1WiIgZmlsbD0iI0I1QjJCMiIvPgo8cGF0aCBkPSJNNDUgMjVINTVWNzVINDVWMjVaIiBmaWxsPSIjQjVCMkIyIi8+CjxwYXRoIGQ9Ik0yNSA2NUgzMFY4MEgyNVY2NVoiIGZpbGw9IiMzMTMxMzEiLz4KPHBhdGggZD0iTTI1IDQySDMwVjU3SDI1VjQyWiIgZmlsbD0iIzMxMzEzMSIvPgo8cGF0aCBkPSJNMjUgMjFIMzBWMzZIMjVWMjFaIiBmaWxsPSIjMzEzMTMxIi8+CjxwYXRoIGQ9Ik03MCA2NEg3NVY3OUg3MFY2NFoiIGZpbGw9IiMzMTMxMzEiLz4KPHBhdGggZD0iTTcwIDQxSDc1VjU2SDcwVjQxWiIgZmlsbD0iIzMxMzEzMSIvPgo8cGF0aCBkPSJNNzAgMjBINzVWMzVINzBWMjBaIiBmaWxsPSIjMzEzMTMxIi8+CjxwYXRoIGQ9Ik05MCAyNUgxMDBWNzVIOTBWMjVaIiBmaWxsPSIjQjVCMkIyIi8+Cjwvc3ZnPgo='
    };

    const imageComponentLayer = new ImageComponentLayer(pixiContext, 'svgcomponents', {
      order: 6,
      data: [
        {
          id: 'completion-svg-1',
          start: 5250,
          end: 5252,
          diameter: 8.5,
          imageKey: 'completionImage1',
        },
        {
          id: 'completion-svg-2',
          start: 5252,
          end: 5274,
          diameter: 8.5,
          imageKey: 'completionImage2',
        },
        {
          id: 'completion-svg-3',
          start: 5274,
          end: 5276,
          diameter: 8.5,
          imageKey: 'completionImage3',
        },
      ],
      images: CSDSVGList,
      referenceSystem,
    });

    const layers = [
      gridLayer,
      geomodelLayer,
      wellboreLayer,
      geomodelLabelsLayer,
      seismicLayer,
      holeSizeLayer,
      casingAndCementLayer,
      completionLayer,
      imageComponentLayer,
      calloutLayer,
    ];

    const opts = {
      scaleOptions,
      axisOptions,
      container,
      referenceSystem,
    };

    const controller = new Controller({ layers, ...opts });

    addMDOverlay(controller);

    const seismicOptions = getSeismicOptions(seismicInfo);

    generateSeismicSliceImage(seismic as any, trajectory, seismicColorMap).then((seismicImage: ImageBitmap) => {
      seismicLayer.setData({ image: seismicImage, options: seismicOptions });
    });

    controller.adjustToSize(width, height);
    controller.setViewport(1000, 1500, 5000);
    controller.zoomPanHandler.zFactor = 1;

    const FPSLabel = createFPSLabel();

    // toggle layers and axis
    const btnGrid = createButton(controller, gridLayer, 'Grid');
    const btnWellbore = createButton(controller, wellboreLayer, 'Wellbore');
    const btnGeomodel = createButton(controller, geomodelLayer, 'Geo model');
    const btnHoleSize = createButton(controller, holeSizeLayer, 'Hole size');
    const btnCompletion = createButton(controller, completionLayer, 'Completion');
    const btnCasingAndCement = createButton(controller, casingAndCementLayer, 'Casing & Cement');
    const btnGeomodelLabels = createButton(controller, geomodelLabelsLayer, 'Geo model labels');
    const btnSeismic = createButton(controller, seismicLayer, 'Seismic');
    const btnPicks = createButton(controller, calloutLayer, 'Picks');

    let show = true;
    const toggleAxis = createButtonWithCb(
      'Axis labels',
      (btn: HTMLElement) => {
        if (show) {
          controller.hideAxisLabels();
          btn.style.backgroundColor = 'red';
          btn.style.color = 'white';
          show = false;
        } else {
          controller.showAxisLabels();
          show = true;
          btn.style.backgroundColor = 'lightblue';
          btn.style.color = '';
        }
      },
      'background: lightblue;',
    );
    const btnLarger = createButtonWithCb('800x600', () => {
      const w = 800;
      const h = 600;
      container.setAttribute('style', `height: ${h}px; width: ${w}px;background-color: #eee;`);
      root.style.width = `${w}px`;
      btnAdjustSizeContainer.style.width = `${w}px`;
      btnToggleContainer.style.width = `${w}px`;
      controller.adjustToSize(w, h);
    });
    const btnSmaller = createButtonWithCb('600x400', () => {
      const w = 600;
      const h = 400;
      container.setAttribute('style', `height: ${h}px; width: ${w}px;background-color: #eee;`);
      root.style.width = `${w}px`;
      btnAdjustSizeContainer.style.width = `${w}px`;
      btnToggleContainer.style.width = `${w}px`;
      controller.adjustToSize(w, h);
    });
    const btnDefault = createButtonWithCb('Default', () => {
      container.setAttribute('style', `height: ${height}px; width: ${width}px;background-color: #eee;`);
      root.style.width = `${width}px`;
      btnAdjustSizeContainer.style.width = `${width}px`;
      btnToggleContainer.style.width = `${width}px`;
      controller.adjustToSize(width, height);
    });

    const btnClearData = createButtonWithCb('Clear everything', () => {
      controller.clearAllData();
    });

    btnToggleContainer.appendChild(btnGrid);
    btnToggleContainer.appendChild(btnWellbore);
    btnToggleContainer.appendChild(btnGeomodel);
    btnToggleContainer.appendChild(btnGeomodelLabels);
    btnToggleContainer.appendChild(btnSeismic);
    btnToggleContainer.appendChild(btnHoleSize);
    btnToggleContainer.appendChild(btnCompletion);
    btnToggleContainer.appendChild(btnCasingAndCement);
    btnToggleContainer.appendChild(btnPicks);
    btnToggleContainer.appendChild(toggleAxis);
    btnAdjustSizeContainer.appendChild(btnLarger);
    btnAdjustSizeContainer.appendChild(btnSmaller);
    btnAdjustSizeContainer.appendChild(btnDefault);
    btnMiscContainer.appendChild(btnClearData);

    root.appendChild(
      createHelpText(
        'A complete example of multiple layers comprised of SVG, Canvas, HTML and pixi.js (WebGL). We use a controller to update and display each layer in a container (just a plain div element) on top of each other.',
      ),
    );
    root.appendChild(container);
    root.appendChild(createHelpText('Toggle'));
    root.appendChild(btnToggleContainer);
    root.appendChild(createHelpText('Adjust size'));
    root.appendChild(btnAdjustSizeContainer);
    root.appendChild(createHelpText('Miscellaneous'));
    root.appendChild(btnMiscContainer);
    root.appendChild(FPSLabel);
  });

  return root;
};

function addMDOverlay(instance: any) {
  const elm = instance.overlay.create('md', {
    onMouseMove: (event: any) => {
      const { target, caller, x } = event;

      const newX = caller.currentStateAsEvent.xScale.invert(x);
      const { referenceSystem } = caller;

      const md = referenceSystem.unproject(newX);
      target.textContent = Number.isFinite(md) ? `MD: ${md.toFixed(1)}` : '-';
      if (md < 0 || referenceSystem.length < md) {
        target.style.visibility = 'hidden';
      } else {
        target.style.visibility = 'visible';
      }
    },
    onMouseExit: (event: any) => {
      event.target.style.visibility = 'hidden';
    },
  });
  elm.style.visibility = 'hidden';
  elm.style.display = 'inline-block';
  elm.style.padding = '2px';
  elm.style.borderRadius = '4px';
  elm.style.textAlign = 'right';
  elm.style.position = 'absolute';
  elm.style.backgroundColor = 'rgba(0,0,0,0.5)';
  elm.style.color = 'white';
  elm.style.right = '5px';
  elm.style.bottom = '5px';
  elm.style.zIndex = '100';
}

/**
 * storybook helper button for toggling a layer on and off
 * @param manager
 * @param layer
 * @param title
 * @param additionalEventParams
 */
const createButton = <T>(manager: Controller<T>, layer: Layer<T>, title: string) => {
  const btn = document.createElement('button');
  btn.innerHTML = `${title}`;
  btn.setAttribute('style', 'width: 170px;height:32px;margin-top:12px;background: lightblue;');
  let show = false;
  btn.onclick = () => {
    if (show) {
      manager.showLayer(layer.id);
      btn.style.backgroundColor = 'lightblue';
      btn.style.color = '';
    } else {
      manager.hideLayer(layer.id);
      btn.style.backgroundColor = 'red';
      btn.style.color = 'white';
    }
    show = !show;
  };
  return btn;
};

/**
 * helper method
 * @param label - button label
 * @param cb - callback function when clicking
 */
function createButtonWithCb(label: string, cb: any, initialStyle = '') {
  const btn = document.createElement('button');
  btn.innerHTML = label;
  btn.setAttribute('style', `${initialStyle}width: 170px;height:32px;margin-top:12px;`);
  // cb(btn);
  btn.onclick = () => cb(btn);
  return btn;
}
