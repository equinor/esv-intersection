import { scaleLinear } from 'd3-scale';

import { CalloutCanvasLayer } from '../../../../src/layers';
import { Annotation } from '../../../../src/interfaces';

import { createLayerContainer, createRootContainer } from '../../utils';

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

const xbounds = [0, 500];
const ybounds = [0, 500];

const xscale = scaleLinear().domain(xbounds).range([0, 500]);
const yscale = scaleLinear().domain(ybounds).range([0, 500]);

const width = 500;
const height = 500;

export const CalloutCanvas = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  const layer = new CalloutCanvasLayer('callout', { order: 1 });
  layer.onMount(createEventObj(container));
  layer.onUpdate({ data: annotations });
  layer.onRescale(createEventObj(container));

  root.appendChild(container);

  return root;
};

const createEventObj = (elm: any) => {
  return {
    xScale: xscale.copy(),
    yScale: yscale.copy(),
    elm,
    annotations,
    isLeftToRight: true,
    margin,
    scale: 0,
    width,
    height,
  };
};
