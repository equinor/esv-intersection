import { event, select, Selection } from 'd3-selection';
import { scaleLinear, ScaleLinear } from 'd3-scale';
import { zoom, zoomIdentity, ZoomBehavior, ZoomTransform } from 'd3-zoom';

import { ZoomAndPanOptions, OnRescaleEvent, OnUpdateEvent } from '../interfaces';

const DEFAULT_MIN_ZOOM_LEVEL = 0.1;
const DEFAULT_MAX_ZOOM_LEVEL = 256;

type RescaleFunction = (event: OnRescaleEvent) => void;
/**
 * Handle zoom and pan for intersection layers
 */
export class ZoomPanHandler {
  zoom: ZoomBehavior<Element, unknown> = null;
  elm: HTMLElement = null;
  container: Selection<any, unknown, null, undefined> = null;
  onRescale: RescaleFunction = null;
  options: ZoomAndPanOptions = null;
  xBounds: [number, number] = [0, 1];
  yBounds: [number, number] = [0, 1];
  translateBoundsX: [number, number] = [0, 1];
  translateBoundsY: [number, number] = [0, 1];
  scaleX: ScaleLinear<number, number> = null;
  scaleY: ScaleLinear<number, number> = null;
  _zFactor: number = 1;
  _enableTranslateExtent: boolean;
  currentTransform: ZoomTransform;

  /**
   * Constructor
   * @param  elm, -
   * @param  options - options
   */
  constructor(
    elm: HTMLElement,
    onRescale: RescaleFunction,
    options: ZoomAndPanOptions = { maxZoomLevel: DEFAULT_MAX_ZOOM_LEVEL, minZoomLevel: DEFAULT_MIN_ZOOM_LEVEL },
  ) {
    this.onZoom = this.onZoom.bind(this);

    this.container = select(elm);
    this.options = options;

    this.onRescale = onRescale;

    this.onZoom = this.onZoom.bind(this);
    this.calculateTransform = this.calculateTransform.bind(this);
    this.applyTransform = this.applyTransform.bind(this);
    this.recalculateZoomTransform = this.recalculateZoomTransform.bind(this);
    this.rescale = this.rescale.bind(this);

    this.adjustToSize = this.adjustToSize.bind(this);
    this.setViewport = this.setViewport.bind(this);

    this.currentStateAsEvent = this.currentStateAsEvent.bind(this);

    this.updateTranslateExtent = this.updateTranslateExtent.bind(this);

    this.scaleX = scaleLinear().domain(this.xBounds).range([0, 1]);
    this.scaleY = scaleLinear().domain(this.yBounds).range([0, 1]);

    this.init();
  }

  /**
   * Getter returning width of target
   * @returns  width
   */
  get width(): number {
    return this.scaleX.range()[1];
  }

  /**
   * Getter returning height of target
   * @returns  height
   */
  get height(): number {
    return this.scaleY.range()[1];
  }

  /**
   * Getter which calculate span from x bounds
   * @returns  x span
   */
  get xSpan(): number {
    const { xBounds } = this;
    const xspan: number = Math.abs(xBounds[1] - xBounds[0]);
    return xspan;
  }

  /**
   * Calculate span from y bounds
   * @returns  y span
   */
  get ySpan(): number {
    const { yBounds } = this;
    const yspan: number = Math.abs(yBounds[1] - yBounds[0]);
    return yspan;
  }

  /**
   * Ratio between height and width
   * @returns  ratio
   */
  get viewportRatio(): number {
    const ratio: number = this.width / (this.height || 1);
    return ratio;
  }

  /**
   * x ratios screen to value ratio
   * @returns  ratio
   */
  get xRatio(): number {
    const domain: number[] = this.scaleX.domain();
    const ratio: number = Math.abs(this.width / (domain[1] - domain[0]));
    return ratio;
  }

  /**
   * y scale screen to value ratio
   * @returns  ratio
   */
  get yRatio(): number {
    const domain: number[] = this.scaleY.domain();
    const ratio: number = Math.abs(this.height / (domain[1] - domain[0]));
    return ratio;
  }

  /**
   * Get z-factor
   * @returns  z-factor
   */
  get zFactor(): number {
    return this._zFactor;
  }

  /**
   * Set z factor
   * @param  factor
   */
  set zFactor(factor: number) {
    this._zFactor = factor;
    this.recalculateZoomTransform();
  }

