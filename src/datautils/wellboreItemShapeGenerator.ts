import { Point } from 'pixi.js';
import { merge } from 'd3-array';
import { Cement, Casing, HoleSize } from '..';
import { HOLE_OUTLINE } from '../constants';

export const getEndLines = (
  rightPath: Point[],
  leftPath: Point[],
): {
  top: Point[];
  bottom: Point[];
} => {
  return {
    top: [rightPath[0], leftPath[0]],
    bottom: [rightPath[rightPath.length - 1], leftPath[leftPath.length - 1]],
  };
};

export const makeTubularPolygon = (rightPath: Point[], leftPath: Point[]): Point[] => {
  return [
    ...leftPath,
    ...rightPath
      .map<Point>((d) => d.clone())
      .reverse(),
  ];
};

export const findCasing = (id: string, casings: Casing[]): Casing => {
  const res = casings.filter((c) => c.casingId === id);
  if (res.length === 0) {
    throw new Error('Casing not found');
  }
  return res[0];
};

export const overlaps = (top1: number, bottom1: number, top2: number, bottom2: number): boolean => top1 <= bottom2 && top2 <= bottom1;

export const uniq = <T>(arr: T[]): T[] => Array.from<T>(new Set(arr));

export const findIntersectingItems = (
  cement: Cement,
  parentCasing: Casing,
  casings: Casing[],
  holes: HoleSize[],
): { holes: HoleSize[]; outerCasings: Casing[] } => {
  const { toc: start } = cement;
  const { end } = parentCasing;
  const overlappingHoles = holes.filter((h: HoleSize) => overlaps(start, end, h.start, h.end) && h.diameter > parentCasing.diameter);
  const overlappingCasings = casings.filter(
    (c: Casing) => c.casingId !== cement.casingId && overlaps(start, end, c.start, c.end) && c.diameter > parentCasing.diameter,
  );

  return {
    holes: overlappingHoles,
    outerCasings: overlappingCasings,
  };
};

export const cementDiameterChangeDepths = (
  cement: Cement,
  bottomOfCement: number,
  diameterIntervals: {
    start: number;
    end: number;
  }[],
): number[] => {
  const topOfCement = cement.toc;

  const diameterChangeDepths =
    merge(
      diameterIntervals.map((d) => [
        d.start - 0.0001, // +- 0.0001 to find diameter right beforeobject
        d.start,
        d.end,
        d.end + 0.0001, // +- 0.0001 to find diameter right after object
      ]),
    ).filter((d) => d >= topOfCement && d <= bottomOfCement) as number[]; // trim

  diameterChangeDepths.push(topOfCement);
  diameterChangeDepths.push(bottomOfCement);

  const uniqDepths = uniq(diameterChangeDepths);

  return uniqDepths.sort((a: number, b: number) => a - b);
};

export const calculateCementDiameter = (innerCasing: Casing, nonAttachedCasings: Casing[], holes: HoleSize[]) => (
  depth: number,
): {
  md: number;
  innerDiameter: number;
  outerDiameter: number;
} => {
  const defaultCementWidth = 100; // Default to flow cement outside to show error in data

  const innerDiameter = innerCasing ? innerCasing.diameter : 0;

  const outerCasings = nonAttachedCasings.filter((casing) => casing.innerDiameter > innerDiameter);
  const holeAtDepth = holes.find((casing) => casing.start <= depth && casing.end >= depth);
  const outerCasingAtDepth = outerCasings
    .filter((d) => d)
    .sort((a, b) => a.innerDiameter - b.innerDiameter) // ascending
    .find((object) => object.start <= depth && object.end >= depth);

  let outerDiameter;
  if (outerCasingAtDepth) {
    outerDiameter = outerCasingAtDepth.innerDiameter;
  } else if (holeAtDepth) {
    outerDiameter = holeAtDepth.diameter - HOLE_OUTLINE;
  } else {
    outerDiameter = defaultCementWidth;
  }

  return {
    md: depth,
    innerDiameter,
    outerDiameter,
  };
};
