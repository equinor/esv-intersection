import { ZoomPanHandler } from './ZoomPanHandler';
import { Layer, LayerOptions } from '../layers';
import { ScaleOptions } from '../interfaces';
import { Axis } from '../components';
import { IntersectionReferenceSystem } from './IntersectionReferenceSystem';
import { AxisOptions } from './interfaces';
export declare class LayerManager {
    private container;
    private layerContainer;
    private _zoomPanHandler;
    private layers;
    private _axis;
    private _svgContainer;
    /**
     * Handles layers and axis also holds a zoom and pan handler object
     * @param container root container
     * @param scaleOptions
     * @param axisOptions
     */
    constructor(container: HTMLElement, scaleOptions?: ScaleOptions, axisOptions?: AxisOptions);
    /**
     * Adds and mounts an array of layers
     * @param layers array of layers
     */
    addLayers(layers: Layer<unknown>[]): LayerManager;
    /**
     * Gets all layers currently mounted
     */
    getLayers(): Layer<unknown>[];
    /**
     * Clears data from all mounted layers
     * @param includeReferenceSystem - (optional) if true also removes reference system, default is true
     */
    clearAllData(includeReferenceSystem?: boolean): LayerManager;
    /**
     * Adds the layer to the manager, and mounts it
     * @param layer Layer
     * @param params extra params to pass to the onUpdate method
     */
    addLayer(layer: Layer<unknown>, params?: LayerOptions<unknown>): LayerManager;
    /**
     * Remove and unmount layer from manager
     * @param layerId name of layer
     */
    removeLayer(layerId: string): LayerManager;
    /**
     * Remove and unmount all layers from manager
     */
    removeAllLayers(): LayerManager;
    getLayer(layerId: string): Layer<unknown>;
    initLayer(layer: Layer<unknown>, params?: LayerOptions<unknown>): LayerManager;
    showLayer(layerId: string): LayerManager;
    hideLayer(layerId: string): LayerManager;
    /**
     * Adjust layers, axis, and zoom according to inputted dimensions
     * @param width (required)
     * @param height (required)
     */
    adjustToSize(width: number, height: number): void;
    setReferenceSystem(irs: IntersectionReferenceSystem): void;
    showAxis(): LayerManager;
    hideAxis(): LayerManager;
    showAxisLabels(): LayerManager;
    hideAxisLabels(): LayerManager;
    setAxisOffset(x: number, y: number): LayerManager;
    setXAxisOffset(x: number): LayerManager;
    setYAxisOffset(y: number): LayerManager;
    setZoomLevelBoundary(zoomlevels: [number, number]): LayerManager;
    setMaxZoomLevel(zoomlevel: number): LayerManager;
    setMinZoomLevel(zoomlevel: number): LayerManager;
    destroy(): LayerManager;
    get zoomPanHandler(): ZoomPanHandler;
    get axis(): Axis;
    private rescale;
    private createAxis;
}
