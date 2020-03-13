import { WellborepathLayerOptions, Annotation, HoleSize, Casing } from '../../src/interfaces';
import { LayerManager } from '../../src/control';
import { GridLayer, WellborepathLayer, CalloutCanvasLayer, ImageLayer, GeomodelLayer, HoleSizeLayer, CasingLayer, Layer } from '../../src/layers';

import { createButtonContainer, createFPSLabel, createLayerContainer, createRootContainer } from './utils';

import { generateSurfaceData, generateProjectedTrajectory, SurfaceData } from '../../src/datautils';

export default {
  title: 'Intersection',
};

const bg1Img = require('./resources/bg1.jpeg');
const bg2Img = require('./resources/bg2.jpg');

//Data
import poslog from './exampledata/poslog.json';
import stratColumn from './exampledata/stratcolumn.json';
import surfaceValues from './exampledata/surfaces.json';

const trajectory: number[][] = generateProjectedTrajectory(poslog, 45);
const geolayerdata: SurfaceData = generateSurfaceData(trajectory, stratColumn, surfaceValues);

const annotations: Annotation[] = [
  {
    title: 'Heidur Top',
    md: 1234.3,
    tvd: 1234,
    mdUnit: 'm',
    depthReferencePoint: 'RKB',
    group: 'strat-picks',
    data: [150, 160],
  },
  {
    title: 'Balder Fm. Top',
    md: 1234.3,
    tvd: 1234,
    mdUnit: 'm',
    depthReferencePoint: 'RKB',
    group: 'strat-picks',
    data: [460, 110],
  },
  {
    title: 'Odin Fm. Top',
    md: 1234.3,
    tvd: 1234,
    mdUnit: 'm',
    depthReferencePoint: 'RKB',
    group: 'strat-picks',
    data: [350, 60],
  },
  {
    title: 'Loke Fm. 2.1 Top',
    md: 1234,
    tvd: 1234,
    mdUnit: 'm',
    depthReferencePoint: 'RKB',
    group: 'strat-picks',
    data: [40, 70],
  },
  {
    title: 'Balder Fm. 1.1 SB Top',
    md: 1234.7,
    tvd: 1234,
    mdUnit: 'm',
    depthReferencePoint: 'RKB',
    group: 'strat-picks',
    data: [200, 300],
  },
  {
    title: 'Balder Fm. 1.1 SB Base',
    md: 1234.59,
    tvd: 1234.75,
    mdUnit: 'm',
    depthReferencePoint: 'RKB',
    group: 'strat-picks',
    data: [115, 110],
  },
];

const margin = {
  top: 0,
  right: 40,
  bottom: 26,
  left: 0,
};

const wellborePath = [
  [30, 400],
  [40, 700],
  [45, 1000],
  [50, 1100],
  [55, 1400],
  [95, 1100],
  [115, 1100],
  [115, 1100],
  [120, 1100],
  [150, 1600],
  [200, 3000],
  [210, 2400],
  [300, 1500],
  [320, 1200],
  [340, 500],
  [350, 600],
  [360, 700],
  [370, 800],
  [375, 900],
  [400, 1000],
  [420, 1100],
  [440, 1100],
  [460, 1100],
  [490, 1100],
];

const holeSizeData: HoleSize[] = [
  { start: 0, length: 100, diameter: 36 },
  { start: 100, length: 400, diameter: 30 },
  { start: 500, length: 400, diameter: 28 },
];
const casingData: Casing[] = [
  { start: 0, length: 100, diameter: 34, innerDiameter: 34 - 1, hasShoe: false },
  { start: 0, length: 200, diameter: 32, innerDiameter: 32 - 1, hasShoe: true },
  { start: 200, length: 400, diameter: 10, innerDiameter: 10 - 1, hasShoe: true },
  { start: 600, length: 400, diameter: 8, innerDiameter: 8 - 1, hasShoe: true },
];

const xbounds: [number, number] = [0, 1000];
const ybounds: [number, number] = [0, 1000];

const xRange = 600;
const yRange = 500;

