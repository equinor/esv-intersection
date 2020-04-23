import { IntersectionReferenceSystem, Controller } from '../../src/control';
import {
  GridLayer,
  WellborepathLayer,
  CalloutCanvasLayer,
  ImageLayer,
  GeomodelLayer,
  GeomodelCanvasLayer,
  GeomodelLayerV2,
  GeomodelLabelsLayer,
  Layer,
  SeismicCanvasLayer,
  HoleSizeLayer,
  CasingLayer,
  CompletionLayer,
} from '../../src/layers';

import { createButtonContainer, createFPSLabel, createLayerContainer, createRootContainer } from './utils';

import { generateSurfaceData, generateProjectedTrajectory, SurfaceData } from '../../src/datautils';
import { getSeismicInfo, generateSeismicSliceImage } from '../../src/datautils/seismicimage';

export default {
  title: 'Intersection',
};

const bg1Img = require('./resources/bg1.jpeg');
const bg2Img = require('./resources/bg2.jpg');

//Data
import {
  casingData,
  completionData,
  holeSizeData,
  poslog,
  seismic,
  stratColumn,
  surfaceValues
} from './exampledata';

const seismicColorMap = [
  '#ffe700',
  '#ffdf00',
  '#ffd600',
  '#ffce00',
  '#ffc500',
  '#ffbc00',
  '#ffb400',
  '#ffab00',
  '#ffa200',
  '#ff9a00',
  '#ff9100',
  '#ff8900',
  '#ff8000',
  '#ff7700',
  '#ff6f00',
  '#ff6600',
  '#ff5e00',
  '#ff5500',
  '#f55400',
  '#ea5200',
  '#e05100',
  '#d55000',
  '#cb4e00',
  '#c04d00',
  '#b64b00',
  '#ab4a00',
  '#a14900',
  '#964700',
  '#8c4600',
  '#925213',
  '#975d25',
  '#9d6938',
  '#a2744a',
  '#a8805d',
  '#ad8b6f',
  '#b39782',
  '#b8a294',
  '#beaea7',
  '#c3b9b9',
  '#b7aeae',
  '#aaa2a2',
  '#9e9797',
  '#918b8b',
  '#858080',
  '#787474',
  '#6c6969',
  '#5f5d5d',
  '#535252',
  '#464646',
  '#404057',
  '#393968',
  '#333378',
  '#2d2d89',
  '#26269a',
  '#2020ab',
  '#1919bc',
  '#1313cd',
  '#0d0ddd',
  '#0606ee',
  '#0000ff',
  '#000cff',
  '#0018ff',
  '#0024ff',
  '#0030ff',
  '#003cff',
  '#0048ff',
  '#0054ff',
  '#0060ff',
  '#006cff',
  '#0078ff',
  '#0084ff',
  '#0090ff',
  '#009cff',
  '#00a8ff',
  '#00b4ff',
  '#00c0ff',
  '#00ccff',
  '#00d8ff',
  '#00e4ff',
  '#00f0ff',
];

const xbounds: [number, number] = [0, 1000];
const ybounds: [number, number] = [0, 1000];

const xRange = 600;
const yRange = 500;

const scaleOptions = { xMin: xbounds[0], xMax: xbounds[1], yMin: ybounds[0], yMax: ybounds[1], height: yRange, width: xRange };
const axisOptions = {
  xLabel: 'Displacement',
  yLabel: 'TVD MSL',
  unitOfMeasure: 'm',
};

const defaultOptions = {
  defaultIntersectionAngle: 135,
  tension: 0.75,
  arcDivisions: 5000,
  thresholdDirectionDist: 0.001,
};

const width = 700;
const height = 600;

let image: ImageBitmap = null;

