import Vector2 from '@equinor/videx-vector2';
import { Vector } from 'curve-interpolator/dist/src/core/interfaces';

type fx = (n: number) => Vector;

/*
 * Methods for calculating length of a curve
 */
export class ArcLength {
  /**
   * Calculate using an adaptive bisect method
   * @param {Number} func Curve function returning [x,y]
   * @param {Number} minLimit Min limit
   * @param {Number} maxLimit Max limit
   * @param {Number} tolerance Result tolerance
   * @param {Number} minDepth Min recursive depth before accepting solution
   * @param {Number} maxDepth Max recursive depth
   */
  static bisect(
    func: fx,
    minLimit: number = 0,
    maxLimit: number = 1,
    tolerance: number = 0.005,
    minDepth: number = 4,
    maxDepth: number = 10,
  ): number {
    const calcRec = (a: number, b: number, aVal: number[], bVal: number[], span: number, tolerance: number, depth: number = 0): number => {
      const mid = (a + b) / 2;
      const midVal = func(mid) as number[];
      const spanA = Vector2.distance(aVal, midVal);
      const spanB = Vector2.distance(midVal, bVal);
      const length = spanA + spanB;
      if ((depth >= minDepth && Math.abs(length - span) < tolerance) || depth >= maxDepth) {
        return length;
      }
      const tol = tolerance / 2;
      const d = depth + 1;
      return calcRec(a, mid, aVal, midVal, spanA, tol, d) + calcRec(mid, b, midVal, bVal, spanB, tol, d);
    };
    const aVal = func(minLimit) as number[];
    const bVal = func(maxLimit) as number[];
    const span = Vector2.distance(aVal, bVal);
    const res = calcRec(minLimit, maxLimit, aVal, bVal, span, tolerance);
    return res;
  }

  /**
   * Calculate using trapezoid method
   * @param {Number} func Curve function returning [x,y]
   * @param {Number} minLimit Min limit
   * @param {Number} maxLimit Max limit
   * @param {Number} segments Number of segments
   */
  static trapezoid(func: fx, minLimit: number = 0, maxLimit: number = 1, segments: number = 1000): number {
    let length = 0;
    let lastPos = func(minLimit) as number[];
    const step = (maxLimit - minLimit) / (segments - 1);
    for (let i = 1; i < segments; i++) {
      const pos = func(minLimit + i * step) as number[];
      const delta = Vector2.distance(lastPos, pos);
      length += delta;
      lastPos = pos;
    }
    return length;
  }
}
