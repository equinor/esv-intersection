import { Vector } from 'curve-interpolator/dist/src/core/interfaces';
type fx = (n: number) => Vector;
interface ArcLength {
    bisect: (func: fx, minLimit?: number, maxLimit?: number, tolerance?: number, minDepth?: number, maxDepth?: number) => number;
    trapezoid: (func: fx, minLimit?: number, maxLimit?: number, segments?: number) => number;
}
export declare const ArcLength: ArcLength;
export {};
//# sourceMappingURL=arc-length.d.ts.map