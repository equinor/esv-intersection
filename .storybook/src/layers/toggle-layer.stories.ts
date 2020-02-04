import { scaleLinear } from 'd3-scale';
import GridLayer from '../../../src/layers/GridLayer';
import { OnUpdateEvent } from '../../../src/interfaces';

const width = 400;
const height = 500;

const xbounds = [0, 1000];
const ybounds = [0, 1000];


const createRootDiv = () => {
  const root = document.createElement('div');
  root.setAttribute('height', '700px');
  return root;
}

const createGridContainer = () => {
  const root = document.createElement('div');
  root.className = 'grid-container';
  root.setAttribute(
    'style',
    `height: ${height}px; width: ${width}px;background-color: #eee;position: relative;`,
  );
  root.setAttribute('height', `${height}`);
  root.setAttribute('width', `${width}`);
  return root;
}

/**
 * helper function to create a button that toggles a layer on and off
 * @param layer
 * @param root
 * @param event
 */
const createButton = (layer : GridLayer, root : HTMLElement, event : OnUpdateEvent) => {
  const btn = document.createElement('button');
  btn.innerHTML = 'Toggle layer';
  btn.setAttribute('style', 'width: 100px;height:32px;margin-top:12px;')
  let show = false;
  btn.onclick = () => {
    if (show) {
      layer.onMount({ elm: root });
      layer.onUpdate(event);
    } else {
      layer.onUnmount();
    }
    show = !show;
  }
  return btn;
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

export const ToggleCanvasLayer = () => {
  const root = createRootDiv();
  const container = createGridContainer();

  const gridLayer = new GridLayer('grid', {
    order: 1,
    majorColor: 'black',
    minorColor: 'black',
    majorWidth: 0.5,
    minorWidth: 0.5,
  });

  gridLayer.onMount({ elm: container });

  /**
   * .onUpdate(...) sets width and height of the canvas, currently .render() uses default dimensions (150, 300)
   */
  gridLayer.onUpdate(createEventObj(container));

  const btn = createButton(gridLayer, container, createEventObj(container));

  root.appendChild(container);
  root.appendChild(btn);

  return root;
};