const width = 700;
const height = 600;

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

  // Instantiate and mount layers
  const gridLayer = createGridLayer();
  const wellboreLayer = createWellboreLayer();
  const calloutLayer = createCanvasCallout();
  const image1Layer = createImageLayer('bg1Img', 1);
  const image2Layer = createImageLayer('bg2Img', 2);
  const geomodelLayer = createGeomodelLayer('geomodel', 1);
  const holeSizeLayer = createHoleSizeLayer();
  const casingLayer = createCasingLayer();

  const manager = new LayerManager(container, scaleOptions, axisOptions);

  const sm = manager.scaleManager;

  manager
    .addLayer(gridLayer)
    .addLayer(wellboreLayer, { xScale: sm.xScale, yScale: sm.yScale, data: wellborePath })
    .addLayer(calloutLayer, { data: annotations })
    .addLayer(image1Layer, { url: bg1Img })
    .addLayer(image2Layer, { url: bg2Img })
    .addLayer(geomodelLayer, { data: geolayerdata })
    .addLayer(holeSizeLayer, { data: holeSizeData, wellborePath })
    .addLayer(casingLayer, { data: casingData, wellborePath });

  manager.zoomPanHandler.setBounds(sm.xDomain as [number, number], sm.yDomain as [number, number]);
  manager.zoomPanHandler.adjustToSize(sm.xRange[1], sm.yRange[1]);
  manager.zoomPanHandler.setViewport(250, 550, 600);

  const FPSLabel = createFPSLabel();

  const btnCallout = createButton(manager, calloutLayer, 'Callout', { data: annotations });
  const btnWellbore = createButton(manager, wellboreLayer, 'Wellbore', { data: wellborePath });
  const btnImage1 = createButton(manager, image1Layer, 'Image 1', { url: bg1Img });
  const btnImage2 = createButton(manager, image2Layer, 'Image 2', { url: bg2Img });
  const btnGeomodel = createButton(manager, geomodelLayer, 'Geo model', { data: geolayerdata });
  const btnHoleSize = createButton(manager, holeSizeLayer, 'Hole size', { data: holeSizeData, wellborePath });
  const btnCasing = createButton(manager, casingLayer, 'Casing', { data: casingData, wellborePath });

  btnContainer.appendChild(btnCallout);
  btnContainer.appendChild(btnWellbore);
  btnContainer.appendChild(btnImage1);
  btnContainer.appendChild(btnImage2);
  btnContainer.appendChild(btnGeomodel);
  btnContainer.appendChild(btnHoleSize);
  btnContainer.appendChild(btnCasing);

  root.appendChild(container);
  root.appendChild(btnContainer);
  root.appendChild(FPSLabel);

  return root;
};

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

const createGeomodelLayer = (id: string, zIndex: number) => {
  const layer = new GeomodelLayer(id, {
    order: zIndex,
    layerOpacity: 1,
  });

  return layer;
};

const createImageLayer = (id: string, zIndex: number) => {
  const layer = new ImageLayer(id, {
    order: zIndex,
    layerOpacity: 0.5,
  });

  return layer;
};

const createCanvasCallout = () => {
  const layer = new CalloutCanvasLayer('callout', { order: 4 });
  return layer;
};

const createWellboreLayer = () => {
  const options: WellborepathLayerOptions = {
    order: 3,
    strokeWidth: '5px',
    stroke: 'black',
  };
  const layer = new WellborepathLayer('wellborepath', options);

  return layer;
};

const createGridLayer = () => {
  const gridLayer = new GridLayer('grid', {
    majorColor: 'black',
    minorColor: 'gray',
    majorWidth: 0.5,
    minorWidth: 0.5,
    order: 1,
  });

  return gridLayer;
};

const createHoleSizeLayer = () => {
  const holesizeLayer = new HoleSizeLayer('holesize', { order: 1 });
  return holesizeLayer;
};

const createCasingLayer = () => {
  const casingLayer = new CasingLayer('casing', { order: 1 });
  return casingLayer;
};
