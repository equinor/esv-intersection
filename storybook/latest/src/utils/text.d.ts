import { BoundingBox } from '../interfaces';
import { ScaleLinear } from 'd3-scale';
export declare function pixelsPerUnit(x: ScaleLinear<number, number>): number;
export declare function calcSize(factor: number, min: number, max: number, x: ScaleLinear<number, number>): number;
export declare function isOverlappingHorizontally(r1: BoundingBox, r2: BoundingBox): boolean;
export declare function isOverlapping(r1: BoundingBox, r2: BoundingBox, horizontalPadding?: number, verticalPadding?: number): boolean;
export declare function getOverlap(r1: BoundingBox, r2: BoundingBox): {
    dx: number;
    dy: number;
};
export declare function getOverlapOffset(r1: BoundingBox, r2: BoundingBox, horizontalPadding?: number, verticalPadding?: number): {
    dx: number;
    dy: number;
};
//# sourceMappingURL=text.d.ts.map