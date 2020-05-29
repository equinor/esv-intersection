import { WellborepathLayer } from '../../../../src/layers';
import { WellborepathLayerOptions, OnRescaleEvent } from '../../../../src/interfaces';
import { ZoomPanHandler } from '../../../../src/control/ZoomPanHandler';

import { createRootContainer, createLayerContainer, createFPSLabel } from '../../utils';

import { IntersectionReferenceSystem } from '../../../../src/control';

import { getWellborePath } from '../../data';

const width = 400;
const height = 500;

const createEventObj = (elm: any) => {
  return {
    elm,
  };
};

export const Wellborepath = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  getWellborePath().then((wbp) => {
    const referenceSystem = new IntersectionReferenceSystem(wbp);
    const options: WellborepathLayerOptions = {
      order: 1,
      strokeWidth: '2px',
      stroke: 'black',
      referenceSystem,
    };
    const layer = new WellborepathLayer('wellborepath', options);

    layer.onMount({ elm: container });
    layer.onUpdate(createEventObj(container));

    root.appendChild(container);

    return root;
  });
};

export const WellborepathWithSampleDataAndZoom = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();

  getWellborePath().then((data) => {
    const referenceSystem = new IntersectionReferenceSystem(data);

    const options: WellborepathLayerOptions = {
      order: 1,
      strokeWidth: '2px',
      stroke: 'black',
      referenceSystem,
    };
    const wellborePathLayer = new WellborepathLayer('wellborepath', options);
    wellborePathLayer.onMount({ elm: container, width, height });
    wellborePathLayer.onUpdate({ ...createEventObj(container) });

    const zoomHandler = new ZoomPanHandler(container, (event: OnRescaleEvent) => {
      wellborePathLayer.onRescale({ ...event });
    });
    zoomHandler.setBounds([0, 1000], [0, 1000]);
    zoomHandler.adjustToSize(width, height);
    zoomHandler.zFactor = 1;
    zoomHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
    zoomHandler.enableTranslateExtent = false;
    zoomHandler.setViewport(1000, 1000, 5000);

    root.appendChild(container);
    root.appendChild(fpsLabel);
  });

  return root;
};
