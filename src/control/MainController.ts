import { IntersectionReferenceSystem } from './IntersectionReferenceSystem';
import { LayerManager } from './LayerManager';
import { Layer } from '../layers';
import { ControllerOptions } from './interfaces';
import { ZoomPanHandler } from './ZoomPanHandler';
import { ReferenceSystemOptions } from '..';
import { Axis } from '../components';
import { overlay, Overlay } from './overlay';
import { HORIZONTAL_AXIS_MARGIN, VERTICAL_AXIS_MARGIN } from '../constants';

/**
 * API for controlling data and layers
 */
export class Controller {
  private _referenceSystem: IntersectionReferenceSystem;

  private layerManager: LayerManager;
  private _overlay: Overlay;

  /**
   * Interface to control layers, reference system, axis and overlay. overlay is created on instantiation, does not currently support opt-out.
   * @param options
   * @param options.container (required) Currently only supports HTMLElement
   * @param options.scaleOptions (optional) currently supports formats listed in examples below
   * @example scaleOptions = { xMin: 0, xMax: 100, yMin: 0, yMax: 100 }
   * @example scaleOptions = { xBounds: [0 , 100], yBounds: [0, 100] }
   * @param options.axisOptions (optional) creates axis with supplied labels, currently only supports creating axis on instantiation
   * @param options.layers (optional) list of layers
   * @param options.path (optional) creates a reference system based on an array of 3d coordinates
   * @param options.referenceSystem (optional) sets reference system, takes priority over path if both are supplied
   */
  constructor(options: ControllerOptions) {
    const { container, axisOptions, scaleOptions, referenceSystem, layers, path } = options;

    this._referenceSystem = referenceSystem || (path && new IntersectionReferenceSystem(path));

    this._overlay = overlay(this, container);

    this.layerManager = new LayerManager(this._overlay.elm.node() as HTMLElement, scaleOptions, axisOptions);
    if (layers) {
      this.layerManager.addLayers(layers);
      this.setOverlayZIndex(layers);
    }
  }

  /**
   * Sets reference system, overrides any existing reference systems in place
   * @param referenceSystem IntersectionReferenceSystem
   */
  setReferenceSystem(referenceSystem: IntersectionReferenceSystem): Controller {
    this._referenceSystem = referenceSystem;
    this.layerManager.setReferenceSystem(referenceSystem);
    return this;
  }

  /**
   * Creates new reference system based on path, overrides any existing reference systems in place
   * @param path array of coords
   * @param options optional
   * @param options.trajectoryAngle (optional) angle in degrees
   */
  updatePath(path: number[][], options?: ReferenceSystemOptions): Controller {
    this.setReferenceSystem(new IntersectionReferenceSystem(path, options));

    return this;
  }

  /**
   * Clears data from all mounted layers
   * @param includeReferenceSystem - (optional) if true also removes reference system, default is true
   */
  clearAllData(includeReferenceSystem: boolean = true): Controller {
    this.layerManager.clearAllData(includeReferenceSystem);
    return this;
  }

  /**
   * Adds layer to list, and initializes it
   * @param layer layer object
   * @param params (optional) adds additional parameters to the onUpdateEvent
   */
  addLayer(layer: Layer, params?: any): Controller {
    this.layerManager.addLayer(layer, params);
    this.setOverlayZIndex(this.layerManager.getLayers());
    return this;
  }

  /**
   * Remove and unmount layer from list
   * @param layerId string id
   */
  removeLayer(layerId: string): Controller {
    this.layerManager.removeLayer(layerId);
    return this;
  }

  /**
   * Remove and unmount all layers from list
   */
  removeAllLayers(): Controller {
    this.layerManager.removeAllLayers();
    return this;
  }

  /**
   * Find first layer with given id, returns undefined if none are found
   * @param layerId string id
   */
  getLayer(layerId: string): Layer {
    return this.layerManager.getLayer(layerId);
  }

