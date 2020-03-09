import { select } from 'd3-selection';
import { ZoomPanHandler } from './ZoomPanHandler';
import { Layer } from '../layers';
import { ScaleManager } from './ScaleManager';
import { ScaleOptions, OnMountEvent, OnRescaleEvent } from '../interfaces';
import { Axis } from '../components';

interface AxisOptions {
  xLabel: string;
  yLabel: string;
  unitOfMeasure: string;
}

export class LayerManager {
  private container: HTMLElement;

  private _zoomPanHandler: ZoomPanHandler;

  private _scaleManager: ScaleManager;

  private layers: Layer[] = [];

  private axis: Axis;

  constructor(container: HTMLElement, scaleOptions: ScaleOptions, axisOptions?: AxisOptions) {
    this.container = container;
    this._scaleManager = new ScaleManager(scaleOptions);
    this._zoomPanHandler = new ZoomPanHandler(container, event => this.rescale(event));

    if (axisOptions) {
      this.axis = this.createAxis(axisOptions);
    }

    this.rescale = this.rescale.bind(this);
  }

  addLayer(layer: Layer, params?: any): LayerManager {
    this.layers.push(layer);
    this.initLayer(layer, params);

    return this;
  }

  removeLayer(layerId: string): LayerManager {
    const idx = this.layers.findIndex(l => l.id === layerId);
    if (idx) {
      this.layers[idx].onUnmount();
      this.layers.splice(idx, 1);
    }

    return this;
  }

  initLayer(layer: Layer, params?: any): LayerManager {
    const event: OnMountEvent = {
      elm: this.container,
      width: this._scaleManager.xRange[1],
      height: this._scaleManager.yRange[1],
      xScale: this._scaleManager.scales[0],
      yScale: this._scaleManager.scales[1],
    };
    layer.onMount(event);
    layer.onUpdate({ ...event, ...params });
    const rescaleEvent = this.zoomPanHandler.createEventObject();
    layer.onRescale(rescaleEvent);

    return this;
  }

  get zoomPanHandler(): ZoomPanHandler {
    return this._zoomPanHandler;
  }

  get scaleManager(): ScaleManager {
    return this._scaleManager;
  }

  private rescale(event: OnRescaleEvent) {
    if (this.axis) {
      this.axis.onRescale(event);
    }
    if (this.layers && this.layers.length > 0) {
      this.layers.map(layer => layer.onRescale(event));
    }
  }

  private createAxis = (options: AxisOptions): Axis => {
    const { container, scaleManager } = this;
    const svgContainer = document.createElement('div');
    svgContainer.setAttribute('style', 'position: absolute; z-index: 9999;');
    container.appendChild(svgContainer);

    const svg = select(svgContainer)
      .append('svg')
      .attr('height', `${container.getAttribute('height')}px`)
      .attr('width', `${container.getAttribute('width')}px`);

    const showLabels = true;

    const axis = new Axis(svg, scaleManager.xScale, scaleManager.yScale, showLabels, options.xLabel, options.yLabel, options.unitOfMeasure);

    axis.render();

    return axis;
  };
}
