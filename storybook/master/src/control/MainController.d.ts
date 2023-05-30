import { IntersectionReferenceSystem } from './IntersectionReferenceSystem';
import { Layer } from '../layers';
import { ControllerOptions } from './interfaces';
import { ZoomPanHandler } from './ZoomPanHandler';
import { LayerOptions, OnRescaleEvent, ReferenceSystemOptions } from '..';
import { Axis } from '../components';
import { Overlay } from './overlay';
/**
 * API for controlling data and layers
 */
export declare class Controller {
    private _referenceSystem;
    private layerManager;
    private _overlay;
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
    constructor(options: ControllerOptions);
    /**
     * Sets reference system, overrides any existing reference systems in place
     * @param referenceSystem IntersectionReferenceSystem
     */
    setReferenceSystem(referenceSystem: IntersectionReferenceSystem): Controller;
    /**
     * Creates new reference system based on path, overrides any existing reference systems in place
     * @param path array of coords
     * @param options optional
     * @param options.trajectoryAngle (optional) angle in degrees
     */
    updatePath(path: number[][], options?: ReferenceSystemOptions): Controller;
    /**
     * Clears data from all mounted layers
     * @param includeReferenceSystem - (optional) if true also removes reference system, default is true
     */
    clearAllData(includeReferenceSystem?: boolean): Controller;
    /**
     * Adds layer to list, and initializes it
     * @param layer layer object
     * @param params (optional) adds additional parameters to the onUpdateEvent
     */
    addLayer(layer: Layer<unknown>, params?: LayerOptions<unknown>): Controller;
    /**
     * Remove and unmount layer from list
     * @param layerId string id
     */
    removeLayer(layerId: string): Controller;
    /**
     * Remove and unmount all layers from list
     */
    removeAllLayers(): Controller;
    /**
     * Find first layer with given id, returns undefined if none are found
     * @param layerId string id
     */
    getLayer(layerId: string): Layer<unknown>;
    /**
     * Sets visibility to true and rescales the layer
     * @param layerId string id
     */
    showLayer(layerId: string): Controller;
    /**
     * Sets visibility to false
     * @param layerId string id
     */
    hideLayer(layerId: string): Controller;
    /**
     * Adjust layers, axis, overlay, and zoom according to inputted dimensions
     * @param width (required)
     * @param height (required)
     */
    adjustToSize(width: number, height: number): Controller;
    /**
     * Set new viewport
     * @param  cx - center X pos
     * @param  cy - center Y pos
     * @param  displ - displacement
     * @param  duration - duration of transition
     */
    setViewport(cx?: number, cy?: number, displacement?: number, duration?: number): Controller;
    /**
     * Sets bounds for zoom and pan handler
     * @param xBounds - domain in x-direction
     * @param yBounds - domain in y-direction
     */
    setBounds(xBounds: [number, number], yBounds: [number, number]): Controller;
    /**
     * Display both axes
     */
    showAxis(): Controller;
    /**
     * Hide both axes
     */
    hideAxis(): Controller;
    /**
     * Shows labels in x and y
     */
    showAxisLabels(): Controller;
    /**
     * Hide labels in x and y
     */
    hideAxisLabels(): Controller;
    /**
     * Sets domain offset, offset is subtracted from domain
     * @param x
     * @param y
     */
    setAxisOffset(x: number, y: number): Controller;
    /**
     * Sets domain offset in x-direction, offset is subtracted from domain
     * @param x
     */
    setXAxisOffset(x: number): Controller;
    /**
     * Sets domain offset in y-direction, offset is subtracted from domain
     * @param y
     */
    setYAxisOffset(y: number): Controller;
    /**
     * Defines min and max of how much one can zoom
     * @param zoomlevels
     */
    setZoomLevelBoundary(zoomlevels: [number, number]): Controller;
    /**
     * Defines how far in one can zoom
     * @param zoomlevel
     */
    setMaxZoomLevel(zoomlevel: number): Controller;
    /**
     * Defines how far out one can zoom
     * @param zoomlevel
     */
    setMinZoomLevel(zoomlevel: number): Controller;
    /**
     * Destroy Controller
     * Convenience method for removing from DOM and clearing references
     */
    destroy(): Controller;
    private getHighestZIndex;
    private setOverlayZIndex;
    get overlay(): Overlay<Controller>;
    get referenceSystem(): IntersectionReferenceSystem;
    get zoomPanHandler(): ZoomPanHandler;
    get axis(): Axis;
    get currentStateAsEvent(): OnRescaleEvent;
}
//# sourceMappingURL=MainController.d.ts.map