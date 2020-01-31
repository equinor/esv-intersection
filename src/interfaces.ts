import { Layer } from './layers/Layer';

interface LayerEvent {
  [propType: string]: any;
  elm?: HTMLElement;
}

export interface OnMountEvent extends LayerEvent {
  elm: HTMLElement;
}

export interface OnUnmountEvent extends LayerEvent {
}

export interface OnRescaleEvent extends LayerEvent {
  xScale: d3.ScaleLinear<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  xBounds?: [number, number],
  yBounds?: [number, number],
  zFactor?: number,
  viewportRatio?: number,
  width?: number;
  height?: number;
  xRatio?: number;
  yRatio?: number;
  transform?: d3.ZoomTransform,
}

export interface OnUpdateEvent extends OnRescaleEvent {
}

export interface LayerOptions {
  order: Number;
  layerOpacity?: Number;

  onMount?(event: OnMountEvent, layer: Layer): void;
  onUnmount?(event: OnUnmountEvent, layer: Layer): void;
  onUpdate?(event: OnUpdateEvent, layer: Layer): void;
  onRescale?(event: OnRescaleEvent, layer: Layer): void;
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

export interface ZoomAndPanOptions {
  maxZoomLevel: number,
}
