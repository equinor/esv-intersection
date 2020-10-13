import { IntersectionReferenceSystem, Controller } from '../../../src/control';
import {
  GridLayer,
  WellborepathLayer,
  GeomodelLayerV2,
  GeomodelLabelsLayer,
  Layer,
  SeismicCanvasLayer,
  HoleSizeLayer,
  CasingLayer,
  CompletionLayer,
  CementLayer,
  CalloutCanvasLayer,
} from '../../../src/layers';

import { createButtonContainer, createFPSLabel, createLayerContainer, createRootContainer, createHelpText } from '../utils';

import {
  generateSurfaceData,
  SurfaceData,
  getSeismicInfo,
  generateSeismicSliceImage,
  transformFormationData,
  getPicksData,
} from '../../../src/datautils';

//Data
import { seismicColorMap } from '../exampledata';

import { getCompletion, getSeismic, getSurfaces, getWellborePath, getStratColumns, getHolesize, getCasings, getCement, getPicks } from '../data';

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

const renderIntersection = (scaleOptions) => {
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
    const [path, completion, seismic, surfaces, stratColumns, casings, holesizes, cement, picks] = values;
    const referenceSystem = new IntersectionReferenceSystem(path);
    referenceSystem.offset = path[0][2]; // Offset should be md at start of path
    const displacement = referenceSystem.displacement || 1;
    const extend = 1000 / displacement;
    const steps = surfaces[0]?.data?.values?.length || 1;
    const traj = referenceSystem.getTrajectory(steps, 0, 1 + extend);
    const trajectory: number[][] = IntersectionReferenceSystem.toDisplacement(traj.points, traj.offset);
    const geolayerdata: SurfaceData = generateSurfaceData(trajectory, stratColumns, surfaces);
    const seismicInfo = getSeismicInfo(seismic, trajectory) || {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };

    const transformedPicksData = transformFormationData(picks, stratColumns);
    const picksData = getPicksData(transformedPicksData);

    // Instantiate layers
    const gridLayer = new GridLayer('grid', { majorColor: 'black', minorColor: 'gray', majorWidth: 0.5, minorWidth: 0.5, order: 1, referenceSystem });
    const geomodelLayer = new GeomodelLayerV2('geomodel', { order: 2, layerOpacity: 0.6 });
    const wellboreLayer = new WellborepathLayer('wellborepath', { order: 3, strokeWidth: '2px', stroke: 'red', referenceSystem });
    const holeSizeLayer = new HoleSizeLayer('holesize', { order: 4, data: holesizes, referenceSystem });
    const casingLayer = new CasingLayer('casing', { order: 5, data: casings, referenceSystem });
    const geomodelLabelsLayer = new GeomodelLabelsLayer('geomodellabels', { order: 3, data: geolayerdata });
    const seismicLayer = new SeismicCanvasLayer('seismic', { order: 1 });
    const completionLayer = new CompletionLayer('completion', { order: 4, data: completion, referenceSystem });
    const cementLayer = new CementLayer('cement', { order: 99, data: { cement, casings, holes: holesizes }, referenceSystem });
    const calloutLayer = new CalloutCanvasLayer('callout', { order: 100, data: picksData, referenceSystem });

    const layers = [
      gridLayer,
      geomodelLayer,
      wellboreLayer,
      geomodelLabelsLayer,
      seismicLayer,
      completionLayer,
      holeSizeLayer,
      casingLayer,
      cementLayer,
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

    controller.getLayer('geomodel').onUpdate({ data: geolayerdata });

    const seismicOptions = {
      x: seismicInfo.minX,
      y: seismicInfo.minTvdMsl,
      width: seismicInfo.maxX - seismicInfo.minX,
      height: seismicInfo.maxTvdMsl - seismicInfo.minTvdMsl,
    };

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
    const btnCasing = createButton(controller, casingLayer, 'Casing');
    const btnCompletion = createButton(controller, completionLayer, 'Completion');
    const btnCement = createButton(controller, cementLayer, 'Cement');
    const btnGeomodelLabels = createButton(controller, geomodelLabelsLayer, 'Geo model labels');
    const btnSeismic = createButton(controller, seismicLayer, 'Seismic');
    const btnPicks = createButton(controller, calloutLayer, 'Picks');
    const btnSetDataForCompletion = createSetLayerButton(cementLayer, casingLayer, cement, casings, holesizes);
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
    btnToggleContainer.appendChild(btnCasing);
    btnToggleContainer.appendChild(btnCompletion);
    btnToggleContainer.appendChild(btnCement);
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
const createButton = (manager: Controller, layer: Layer, title: string) => {
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

const createSetLayerButton = (cementLayer: any, casingLayer: any, cement: any, casings: any, holes: any) => {
  const btn = document.createElement('button');
  btn.innerHTML = `Update data for compl`;
  btn.setAttribute('style', 'width: 130px;height:32px;margin-top:12px;');
  btn.onclick = () => {
    const alterWBI = (c: any): any => {
      return { ...c, end: c.end += 15 };
    };
    casings[0] = alterWBI(casings[0]);
    holes[0] = alterWBI(holes[0]);
    cementLayer.setData({ cement, casings, holes });
    casingLayer.setData(casings);
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
