import { Point } from 'pixi.js';
import Vector2 from '@equinor/videx-vector2';

export const pointToVector = (p: Point): Vector2 => new Vector2(p.x, p.y);
export const pointToArray = (p: Point): [number, number] => [p.x, p.y];
export const vectorToPoint = (v: Vector2): Point => new Point(v[0], v[1]);
export const vectorToArray = (v: Vector2): [number, number] => [v[0] ?? 0, v[1] ?? 0];
export const arrayToPoint = (a: number[]): Point => new Point(a[0], a[1]);
export const arrayToVector = (a: number[]): Vector2 => new Vector2(a[0] ?? 0, a[1] ?? 0);

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

export const createNormals = (points: Point[]): Vector2[] => {
  if (points.length < 2) {
    return [new Vector2(0)];
  }

  let n: Vector2;

  return points.map((_coord, i, list) => {
    const curr = list[i];
    const next = list[i + 1];

    if (i < list.length - 1 && curr != null && next != null) {
      const p = pointToVector(curr);
      const q = pointToVector(next);
      const np = q.sub(p);
      const rotate = np.rotate90();
      n = rotate.normalized();
      return n;
    }

    // reuse previous normal for last coord
    return n;
  });
};

// TODO check if this can be simplified and return Vector/number[]
export const offsetPoint = (point: Point, vector: Vector2, offset: number): Point => {
  const p = pointToVector(point);
  return vectorToPoint(p.add(vector.scale(offset)));
};

export const offsetPoints = (points: Point[], vectors: Vector2[], offset: number): Point[] => {
  if (points.length !== vectors.length) {
    throw new Error('Number of vectors does not match number of points');
  }

  return points.map((point, index) => {
    const vector = vectors[index];

    if (vector != null) {
      return offsetPoint(point, vector, offset);
    }
    throw new Error(`Trying to read index ${index} of point ${point}, but no such vector was found!`);
  });
};
