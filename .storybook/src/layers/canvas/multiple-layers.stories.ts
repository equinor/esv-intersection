import { scaleLinear } from 'd3-scale';
import { GridLayer, ImageLayer } from '../../../../src/layers';

import { createRootContainer, createLayerContainer, createHelpText, createSlider } from '../../utils';

const bgImg1 = require('../../resources/bg1.jpeg');
const bgImg2 = require('../../resources/bg2.jpg');

const width = 400;
const height = 500;

const xbounds = [0, 400];
const ybounds = [0, 500];

export const MultipleCanvasLayers = () => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  const gridLayer = new GridLayer('grid', {
    order: 1,
    layerOpacity: 0.5,
    majorColor: 'black',
    majorWidth: 2,
  });
  const backgroundLayer1 = new ImageLayer('bgimg1', {
    order: 2,
    layerOpacity: 1,
  });
  const backgroundLayer2 = new ImageLayer('bgimg2', {
    order: 3,
    layerOpacity: 1,
  });
  const ev = { elm: container, width, height };

  gridLayer.onMount(ev);
  backgroundLayer1.onMount({ ...ev, url: bgImg1 });
  backgroundLayer2.onMount({ ...ev, url: bgImg2 });

  gridLayer.onUpdate(createEventObj(container));
  backgroundLayer1.onUpdate(createEventObj(container));
  backgroundLayer2.onUpdate(createEventObj(container));

  const helpText = createHelpText('set opacity of the images');
  const bg1Slider = createSlider(backgroundLayer1, createEventObj(container), width);
  const bg2Slider = createSlider(backgroundLayer2, createEventObj(container), width);

  root.appendChild(container);
  root.appendChild(helpText);
  root.appendChild(bg1Slider);
  root.appendChild(bg2Slider);

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
