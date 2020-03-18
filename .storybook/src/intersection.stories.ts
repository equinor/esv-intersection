import { CurveInterpolator } from 'curve-interpolator';
import { WellborepathLayerOptions, Annotation, HoleSize, Casing } from '../../src/interfaces';
import { LayerManager, IntersectionReferenceSystem } from '../../src/control';
import {
  GridLayer,
  WellborepathLayer,
  CalloutCanvasLayer,
  ImageLayer,
  GeomodelLayer,
  HoleSizeLayer,
  CasingLayer,
  Layer,
  SeismicCanvasLayer,
  GeomodelLabelsLayer,
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
import poslog from './exampledata/poslog.json';
import stratColumn from './exampledata/stratcolumn.json';
import surfaceValues from './exampledata/surfaces.json';
import seismic from './exampledata/seismic.json';

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
import annotations from './exampledata/annotations';
import mockedWellborePath from './exampledata/wellborepathMock.json';

const trajectory: number[][] = generateProjectedTrajectory(poslog, 45);
const geolayerdata: SurfaceData = generateSurfaceData(trajectory, stratColumn, surfaceValues);
const seismicInfo = getSeismicInfo(seismic, trajectory);

const wellborePathCoords = [
  [50, 10 + 775],
  [50, 100 + 300 + 775],
  [50, 150 + 300 + 775],
  [70, 170 + 300 + 775],
  [100, 180 + 300 + 775],
  [125, 200 + 300 + 775],
  [150, 250 + 300 + 775],
  [150, 300 + 300 + 775],
  [160, 350 + 300 + 775],
  [170, 400 + 300 + 775],
  [195, 410 + 300 + 775],
  [215, 412 + 300 + 775],
  [240, 408 + 300 + 775],
  [280, 409 + 300 + 775],
  [310, 410 + 300 + 775],
  [350, 408 + 300 + 775],
  [400, 418 + 300 + 775],
  [450, 448 + 300 + 775],
  [470, 455 + 300 + 775],
  [477, 470 + 300 + 775],
  [490, 510 + 300 + 775],
  [492, 560 + 300 + 775],
  [494, 610 + 300 + 775],
  [496, 690 + 300 + 775],
];
const tension = 0.2;
const numPoints = 999;
const wbpInterp = new CurveInterpolator(wellborePathCoords, tension);
const wellborePath = wbpInterp.getPoints(numPoints);

const holeSizeData: HoleSize[] = [
  { start: 0, length: 400, diameter: 36 },
  { start: 400, length: 400, diameter: 22 },
  { start: 800, length: 700, diameter: 10 },
];
const casingData: Casing[] = [
  { start: 0, length: 100, diameter: 34, innerDiameter: 34 - 1, hasShoe: false },
  { start: 0, length: 250, diameter: 30, innerDiameter: 30 - 1, hasShoe: true },
  { start: 250, length: 350, diameter: 10, innerDiameter: 10 - 1, hasShoe: true },
  { start: 600, length: 400, diameter: 8, innerDiameter: 8 - 1, hasShoe: true },
  { start: 1000, length: 400, diameter: 7.5, innerDiameter: 7.5 - 1, hasShoe: true },
];

const xbounds: [number, number] = [0, 1000];
const ybounds: [number, number] = [0, 1000];

const xRange = 600;
const yRange = 500;

const width = 700;
const height = 600;

let image: ImageBitmap = null;

export const intersection = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const btnContainer = createButtonContainer(width);

  const scaleOptions = { xMin: xbounds[0], xMax: xbounds[1], yMin: ybounds[0], yMax: ybounds[1], height: yRange, width: xRange };
  const axisOptions = {
    xLabel: 'Displacement',
    yLabel: 'TVD MSL',
    unitOfMeasure: 'm',
  };

  const defaultOptions = {
    defaultIntersectionAngle: 135,
    tension: 0.75,
    arcDivisions: 2000,
    thresholdDirectionDist: 0.001,
  };

  const dataManager = new IntersectionReferenceSystem(poslog, defaultOptions);

  // Instantiate layers
  const gridLayer = new GridLayer('grid', { majorColor: 'black', minorColor: 'gray', majorWidth: 0.5, minorWidth: 0.5, order: 1 });
  const calloutLayer = new CalloutCanvasLayer('callout', { order: 4 });
  const geomodelLayer = new GeomodelLayer('geomodel', { order: 1, layerOpacity: 1 });
  const image1Layer = new ImageLayer('bg1Img', { order: 1, layerOpacity: 0.5 });
  const image2Layer = new ImageLayer('bg2Img', { order: 2, layerOpacity: 0.5 });
  const wellboreLayer = new WellborepathLayer('wellborepath', { order: 3, strokeWidth: '5px', stroke: 'red' });
  const holeSizeLayer = new HoleSizeLayer('holesize', { order: 1 });
  const casingLayer = new CasingLayer('casing', { order: 1 });
  const geomodelLabelsLayer = new GeomodelLabelsLayer('geomodellabels', { order: 3 });
  const seismicLayer = new SeismicCanvasLayer('seismic', { order: 1 });

  const manager = new LayerManager(container, scaleOptions, axisOptions);

  const sm = manager.scaleManager;

  manager
    .addLayer(gridLayer)
    .addLayer(wellboreLayer, { xScale: sm.xScale, yScale: sm.yScale, data: dataManager.projectedPath || mockedWellborePath })
    .addLayer(calloutLayer, { data: annotations })
    .addLayer(image1Layer, { url: bg1Img })
    .addLayer(image2Layer, { url: bg2Img })
    .addLayer(geomodelLayer, { data: geolayerdata })
    .addLayer(holeSizeLayer, { data: holeSizeData, wellborePath })
    .addLayer(casingLayer, { data: casingData, wellborePath })
    .addLayer(geomodelLabelsLayer, { data: geolayerdata, wellborePath })
    .addLayer(seismicLayer, {});

  const seismicOptions = {
    x: seismicInfo.minX,
    y: seismicInfo.minTvdMsl,
    width: seismicInfo.maxX - seismicInfo.minX,
    height: seismicInfo.maxTvdMsl - seismicInfo.minTvdMsl,
  };
  generateSeismicSliceImage(seismic, trajectory, seismicColorMap).then((seismicImage: ImageBitmap) => {
    image = seismicImage;
    seismicLayer.onUpdate({ image, options: seismicOptions });
  });

  manager.zoomPanHandler.setBounds(sm.xDomain as [number, number], sm.yDomain as [number, number]);
  manager.zoomPanHandler.adjustToSize(sm.xRange[1], sm.yRange[1]);
  manager.zoomPanHandler.setViewport(250, 550, 6000);

  const FPSLabel = createFPSLabel();

  const btnCallout = createButton(manager, calloutLayer, 'Callout', { data: annotations });
  const btnWellbore = createButton(manager, wellboreLayer, 'Wellbore', { data: dataManager.projectedPath });
  const btnImage1 = createButton(manager, image1Layer, 'Image 1', { url: bg1Img });
  const btnImage2 = createButton(manager, image2Layer, 'Image 2', { url: bg2Img });
  const btnGeomodel = createButton(manager, geomodelLayer, 'Geo model', { data: geolayerdata });
  const btnHoleSize = createButton(manager, holeSizeLayer, 'Hole size', { data: holeSizeData, wellborePath });
  const btnCasing = createButton(manager, casingLayer, 'Casing', { data: casingData, wellborePath });
  const btnGeomodelLabels = createButton(manager, geomodelLabelsLayer, 'Geo model labels', { data: geolayerdata });
  const btnSeismic = createButton(manager, seismicLayer, 'Seismic', {});

  btnContainer.appendChild(btnCallout);
  btnContainer.appendChild(btnWellbore);
  btnContainer.appendChild(btnImage1);
  btnContainer.appendChild(btnImage2);
  btnContainer.appendChild(btnGeomodel);
  btnContainer.appendChild(btnHoleSize);
  btnContainer.appendChild(btnCasing);
  btnContainer.appendChild(btnGeomodelLabels);
  btnContainer.appendChild(btnSeismic);

  root.appendChild(container);
  root.appendChild(btnContainer);
  root.appendChild(FPSLabel);

  return root;
};

/**
 * storybook helper button for toggling a layer on and off
 * @param manager
 * @param layer
 * @param title
 * @param additionalEventParams
 */
const createButton = (manager: LayerManager, layer: Layer, title: string, additionalEventParams: any) => {
  const btn = document.createElement('button');
  btn.innerHTML = `Toggle ${title}`;
  btn.setAttribute('style', 'width: 130px;height:32px;margin-top:12px;');
  let show = false;
  btn.onclick = () => {
    if (show) {
      manager.addLayer(layer, additionalEventParams);
    } else {
      manager.removeLayer(layer.id.toString());
    }
    show = !show;
  };
  return btn;
};
