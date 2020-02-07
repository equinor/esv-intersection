import { Layer } from './layers/Layer';

interface LayerEvent {
  [propType: string]: any;
}

export interface OnMountEvent extends LayerEvent {
  elm: HTMLElement;
}

export interface OnUnmountEvent extends LayerEvent {
  elm?: HTMLElement;
}

export interface OnUpdateEvent extends LayerEvent {
  elm: HTMLElement;
}

export interface OnRescaleEvent extends LayerEvent {}

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

export interface GeomodelLayerOptions extends LayerOptions {}

export interface GeoModelData {
  name: string;
  color: number;
  md: number[];
  pos: [number, number][];
  bottomMd: number[];
  bottomPos: [number, number][];
}
