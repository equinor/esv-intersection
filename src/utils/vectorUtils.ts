import { Point } from 'pixi.js';
import Vector2 from '@equinor/videx-vector2';

export const calcDist = (prev: number[], point: number[]): number => {
  const a = prev[0] - point[0];
  const b = prev[1] - point[1];

  return Math.sqrt(a * a + b * b);
};

export const calcDistPoint = (prev: Point, point: Point): number => {
  return calcDist([prev.x, prev.y], [point.x, point.y]);
};

export const calcNormal = (p1: Point, p2: Point): Point => {
  // if (p1 == null || p2 == null) {
  //   throw `Calculate normal null point: P1: ${p1} P2: ${p2}`;
  // }

  let dx = p2.x - p1.x;
  let dy = p2.y - p1.y;
  dx = dy === 0 ? 1 : dx;
  dy = dx === 0 ? 1 : dy;
  return new Point(-dy, dx);
};

export const pointToVector = (p: Point): Vector2 => new Vector2(p.x, p.y);

export const vectorToPoint = (v: Vector2): Point => new Point(v[0], v[1]);

export const pointToArray = (p: Point): [number, number] => [p.x, p.y];

export const arrayToPoint = (p: [number, number]): Point => new Point(p[0], p[1]);

export const convertToUnitVector = (vector: Point): Point => {
  const dist = calcDistPoint(new Point(0, 0), vector);
  const div = 1 / dist;
  const unitVector = new Point(div * vector.x, div * vector.y);
  return unitVector;
};

export const createNormal = (coords: Point[], offset: number): Point[] => {
  const newPoints: Point[] = [];
  const nextToLastPointIndex = 2;

  const old = convertToUnitVector(calcNormal(coords[1], coords[1 + 1]));
  const normalVec = Vector2.sub(pointToArray(coords[1]), pointToArray(coords[1 + 1])); //.normalized();
  console.log(normalVec, old);

  return [];

  for (let i = 0; i < coords.length - nextToLastPointIndex; i++) {
    // const old = convertToUnitVector(calcNormal(coords[i+1 ], coords[i ]));
    const normalVec = Vector2.sub(pointToArray(coords[i + 1]), pointToArray(coords[i + 1])).normalized();

    const newPoint = coords[i].clone();
    const newPoint2 = vectorToPoint(pointToVector(newPoint).add(normalVec.scale(offset)));
    // newPoint.x += normalVec.x * offset;
    // newPoint.y += normalVec.y * offset;
    // console.log(newPoint, newPoint2);
    newPoints.push(newPoint2);
  }
  if (coords.length > nextToLastPointIndex) {
    const lastPoint = Vector2.sub(
      pointToArray(coords[coords.length - nextToLastPointIndex - 1]),
      pointToArray(coords[coords.length - nextToLastPointIndex]),
    ).normalized();
    // const lastPoint = convertToUnitVector(calcNormal(coords[coords.length - nextToLastPointIndex - 1], coords[coords.length - nextToLastPointIndex]));
    const newPoint = coords[coords.length - nextToLastPointIndex].clone();
    newPoint.x += lastPoint.x * offset;
    newPoint.y += lastPoint.y * offset;
    newPoints.push(newPoint);
  }
  return newPoints;
};

// getAngle(p1: { y: number; x: number }, p2: { y: number; x: number }): number {
//   return Math.atan2(p2.y - p1.y, p2.x - p1.x);
// }
