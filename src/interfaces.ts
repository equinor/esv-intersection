import { ZoomTransform } from 'd3-zoom';
import { Point, Graphics } from 'pixi.js';
import { Layer } from './layers/base/Layer';
import { IntersectionReferenceSystem } from './control/IntersectionReferenceSystem';
import Vector2 from '@equinor/videx-vector2';

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

export interface LayerOptions {
  order?: number;
  layerOpacity?: number;
  referenceSystem?: IntersectionReferenceSystem;
  data?: any;
  interactive?: boolean;

  onMount?(event: OnMountEvent, layer: Layer): void;
  onUnmount?(event: OnUnmountEvent, layer: Layer): void;
  onUpdate?(event: OnUpdateEvent, layer: Layer): void;
  onRescale?(event: OnRescaleEvent, layer: Layer): void;
  onResize?(event: OnResizeEvent, layer: Layer): void;
}

export interface GridLayerOptions extends LayerOptions {
  majorWidth?: number;
  majorColor?: string;

  minorWidth?: number;
  minorColor?: string;
}

export interface WellborepathLayerOptions extends LayerOptions {
  stroke: string;
  strokeWidth: string;
}

export interface GeomodelLayerOptions extends LayerOptions {}

export interface CompletionLayerOptions extends LayerOptions {}

export interface GeomodelLayerLabelsOptions extends LayerOptions {
  margins?: number;
  minFontSize?: number;
  maxFontSize?: number;
  textColor?: string;
  font?: string;
}

export interface HoleSizeLayerOptions extends WellComponentBaseOptions {}

export interface CasingLayerOptions extends WellComponentBaseOptions {}

export interface CementLayerOptions extends WellComponentBaseOptions {
  percentFirstColor?: number;
  rotation?: number;
}

export interface WellComponentBaseOptions extends LayerOptions {
  solidColor?: string;
  firstColor?: string;
  secondColor?: string;
  lineColor?: number;
  topBottomLineColor?: number;
  maxTextureDiameterScale?: number;
  margins?: number;
  minFontSize?: number;
  maxFontSize?: number;
  textColor?: string;
  font?: string;
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

export interface Interpolator {
  trajectory: any;
  curtain: any;
  position?: any;
  curve?: any;
}

export interface Trajectory {
  points: number[][];
  offset: number;
}

export interface ReferenceSystemOptions {
  trajectoryAngle?: number;
  calculateDisplacementFromBottom?: boolean;
}

export type BoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  offsetX?: number;
  offsetY?: number;
};

export interface CalloutOptions extends LayerOptions {
  minFontSize?: number;
  maxFontSize?: number;
  fontSizeFactor?: number;
  offsetMin?: number;
  offsetMax?: number;
  offsetFactor?: number;
}