  /**
   * Check if x is inverted (right to left is positive) from x bounds
   * @returns  true if inverted
   */
  get isXInverted(): boolean {
    return this.xBounds[1] < this.xBounds[0];
  }

  /**
   * Check if y is inverted (bottom to top is positive) from y bounds
   * @returns  true if inverted
   */
  get isYInverted(): boolean {
    return this.yBounds[1] < this.yBounds[0];
  }

  /**
   * Get if enable translate extent (pan limit)
   * @returns  true if enabled
   */
  get enableTranslateExtent(): boolean {
    return this._enableTranslateExtent;
  }

  /**
   * Set enable translate extent (pan limit)
   * @param  enabled - If should be enabled
   */
  set enableTranslateExtent(enabled: boolean) {
    this._enableTranslateExtent = enabled;

    this.updateTranslateExtent();
  }

  /**
   * Update translate extent (pan limits)
   */
  updateTranslateExtent(): void {
    const { width, xSpan, ySpan, zFactor, enableTranslateExtent, translateBoundsX, translateBoundsY } = this;

    let x1: number = -Infinity;
    let y1: number = -Infinity;
    let x2: number = +Infinity;
    let y2: number = +Infinity;

    if (enableTranslateExtent) {
      const ppu: number = width / xSpan;
      const h: number = ySpan * ppu * zFactor;

      x1 = translateBoundsX[0] * ppu;
      x2 = translateBoundsX[1] * ppu;
      y1 = translateBoundsY[0] * ppu * zFactor;
      y2 = translateBoundsY[1] * ppu * zFactor;
    }

    this.zoom.translateExtent([
      [x1, y1],
      [x2, y2],
    ]);
  }

  /**
   * Create an event object from current state
   */
  currentStateAsEvent(): OnRescaleEvent {
    const { scaleX, scaleY, xBounds, yBounds, zFactor, viewportRatio, currentTransform, xRatio, yRatio, width, height } = this;

    return {
      xScale: scaleX.copy(),
      yScale: scaleY.copy(),
      xBounds: xBounds,
      yBounds: yBounds,
      zFactor: zFactor,
      viewportRatio,
      xRatio: xRatio,
      yRatio: yRatio,
      width: width,
      height: height,
      transform: { ...currentTransform },
    };
  }

  /**
   * Update scale
   */
  rescale(): void {
    const { currentStateAsEvent } = this;

    this.onRescale(currentStateAsEvent());
  }

  /**
   * Initialized handler
   */
  init(): void {
    this.zoom = zoom().scaleExtent([this.options.minZoomLevel, this.options.maxZoomLevel]).on('zoom', this.onZoom);

    this.container.call(this.zoom);
  }

  /**
   * Handle zoom
   */
  onZoom(): void {
    const { transform } = event;
    if (!transform) {
      return;
    }

    this.applyTransform(transform);
    this.rescale();
  }

  /**
   * Update scale
   */
  applyTransform(transform: ZoomTransform): void {
    const { width, scaleX, scaleY, xSpan, ySpan, xBounds, yBounds, zFactor } = this;

    const { viewportRatio: ratio, isXInverted, isYInverted } = this;

    const newWidth: number = width * transform.k;

    const unitsPerPixels: number = xSpan / newWidth;

    const newXSpan: number = xSpan / transform.k;
    const newYSpan: number = newXSpan / zFactor / ratio;

    const shiftx: number = unitsPerPixels * transform.x;
    const shifty: number = (unitsPerPixels / zFactor) * transform.y;
    const dx0: number = xBounds[0] - (isXInverted ? -shiftx : shiftx);
    const dy0: number = yBounds[0] - (isYInverted ? -shifty : shifty);

    scaleX.domain([dx0, dx0 + (isXInverted ? -newXSpan : newXSpan)]);
    scaleY.domain([dy0, dy0 + (isYInverted ? -newYSpan : newYSpan)]);

    this.currentTransform = transform;
  }

