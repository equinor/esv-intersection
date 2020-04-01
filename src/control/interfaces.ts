import { Selection } from 'd3-selection';
import { IntersectionReferenceSystem } from './IntersectionReferenceSystem';
import { ScaleOptions } from '../interfaces';
import { Layer } from '../layers';

export interface Position {
  easting: number;
  northing: number;
  tvd: number;
  md: number;
}

export interface AxisOptions {
  xLabel: string;
  yLabel: string;
  unitOfMeasure: string;
}

export interface ControllerOptions {
  container: HTMLElement;
  axisOptions?: AxisOptions;
  scaleOptions: ScaleOptions;
  referenceSystem?: IntersectionReferenceSystem;
  layers?: Layer[];
  poslog?: Position[];
}

interface OverlayEvent {
  target?: HTMLElement;
  source: HTMLElement;
  caller: any;
}

export interface OverlayResizeEvent extends OverlayEvent {
  width: number;
  height: number;
}

export interface OverlayMouseMoveEvent extends OverlayEvent {
  x: number;
  y: number;
}

export interface OverlayMouseExitEvent extends OverlayEvent {}

export interface OverlayCallbacks {
  onMouseMove?(event: OverlayMouseMoveEvent): void;
  onMouseExit?(event: OverlayMouseExitEvent): void;
  onResize?(event: OverlayResizeEvent): void;
}

export interface Overlay {
  create(key: string, callbacks?: OverlayCallbacks): HTMLElement;
  register(key: string, callbacks: OverlayCallbacks): void;
  remove(key: string): void;
  elm: Selection<SVGElement, unknown, null, undefined>;
  elements: { [propName: string]: HTMLElement };
  listeners: { [propName: string]: OverlayCallbacks };
  enabled: boolean;
}
