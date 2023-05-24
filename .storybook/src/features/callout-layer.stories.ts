import { CalloutCanvasLayer, IntersectionReferenceSystem, WellborepathLayer, Controller, ZoomPanHandler } from '../../../src';
import { getPicks, getPositionLog, getStratColumns } from '../data';
import { getPicksData, transformFormationData } from '../../../src/datautils/picks';

import { createLayerContainer, createRootContainer, createFPSLabel, createHelpText } from '../utils';

const xBounds: [number, number] = [0, 500];
const yBounds: [number, number] = [0, 500];

const xRange = 500;
const yRange = 500;

const width = 500;
const height = 500;

export const CalloutUsingLowLevelInterface = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  Promise.all([getPositionLog(), getPicks(), getStratColumns()]).then((values) => {
    const [poslog, picks, stratcolumn] = values;

    const transformedData = transformFormationData(picks, stratcolumn);
    const rs = new IntersectionReferenceSystem(poslog.map((p: any) => [p.easting, p.northing, p.tvd]));
    const picksData = getPicksData(transformedData);

    const wp = new WellborepathLayer('path', { referenceSystem: rs, stroke: 'red', strokeWidth: '1' });
    const layer = new CalloutCanvasLayer('callout', { order: 1, referenceSystem: rs });
    layer.onMount({ elm: container });
    wp.onMount({ elm: container });
    layer.onUpdate({ data: picksData });
    const zoompanHandler = new ZoomPanHandler(container, (event) => {
      layer.onRescale(event);
      wp.onRescale(event);
    });

    zoompanHandler.setBounds(xBounds, yBounds);
    zoompanHandler.adjustToSize(xRange, yRange);
    zoompanHandler.setViewport(1500, 1500, 3000);
  });

  root.appendChild(
    createHelpText(
      'Low level interface for creating and displaying a callout layer. We have also added a wellbore path to show the picks along its path. This layer is made using canvas.',
    ),
  );
  root.appendChild(container);
  root.appendChild(createFPSLabel());

  return root;
};

export const CalloutUsingHighLevelInterface = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  Promise.all([getPositionLog(), getPicks(), getStratColumns()]).then((values) => {
    const [poslog, picks, stratcolumn] = values;

    const transformedData = transformFormationData(picks, stratcolumn);
    const rs = new IntersectionReferenceSystem(poslog.map((p: any) => [p.easting, p.northing, p.tvd]));
    const picksData = getPicksData(transformedData);

    const wp = new WellborepathLayer('path', { referenceSystem: rs, stroke: 'red', strokeWidth: '1' });
    const layer = new CalloutCanvasLayer('callout', { order: 1, data: picksData, referenceSystem: rs });

    const controller = new Controller({ container, referenceSystem: rs });
    controller.addLayer(wp);
    controller.addLayer(layer);

    controller.setBounds(xBounds, yBounds);
    controller.adjustToSize(xRange, yRange);
    controller.setViewport(1500, 1500, 3000);
  });

  root.appendChild(
    createHelpText(
      'High level interface for creating and displaying a callout layer. We have also added a wellbore path to show the picks along its path. This layer is made using canvas.',
    ),
  );
  root.appendChild(container);
  root.appendChild(createFPSLabel());

  return root;
};

export default {
  title: 'ESV Intersection/Features/Callout',
  component: CalloutUsingLowLevelInterface,
};
