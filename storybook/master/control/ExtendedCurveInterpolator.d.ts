import { CurveInterpolator } from 'curve-interpolator';
import { Vector } from 'curve-interpolator/dist/src/core/interfaces';
import { CurveInterpolatorOptions } from 'curve-interpolator/dist/src/curve-interpolator';
export declare class ExtendedCurveInterpolator extends CurveInterpolator {
    arcLengthLookup: number[];
    constructor(points: Vector[], options?: CurveInterpolatorOptions);
    /**
     * Function which finds t value for arc length
     * @param {Number} arcLength Target arc length
     * @param {Number} tolerance Tolerance for result
     * @param {Number} iterations Max number of iterations to use
     */
    findTForArcLength(arcLength: number, options?: {
        approxT?: boolean;
        quickT?: boolean;
        normalizedLength?: number;
    }): number;
    /**
     * Function which finds t value for arc length by finding root
     * @param {Number} arcLength Target arc length
     * @param {Number} tolerance Tolerance for result
     * @param {Number} iterations Max number of iterations to use
     */
    findTByRootForArcLength(arcLength: number, tolerance?: number, iterations?: number): number;
    /**
     * Function which finds t value for arc length by simple approximation
     * @param {Number} arcLength Target arclength
     */
    findApproxTForArcLength(arcLength: number, normalizedLength?: number): number;
    /**
     * Function which finds t value for arc length using lookup table
     * @param {Number} arcLength Target arclength
     */
    findTQuickForArcLength(arcLength: number): number;
    generateArcLengthLookup(segments?: number): void;
    /**
     * Function calculating length along curve using interpolator.
     * @param {Number} from t at start (default = 0)
     * @param {Number} to t at end (default = 1)
     */
    getArcLength(from?: number, to?: number): number;
    /**
     * Function calculating length along curve using interpolator.
     * @param {Number} from t at start (default = 0)
     * @param {Number} to t at end (default = 1)
     */
    getQuickArcLength(from?: number, to?: number): number;
    /**
     * Function getting a point at curve length.
     * @param {Number} arcLength
     */
    getPointAtArcLength(arcLength: number, options?: {
        approxT?: boolean;
        quickT?: boolean;
        normalizedLength?: number;
    }): Vector;
    getPointAt(t: number): Vector;
}
//# sourceMappingURL=ExtendedCurveInterpolator.d.ts.map