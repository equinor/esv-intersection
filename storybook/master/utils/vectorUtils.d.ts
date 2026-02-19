import { Point } from 'pixi.js';
import { default as Vector2 } from '@equinor/videx-vector2';
export declare const pointToVector: (p: Point) => Vector2;
export declare const pointToArray: (p: Point) => [number, number];
export declare const vectorToPoint: (v: Vector2) => Point;
export declare const vectorToArray: (v: Vector2) => [number, number];
export declare const arrayToPoint: (a: number[]) => Point;
export declare const arrayToVector: (a: number[]) => Vector2;
export declare const calcDist: (prev: [number, number], point: [number, number]) => number;
export declare const calcDistPoint: (prev: Point, point: Point) => number;
export declare const calcNormal: (p1: Point, p2: Point) => Point;
export declare const convertToUnitVector: (p: Point) => Point;
export declare const createNormals: (points: Point[]) => Vector2[];
export declare const offsetPoint: (point: Point, vector: Vector2, offset: number) => Point;
export declare const offsetPoints: (points: Point[], vectors: Vector2[], offset: number) => Point[];
//# sourceMappingURL=vectorUtils.d.ts.map