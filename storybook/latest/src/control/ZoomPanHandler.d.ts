import { Selection } from 'd3-selection';
import { ScaleLinear } from 'd3-scale';
import { ZoomBehavior, ZoomTransform } from 'd3-zoom';
import { ZoomAndPanOptions, OnRescaleEvent } from '../interfaces';
export type RescaleFunction = (event: OnRescaleEvent) => void;
/**
 * Handle zoom and pan for intersection layers
 */
export declare class ZoomPanHandler {
    zoom: ZoomBehavior<Element, unknown>;
    elm: HTMLElement;
    container: Selection<HTMLElement, unknown, null, undefined>;
    onRescale: RescaleFunction;
    options: ZoomAndPanOptions;
    xBounds: [number, number];
    yBounds: [number, number];
    translateBoundsX: [number, number];
    translateBoundsY: [number, number];
    scaleX: ScaleLinear<number, number>;
    scaleY: ScaleLinear<number, number>;
    _zFactor: number;
    _enableTranslateExtent: boolean;
    currentTransform: ZoomTransform;
    /**
     * Constructor
     * @param  elm, -
     * @param  options - options
     */
    constructor(elm: HTMLElement, onRescale: RescaleFunction, options?: ZoomAndPanOptions);
    /**
     * Getter returning width of target
     * @returns  width
     */
    get width(): number;
    /**
     * Getter returning height of target
     * @returns  height
     */
    get height(): number;
    /**
     * Getter which calculate span from x bounds
     * @returns  x span
     */
    get xSpan(): number;
    /**
     * Calculate span from y bounds
     * @returns  y span
     */
    get ySpan(): number;
    /**
     * Ratio between height and width
     * @returns  ratio
     */
    get viewportRatio(): number;
    /**
     * x ratios screen to value ratio
     * @returns  ratio
     */
    get xRatio(): number;
    /**
     * y scale screen to value ratio
     * @returns  ratio
     */
    get yRatio(): number;
    /**
     * Get z-factor
     * @returns  z-factor
     */
    get zFactor(): number;
    /**
     * Set z factor
     * @param  factor
     */
    set zFactor(factor: number);
    /**
     * Check if x is inverted (right to left is positive) from x bounds
     * @returns  true if inverted
     */
    get isXInverted(): boolean;
    /**
     * Check if y is inverted (bottom to top is positive) from y bounds
     * @returns  true if inverted
     */
    get isYInverted(): boolean;
    /**
     * Get if enable translate extent (pan limit)
     * @returns  true if enabled
     */
    get enableTranslateExtent(): boolean;
    /**
     * Set enable translate extent (pan limit)
     * @param  enabled - If should be enabled
     */
    set enableTranslateExtent(enabled: boolean);
    /**
     * Update translate extent (pan limits)
     */
    updateTranslateExtent(): void;
    /**
     * Create an event object from current state
     */
    currentStateAsEvent(): OnRescaleEvent;
    /**
     * Update scale
     */
    rescale(): void;
    /**
     * Initialized handler
     */
    init(): void;
    /**
     * Handle zoom
     */
    onZoom(event: {
        transform: ZoomTransform;
    }): void;
    /**
     * Update scale
     */
    applyTransform(transform: ZoomTransform): void;
    /**
     * Set new viewport
     * @param  cx - center X pos
     * @param  cy - center Y pos
     * @param  displ
     * @param  duration - duration of transition
     * @returns  a merge of filter and payload
     */
    setViewport(cx?: number, cy?: number, displ?: number, duration?: number): void;
    /**
     * Set bounds
     */
    setBounds(xBounds: [number, number], yBounds: [number, number]): void;
    /**
     * Set bounds
     */
    setTranslateBounds(xBounds: [number, number], yBounds: [number, number]): void;
    /**
     * Adjust zoom due to changes in size of target
     * @param  force - force update even if size did not change
     */
    adjustToSize(width?: number | boolean, height?: number, force?: boolean): void;
    /**
     * Calculate new transform
     * @param  dx0
     * @param  dx1
     * @param  dy
     * @returns  New transformation matrix
     */
    calculateTransform(dx0: number, dx1: number, dy: number): ZoomTransform;
    /**
     * Recalcualate the transform
     */
    recalculateZoomTransform(): void;
    setZoomLevelBoundary(zoomlevels: [number, number]): ZoomPanHandler;
    setMaxZoomLevel(zoomlevel: number): ZoomPanHandler;
    setMinZoomLevel(zoomlevel: number): ZoomPanHandler;
}
//# sourceMappingURL=ZoomPanHandler.d.ts.map