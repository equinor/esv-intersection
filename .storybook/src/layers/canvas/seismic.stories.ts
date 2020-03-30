import { scaleLinear } from 'd3-scale';
import { SeismicCanvasLayer } from '../../../../src/layers';

import { createRootContainer, createLayerContainer, createFPSLabel } from '../../utils';
import { generateProjectedTrajectory } from '../../../../src/datautils';
import { getSeismicInfo, generateSeismicSliceImage } from '../../../../src/datautils/seismicimage';

//Data
import poslog from '../../exampledata/poslog.json';
import seismic from '../../exampledata/seismic.json';
import { ZoomPanHandler } from '../../../../src/control/ZoomPanHandler';
import { OnRescaleEvent } from '../../../../src/interfaces';

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
const seismicColorMap2 = ['#00004c', '#000092', '#0000db', '#3131ff', '#9999ff', '#fdfdff', '#ff9999', '#ff3535', '#e60000', '#b30000', '#800000'];

const width = 400;
const height = 500;

const xbounds = [0, width];
const ybounds = [0, height];

export const Seismic = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  const seismicLayer = new SeismicCanvasLayer('seismic', {
    order: 2,
    layerOpacity: 1,
  });
  const ev = { elm: container, width, height };

  seismicLayer.onMount({ ...ev });
  const trajectory: number[][] = generateProjectedTrajectory(poslog, 45);
  const seismicInfo = getSeismicInfo(seismic, trajectory);
  generateSeismicSliceImage(seismic, trajectory, seismicColorMap).then((seismicImage: ImageBitmap) => {
    seismicLayer.data = {
      image: seismicImage,
      options: {
        x: seismicInfo.minX,
        y: seismicInfo.minTvdMsl,
        width: seismicInfo.maxX - seismicInfo.minX,
        height: seismicInfo.maxTvdMsl - seismicInfo.minTvdMsl,
      },
    };
  });

  const zoomHandler = new ZoomPanHandler(container, (event: OnRescaleEvent) => {
    seismicLayer.onRescale(event);
  });
  zoomHandler.setBounds([0, width], [0, height]);
  zoomHandler.adjustToSize(width, height);
  zoomHandler.setViewport(width / 2, height / 2, width / 2);

  root.appendChild(container);
  root.appendChild(createFPSLabel());

  return root;
};

/**
 * Creates an event object that contains the element and x- and y-scale
 * @param elm
 */
const createEventObj = (elm: any) => {
  const xscale = scaleLinear().domain(xbounds).range([0, 400]);
  const yscale = scaleLinear().domain(ybounds).range([0, 500]);

  return {
    xScale: xscale.copy(),
    yScale: yscale.copy(),
    elm,
  };
};
