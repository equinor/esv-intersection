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
