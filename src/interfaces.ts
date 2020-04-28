import { ZoomTransform } from 'd3-zoom';
import { Point, Graphics } from 'pixi.js';
import { Layer } from './layers/base/Layer';
import { IntersectionReferenceSystem } from './control/IntersectionReferenceSystem';

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

export interface GeoModelData {
  name: string;
  color: number;
  data: [number[]];
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
  md: number;
  tvd: number;
  mdUnit: string;
  depthReferencePoint: string;
  data: number[];
  connector?: Connector;
  group: string;
}

export interface HoleSize {
  diameter: number;
  length: number;
  start: number;
  end: number;
  hasShoe?: boolean;
  innerDiameter?: number;
}

export interface Casing {
  diameter: number;
  length: number;
  start: number;
  end: number;
  hasShoe: boolean;
  innerDiameter: number;
  casingId: string;
}
export interface CompiledCement {
  toc: number;
  boc: number;
  casingId: string;
  intersectingItems: any;
}
export interface Cement {
  toc: number;
  casingId: string; // TODO find the actual ID
}

export interface MDPoint {
  point: Point;
  md: number; // Currently calculated MD
}

export interface HoleObjectData {
  data: HoleSize;
  points: MDPoint[];
  hasShoe?: boolean;
  innerDiameter?: number;
}

export interface WellItemGraphics {
  graphics: Graphics;
}

export interface NormalCoordsObject {
  wellBorePathCoords: Point[];
  normalOffsetCoordsDown: Point[];
  normalOffsetCoordsUp: Point[];
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
  defaultIntersectionAngle?: number;
  tension?: number;
  arcDivisions?: number;
  thresholdDirectionDist?: number;
}