  /**
   * Set new viewport
   * @param  cx - center X pos
   * @param  cy - center Y pos
   * @param  displ
   * @param  duration - duration of transition
   * @returns  a merge of filter and payload
   */
  setViewport(cx: number = null, cy: number = null, displ: number = null, duration: number = null): void {
    const { zoom, container, calculateTransform, viewportRatio: ratio, scaleX, scaleY, isXInverted } = this;

    if (cx === null || displ === null) {
      const xd: number[] = scaleX.domain();
      const dspan: number = xd[1] - xd[0];
      if (cx === null) {
        cx = xd[0] + dspan / 2 || 0;
      }
      if (displ === null) {
        displ = Math.abs(dspan) || 1;
      }
    }

    if (cy === null) {
      const yd: number[] = scaleY.domain();
      cy = yd[0] + (yd[1] - yd[0]) / 2 || 0;
    }

    const xdispl: number = isXInverted ? -displ : displ;

    const dx0: number = cx - xdispl / 2;
    const dx1: number = dx0 + xdispl;

    const t: ZoomTransform = calculateTransform(dx0, dx1, cy);

    if (Number.isFinite(duration) && duration > 0) {
      zoom.transform(container.transition().duration(duration), t);
    } else {
      zoom.transform(container, t);
    }
  }

  /**
   * Set bounds
   */
  setBounds(xBounds: [number, number], yBounds: [number, number]): void {
    this.xBounds = xBounds;
    this.yBounds = yBounds;

    this.recalculateZoomTransform();
  }

  /**
   * Set bounds
   */
  setTranslateBounds(xBounds: [number, number], yBounds: [number, number]): void {
    this.translateBoundsX = xBounds;
    this.translateBoundsY = yBounds;

    this.updateTranslateExtent();
  }

  /**
   * Adjust zoom due to changes in size of target
   * @param  force - force update even if size did not change
   */
  adjustToSize(width?: number | boolean, height?: number, force: boolean = false): void {
    const { width: oldWidth, height: oldHeight, scaleX, scaleY, recalculateZoomTransform } = this;

    let w = 0;
    let h = 0;

    if (typeof width === 'undefined' || typeof width === 'boolean') {
      const { containerWidth, containerHeight } = this.container.node().getBoundingClientRect();
      w = containerWidth;
      h = containerHeight;
    } else {
      w = width;
      h = height;
    }

    const newWidth: number = Math.max(1, w);
    const newHeight: number = Math.max(1, h);

    // exit early if nothing has changed
    if (!force && oldWidth === newWidth && oldHeight === newHeight) {
      return;
    }

    scaleX.range([0, newWidth]);
    scaleY.range([0, newHeight]);

    recalculateZoomTransform();
    this.onRescale(this.currentStateAsEvent());
  }

  /**
   * Calculate new transform
   * @param  dx0
   * @param  dx1
   * @param  dy
   * @returns  New transformation matrix
   */
  calculateTransform(dx0: number, dx1: number, dy: number): ZoomTransform {
    const { scaleX, xSpan, xBounds, yBounds, zFactor, viewportRatio: ratio, isXInverted, isYInverted } = this;

    const [rx1, rx2] = scaleX.range();
    const displ: number = Math.abs(dx1 - dx0);
    const k: number = xSpan / displ;
    const unitsPerPixels: number = displ / (rx2 - rx1);

    const dy0: number = dy - (isYInverted ? -displ : displ) / zFactor / ratio / 2;

    const tx: number = (xBounds[0] - dx0) / (isXInverted ? -unitsPerPixels : unitsPerPixels);
    const ty: number = (yBounds[0] - dy0) / ((isYInverted ? -unitsPerPixels : unitsPerPixels) / zFactor);

    return zoomIdentity.translate(tx, ty).scale(k);
  }

  /**
   * Recalcualate the transform
   */
  recalculateZoomTransform(): void {
    const { scaleX, scaleY, container, calculateTransform, updateTranslateExtent } = this;

    const [dx0, dx1] = scaleX.domain();
    const [dy0, dy1] = scaleY.domain();

    const dy: number = dy0 + (dy1 - dy0) / 2;

    const transform: ZoomTransform = calculateTransform(dx0, dx1, dy);

    updateTranslateExtent();

    this.zoom.transform(container, transform);
  }

  setZoomLevelBoundary(zoomlevels: [number, number]): ZoomPanHandler {
    this.zoom.scaleExtent(zoomlevels);
    return this;
  }

  setMaxZoomLevel(zoomlevel: number): ZoomPanHandler {
    const zoomLevels = this.zoom.scaleExtent();
    this.zoom.scaleExtent([zoomLevels[0], zoomlevel]);
    return this;
  }

  setMinZoomLevel(zoomlevel: number): ZoomPanHandler {
    const zoomLevels = this.zoom.scaleExtent();
    this.zoom.scaleExtent([zoomlevel, zoomLevels[1]]);
    return this;
  }
}
