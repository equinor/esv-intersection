import { ZoomTransform } from 'd3-zoom';
import { Graphics } from 'pixi.js';
import Vector2 from '@equinor/videx-vector2';
import { ScaleLinear } from 'd3-scale';
import { ExtendedCurveInterpolator } from './control/ExtendedCurveInterpolator';
import { CurveInterpolator } from 'curve-interpolator';

interface LayerEvent {
  elm?: HTMLElement;
}

export interface OnMountEvent extends LayerEvent {
  elm: HTMLElement;
  width?: number;
  height?: number;
}

export type OnUnmountEvent = LayerEvent;

export interface OnResizeEvent extends LayerEvent {
  width: number;
  height: number;
}

export interface OnRescaleEvent extends LayerEvent {
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
  xBounds: [number, number];
  yBounds: [number, number];
  zFactor: number;
  viewportRatio: number;
  xRatio: number;
  yRatio: number;
  width: number;
  height: number;
  transform: ZoomTransform;
}

export interface OnUpdateEvent<T> extends LayerEvent {
  data?: T;
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

export type BoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  offsetX?: number;
  offsetY?: number;
};