  /**
   * Sets visibility to true and rescales the layer
   * @param layerId string id
   */
  showLayer(layerId: string): Controller {
    this.layerManager.showLayer(layerId);
    return this;
  }

  /**
   * Sets visibility to false
   * @param layerId string id
   */
  hideLayer(layerId: string): Controller {
    this.layerManager.hideLayer(layerId);
    return this;
  }

  /**
   * Adjust layers, axis, overlay, and zoom according to inputted dimensions
   * @param width (required)
   * @param height (required)
   */
  adjustToSize(width: number, height: number): Controller {
    this.layerManager.adjustToSize(width, height);

    const dimensions = { width: Math.max(width - HORIZONTAL_AXIS_MARGIN, 0), height: Math.max(height - VERTICAL_AXIS_MARGIN, 0) };
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

  /**
   * Sets bounds for zoom and pan handler
   * @param xBounds - domain in x-direction
   * @param yBounds - domain in y-direction
   */
  setBounds(xBounds: [number, number], yBounds: [number, number]): Controller {
    this.zoomPanHandler.setBounds(xBounds, yBounds);
    return this;
  }

  /**
   * Display both axes
   */
  showAxis(): Controller {
    this.layerManager.showAxis();
    return this;
  }

  /**
   * Hide both axes
   */
  hideAxis(): Controller {
    this.layerManager.hideAxis();
    return this;
  }

  /**
   * Shows labels in x and y
   */
  showAxisLabels(): Controller {
    this.layerManager.showAxisLabels();
    return this;
  }

  /**
   * Hide labels in x and y
   */
  hideAxisLabels(): Controller {
    this.layerManager.hideAxisLabels();
    return this;
  }

  /**
   * Sets domain offset, offset is subtracted from domain
   * @param x
   * @param y
   */
  setAxisOffset(x: number, y: number): Controller {
    this.layerManager.setAxisOffset(x, y);
    return this;
  }

  /**
   * Sets domain offset in x-direction, offset is subtracted from domain
   * @param x
   */
  setXAxisOffset(x: number): Controller {
    this.layerManager.setXAxisOffset(x);
    return this;
  }

  /**
   * Sets domain offset in y-direction, offset is subtracted from domain
   * @param y
   */
  setYAxisOffset(y: number): Controller {
    this.layerManager.setYAxisOffset(y);
    return this;
  }

  /**
   * Defines min and max of how much one can zoom
   * @param zoomlevels
   */
  setZoomLevelBoundary(zoomlevels: [number, number]): Controller {
    this.zoomPanHandler.setZoomLevelBoundary(zoomlevels);
    return this;
  }

  /**
   * Defines how far in one can zoom
   * @param zoomlevel
   */
  setMaxZoomLevel(zoomlevel: number): Controller {
    this.zoomPanHandler.setMaxZoomLevel(zoomlevel);
    return this;
  }

  /**
   * Defines how far out one can zoom
   * @param zoomlevel
   */
  setMinZoomLevel(zoomlevel: number): Controller {
    this.zoomPanHandler.setMinZoomLevel(zoomlevel);
    return this;
  }

  /**
   * Destroy Controller
   * Convenience method for removing from DOM and clearing references
   */
  destroy(): Controller {
    this.layerManager.destroy();
    this._overlay.destroy();
    this._referenceSystem = undefined;
    this.layerManager = undefined;
    this._overlay = undefined;
    return this;
  }

  private getHighestZIndex(layers: Layer[]): number {
    const highestZIndex = layers.length > 0 ? layers.reduce((max, layers) => (max.order > layers.order ? max : layers)).order : 1;
    return highestZIndex;
  }

  private setOverlayZIndex(layers: Layer[]): void {
    const highestZIndex = this.getHighestZIndex(layers);
    this.overlay.setZIndex(highestZIndex + 2);
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

  get axis(): Axis {
    return this.layerManager.axis;
  }

  get currentStateAsEvent(): any {
    return this.zoomPanHandler.currentStateAsEvent();
  }
}
