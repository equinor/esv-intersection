import { IntersectionReferenceSystem } from './IntersectionReferenceSystem';
import { ScaleOptions } from '../interfaces';
import { Layer } from '../layers';

export interface AxisOptions {
  xLabel: string;
  yLabel: string;
  unitOfMeasure: string;
}

export interface ControllerOptions {
  container: HTMLElement;
  overlayElementGetter: Function;
  axisOptions?: AxisOptions;
  scaleOptions?: ScaleOptions;
  referenceSystem?: IntersectionReferenceSystem;
  layers?: Layer[];
  path?: number[][];
}

interface OverlayEvent {
  target?: Element;
  source: Element;
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
