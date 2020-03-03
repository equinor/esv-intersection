import { ScaleLinear } from 'd3-scale';
import { ZoomTransform } from 'd3-zoom';
import { Point, Graphics } from 'pixi.js';
import { Layer } from './layers/Layer';

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
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
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
  order: Number;
  layerOpacity?: Number;

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

export interface GeoModelData {
  name: string;
  color: number;
  data: [number[]];
}

export interface ZoomAndPanOptions {
  maxZoomLevel: number;
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
  hasShoe?: boolean;
  innerDiameter?: number;
}

export interface Casing {
  diameter: number;
  length: number;
  start: number;
  hasShoe: boolean;
  innerDiameter: number;
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
