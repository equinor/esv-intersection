import {
  line,
  CurveFactory,
  CurveFactoryLineOnly,
  curveCatmullRom,
  curveLinear,
  curveBasis,
  curveBasisClosed,
  curveBundle,
  curveCardinal,
  curveMonotoneX,
  curveMonotoneY,
  curveNatural,
  curveStep,
  curveStepAfter,
  curveStepBefore,
} from 'd3-shape';
import { SVGLayer } from './base/SVGLayer';
import { OnUpdateEvent, OnRescaleEvent } from '../interfaces';
import { LayerOptions } from '..';

const CURVE_CATMULL_ROM_ALPHA = 0.7;
const CURVE_CARDINAL_TENSION = 0.9;
const CURVE_BUNDLE_BETA = 1.0;

export interface WellborepathLayerOptions<
  T extends [number, number][],
> extends LayerOptions<T> {
  stroke: string;
  strokeWidth: string;
  curveType?: string;
  tension?: number;
  /**
   * Index in `data` where the extrapolated portion begins. When set, points
   * from this index onward are rendered as a separate path so they can be
   * styled differently. Ignored if <= 0 or >= data.length.
   */
  extrapolationStartIndex?: number;
  extrapolatedStroke?: string;
  extrapolatedStrokeWidth?: string;
  extrapolatedOpacity?: number;
  extrapolatedStrokeDasharray?: string;
}

export class WellborepathLayer<
  T extends [number, number][],
> extends SVGLayer<T> {
  rescaleEvent: OnRescaleEvent | undefined;

  constructor(id?: string, options?: WellborepathLayerOptions<T>) {
    super(id, options);
    this.options = {
      ...this.options,
      ...options,
    };
    this.render = this.render.bind(this);
  }

  override onUpdate(event: OnUpdateEvent<T>): void {
    super.onUpdate(event);
    this.render();
  }

  override onRescale(event: OnRescaleEvent): void {
    super.onRescale(event);
    if (!this.elm) {
      return;
    }
    this.rescaleEvent = event;
    this.render();
  }

  render(): void {
    const {
      strokeWidth,
      stroke,
      extrapolationStartIndex,
      extrapolatedStroke,
      extrapolatedStrokeWidth,
      extrapolatedOpacity,
      extrapolatedStrokeDasharray,
    } = this.options as WellborepathLayerOptions<T>;

    if (!this.elm) {
      return;
    }
    this.elm.select('g').remove();

    const data =
      this.data ||
      (this.referenceSystem &&
        (this.referenceSystem.projectedPath as [number, number][]));
    if (!data || !this.rescaleEvent) {
      return;
    }

    const g = this.elm.append('g').attr('class', 'well-path');

    const hasExtrapolation =
      typeof extrapolationStartIndex === 'number' &&
      extrapolationStartIndex > 0 &&
      extrapolationStartIndex < data.length;

    // Real data is everything before the first extrapolated point.
    const realData = hasExtrapolation
      ? data.slice(0, extrapolationStartIndex)
      : data;

    g.append('path')
      .attr('d', this.renderWellborePath(realData))
      .attr('stroke-width', strokeWidth || '2px')
      .attr('stroke', stroke || 'red')
      .attr('fill', 'none');

    if (hasExtrapolation) {
      const extrapolatedData = data.slice(extrapolationStartIndex - 1);
      const extrapolatedPath = g
        .append('path')
        .attr('d', this.renderWellborePath(extrapolatedData))
        .attr('stroke-width', extrapolatedStrokeWidth || strokeWidth || '2px')
        .attr('stroke', extrapolatedStroke || stroke || 'red')
        .attr('fill', 'none');
      if (extrapolatedOpacity !== undefined) {
        extrapolatedPath.attr('opacity', extrapolatedOpacity);
      }
      if (extrapolatedStrokeDasharray) {
        extrapolatedPath.attr('stroke-dasharray', extrapolatedStrokeDasharray);
      }
    }
  }

  private renderWellborePath(data: [number, number][]): string {
    if (this.rescaleEvent != null) {
      const { xScale, yScale } = this.rescaleEvent;
      const transformedData: [number, number][] = data.map(d => [
        xScale(d[0]),
        yScale(d[1]),
      ]);

      const curveFactory = this.getCurveFactory();
      return line().curve(curveFactory)(transformedData) ?? '';
    }
    return '';
  }

  private getCurveFactory(): CurveFactory | CurveFactoryLineOnly {
    const { curveType, tension } = this.options as WellborepathLayerOptions<T>;
    switch (curveType) {
      case 'curveLinear':
        return curveLinear;
      case 'curveBasis':
        return curveBasis;
      case 'curveBasisClosed':
        return curveBasisClosed;
      case 'curveBundle':
        return curveBundle.beta(tension || CURVE_BUNDLE_BETA);
      case 'curveCardinal':
        return curveCardinal.tension(tension || CURVE_CARDINAL_TENSION);
      case 'curveMonotoneX':
        return curveMonotoneX;
      case 'curveMonotoneY':
        return curveMonotoneY;
      case 'curveNatural':
        return curveNatural;
      case 'curveStep':
        return curveStep;
      case 'curveStepAfter':
        return curveStepAfter;
      case 'curveStepBefore':
        return curveStepBefore;
      case 'curveCatmullRom':
      default:
        return curveCatmullRom.alpha(tension || CURVE_CATMULL_ROM_ALPHA);
    }
  }
}
