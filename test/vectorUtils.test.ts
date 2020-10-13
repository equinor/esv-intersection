import { Point } from 'pixi.js';
import Vector2 from '@equinor/videx-vector2';
import { createNormals, offsetPoints } from '../src/utils/vectorUtils';

describe('vectorUtils', () => {
  describe('createNormals', () => {
    let points: number[][];

    beforeEach(() => {
      points = [
        [0, 0],
        [1, 1],
      ];
    });

    it('should return a 0 vector for list of only 1 point', () => {
      const normals = createNormals([[1, 1]]);
      expect(normals[0].x).toEqual(0);
      expect(normals[0].y).toEqual(0);
      expect(normals[0].magnitude).toEqual(0);
    });

    it('should create a normal for each point', () => {
      const normals = createNormals(points);
      normals.forEach((normal) => {
        expect(normal instanceof Vector2).toEqual(true);
      });
      expect(normals.length).toEqual(points.length);
    });

    it('should calculate vectors', () => {
      const normals = createNormals(points);
      const normal45 = new Vector2(-0.70710678118, 0.70710678118);
      expect(normals[0].x).toBeCloseTo(normal45.x, 10);
      expect(normals[0].y).toBeCloseTo(normal45.y, 10);
    });

    it('should be normalized', () => {
      const normals = createNormals(points);
      expect(normals[0].magnitude).toBeCloseTo(1, 10);
    });
  });

  describe('offsetPoints', () => {
    let points: number[][];
    let normals: Vector2[];
    let newPoints: Point[];

    beforeEach(() => {
      const vector = new Vector2(-0.70710678118, 0.70710678118);
      points = [
        [0, 0],
        [1, 1],
        [2, 2],
      ];
      normals = [vector.clone(), vector.clone(), vector.clone()];
      newPoints = offsetPoints(points, normals, 1);
    });

    it('should trow an error if unequal numbers of points and vectors', () => {
      normals.pop();
      expect(() => {
        offsetPoints(points, normals, 1);
      }).toThrowError();
    });

    it('should offset each point with the corresponding vector', () => {
      expect(newPoints[0]).toEqual(new Point(-0.70710678118, 0.70710678118));
      expect(newPoints[1]).toEqual(new Point(0.29289321881999997, 1.70710678118));
      expect(newPoints[2]).toEqual(new Point(1.29289321882, 2.7071067811800003));
    });
  });
});
