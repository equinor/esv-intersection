import { scaleLinear } from 'd3-scale';
import GridLayer from '../../../src/layers/GridLayer';
import Layer from '../../../src/layers/Layer';
import { OnUpdateEvent, WellborepathLayerOptions } from '../../../src/interfaces';
import WellborepathLayer from '../../../src/layers/WellborePathLayer';

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
const createButton = (layer : Layer, root : HTMLElement, event : OnUpdateEvent, title: string) => {
  const btn = document.createElement('button');
  btn.innerHTML = `Toggle ${title}`;
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
    .range([0, width]);
  const yscale = scaleLinear()
    .domain(ybounds)
    .range([0, height]);
  const data = [
    [50, 0],
    [50, 10],
    [50, 20],
    [50, 30],
    [50, 40],
    [50, 50],
    [55, 60],
    [60, 70],
    [65, 80],
    [65, 90],
    [85, 100],
    [95, 110],
    [115, 110],
    [115, 110],
    [120, 110],
  ];

  return {
    xscale: xscale.copy(),
    yscale: yscale.copy(),
    elm,
    data,
  };
};


export const ToggleCanvasLayer = () => {
  const root = createRootDiv();
  const container = createGridContainer();

  const options: WellborepathLayerOptions = {
    order: 1,
    strokeWidth: '5px',
    stroke: 'black',
  };

  const gridLayer = new GridLayer('grid', {
    order: 1,
    majorColor: 'black',
    minorColor: 'black',
    majorWidth: 0.5,
    minorWidth: 0.5,
  });

  const wellborePathLayer = new WellborepathLayer('wellborepath', options);


  gridLayer.onMount({ elm: container });
  wellborePathLayer.onMount({ elm: container });

  /**
   * .onUpdate(...) sets width and height of the canvas, currently .render() uses default dimensions (150, 300)
   */
  gridLayer.onUpdate(createEventObj(container));
  wellborePathLayer.onUpdate(createEventObj(container));

  const canvasBtn = createButton(gridLayer, container, createEventObj(container), 'Canvas');
  const svgBtn = createButton(wellborePathLayer, container, createEventObj(container), 'SVG');

  root.appendChild(container);
  root.appendChild(canvasBtn);
  root.appendChild(svgBtn);

  return root;
};
