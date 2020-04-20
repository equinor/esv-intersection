import { Point } from 'pixi.js';
import { HoleObjectData, NormalCoordsObject, MDPoint } from '..';
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
  startIndex -= 0;
  stopIndex += 0;
  start = s.points[startIndex >= 0 ? startIndex : 0].point;
  stop = s.points[stopIndex <= s.points.length ? stopIndex : s.points.length - 1].point;
  return [start, ...a.map((b: MDPoint) => b.point), stop];
};
