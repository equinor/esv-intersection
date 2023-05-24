import { SeismicCanvasLayer, ZoomPanHandler, OnRescaleEvent } from '../../../src';
import { generateProjectedTrajectory, getSeismicInfo, generateSeismicSliceImage, getSeismicOptions } from '../../../src/datautils';
import { getSeismic, getPositionLog } from '../data';
import { seismicColorMap } from '../exampledata';

import { createRootContainer, createLayerContainer, createFPSLabel } from '../utils';

const width: number = 700;
const height: number = 600;

export const SeismicUsingLowLevelInterface = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  Promise.all([getPositionLog(), getSeismic()]).then((values) => {
    const [poslog, seismic] = values;
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
        options: getSeismicOptions(seismicInfo),
      };
    });

    const zoomHandler = new ZoomPanHandler(container, (event: OnRescaleEvent) => {
      seismicLayer.onRescale(event);
    });
    zoomHandler.setBounds([0, width], [0, height]);
    zoomHandler.adjustToSize(width, height);
    zoomHandler.setViewport(width / 2, height / 2, width / 2);
  });

  root.appendChild(container);
  root.appendChild(createFPSLabel());

  return root;
};

export default {
  title: 'ESV Intersection/Features/Seismic',
  component: SeismicUsingLowLevelInterface,
};
