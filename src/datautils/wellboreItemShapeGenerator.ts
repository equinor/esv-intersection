import { Point } from 'pixi.js';
import { HoleObjectData, NormalCoordsObject, Cement, Casing, HoleSize, CompiledCement } from '..';
import { createNormals, offsetPoints } from '../utils/vectorUtils';

export const generateHoleCoords = (offsetCoordsRight: any, offsetCoordsLeft: any): any => {
  return {
    left: offsetCoordsRight,
    right: offsetCoordsLeft.map((d: Point) => d.clone()).reverse(),
    top: [offsetCoordsRight[0], offsetCoordsLeft[0]],
    bottom: [offsetCoordsRight[offsetCoordsRight.length - 1], offsetCoordsLeft[offsetCoordsLeft.length - 1]],
  };
};

export const createOffsetCoords = (s: HoleObjectData): NormalCoordsObject => {
  const wellBorePathCoords = s.points.map((p) => p.point);
  const normals = createNormals(wellBorePathCoords);
  const offsetCoordsRight = offsetPoints(wellBorePathCoords, normals, s.data.diameter);
  const offsetCoordsLeft = offsetPoints(wellBorePathCoords, normals, -s.data.diameter);

  if (offsetCoordsLeft.length <= 2) {
    return { wellBorePathCoords, offsetCoordsRight: wellBorePathCoords, offsetCoordsLeft: wellBorePathCoords };
  }

  return { wellBorePathCoords, offsetCoordsRight, offsetCoordsLeft };
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
