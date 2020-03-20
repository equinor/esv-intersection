import { IntersectionReferenceSystem } from './IntersectionReferenceSystem';
import { LayerManager } from './LayerManager';
import { Layer } from '../layers';
import { ScaleOptions } from '../interfaces';
import { ZoomPanHandler } from './ZoomPanHandler';

type Position = {
  easting: number;
  northing: number;
  tvd: number;
  md: number;
};

interface AxisOptions {
  xLabel: string;
  yLabel: string;
  unitOfMeasure: string;
}

interface ControllerOptions {
  container: HTMLElement;
  axisOptions?: AxisOptions;
  scaleOptions: ScaleOptions;
  referenceSystem?: IntersectionReferenceSystem;
}

/**
 * API for controlling data and layers
 */
export class Controller {
  private _poslog: Position[];

  private layers: Layer[];

  private _referenceSystem: IntersectionReferenceSystem;

  private layerManager: LayerManager;

  /**
   *
   * @param poslog position log
   * @param layers list of layers
   * @param options requires a container, can optionally overwrite reference system with own,
   * setup axis through supplying options for it, or pass in scaleOptions
   */
  constructor(poslog: Position[], layers: Layer[], options: ControllerOptions) {
    const { container, axisOptions, scaleOptions, referenceSystem } = options;

    this._poslog = poslog;
    this.layers = layers;

    this._referenceSystem = referenceSystem || new IntersectionReferenceSystem(poslog);
    this.layerManager = new LayerManager(container, scaleOptions, axisOptions);

    this.setup();
  }

  addLayer(layer: Layer, params?: any): void {
    this.layerManager.addLayer(layer, params);
  }

  removeLayer(layerId: string): void {
    this.layerManager.removeLayer(layerId);
  }

  getLayer(layerId: string): Layer {
    return this.layerManager.getLayer(layerId);
  }

  /**
   * Adjust zoom due to changes in size of target
   * @param  force - force update even if size did not change, defaults to false
   */
  adjustToSize(width: number, height: number, force?: boolean): void {
    this.zoomPanHandler.adjustToSize(width, height, force);
  }

  /**
   * Set new viewport
   * @param  cx - center X pos
   * @param  cy - center Y pos
   * @param  displ - displacement
   * @param  duration - duration of transition
   */
  setViewport(cx?: number, cy?: number, displacement?: number, duration?: number): void {
    this.zoomPanHandler.setViewport(cx, cy, displacement, duration);
  }

  setBounds(xBounds: [number, number], yBounds: [number, number]): void {
    this.zoomPanHandler.setBounds(xBounds, yBounds);
  }

  get referenceSystem(): IntersectionReferenceSystem {
    return this._referenceSystem;
  }

  get zoomPanHandler(): ZoomPanHandler {
    return this.layerManager.zoomPanHandler;
  }

  get currentStateAsEvent(): any {
    return this.zoomPanHandler.createEventObject();
  }

  get poslog(): Position[] {
    return this._poslog;
  }

  /**
   * mounts layers
   */
  private setup(): void {
    const { layerManager, layers } = this;
    layerManager.addLayers(layers);
  }
}