export const intersection = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const btnContainer = createButtonContainer(width);

  const path = poslog.map((coords) => [coords.easting, coords.northing, coords.tvd]);

  const referenceSystem = new IntersectionReferenceSystem(path, defaultOptions);
  const displacement = referenceSystem.displacement;
  const extend = 1000 / displacement;
  const steps = surfaceValues[0].data.values.length;
  const traj = referenceSystem.getTrajectory(steps, 0, 1 + extend);
  const trajectory: number[][] = IntersectionReferenceSystem.toDisplacement(traj.points, traj.offset);
  const geolayerdata: SurfaceData = generateSurfaceData(trajectory, stratColumn, surfaceValues);
  const seismicInfo = getSeismicInfo(seismic, trajectory);
  const completion = completionData.map((c) => ({ start: c.mdTop, end: c.mdBottom, diameter: c.odMax })); //.filter(c => c.diameter != 0 && c.start > 0);

  // set wb offset in reference system
  generateProjectedWellborePath(referenceSystem.projectedPath);

  // Instantiate layers
  const gridLayer = new GridLayer('grid', { majorColor: 'black', minorColor: 'gray', majorWidth: 0.5, minorWidth: 0.5, order: 1, referenceSystem });
  // const calloutLayer = new CalloutCanvasLayer('callout', { order: 4 });
  const image1Layer = new ImageLayer('bg1Img', { order: 1, layerOpacity: 0.5 });
  const image2Layer = new ImageLayer('bg2Img', { order: 2, layerOpacity: 0.5 });
  const geomodelLayer = new GeomodelLayerV2('geomodel', { order: 2, layerOpacity: 0.8 });
  const wellboreLayer = new WellborepathLayer('wellborepath', { order: 3, strokeWidth: '2px', stroke: 'red', referenceSystem });
  const holeSizeLayer = new HoleSizeLayer('holesize', { order: 4, data: holeSizeData, referenceSystem });
  const casingLayer = new CasingLayer('casing', { order: 5, data: casingData, referenceSystem });
  const geomodelLabelsLayer = new GeomodelLabelsLayer('geomodellabels', { order: 3, data: geolayerdata });
  const seismicLayer = new SeismicCanvasLayer('seismic', { order: 1 });
  const completionLayer = new CompletionLayer('completion', { order: 5, data: completion, referenceSystem });

  const layers = [gridLayer, geomodelLayer, wellboreLayer, geomodelLabelsLayer, seismicLayer, completionLayer, holeSizeLayer, casingLayer];

  const opts = {
    scaleOptions,
    axisOptions,
    container,
    referenceSystem,
  };

  const controller = new Controller({ path, layers, ...opts });

  requestAnimationFrame(() => {
    addMDOverlay(controller);
  });

  // referenceSystem.offset = referenceSystem.project(0)[1];
  // const offset = controller.referenceSystem.displacement;
  // controller.setXAxisOffset(offset);
  // controller.axis.flipX(false);

  controller.getLayer('geomodel').onUpdate({ data: geolayerdata });

  // .addLayer(calloutLayer, { annotations })
  // .addLayer(image1Layer, { url: bg1Img })
  // .addLayer(image2Layer, { url: bg2Img })

  const seismicOptions = {
    x: seismicInfo.minX,
    y: seismicInfo.minTvdMsl,
    width: seismicInfo.maxX - seismicInfo.minX,
    height: seismicInfo.maxTvdMsl - seismicInfo.minTvdMsl,
  };

  generateSeismicSliceImage(seismic, trajectory, seismicColorMap).then((seismicImage: ImageBitmap) => {
    seismicLayer.data = { image: seismicImage, options: seismicOptions };
  });

  controller.adjustToSize(width, height);
  controller.setViewport(1000, 1500, 5000);

  const FPSLabel = createFPSLabel();

  const btnGrid = createButton(controller, gridLayer, 'Grid');
  // const btnCallout = createButton(manager, calloutLayer, 'Callout', { data: annotations });
  const btnWellbore = createButton(controller, wellboreLayer, 'Wellbore');
  // const btnImage1 = createButton(manager, image1Layer, 'Image 1', { url: bg1Img });
  // const btnImage2 = createButton(manager, image2Layer, 'Image 2', { url: bg2Img });
  const btnGeomodel = createButton(controller, geomodelLayer, 'Geo model');
  const btnHoleSize = createButton(controller, holeSizeLayer, 'Hole size');
  const btnCasing = createButton(controller, casingLayer, 'Casing');
  const btnCompletion = createButton(controller, completionLayer, 'Completion');
  const btnGeomodelLabels = createButton(controller, geomodelLabelsLayer, 'Geo model labels');
  const btnSeismic = createButton(controller, seismicLayer, 'Seismic');
  let show = true;
  const toggleAxis = createButtonWithCb('Toggle axis labels', () => {
    if (show) {
      controller.hideAxisLabels();
      show = false;
    } else {
      controller.showAxisLabels();
      show = true;
    }
  });
  const btnLarger = createButtonWithCb('800x600', () => {
    const w = 800;
    const h = 600;
    container.setAttribute('style', `height: ${h}px; width: ${w}px;background-color: #eee;`);
    container.setAttribute('height', `${h}`);
    container.setAttribute('width', `${w}`);
    controller.adjustToSize(w, h);
  });
  const btnSmaller = createButtonWithCb('600x400', () => {
    const w = 600;
    const h = 400;
    container.setAttribute('style', `height: ${h}px; width: ${w}px;background-color: #eee;`);
    container.setAttribute('height', `${h}`);
    container.setAttribute('width', `${w}`);
    controller.adjustToSize(w, h);
  });

  btnContainer.appendChild(btnGrid);
  // btnContainer.appendChild(btnCallout);
  btnContainer.appendChild(btnWellbore);
  // btnContainer.appendChild(btnImage1);
  // btnContainer.appendChild(btnImage2);
  btnContainer.appendChild(btnGeomodel);
  btnContainer.appendChild(btnHoleSize);
  btnContainer.appendChild(btnCasing);
  btnContainer.appendChild(btnCompletion);
  btnContainer.appendChild(btnGeomodelLabels);
  btnContainer.appendChild(btnSeismic);
  btnContainer.appendChild(btnLarger);
  btnContainer.appendChild(btnSmaller);
  btnContainer.appendChild(toggleAxis);

  root.appendChild(container);
  root.appendChild(btnContainer);
  root.appendChild(FPSLabel);

  return root;
};

function addMDOverlay(instance) {
  const elm = instance.overlay.create('md', {
    onMouseMove: (event) => {
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
    onMouseExit: (event) => {
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
}

const generateProjectedWellborePath = (projection: number[][]) => {
  const offset: number = projection[projection.length - 1][0];

  projection.forEach((p, i) => {
    projection[i][0] = offset - p[0];
  });

  return projection;
};

/**
 * storybook helper button for toggling a layer on and off
 * @param manager
 * @param layer
 * @param title
 * @param additionalEventParams
 */
const createButton = (manager: Controller, layer: Layer, title: string) => {
  const btn = document.createElement('button');
  btn.innerHTML = `Toggle ${title}`;
  btn.setAttribute('style', 'width: 130px;height:32px;margin-top:12px;');
  let show = false;
  btn.onclick = () => {
    if (show) {
      manager.showLayer(layer.id);
    } else {
      manager.hideLayer(layer.id);
    }
    show = !show;
  };
  return btn;
};

function createButtonWithCb(label: string, cb: any) {
  const btn = document.createElement('button');
  btn.innerHTML = label;
  btn.setAttribute('style', 'width: 130px;height:32px;margin-top:12px;');
  btn.onclick = cb;
  return btn;
}
