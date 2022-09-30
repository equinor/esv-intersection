import { IPoint, Point } from 'pixi.js';
import { Cement, Casing, HoleSize, MDPoint } from '..';
import { HOLE_OUTLINE } from '../constants';
import { ComplexRopeSegment } from '../layers/CustomDisplayObjects/ComplexRope';

export const getEndLines = (
  rightPath: IPoint[],
  leftPath: IPoint[],
): {
  top: IPoint[];
  bottom: IPoint[];
} => {
  return {
    top: [rightPath[0], leftPath[0]],
    bottom: [rightPath[rightPath.length - 1], leftPath[leftPath.length - 1]],
  };
};

export const makeTubularPolygon = (rightPath: Point[], leftPath: Point[]): Point[] => {
  return [...leftPath, ...rightPath.map<Point>((d) => d.clone()).reverse()];
};

export const overlaps = (top1: number, bottom1: number, top2: number, bottom2: number): boolean => top1 <= bottom2 && top2 <= bottom1;

export const uniq = <T>(arr: T[]): T[] => Array.from<T>(new Set(arr));

export const findIntersectingItems = (
  topOfCement: number,
  bottomOfCement: number,
  parentCasings: Casing[],
  casings: Casing[],
  holes: HoleSize[],
): { overlappingHoles: HoleSize[]; outerCasings: Casing[] } => {
  const overlappingHoles = holes.filter((h: HoleSize) => overlaps(topOfCement, bottomOfCement, h.start, h.end));

  const otherCasings = casings.filter((c: Casing) => !parentCasings.includes(c));
  const overlappingCasings = otherCasings.filter((c: Casing) => overlaps(topOfCement, bottomOfCement, c.start, c.end));

  return {
    overlappingHoles,
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

  const diameterChangeDepths = diameterIntervals.flatMap((d) => [d.start, d.end]);
  const trimmedChangedDepths = diameterChangeDepths.filter((d) => d >= topOfCement && d <= bottomOfCement) as number[]; // trim

  trimmedChangedDepths.push(topOfCement);
  trimmedChangedDepths.push(bottomOfCement);

  const uniqDepths = uniq(trimmedChangedDepths);

  return uniqDepths.sort((a: number, b: number) => a - b);
};

export const findCementOuterDiameterAtDepth = (innerCasing: Casing[], nonAttachedCasings: Casing[], holes: HoleSize[], depth: number): number => {
  const defaultCementWidth = 100; // Default to flow cement outside to show error in data

  const innerCasingAtDepth = innerCasing.find((casing) => casing.start <= depth && casing.end >= depth);
  const innerDiameter = innerCasingAtDepth ? innerCasingAtDepth.diameter : 0;

  const outerCasings = nonAttachedCasings.filter((casing) => casing.innerDiameter > innerDiameter);
  const holeAtDepth = holes.find((hole) => hole.start <= depth && hole.end >= depth && hole.diameter > innerDiameter);
  const outerCasingAtDepth = outerCasings
    .filter((d) => d)
    .sort((a, b) => a.innerDiameter - b.innerDiameter) // ascending
    .find((casing) => casing.start <= depth && casing.end >= depth && casing.diameter > innerDiameter);

  let outerDiameter;
  if (outerCasingAtDepth) {
    outerDiameter = outerCasingAtDepth.innerDiameter;
  } else if (holeAtDepth) {
    outerDiameter = holeAtDepth.diameter - HOLE_OUTLINE;
  } else {
    outerDiameter = defaultCementWidth;
  }

  return outerDiameter;
};

export const createComplexRopeSegmentsForCement = (
  cement: Cement,
  casings: Casing[],
  holes: HoleSize[],
  exaggerationFactor: number,
  getPoints: (start: number, end: number, interestPoints: number[]) => MDPoint[],
): ComplexRopeSegment[] => {
  // Merge deprecated casingId and casingIds array
  // TODO remove casingId now?
  const casingIds = [cement.casingId, ...(cement.casingIds || [])].filter((id) => id);

  const attachedCasings = casingIds.map((casingId) => casings.find((casing) => casing.casingId === casingId));
  if (attachedCasings.length === 0 || attachedCasings.includes(undefined)) {
    throw new Error('Invalid cement data, cement is missing attached casing');
  }

  const topOfCement = cement.toc;
  attachedCasings.sort((a: Casing, b: Casing) => a.end - b.end); // ascending
  const bottomOfCement = attachedCasings[attachedCasings.length - 1].end;

  const { outerCasings, overlappingHoles } = findIntersectingItems(topOfCement, bottomOfCement, attachedCasings, casings, holes);

  const outerDiameterIntervals = [...outerCasings, ...overlappingHoles].map((d) => ({
    start: d.start,
    end: d.end,
  }));

  const changeDepths = cementDiameterChangeDepths(cement, bottomOfCement, outerDiameterIntervals);

  const diameterIntervals = changeDepths
    .map((depth, index, list) => {
      if (index === 0) {
        return;
      }

      const nextDepth = list[index - 1];
      const diameter = findCementOuterDiameterAtDepth(attachedCasings, outerCasings, overlappingHoles, depth) * exaggerationFactor;

      return { top: nextDepth, bottom: depth, diameter };
    })
    .filter((d) => d);

  const ropeSegments = diameterIntervals.map((interval) => {
    const mdPoints = getPoints(interval.top, interval.bottom, [interval.top, interval.bottom]);
    const points = mdPoints.map((mdPoint) => new Point(mdPoint.point[0], mdPoint.point[1]));

    return {
      diameter: interval.diameter,
      points,
    };
  });

  return ropeSegments;
};
