import { select, Selection } from 'd3-selection';
import { ZoomPanHandler } from './ZoomPanHandler';
import { Layer, GridLayer } from '../layers';
import { ScaleOptions, OnMountEvent, OnRescaleEvent, LayerOptions } from '../interfaces';
import { Axis } from '../components';
import { IntersectionReferenceSystem } from './IntersectionReferenceSystem';
import { HORIZONTAL_AXIS_MARGIN, VERTICAL_AXIS_MARGIN } from '../constants';
import { AxisOptions } from './interfaces';

export class LayerManager<T> {
  private container: HTMLElement;

  private layerContainer: HTMLElement;

  private _zoomPanHandler: ZoomPanHandler;

  private layers: Layer<T>[] = [];

  private _axis: Axis;
  private _svgContainer: Selection<HTMLElement, unknown, null, undefined>;

  /**
   * Handles layers and axis also holds a zoom and pan handler object
   * @param container root container
   * @param scaleOptions
   * @param axisOptions
   */
  constructor(container: HTMLElement, scaleOptions?: ScaleOptions, axisOptions?: AxisOptions) {
    this.container = container;
    this.layerContainer = document.createElement('div');
    this.layerContainer.className = 'layer-container';
    this.container.appendChild(this.layerContainer);
    this.adjustToSize(+this.container.getAttribute('width'), +this.container.getAttribute('height'));
    this._zoomPanHandler = new ZoomPanHandler(container, (event) => this.rescale(event));
    if (scaleOptions) {
      const { xMin, xMax, yMin, yMax, xBounds, yBounds } = scaleOptions;
      if (xMin !== undefined && xMax !== undefined && yMin !== undefined && yMax !== undefined) {
        this._zoomPanHandler.setBounds([xMin, xMax], [yMin, yMax]);
      }
      if (xBounds && yBounds) {
        this._zoomPanHandler.setBounds(xBounds, yBounds);
      }
    } else {
      this._zoomPanHandler.setBounds([0, 1], [0, 1]);
    }

    if (axisOptions) {
      this._axis = this.createAxis(axisOptions);
    }

    this.rescale = this.rescale.bind(this);
  }

  /**
   * Adds and mounts an array of layers
   * @param layers array of layers
   */
  addLayers(layers: Layer<T>[]): LayerManager<T> {
    layers.forEach((layer) => this.addLayer(layer));
    return this;
  }

  /**
   * Gets all layers currently mounted
   */
  getLayers(): Layer<T>[] {
    return this.layers;
  }

  /**
   * Clears data from all mounted layers
   * @param includeReferenceSystem - (optional) if true also removes reference system, default is true
   */
  clearAllData(includeReferenceSystem: boolean = true): LayerManager<T> {
    this.layers.forEach((l) => l.clearData(includeReferenceSystem));
    return this;
  }

  /**
   * Adds the layer to the manager, and mounts it
   * @param layer Layer
   * @param params extra params to pass to the onUpdate method
   */
  addLayer(layer: Layer<T>, params?: unknown): LayerManager<T> {
    this.layers.push(layer);
    this.initLayer(layer, params);

    return this;
  }

  /**
   * Remove and unmount layer from manager
   * @param layerId name of layer
   */
  removeLayer(layerId: string): LayerManager<T> {
    const layer = this.layers.find((l) => l.id === layerId);
    if (layer) {
      layer.onUnmount();
      this.layers = this.layers.filter((l) => l.id !== layerId);
    }

    return this;
  }

  /**
   * Remove and unmount all layers from manager
   */
  removeAllLayers(): LayerManager<T> {
    const { layers } = this;
    layers.forEach((layer) => {
      this.removeLayer(layer.id);
    });
    return this;
  }

  getLayer(layerId: string): Layer<unknown> {
    return this.layers.find((l) => l.id === layerId);
  }

  initLayer(layer: Layer<T>, params?: LayerOptions<T>): LayerManager<T> {
    const event: OnMountEvent = {
      elm: this.layerContainer,
    };
    layer.onMount(event);
    const rescaleEvent = this.zoomPanHandler.currentStateAsEvent();
    layer.onUpdate({ ...rescaleEvent, ...params });
    layer.onRescale(rescaleEvent);

    if (this._svgContainer) {
      const highestZIndex = this.layers.length > 0 ? this.layers.reduce((max, layers) => (max.order > layers.order ? max : layers)).order : 1;
      this._svgContainer.style('z-index', `${highestZIndex + 1}`);
    }

    return this;
  }

