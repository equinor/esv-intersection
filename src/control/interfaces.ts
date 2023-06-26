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
  axisOptions?: AxisOptions;
  scaleOptions?: ScaleOptions;
  referenceSystem?: IntersectionReferenceSystem;
  layers?: Layer<unknown>[];
  path?: number[][];
}

interface OverlayEvent<T> {
  target: Element | undefined;
  source: Element | undefined;
  caller: T;
}

export interface OverlayResizeEvent<T> extends OverlayEvent<T> {
  width: number;
  height: number;
}

export interface OverlayMouseMoveEvent<T> extends OverlayEvent<T> {
  x: number;
  y: number;
}

export type OverlayMouseExitEvent<T> = OverlayEvent<T>;

export interface OverlayCallbacks<T> {
  onMouseMove?(event: OverlayMouseMoveEvent<T>): void;
  onMouseExit?(event: OverlayMouseExitEvent<T>): void;
  onResize?(event: OverlayResizeEvent<T>): void;
}
