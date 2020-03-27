/* eslint-disable no-underscore-dangle */
import { ScaleLinear, scaleLinear } from 'd3-scale';
import { ScaleOptions } from '../interfaces';

// Purpose of this manager is to serve the scales out to the necessary parties
export class ScaleManager {
  private _xScale: ScaleLinear<number, number>;

  private _yScale: ScaleLinear<number, number>;

  constructor(scaleOptions: ScaleOptions) {
    const { xMin, xMax, yMin, yMax, width, height } = scaleOptions;
    this._xScale = scaleLinear().domain([xMin, xMax]).range([0, width]);
    this._yScale = scaleLinear().domain([yMin, yMax]).range([0, height]);
  }

  /**
   * [x, y]
   */
  get scales(): ScaleLinear<number, number>[] {
    return [this._xScale.copy(), this.yScale.copy()];
  }

  set xScale(xScale: ScaleLinear<number, number>) {
    this._xScale = xScale;
  }

  get xScale(): ScaleLinear<number, number> {
    return this._xScale.copy();
  }

  set yScale(yScale: ScaleLinear<number, number>) {
    this._yScale = yScale;
  }

  get yScale(): ScaleLinear<number, number> {
    return this._yScale.copy();
  }

  get xDomain(): number[] {
    return this._xScale.domain();
  }

  get xRange(): number[] {
    return this._xScale.range();
  }

  get yDomain(): number[] {
    return this._yScale.domain();
  }

  get yRange(): number[] {
    return this._yScale.range();
  }
}
