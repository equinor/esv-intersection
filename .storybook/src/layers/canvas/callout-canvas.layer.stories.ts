import { scaleLinear } from 'd3-scale';

import { CalloutCanvasLayer } from '../../../../src/layers';
import { Annotation, OnRescaleEvent } from '../../../../src/interfaces';

import { createLayerContainer, createRootContainer } from '../../utils';

const annotations: Annotation[] = [
  {
    title: 'Heidur Top',
    label: '1234.3 m MD RKB',
    color: 'blue',
    group: 'strat-picks',
    pos: [150, 160],
  },
  {
    title: 'Balder Fm. Top',
    label: '1234.3 m MD RKB',
    color: 'blue',
    group: 'strat-picks',
    pos: [460, 110],
  },
  {
    title: 'Odin Fm. Top',
    label: '1234.3 m MD RKB',
    color: 'blue',
    group: 'strat-picks',
    pos: [350, 60],
  },
  {
    title: 'Loke Fm. 2.1 Top',
    label: '1234 m MD RKB',
    color: 'blue',
    group: 'strat-picks',
    pos: [40, 70],
  },
  {
    title: 'Balder Fm. 1.1 SB Top',
    label: '1234.7 m MD RKB',
    color: 'blue',
    group: 'strat-picks',
    pos: [200, 300],
  },
  {
    title: 'Balder Fm. 1.1 SB Base',
    label: '1234.59 m MD RKB',
    color: 'blue',
    group: 'strat-picks',
    pos: [115, 110],
  },
];

const margin = {
  top: 0,
  right: 40,
  bottom: 26,
  left: 0,
};

const xBounds: [number, number] = [0, 500];
const yBounds: [number, number] = [0, 500];

const xscale = scaleLinear().domain(xBounds).range([0, 500]);
const yscale = scaleLinear().domain(yBounds).range([0, 500]);

const width = 500;
const height = 500;

export const CalloutCanvas = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  const layer = new CalloutCanvasLayer('callout', { order: 1 });
  layer.onMount({ elm: container });
  layer.onUpdate({ data: annotations });
  layer.onRescale(createEventObj(container));

  root.appendChild(container);

  return root;
};

const createEventObj = (elm: any): OnRescaleEvent => {
  return {
    xScale: xscale.copy(),
    yScale: yscale.copy(),
    xBounds,
    yBounds,
    elm,
    annotations,
    isLeftToRight: true,
    margin,
    scale: 0,
    width,
    height,
  };
};
