import { clamp } from '@equinor/videx-math';

type fx = (n: number) => number;

/*
 * Methods for finding root of a function
 */
export class RootFinder {
  /**
   * Find root using newthons method
   * @param {Number} func f(x)
   * @param {Number} precision Accuracy of result
   * @param {Number} maxIterations Max number of iterations to use
   * @param {Number} start Starting position
   * @param {Number} minLimit Min limit of result
   * @param {Number} maxLimit Max limit of result
   */
  static newton(func: fx, precision: number = 0.01, maxIterations: number = 1000, start = 0.5, minLimit = 0, maxLimit = 1): number {
    const h = 0.0001;
    let t = start;
    for (let i = 0; i < maxIterations; i++) {
      const v = func(t);
      if (Math.abs(v) < precision) {
        return clamp(t, minLimit, maxLimit);
      }
      const d = (func(t + h) - v) / h;
      t = t - v / d;
    }
    return null;
  }

  /**
   * Find root using bisect method
   * @param {Number} func f(x)
   * @param {Number} precision Accuracy of result
   * @param {Number} maxIterations Max number of iterations to use
   * @param {Number} start Starting position
   * @param {Number} minLimit Min limit of result
   * @param {Number} maxLimit Max limit of result
   */
  static bisect(func: fx, precision: number = 0.01, maxIterations: number = 1000, start = 0.5, minLimit = 0, maxLimit = 1): number {
    let tl = minLimit;
    let th = maxLimit;
    let t = start;
    let v;
    let i;
    for (i = 0; i < maxIterations; i++) {
      v = func(t);
      if (Math.abs(v) < precision) {
        return t;
      }
      if (v < 0) {
        th = t;
      } else {
        tl = t;
      }
      t = (th + tl) / 2;
    }
    return t;
  }

  /**
   * Find root by trying available methods
   * @param {Number} func f(x)
   * @param {Number} precision Accuracy of result
   * @param {Number} maxIterations Max number of iterations to use
   * @param {Number} start Starting position
   * @param {Number} minLimit Min limit of result
   * @param {Number} maxLimit Max limit of result
   */
  static findRoot(func: fx, precision: number = 0.01, maxIterations: number = 1000, start = 0.5, minLimit = 0, maxLimit = 1): number {
    let t = RootFinder.newton(func, precision, maxIterations, start);
    if (t == null) {
      t = RootFinder.bisect(func, precision, maxIterations, start, minLimit, maxLimit);
    }
    return t;
  }
}
