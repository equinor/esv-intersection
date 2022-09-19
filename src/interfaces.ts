import { ZoomTransform } from 'd3-zoom';
import { Graphics, IApplicationOptions } from 'pixi.js';
import { Layer } from './layers/base/Layer';
import { IntersectionReferenceSystem } from './control/IntersectionReferenceSystem';
import Vector2 from '@equinor/videx-vector2';
import { SurfaceData } from './datautils';
import { ScaleLinear } from 'd3-scale';
import { ExtendedCurveInterpolator } from './control/ExtendedCurveInterpolator';
import { CurveInterpolator } from 'curve-interpolator';

interface LayerEvent {
  [propType: string]: any;
  elm?: HTMLElement;
}

export interface OnMountEvent extends LayerEvent {
  elm: HTMLElement;
}

export interface OnUnmountEvent extends LayerEvent {}

export interface OnResizeEvent extends LayerEvent {
  width: number;
  height: number;
}

export interface OnRescaleEvent extends LayerEvent {
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
  xBounds?: [number, number];
  yBounds?: [number, number];
  zFactor?: number;
  viewportRatio?: number;
  width?: number;
  height?: number;
  xRatio?: number;
  yRatio?: number;
  transform?: ZoomTransform;
}

export interface OnUpdateEvent extends LayerEvent {}

export interface LayerOptions<T> {
  order?: number;
  layerOpacity?: number;
  referenceSystem?: IntersectionReferenceSystem;
  data?: T;
  interactive?: boolean;

  onMount?(event: OnMountEvent, layer: Layer<T>): void;
  onUnmount?(event: OnUnmountEvent, layer: Layer<T>): void;
  onUpdate?(event: OnUpdateEvent, layer: Layer<T>): void;
  onRescale?(event: OnRescaleEvent, layer: Layer<T>): void;
  onResize?(event: OnResizeEvent, layer: Layer<T>): void;
}

export interface GridLayerOptions<T> extends LayerOptions<T> {
  majorWidth?: number;
  majorColor?: string;

  minorWidth?: number;
  minorColor?: string;
}

export interface WellborepathLayerOptions extends LayerOptions<[number, number][]> {
  stroke: string;
  strokeWidth: string;
  curveType?: string;
  tension?: number;
}

export interface GeomodelLayerOptions<T> extends LayerOptions<T> {}

export interface CompletionLayerOptions<T> extends PixiLayerOptions<T> {}

export interface GeomodelLayerLabelsOptions extends LayerOptions<SurfaceData> {
  margins?: number;
  minFontSize?: number;
  maxFontSize?: number;
  textColor?: string;
  font?: string;
}

export interface HoleSizeLayerOptions extends WellComponentBaseOptions<HoleSize[]> {
  firstColor?: string;
  secondColor?: string;
  lineColor?: number;
}

export interface CasingShoeSize {
  width: number;
  length: number;
}

export interface CasingLayerOptions extends WellComponentBaseOptions<Casing[]> {
  solidColor?: number;
  lineColor?: number;
  casingShoeSize?: CasingShoeSize;
}

export interface CementLayerOptions<T> extends WellComponentBaseOptions<T> {
  firstColor?: string;
  secondColor?: string;
}

export interface PixiLayerOptions<T> extends LayerOptions<T> {
  pixiApplicationOptions?: IApplicationOptions;
}

export interface WellComponentBaseOptions<T> extends PixiLayerOptions<T> {
  exaggerationFactor?: number;
}

export interface ZoomAndPanOptions {
  maxZoomLevel: number;
  minZoomLevel: number;
}

export interface Connector {
  end: string;
  endScale: number;
}

export interface Annotation {
  title: string;
  label: string;
  color: string;
  group: string;
  md?: number;
  pos?: [number, number];
}

export interface HoleSize {
  diameter: number;
  start: number;
  end: number;
  innerDiameter?: number;
}

export interface Casing {
  diameter: number;
  start: number;
  end: number;
  hasShoe: boolean;
  innerDiameter: number;
  casingId: string;
}
export interface Cement {
  toc: number;
  casingIds?: string[];
  /**
   * Should remove optional on casingIds when casingId is removed in next major release
   * @‌deprecated use casingIds
   */
  casingId?: string;
}

export interface MDPoint {
  point: number[];
  normal?: Vector2;
  md: number; // Currently calculated MD
}

export interface WellItemGraphics {
  graphics: Graphics;
}

export interface ScaleOptions {
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  xBounds?: [number, number];
  yBounds?: [number, number];
}

export interface Interpolators {
  trajectory: CurveInterpolator;
  curtain: ExtendedCurveInterpolator;
  curve?: ExtendedCurveInterpolator;
}

export interface Trajectory {
  points: number[][];
  offset: number;
}

export interface ReferenceSystemOptions {
  normalizedLength?: number;
  arcDivisions?: number;
  tension?: number;
  trajectoryAngle?: number;
  calculateDisplacementFromBottom?: boolean;
  curveInterpolator?: ExtendedCurveInterpolator;
  trajectoryInterpolator?: ExtendedCurveInterpolator;
  curtainInterpolator?: ExtendedCurveInterpolator;
  approxT?: boolean;
  quickT?: boolean;
}

export type BoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  offsetX?: number;
  offsetY?: number;
};

export interface CalloutOptions extends LayerOptions<Annotation[]> {
  minFontSize?: number;
  maxFontSize?: number;
  fontSizeFactor?: number;
  offsetMin?: number;
  offsetMax?: number;
  offsetFactor?: number;
}
