import { IPoint, Point } from 'pixi.js';
import Vector2 from '@equinor/videx-vector2';
export declare const pointToVector: (p: IPoint) => Vector2;
export declare const pointToArray: (p: IPoint) => [number, number];
export declare const vectorToPoint: (v: Vector2) => Point;
export declare const vectorToArray: (v: Vector2) => [number, number];
export declare const arrayToPoint: (a: number[]) => Point;
export declare const arrayToVector: (a: number[]) => Vector2;
export declare const calcDist: (prev: [number, number], point: [number, number]) => number;
export declare const calcDistPoint: (prev: Point, point: Point) => number;
export declare const calcNormal: (p1: Point, p2: Point) => Point;
export declare const convertToUnitVector: (p: Point) => Point;
export declare const createNormals: (points: IPoint[]) => Vector2[];
export declare const offsetPoint: (point: IPoint, vector: Vector2, offset: number) => Point;
export declare const offsetPoints: (points: IPoint[], vectors: Vector2[], offset: number) => Point[];
//# sourceMappingURL=vectorUtils.d.ts.map