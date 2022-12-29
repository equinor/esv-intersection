import { Vector } from 'curve-interpolator/dist/src/interfaces';
declare type fx = (n: number) => Vector;
export declare class ArcLength {
    /**
     * Calculate using an adaptive bisect method
     * @param {Number} func Curve function returning [x,y]
     * @param {Number} minLimit Min limit
     * @param {Number} maxLimit Max limit
     * @param {Number} tolerance Result tolerance
     * @param {Number} minDepth Min recursive depth before accepting solution
     * @param {Number} maxDepth Max recursive depth
     */
    static bisect(func: fx, minLimit?: number, maxLimit?: number, tolerance?: number, minDepth?: number, maxDepth?: number): number;
    /**
     * Calculate using trapezoid method
     * @param {Number} func Curve function returning [x,y]
     * @param {Number} minLimit Min limit
     * @param {Number} maxLimit Max limit
     * @param {Number} segments Number of segments
     */
    static trapezoid(func: fx, minLimit?: number, maxLimit?: number, segments?: number): number;
}
export {};
