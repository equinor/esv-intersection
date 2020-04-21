import { IntersectionReferenceSystem } from './IntersectionReferenceSystem';
import { LayerManager } from './LayerManager';
import { Layer } from '../layers';
import { ControllerOptions } from './interfaces';
import { ZoomPanHandler } from './ZoomPanHandler';
import { ReferenceSystemOptions } from '..';
import { overlay, Overlay } from './overlay';

const HORIZONTALAXISMARGIN = 40;
const VERTICALAXISMARGIN = 30;

/**
 * API for controlling data and layers
 */
export class Controller {
  private _referenceSystem: IntersectionReferenceSystem;

  private layerManager: LayerManager;
  private _overlay: Overlay;

  /**
   *
   * @param path array of 3d coordinates
   * @param layers list of layers
   * @param options requires a container, can optionally overwrite reference system with own,
   * setup axis through supplying options for it, or pass in scaleOptions
   */
  constructor(options: ControllerOptions) {
    const { container, axisOptions, scaleOptions, referenceSystem, layers, path } = options;

    this._referenceSystem = referenceSystem || (path && new IntersectionReferenceSystem(path));
    this.layerManager = new LayerManager(container, scaleOptions, axisOptions);
    if (layers) {
      this.layerManager.addLayers(layers);
    }

    this._overlay = overlay(this, container);
  }

  setReferenceSystem(referenceSystem: IntersectionReferenceSystem): Controller {
    this._referenceSystem = referenceSystem;
    this.layerManager.setReferenceSystem(referenceSystem);
    return this;
  }

  updatePath(path: number[][], options?: ReferenceSystemOptions): Controller {
    this.setReferenceSystem(new IntersectionReferenceSystem(path, options));

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
    this.layerManager.showLayer(layerId);
    return this;
  }

  hideLayer(layerId: string): Controller {
    this.layerManager.hideLayer(layerId);
    return this;
  }

  /**
   * Adjust zoom due to changes in size of target
   * @param  force - force update even if size did not change, defaults to false
   */
  adjustToSize(width: number, height: number): Controller {
    this.layerManager.adjustToSize(width, height);

    const dimensions = { width: width - HORIZONTALAXISMARGIN, height: height - VERTICALAXISMARGIN };
    this.overlay.elm.dispatch('resize', { detail: dimensions, bubbles: true, cancelable: true });

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

  setAxisOffset(x: number, y: number): Controller {
    this.layerManager.setAxisOffset(x, y);
    return this;
  }

  setXAxisOffset(x: number): Controller {
    this.layerManager.setXAxisOffset(x);
    return this;
  }

  setYAxisOffset(y: number): Controller {
    this.layerManager.setYAxisOffset(y);
    return this;
  }

  setZoomLevel(zoomlevels: [number, number]): Controller {
    this.zoomPanHandler.setZoomLevel(zoomlevels);
    return this;
  }

  setMaxZoomLevel(zoomlevel: number): Controller {
    this.zoomPanHandler.setMaxZoomLevel(zoomlevel);
    return this;
  }

  setMinZoomLevel(zoomlevel: number): Controller {
    this.zoomPanHandler.setMinZoomLevel(zoomlevel);
    return this;
  }

  get overlay(): Overlay {
    return this._overlay;
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
