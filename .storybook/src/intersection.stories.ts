import { WellborepathLayerOptions, Annotation } from '../../src/interfaces';
import { LayerManager } from '../../src/control';
import { GridLayer, WellborepathLayer, CalloutCanvasLayer, ImageLayer, GeomodelLayer, GeomodelLabelsLayer, Layer, SeismicCanvasLayer } from '../../src/layers';

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

const seismicColorMap = ["#ffe700","#ffdf00","#ffd600","#ffce00","#ffc500","#ffbc00","#ffb400","#ffab00","#ffa200","#ff9a00","#ff9100","#ff8900","#ff8000","#ff7700","#ff6f00","#ff6600","#ff5e00","#ff5500","#f55400","#ea5200","#e05100","#d55000","#cb4e00","#c04d00","#b64b00","#ab4a00","#a14900","#964700","#8c4600","#925213","#975d25","#9d6938","#a2744a","#a8805d","#ad8b6f","#b39782","#b8a294","#beaea7","#c3b9b9","#b7aeae","#aaa2a2","#9e9797","#918b8b","#858080","#787474","#6c6969","#5f5d5d","#535252","#464646","#404057","#393968","#333378","#2d2d89","#26269a","#2020ab","#1919bc","#1313cd","#0d0ddd","#0606ee","#0000ff","#000cff","#0018ff","#0024ff","#0030ff","#003cff","#0048ff","#0054ff","#0060ff","#006cff","#0078ff","#0084ff","#0090ff","#009cff","#00a8ff","#00b4ff","#00c0ff","#00ccff","#00d8ff","#00e4ff","#00f0ff"];

const trajectory: number[][] = generateProjectedTrajectory(poslog, 45);
const geolayerdata: SurfaceData = generateSurfaceData(trajectory, stratColumn, surfaceValues);
const seismicInfo = getSeismicInfo(seismic, trajectory);


const annotations : Annotation[] = [
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
  [30, 40],
  [40, 70],
  [45, 100],
  [50, 110],
  [55, 140],
  [95, 110],
  [115, 110],
  [115, 110],
  [120, 110],
  [150, 160],
  [200, 300],
  [210, 240],
  [300, 150],
  [320, 120],
  [340, 50],
  [350, 60],
  [360, 70],
  [370, 80],
  [375, 90],
  [400, 100],
  [420, 110],
  [440, 110],
  [460, 110],
  [490, 110],
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

  // Instantiate and mount layers
  const gridLayer = createGridLayer();
  const wellboreLayer = createWellboreLayer();
  const calloutLayer = createCanvasCallout();
  const image1Layer = createImageLayer('bg1Img', 1);
  const image2Layer = createImageLayer( 'bg2Img', 2);
  const geomodelLayer = createGeomodelLayer('geomodel', 2);
  const geomodelLabelsLayer = new GeomodelLabelsLayer('geomodellabels', {order: 3});
  const seismicLayer =  new SeismicCanvasLayer('seismic', { order: 1 });

  const manager = new LayerManager(container, scaleOptions, axisOptions);

  const sm = manager.scaleManager;

  manager
    .addLayer(gridLayer)
    .addLayer(wellboreLayer, { xScale: sm.xScale, yScale: sm.yScale, data: wellborePath })
    .addLayer(calloutLayer, { data: annotations })
    .addLayer(image1Layer, { url: bg1Img })
    .addLayer(image2Layer, { url: bg2Img })
    .addLayer(geomodelLayer, { data: geolayerdata })
    .addLayer(geomodelLabelsLayer, { data: geolayerdata, wellborePath })
    .addLayer(seismicLayer, {});

  const seismicOptions = {x: seismicInfo.minX, y: seismicInfo.minTvdMsl, width: seismicInfo.maxX - seismicInfo.minX, height: seismicInfo.maxTvdMsl - seismicInfo.minTvdMsl }
  generateSeismicSliceImage(seismic, trajectory, seismicColorMap).then((seismicImage: ImageBitmap) => {
    image = seismicImage;
    seismicLayer.onUpdate({ image, options: seismicOptions });
  });

  manager.zoomPanHandler.setBounds(sm.xDomain as [number, number], sm.yDomain as [number, number]);
  manager.zoomPanHandler.adjustToSize(sm.xRange[1], sm.yRange[1]);
  manager.zoomPanHandler.setViewport(250, 550, 600);

  const FPSLabel = createFPSLabel();

  const btnCallout = createButton(manager, calloutLayer, 'Callout', { data: annotations });
  const btnWellbore = createButton(manager, wellboreLayer, 'Wellbore', { data: wellborePath });
  const btnImage1 = createButton(manager, image1Layer, 'Image 1', { url: bg1Img });
  const btnImage2 = createButton(manager, image2Layer, 'Image 2', { url: bg2Img });
  const btnGeomodel = createButton(manager, geomodelLayer, 'Geo model', { data: geolayerdata });
  const btnGeomodelLabels = createButton(manager, geomodelLabelsLayer, 'Geo model labels', { data: geolayerdata });
  const btnSeismic = createButton(manager, seismicLayer, 'Seismic');

  btnContainer.appendChild(btnCallout);
  btnContainer.appendChild(btnWellbore);
  btnContainer.appendChild(btnImage1);
  btnContainer.appendChild(btnImage2);
  btnContainer.appendChild(btnGeomodel);
  btnContainer.appendChild(btnGeomodelLabels);
  btnContainer.appendChild(btnSeismic);

  root.appendChild(container);
  root.appendChild(btnContainer);
  root.appendChild(FPSLabel);

  return root;
};

const createButton = (manager: LayerManager, layer: Layer, title: string, additionalEventParams?: any) => {
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
  const layer = new GeomodelLayer(id,
    {
      order: zIndex,
      layerOpacity: .8,
    });

  return layer;
}

const createImageLayer = (id: string, zIndex: number) => {
  const layer = new ImageLayer(id,
    {
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
