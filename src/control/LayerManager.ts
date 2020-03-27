import { select } from 'd3-selection';
import { ZoomPanHandler } from './ZoomPanHandler';
import { Layer } from '../layers';
import { ScaleOptions, OnMountEvent, OnRescaleEvent } from '../interfaces';
import { Axis } from '../components';
import { IntersectionReferenceSystem } from './IntersectionReferenceSystem';

interface AxisOptions {
  xLabel: string;
  yLabel: string;
  unitOfMeasure: string;
}

export class LayerManager {
  private container: HTMLElement;

  private layerContainer: HTMLElement;

  private _zoomPanHandler: ZoomPanHandler;

  private layers: Layer[] = [];

  private axis: Axis;

  /**
   * Class for handling layers
   * @param container root container
   * @param scaleOptions
   * @param axisOptions
   */
  constructor(container: HTMLElement, scaleOptions: ScaleOptions, axisOptions?: AxisOptions) {
    this.container = container;
    this.layerContainer = document.createElement('div');
    this.container.appendChild(this.layerContainer);
    this.adjustToSize(+this.container.getAttribute('width'), +this.container.getAttribute('height'));
    this._zoomPanHandler = new ZoomPanHandler(container, (event) => this.rescale(event));
    this._zoomPanHandler.setBounds([scaleOptions.xMin, scaleOptions.xMax], [scaleOptions.yMin, scaleOptions.yMax]);

    if (axisOptions) {
      this.axis = this.createAxis(axisOptions);
    }

    this.rescale = this.rescale.bind(this);
  }

  addLayers(layers: Layer[]): LayerManager {
    layers.forEach((layer) => this.addLayer(layer));
    return this;
  }

  /**
   * adds the layer to the manager, and mounts it
   * @param layer Layer
   * @param params extra params to pass to the onUpdate method
   */
  addLayer(layer: Layer, params?: any): LayerManager {
    this.layers.push(layer);
    this.initLayer(layer, params);

    return this;
  }

  /**
   * remove layer from manager, and unmounts it
   * @param layerId name of layer
   */
  removeLayer(layerId: string): LayerManager {
    const idx = this.layers.findIndex((l) => l.id === layerId);
    if (idx !== -1) {
      this.layers[idx].onUnmount();
      this.layers.splice(idx, 1);
    }

    return this;
  }

  getLayer(layerId: string): Layer {
    return this.layers.find((l) => l.id === layerId);
  }

  initLayer(layer: Layer, params?: any): LayerManager {
    const event: OnMountEvent = {
      elm: this.layerContainer,
    };
    layer.onMount(event);
    const rescaleEvent = this.zoomPanHandler.currentStateAsEvent();
    layer.onUpdate({ ...rescaleEvent, ...params });
    layer.onRescale(rescaleEvent);

    return this;
  }

  adjustToSize(width: number, height: number): void {
    const horizontalAxisMargin = 40;
    const verticalAxisMargin = 30;

    const layersWidth = this.axis ? width - horizontalAxisMargin : width;
    const layersHeight = this.axis ? height - verticalAxisMargin : height;

    this.layerContainer.setAttribute('width', `${layersWidth}px`);
    this.layerContainer.setAttribute('height', `${layersHeight}px`);

    if (this.axis) {
      const resizeEvent = { width, height };
      this.axis.onResize(resizeEvent);
    }
    if (this.layers) {
      const resizeEvent = { width: layersWidth, height: layersHeight };
      this.layers.forEach((layer) => layer.onResize(resizeEvent));
    }
    if (this._zoomPanHandler) {
      this._zoomPanHandler.adjustToSize(layersWidth, layersHeight, true);
    }
  }

  get zoomPanHandler(): ZoomPanHandler {
    return this._zoomPanHandler;
  }

  private rescale(event: OnRescaleEvent): void {
    if (this.axis) {
      this.axis.onRescale(event);
    }
    if (this.layers) {
      this.layers.forEach((layer) => layer.onRescale(event));
    }
  }

  private createAxis = (options: AxisOptions): Axis => {
    const { container } = this;
    const svgContainer = document.createElement('div');
    svgContainer.setAttribute('style', 'position: absolute; z-index: 9999;');
    svgContainer.setAttribute('class', 'axis');
    container.appendChild(svgContainer);

    const svg = select(svgContainer)
      .append('svg')
      .attr('height', `${container.getAttribute('height')}px`)
      .attr('width', `${container.getAttribute('width')}px`);

    const showLabels = true;

    const axis = new Axis(svg, showLabels, options.xLabel, options.yLabel, options.unitOfMeasure);

    return axis;
  };

  setReferenceSystem(irs: IntersectionReferenceSystem): void {
    this.layers.forEach((layer) => (layer.referenceSystem = irs));
  }
}