  showLayer(layerId: string): LayerManager<T> {
    const layer = this.getLayer(layerId);
    layer.setVisibility(true);
    layer.onRescale(this.zoomPanHandler.currentStateAsEvent());
    return this;
  }

  hideLayer(layerId: string): LayerManager<T> {
    this.getLayer(layerId).setVisibility(false);
    return this;
  }

  /**
   * Adjust layers, axis, and zoom according to inputted dimensions
   * @param width (required)
   * @param height (required)
   */
  adjustToSize(width: number, height: number): void {
    const layersWidth = Math.max(this._axis ? width - HORIZONTAL_AXIS_MARGIN : width, 0);
    const layersHeight = Math.max(this._axis ? height - VERTICAL_AXIS_MARGIN : height, 0);

    if (this._axis) {
      const resizeEvent = { width, height };
      this._axis.onResize(resizeEvent);
    }
    if (this.layers) {
      const resizeEvent = { width: layersWidth, height: layersHeight };
      this.layers.forEach((layer) => layer.onResize(resizeEvent));
    }
    if (this._zoomPanHandler) {
      this._zoomPanHandler.adjustToSize(layersWidth, layersHeight, true);
    }
  }

  setReferenceSystem(irs: IntersectionReferenceSystem): void {
    this.layers.forEach((layer) => (layer.referenceSystem = irs));
  }

  showAxis(): LayerManager<T> {
    this._axis.show();
    return this;
  }

  hideAxis(): LayerManager<T> {
    this._axis.hide();
    return this;
  }

  showAxisLabels(): LayerManager<T> {
    this._axis.showLabels();
    return this;
  }

  hideAxisLabels(): LayerManager<T> {
    this._axis.hideLabels();
    return this;
  }

  setAxisOffset(x: number, y: number): LayerManager<T> {
    this._axis.offsetX = x;
    this._axis.offsetY = y;
    const gridLayers = this.layers.filter((l: Layer<T>) => l instanceof GridLayer<T>);
    gridLayers.forEach((l: GridLayer<T>) => {
      l.offsetX = x;
      l.offsetY = y;
    });
    return this;
  }

  setXAxisOffset(x: number): LayerManager<T> {
    this._axis.offsetX = x;
    const gridLayers = this.layers.filter((l: Layer<T>) => l instanceof GridLayer<T>);
    gridLayers.forEach((l: GridLayer<T>) => {
      l.offsetX = x;
    });
    return this;
  }

  setYAxisOffset(y: number): LayerManager<T> {
    this._axis.offsetY = y;
    const gridLayers = this.layers.filter((l: Layer<T>) => l instanceof GridLayer<T>);
    gridLayers.forEach((l: GridLayer<T>) => {
      l.offsetY = y;
    });
    return this;
  }

  setZoomLevelBoundary(zoomlevels: [number, number]): LayerManager<T> {
    this._zoomPanHandler.setZoomLevelBoundary(zoomlevels);
    return this;
  }

  setMaxZoomLevel(zoomlevel: number): LayerManager<T> {
    this._zoomPanHandler.setMaxZoomLevel(zoomlevel);
    return this;
  }

  setMinZoomLevel(zoomlevel: number): LayerManager<T> {
    this._zoomPanHandler.setMinZoomLevel(zoomlevel);
    return this;
  }

  destroy(): LayerManager<T> {
    this.removeAllLayers();
    this.layerContainer.remove();
    this.layerContainer = undefined;
    this.container = undefined;
    this.layers = undefined;
    this._zoomPanHandler = undefined;
    this._axis = undefined;
    this._svgContainer = undefined;

    return this;
  }

  get zoomPanHandler(): ZoomPanHandler {
    return this._zoomPanHandler;
  }

  get axis(): Axis {
    return this._axis;
  }

  private rescale(event: OnRescaleEvent): void {
    if (this._axis) {
      this._axis.onRescale(event);
    }
    if (this.layers) {
      this.layers.forEach((layer) => (layer.isVisible === true ? layer.onRescale(event) : {}));
    }
  }

  private createAxis = (options: AxisOptions): Axis => {
    const { container } = this;
    this._svgContainer = select(container)
      .append('div')
      .attr('class', 'axis')
      .style('position', 'absolute')
      .style('z-index', '10')
      .style('pointer-events', 'none');

    const svg = this._svgContainer.append('svg').attr('height', `${container.offsetHeight}px`).attr('width', `${container.offsetWidth}px`);

    const showLabels = true;

    const axis = new Axis(svg, showLabels, options.xLabel, options.yLabel, options.unitOfMeasure);

    return axis;
  };
}
