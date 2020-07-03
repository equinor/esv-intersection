import { Point } from 'pixi.js';
import { HoleObjectData, NormalCoordsObject, MDPoint, Cement, Casing, HoleSize, CompiledCement } from '..';
import { createNormals, pointToArray, arrayToPoint, offsetPoints } from '../utils/vectorUtils';
import { CurveInterpolator } from 'curve-interpolator';

export const generateHoleCoords = (normalOffsetCoordsUp: any, normalOffsetCoordsDown: any): any => {
  return {
    left: normalOffsetCoordsUp,
    right: normalOffsetCoordsDown.map((d: Point) => d.clone()).reverse(),
    top: [normalOffsetCoordsUp[0], normalOffsetCoordsDown[0]],
    bottom: [normalOffsetCoordsUp[normalOffsetCoordsUp.length - 1], normalOffsetCoordsDown[normalOffsetCoordsDown.length - 1]],
  };
};

export const createNormalCoords = (s: HoleObjectData): NormalCoordsObject => {
  const wellBorePathCoords = s.points.map((p) => p.point);
  const normals = createNormals(wellBorePathCoords);
  const normalOffsetCoordsUpOrig = offsetPoints(wellBorePathCoords, normals, s.data.diameter);
  const normalOffsetCoordsDownOrig = offsetPoints(wellBorePathCoords, normals, -s.data.diameter);

  if (normalOffsetCoordsUpOrig.length <= 2) {
    return { wellBorePathCoords, normalOffsetCoordsDown: wellBorePathCoords, normalOffsetCoordsUp: wellBorePathCoords };
  }

  const tension = 0.2;
  const numPoints = 999;
  const normalOffsetCoordsUpInterpolator = new CurveInterpolator(normalOffsetCoordsUpOrig.map(pointToArray), tension);
  const normalOffsetCoordsDownInterpolator = new CurveInterpolator(normalOffsetCoordsDownOrig.map(pointToArray), tension);
  const normalOffsetCoordsUp = normalOffsetCoordsUpInterpolator.getPoints(numPoints).map(arrayToPoint);
  const normalOffsetCoordsDown = normalOffsetCoordsDownInterpolator.getPoints(numPoints).map(arrayToPoint);

  return { wellBorePathCoords, normalOffsetCoordsDown, normalOffsetCoordsUp };
};

export const findCasing = (id: string, casings: any) => {
  const res = casings.filter((c: any) => c.casingId === id);
  return res.length > 0 ? res[0] : {};
};

export const overlaps = (top1: number, bottom1: number, top2: number, bottom2: number): boolean => top1 <= bottom2 && top2 <= bottom1;

export const findIntersectingItems = (cement: Cement, parentCasing: Casing, casings: Casing[], holes: HoleSize[]) => {
  const { toc: start } = cement;

  const res = [];
  res.push(...holes.filter((h: HoleSize) => overlaps(start, parentCasing.end, h.start, h.end) && h.diameter > parentCasing.diameter));
  res.push(
    ...casings.filter(
      (c: Casing) => c.casingId !== cement.casingId && overlaps(start, parentCasing.end, c.start, c.end) && c.diameter > parentCasing.diameter,
    ),
  );
  return res;
};
