import { Point } from 'pixi.js';
import Vector2 from '@equinor/videx-vector2';

export const pointToVector = (p: Point): Vector2 => new Vector2(p.x, p.y);
export const pointToArray = (p: Point): [number, number] => [p.x, p.y];
export const vectorToPoint = (v: Vector2): Point => new Point(v[0], v[1]);
export const vectorToArray = (v: Vector2): [number, number] => [v[0], v[1]];
export const arrayToPoint = (a: [number, number]): Point => new Point(a[0], a[1]);
export const arrayToVector = (a: [number, number]): Vector2 => new Vector2(a[0], a[1]);


export const calcDist = (prev: [number, number], point: [number, number]): number => {
  return arrayToVector(point).sub(prev).magnitude;
};

export const calcDistPoint = (prev: Point, point: Point): number => {
  return pointToVector(point).sub(prev.x, prev.y).magnitude;
};

export const calcNormal = (p1: Point, p2: Point): Point => {
  const d = pointToVector(p2).sub(p1.x, p1.y);
  d.x = d.y === 0 ? 1 : d.x;
  d.y = d.x === 0 ? 1 : d.y;
  return vectorToPoint(d.rotate90()); //TODO: normalize
};

export const convertToUnitVector = (p: Point): Point => {
  return vectorToPoint(pointToVector(p).normalize());
};

export const createNormal = (coords: Point[], offset: number): Point[] => {
  const newPoints: Point[] = [];
  const nextToLastPointIndex = 2;

  for (let i = 0; i < coords.length - nextToLastPointIndex; i++) {
    const p = pointToVector(coords[i]);
    const n = pointToVector(coords[i+1]).sub(p).rotate90().normalize()
    newPoints.push(vectorToPoint(p.add(n.scale(offset))));
  }
  if (coords.length > nextToLastPointIndex) {
    const p = pointToVector(coords[coords.length - nextToLastPointIndex]);
    const q = pointToVector(coords[coords.length - nextToLastPointIndex - 1]);
    const n = p.sub(q).rotate90().normalize()
    newPoints.push(vectorToPoint(p.add(n.scale(offset))));
  }
  return newPoints;
};

// getAngle(p1: { y: number; x: number }, p2: { y: number; x: number }): number {
//   return Math.atan2(p2.y - p1.y, p2.x - p1.x);
// }
