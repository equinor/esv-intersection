import { SeismicCanvasLayer } from '../../../../src/layers';

import { createRootContainer, createLayerContainer, createFPSLabel } from '../../utils';
import { generateProjectedTrajectory } from '../../../../src/datautils';
import { getSeismicInfo, generateSeismicSliceImage } from '../../../../src/datautils/seismicimage';

//Data
import { ZoomPanHandler } from '../../../../src/control/ZoomPanHandler';
import { OnRescaleEvent } from '../../../../src/interfaces';

import { getSeismic, getPositionLog } from '../../data';
import { seismicColorMap } from '../../exampledata';

const width = 400;
const height = 500;

export const Seismic = () => {
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
    const seismicInfo = getSeismicInfo(seismic, trajectory) || { x: 0, y: 0, width: 0, height: 0 };
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
  });

  root.appendChild(container);
  root.appendChild(createFPSLabel());

  return root;
};
