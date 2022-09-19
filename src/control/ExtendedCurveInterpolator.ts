/* eslint-disable no-magic-numbers */
import Vector2 from '@equinor/videx-vector2';
import { clamp } from '@equinor/videx-math';
import { CurveInterpolator } from 'curve-interpolator';
import { Vector } from 'curve-interpolator/dist/src/interfaces';
import { CurveInterpolatorOptions } from 'curve-interpolator/dist/src/curve-interpolator';

import { RootFinder } from '../utils/root-finder';
import { ArcLength } from '../utils/arc-length';
import { BinarySearch } from '../utils/binary-search';

export class ExtendedCurveInterpolator extends CurveInterpolator {
  arcLengthLookup: number[] = [];

  constructor(points: Vector[], options?: CurveInterpolatorOptions) {
    super(points, options);
    this.findTForArcLength = this.findTForArcLength.bind(this);
    this.findTByRootForArcLength = this.findTByRootForArcLength.bind(this);
    this.findApproxTForArcLength = this.findApproxTForArcLength.bind(this);
    this.findTQuickForArcLength = this.findTQuickForArcLength.bind(this);
    this.generateArcLengthLookup = this.generateArcLengthLookup.bind(this);
    this.getArcLength = this.getArcLength.bind(this);
    this.getQuickArcLength = this.getQuickArcLength.bind(this);
    this.getPointAtArcLength = this.getPointAtArcLength.bind(this);
    this.getPointAt = this.getPointAt.bind(this);
  }

  /**
   * Function which finds t value for arc length
   * @param {Number} arcLength Target arc length
   * @param {Number} tolerance Tolerance for result
   * @param {Number} iterations Max number of iterations to use
   */
  findTForArcLength(arcLength: number, options?: { approxT?: boolean; quickT?: boolean; normalizedLength?: number }): number {
    // TODO: Ideally the CurveInterpolator should be able to provide t for curve length
    let t;
    if (options?.approxT) {
      t = this.findApproxTForArcLength(arcLength, options?.normalizedLength);
    } else if (options?.quickT) {
      t = this.findTQuickForArcLength(arcLength);
    } else {
      t = this.findTByRootForArcLength(arcLength);
    }
    return t;
  }

  /**
   * Function which finds t value for arc length by finding root
   * @param {Number} arcLength Target arc length
   * @param {Number} tolerance Tolerance for result
   * @param {Number} iterations Max number of iterations to use
   */
  findTByRootForArcLength(arcLength: number, tolerance = 0.01, iterations = 100): number {
    if (arcLength <= 0) {
      return 0.0;
    }
    if (arcLength >= this.length) {
      return 1.0;
    }
    const t = RootFinder.findRoot((x) => arcLength - this.getQuickArcLength(0, x), tolerance, iterations, arcLength / this.length);
    return t;
  }

  /**
   * Function which finds t value for arc length by simple approximation
   * @param {Number} arcLength Target arclength
   */
  findApproxTForArcLength(arcLength: number, normalizedLength?: number): number {
    const t = arcLength / (normalizedLength || this.length);
    return t;
  }

  /**
   * Function which finds t value for arc length using lookup table
   * @param {Number} arcLength Target arclength
   */
  findTQuickForArcLength(arcLength: number): number {
    if (this.arcLengthLookup.length === 0) {
      this.generateArcLengthLookup();
    }
    const index = BinarySearch.search(this.arcLengthLookup, arcLength);
    const v1 = this.arcLengthLookup[index];
    const v2 = this.arcLengthLookup[index + 1];
    const t = (index + (arcLength - v1) / (v2 - v1)) / this.arcLengthLookup.length;
    return t;
  }

  generateArcLengthLookup(segments: number = 1000): void {
    let lastPos = this.getPointAt(0);
    let length = 0;
    for (let i = 0; i < segments; i++) {
      const pos = this.getPointAt(i / (segments - 1));
      const delta = Vector2.distance(lastPos as number[], pos as number[]);
      length += delta;
      this.arcLengthLookup.push(length);
      lastPos = pos;
    }
  }

  /**
   * Function calculating length along curve using interpolator.
   * @param {Number} from t at start (default = 0)
   * @param {Number} to t at end (default = 1)
   */
  getArcLength(from = 0, to = 1): number {
    if (from === 0 && to === 1) {
      return this.length;
    }
    return ArcLength.bisect((t: number) => this.getPointAt(t), from, to, 0.002);
  }

  /**
   * Function calculating length along curve using interpolator.
   * @param {Number} from t at start (default = 0)
   * @param {Number} to t at end (default = 1)
   */
  getQuickArcLength(from = 0, to = 1): number {
    let fromLength = 0;
    let toLength = this.length;
    if (this.arcLengthLookup.length === 0) {
      this.generateArcLengthLookup();
    }

    if (from !== 0) {
      const fromIndex = Math.floor(from * this.arcLengthLookup.length);
      const fromLl = this.arcLengthLookup[fromIndex];
      const fromLh = this.arcLengthLookup[fromIndex + 1];
      fromLength = fromLl + ((from * this.arcLengthLookup.length) % this.arcLengthLookup.length) * (fromLh - fromLl);
    }

    if (to !== 1) {
      const toIndex = Math.floor(to * this.arcLengthLookup.length);
      const toLl = this.arcLengthLookup[toIndex];
      const toLh = this.arcLengthLookup[toIndex + 1];
      toLength = toLl + ((from * this.arcLengthLookup.length) % this.arcLengthLookup.length) * (toLh - toLl);
    }

    const totalLength = toLength - fromLength;
    return totalLength;
  }

  /**
   * Function getting a point at curve length.
   * @param {Number} arcLength
   */
  getPointAtArcLength(arcLength: number, options?: { approxT?: boolean; quickT?: boolean; normalizedLength?: number }): Vector {
    const t = this.findTForArcLength(arcLength, options);
    return this.getPointAt(t);
  }

  getPointAt(t: number): number[] {
    const tl = clamp(t, 0, 1);
    return super.getPointAt(tl) as number[];
  }
}
