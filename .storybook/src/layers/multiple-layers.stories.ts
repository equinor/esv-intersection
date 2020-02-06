import { scaleLinear } from 'd3-scale';
import GridLayer from '../../../src/layers/GridLayer';
import CanvasLayer from '../../../src/layers/CanvasLayer';
import { OnUpdateEvent, OnMountEvent } from '../../../src/interfaces';

const tshirtImg = require('../resources/tshirt.png');
const sweaterImg = require('../resources/sweater.png');

const width = 400;
const height = 500;

const xbounds = [0, 500];
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
  const tShirtLayer = new ImageLayer('tshirtimg', {
    order: 2,
    layerOpacity: 1,
  });
  const jacketLayer = new ImageLayer('jacketimg', {
    order: 3,
    layerOpacity: 1,
  });
  const ev = { elm: container };

  gridLayer.onMount(ev);
  tShirtLayer.onMount({ ...ev, url: tshirtImg });
  jacketLayer.onMount({ ...ev, url: sweaterImg });

  gridLayer.onUpdate(createEventObj(container));
  tShirtLayer.onUpdate(ev);
  jacketLayer.onUpdate(ev);

  const tShirtSlider = createSlider(tShirtLayer, ev);
  const jacketSlider = createSlider(jacketLayer, ev);

  root.appendChild(container);
  root.appendChild(createHelpText());
  root.appendChild(tShirtSlider);
  root.appendChild(jacketSlider);

  return root;
};

const createRootContainer = () => {
  const root = document.createElement('div');
  root.setAttribute('height', '700px');
  root.setAttribute('style', `display: flex;flex:1;flex-direction:column; width: ${width}px; background-color: white; padding: 12px;`);

  return root;
}

const createLayerContainer = () => {
  const container = document.createElement('div');
  container.className = 'layer-container';
  container.setAttribute(
    'style',
    `height: ${height}px; width: ${width}px;background-color: #eee;`,
  );
  container.setAttribute('height', `${height}`);
  container.setAttribute('width', `${width}`);

  return container;
}

const createHelpText = () => {
  const text = document.createElement('p');
  text.innerHTML ='set opacity of the images';
  return text;
}

/**
 * Creates an event object that contains the element and x- and y-scale
 * @param elm
 */
const createEventObj = (elm: any) => {
  const xscale = scaleLinear()
    .domain(xbounds)
    .range([0, 500]);
  const yscale = scaleLinear()
    .domain(ybounds)
    .range([0, 500]);

  return {
    xscale: xscale.copy(),
    yscale: yscale.copy(),
    elm,
  };
};

const createSlider = (layer: ImageLayer, event: OnUpdateEvent) => {
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.value = `${(layer.opacity as number) * 10}`;
  slider.min = '0';
  slider.max = '10';
  slider.setAttribute('style', `width:${width}px`);
  slider.oninput = () => {
    layer.opacity = parseInt(slider.value) / 10;
    layer.onUpdate(event);
  }
  return slider;
}

/**
 * Example of a custom layer
 */
class ImageLayer extends CanvasLayer {
  img: HTMLImageElement;

  onMount(event: OnMountEvent) {
    super.onMount(event);
    const img = document.createElement('img');
    img.src = event.url;
    this.img = img;
    this.isLoading = true;
  }

  onUpdate(event: OnUpdateEvent) {
    super.onUpdate(event);
    this.render();
  }
  render() {
    if (this.isLoading) {
      this.img.onload = () => {
        this.isLoading = false;
        this.ctx.drawImage(this.img, 10, 10, width, height);
      }
    } else {
      this.ctx.drawImage(this.img, 10, 10, width, height);
    }
  }
}
