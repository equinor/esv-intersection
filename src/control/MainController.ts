import { IntersectionReferenceSystem } from './IntersectionReferenceSystem';
import { LayerManager } from './LayerManager';
import { Layer } from '../layers';
import { ControllerOptions, Position } from './interfaces';
import { ZoomPanHandler } from './ZoomPanHandler';
import { ReferenceSystemOptions } from '..';

/**
 * API for controlling data and layers
 */
export class Controller {
  private _referenceSystem: IntersectionReferenceSystem;

  private layerManager: LayerManager;

  /**
   *
   * @param poslog position log
   * @param layers list of layers
   * @param options requires a container, can optionally overwrite reference system with own,
   * setup axis through supplying options for it, or pass in scaleOptions
   */
  constructor(options: ControllerOptions) {
    const { container, axisOptions, scaleOptions, referenceSystem, layers, poslog } = options;

    this._referenceSystem = referenceSystem || (poslog && new IntersectionReferenceSystem(poslog));
    this.layerManager = new LayerManager(container, scaleOptions, axisOptions);
    if (layers) {
      this.layerManager.addLayers(layers);
    }
  }

  setReferenceSystem(referenceSystem: IntersectionReferenceSystem): Controller {
    this._referenceSystem = referenceSystem;
    this.layerManager.setReferenceSystem(referenceSystem);
    return this;
  }

  updatePoslog(poslog: Position[], options?: ReferenceSystemOptions): Controller {
    this.setReferenceSystem(new IntersectionReferenceSystem(poslog, options));

    return this;
  }

  addLayer(layer: Layer, params?: any): Controller {
    this.layerManager.addLayer(layer, params);
    return this;
  }

  removeLayer(layerId: string): Controller {
    this.layerManager.removeLayer(layerId);
    return this;
  }

  getLayer(layerId: string): Layer {
    return this.layerManager.getLayer(layerId);
  }

  showLayer(layerId: string): Controller {
    this.getLayer(layerId).setVisibility(true);
    return this;
  }

  hideLayer(layerId: string): Controller {
    this.getLayer(layerId).setVisibility(false);
    return this;
  }

  /**
   * Adjust zoom due to changes in size of target
   * @param  force - force update even if size did not change, defaults to false
   */
  adjustToSize(width: number, height: number): Controller {
    this.layerManager.adjustToSize(width, height);
    return this;
  }

  /**
   * Set new viewport
   * @param  cx - center X pos
   * @param  cy - center Y pos
   * @param  displ - displacement
   * @param  duration - duration of transition
   */
  setViewport(cx?: number, cy?: number, displacement?: number, duration?: number): Controller {
    this.zoomPanHandler.setViewport(cx, cy, displacement, duration);
    return this;
  }

  setBounds(xBounds: [number, number], yBounds: [number, number]): Controller {
    this.zoomPanHandler.setBounds(xBounds, yBounds);
    return this;
  }

  get referenceSystem(): IntersectionReferenceSystem {
    return this._referenceSystem;
  }

  get zoomPanHandler(): ZoomPanHandler {
    return this.layerManager.zoomPanHandler;
  }

  get currentStateAsEvent(): any {
    return this.zoomPanHandler.currentStateAsEvent();
  }
}
