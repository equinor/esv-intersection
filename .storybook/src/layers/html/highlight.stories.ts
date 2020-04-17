import { Selection, select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { WellborepathLayer, HTMLLayer } from '../../../../src/layers';
import { OnRescaleEvent, OnMountEvent } from '../../../../src/interfaces';
import { IntersectionReferenceSystem, Controller } from '../../../../src/control';
import { ZoomPanHandler } from '../../../../src/control/ZoomPanHandler';

import { createRootContainer, createLayerContainer, createFPSLabel } from '../../utils';

import poslog from '../../exampledata/poslog.json';

const POINTHEIGHT = 5;
const POINTWIDTH = 5;
const POINTPADDING = 2;
const POINTOFFSETX = (POINTWIDTH + POINTPADDING) / 2;
const POINTOFFSETY = (POINTHEIGHT + POINTPADDING) / 2;

const width = 700;
const height = 600;

const xRange = 600;
const yRange = 500;
const xbounds: number[] = [0, 1000];
const ybounds: number[] = [0, 1000];

const scaleOptions = { xMin: xbounds[0], xMax: xbounds[1], yMin: ybounds[0], yMax: ybounds[1], height: yRange, width: xRange };
const axisOptions = {
  xLabel: 'Displacement',
  yLabel: 'TVD MSL',
  unitOfMeasure: 'm',
};

const defaultOptions = {
  defaultIntersectionAngle: 135,
  tension: 0.75,
  arcDivisions: 5000,
  thresholdDirectionDist: 0.001,
};

export const HighlightWellborepath = () => {
  const referenceSystem = new IntersectionReferenceSystem(poslog.map((coords) => [coords.easting, coords.northing, coords.tvd]), defaultOptions);

  const layer = new WellborepathLayer('wellborepath', { order: 3, strokeWidth: '5px', stroke: 'red', referenceSystem });

  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  layer.onMount({ elm: container });
  layer.onUpdate({});

  const highlightLayer = new HighlightLayer('pointhighlighter', {
    order: 105,
    referenceSystem,
    layerOpacity: 0.5,
  });

  highlightLayer.onMount({ elm: container, width, height });

  const zoomHandler = new ZoomPanHandler(container, (event: OnRescaleEvent) => {
    layer.onRescale({ ...event });
    highlightLayer.onRescale({ ...event });
  });

  zoomHandler.setBounds([0, 1000], [0, 1000]);
  zoomHandler.adjustToSize(width, height);
  zoomHandler.zFactor = 1;
  zoomHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
  zoomHandler.enableTranslateExtent = false;
  zoomHandler.setViewport(1000, 1000, 5000);

  highlightLayer.onRescale(zoomHandler.currentStateAsEvent());

  const slider = createSlider((event: any) => onUpdate(event, { rescaleEvent: zoomHandler.currentStateAsEvent(), layer: highlightLayer }), {
    width,
    min: 0,
    max: referenceSystem.length,
  });

  root.appendChild(container);
  root.appendChild(slider);
  root.appendChild(createFPSLabel());

  return root;
};

export const HighlightWellborepathWithController = () => {
  const referenceSystem = new IntersectionReferenceSystem(poslog.map((coords) => [coords.easting, coords.northing, coords.tvd]), defaultOptions);

  const layer = new WellborepathLayer('wellborepath', { order: 3, strokeWidth: '5px', stroke: 'red', referenceSystem });

  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  const controller = new Controller({
    referenceSystem,
    axisOptions,
    scaleOptions,
    container,
  });

  const highlightLayer = new HighlightLayer('pointhighlighter', {
    order: 105,
    referenceSystem,
    layerOpacity: 0.5,
  });

  controller.addLayer(layer).addLayer(highlightLayer);

  controller.setBounds([0, 1000], [0, 1000]);
  controller.adjustToSize(width, height);
  controller.setViewport(1000, 1000, 5000);

  // external event that calls the rescale event the highlighting should change
  const slider = createSlider((event: any) => onUpdate(event, { rescaleEvent: controller.currentStateAsEvent, layer: highlightLayer }), {
    width,
    min: 0,
    max: controller.referenceSystem.length,
  });

  root.appendChild(container);
  root.appendChild(slider);
  root.appendChild(createFPSLabel());

  return root;
};

class HighlightLayer extends HTMLLayer {
  elements: Selection<HTMLElement, any, null, undefined>[] = [];

  onMount(event: OnMountEvent): void {
    super.onMount(event);
    this.addHighlightElement('wellborepath');
  }

  onRescale(event: OnRescaleEvent): void {
    super.onRescale(event);
    const elm = this.elements[0];
    if (this.referenceSystem) {
      // returns coords in [displacement, tvd]
      const coords = this.referenceSystem.project(event.md || 0);

      // screen coords inside the container
      const newX = event.xScale(coords[0]);
      const newY = event.yScale(coords[1]);
      elm.style('left', `${newX - POINTOFFSETX}px`);
      elm.style('top', `${newY - POINTOFFSETY}px`);
    }
  }

  addHighlightElement(id: string): HighlightLayer {
    const elm = this.elm.append('div').attr('id', `${id}-highlight`);
    elm.style('visibility', 'visible');
    elm.style('height', `${POINTHEIGHT}px`);
    elm.style('width', `${POINTWIDTH}px`);
    elm.style('display', 'inline-block');
    elm.style('padding', `${POINTPADDING}px`);
    elm.style('border-radius', '4px');
    elm.style('position', 'absolute');
    elm.style('background-color', 'red');
    this.elements = [elm];
    return this;
  }

  getElement(id: string): Selection<HTMLElement, any, null, undefined> {
    return this.elm.select(id);
  }
}

const onUpdate = (event: InputEvent, obj: any) => {
  obj.layer.onRescale({ ...obj.rescaleEvent, md: event.target.valueAsNumber });
};

const createSlider = (cb: any, opts: any) => {
  const slider = document.createElement('input');
  let val = 0;
  slider.type = 'range';
  slider.value = val.toString();
  slider.min = `${opts.min || 0}`;
  slider.max = `${opts.max || 10}`;
  slider.setAttribute('style', `width:${opts.width}px`);
  slider.oninput = cb;
  return slider;
};
