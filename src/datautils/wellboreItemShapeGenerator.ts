import { Point } from 'pixi.js';
import { HoleObjectData, NormalCoordsObject, MDPoint, Cement, Casing, HoleSize, CompiledCement } from '..';
import { createNormal, pointToArray, arrayToPoint } from '../utils/vectorUtils';
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
  const wellBorePathCoords = actualPoints(s);
  const normalOffsetCoordsUpOrig = createNormal(wellBorePathCoords, s.data.diameter);
  const normalOffsetCoordsDownOrig = createNormal(wellBorePathCoords, -s.data.diameter);

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

export const actualPoints = (s: HoleObjectData): Point[] => {
  let start = new Point();
  let stop = new Point();
  let startIndex = 0;
  let stopIndex = 0;
  const a = s.points.filter((p: MDPoint, index: number) => {
    if (s.data.start > p.md) {
      startIndex = index;
    }
    if (s.data.start + s.data.length >= p.md) {
      stopIndex = index;
    }
    return p.md > s.data.start && p.md < s.data.start + s.data.length;
  });

  if (a == null || a.length === 0) {
    return [];
  }

  startIndex -= 0;
  stopIndex += 0;
  start = s.points[startIndex >= 0 ? startIndex : 0].point;
  stop = s.points[stopIndex <= s.points.length ? stopIndex : s.points.length - 1].point;
  return [start, ...a.map((b: MDPoint) => b.point), stop];
};

export const findCasing = (id: string, casings: any) => {
  const res = casings.filter((c: any) => c.casingId === id);
  return res.length > 0 ? res[0] : {};
};

export const isBetween = (top: number, bottom: number, itemBottom: number, itemTop: number) => {
  // item is inside
  if (itemTop < top && itemBottom > bottom) {
    return true;
  }

  // Top half and over
  if (itemTop > top && itemBottom < top) {
    return true;
  }

  // bottom half and below
  if (itemTop > bottom && itemBottom < bottom) {
    return true;
  }

  return false;
};

export const findIntersectingItems = (cement: Cement, parentCasing: Casing, casings: Casing[], holes: HoleSize[]) => {
  const { toc: start } = cement;

  const res = [];
  res.push(...holes.filter((h: HoleSize) => isBetween(start, parentCasing.end, h.start, h.end) && h.diameter > parentCasing.diameter));
  res.push(
    ...casings.filter(
      (c: Casing) => c.casingId !== cement.casingId && isBetween(start, parentCasing.end, c.start, c.end) && c.diameter > parentCasing.diameter,
    ),
  );
  return res;
};
