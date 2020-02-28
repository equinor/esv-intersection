import { scaleLinear } from 'd3-scale';
import { GridLayer, ImageLayer } from '../../../src/layers';
import { OnUpdateEvent } from '../../../src/interfaces';

const bgImg1 = require('../resources/bg1.jpeg');
const bgImg2 = require('../resources/bg2.jpg');

const width = 400;
const height = 500;

const xbounds = [0, 400];
const ybounds = [0, 500];

export const MultipleCanvasLayers = () => {
  const root = createRootContainer();
  const container = createLayerContainer();

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
  const ev = { elm: container };

  gridLayer.onMount(ev);
  backgroundLayer1.onMount({ ...ev, url: bgImg1 });
  backgroundLayer2.onMount({ ...ev, url: bgImg2 });

  gridLayer.onUpdate(createEventObj(container));
  backgroundLayer1.onUpdate(createEventObj(container));
  backgroundLayer2.onUpdate(createEventObj(container));

  const bg1Slider = createSlider(backgroundLayer1, createEventObj(container));
  const bg2Slider = createSlider(backgroundLayer2, createEventObj(container));

  root.appendChild(container);
  root.appendChild(createHelpText());
  root.appendChild(bg1Slider);
  root.appendChild(bg2Slider);

  return root;
};

const createRootContainer = () => {
  const root = document.createElement('div');
  root.setAttribute('height', '700px');
  root.setAttribute('style', `display: flex;flex:1;flex-direction:column; width: ${width}px; background-color: white; padding: 12px;`);

  return root;
};

const createLayerContainer = () => {
  const container = document.createElement('div');
  container.className = 'layer-container';
  container.setAttribute('style', `height: ${height}px; width: ${width}px;background-color: #eee;`);
  container.setAttribute('height', `${height}`);
  container.setAttribute('width', `${width}`);

  return container;
};

const createHelpText = () => {
  const text = document.createElement('p');
  text.innerHTML = 'set opacity of the images';
  return text;
};

/**
 * Creates an event object that contains the element and x- and y-scale
 * @param elm
 */
const createEventObj = (elm: any) => {
  const xscale = scaleLinear()
    .domain(xbounds)
    .range([0, 400]);
  const yscale = scaleLinear()
    .domain(ybounds)
    .range([0, 500]);

  return {
    xScale: xscale.copy(),
    yScale: yscale.copy(),
    elm,
  };
};

const createSlider = (layer: ImageLayer, event: OnUpdateEvent) => {
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.value = `${layer.opacity.valueOf() * 10}`;
  slider.min = '0';
  slider.max = '10';
  slider.setAttribute('style', `width:${width}px`);
  slider.oninput = () => {
    layer.opacity = parseInt(slider.value) / 10;
    layer.onUpdate(event);
  };
  return slider;
};
