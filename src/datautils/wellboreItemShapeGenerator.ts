import { Point } from 'pixi.js';
import { merge } from 'd3-array';
import { Cement, Casing, HoleSize, CompiledCement } from '..';
import { HOLE_OUTLINE } from '../constants';

export const groupCoords = (offsetCoordsRight: any, offsetCoordsLeft: any): any => {
  return {
    left: offsetCoordsRight,
    right: offsetCoordsLeft.map((d: Point) => d.clone()).reverse(),
    top: [offsetCoordsRight[0], offsetCoordsLeft[0]],
    bottom: [offsetCoordsRight[offsetCoordsRight.length - 1], offsetCoordsLeft[offsetCoordsLeft.length - 1]],
  };
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
): { holes: HoleSize[]; casings: Casing[] } => {
  const { toc: start } = cement;
  const { end } = parentCasing;
  const overlappingHoles = holes.filter((h: HoleSize) => overlaps(start, end, h.start, h.end) && h.diameter > parentCasing.diameter);
  const overlappingCasings = casings.filter(
    (c: Casing) => c.casingId !== cement.casingId && overlaps(start, end, c.start, c.end) && c.diameter > parentCasing.diameter,
  );

  return {
    holes: overlappingHoles,
    casings: overlappingCasings,
  };
};

export const parseCement = (cement: Cement, casings: Casing[], holes: HoleSize[]): CompiledCement => {
  const attachedCasing = findCasing(cement.casingId, casings);
  const res: CompiledCement = {
    ...cement,
    boc: attachedCasing.end,
    attachedCasing,
    intersectingItems: findIntersectingItems(cement, attachedCasing, casings, holes),
  };
  return res;
};

export const cementDiameterChangeDepths = (
  cement: CompiledCement,
  diameterIntervals: {
    start: number;
    end: number;
  }[],
): number[] => {
  const diameterChangeDepths =
    merge(
      diameterIntervals.map((d) => [
        d.start - 0.0001, // +- 0.0001 to find diameter right beforeobject
        d.start,
        d.end,
        d.end + 0.0001, // +- 0.0001 to find diameter right after object
      ]),
    ).filter((d) => d >= cement.toc && d <= cement.boc) as number[]; // trim

  diameterChangeDepths.push(cement.toc);
  diameterChangeDepths.push(cement.boc);

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

  const outerObjectAtDepth = [...outerCasings, holeAtDepth]
    .filter((d) => d)
    .sort((a, b) => {
      const aDim = a.innerDiameter ? a.innerDiameter : a.diameter;
      const bDim = b.innerDiameter ? b.innerDiameter : b.diameter;
      return aDim - bDim;
    }) // ascending
    .find((object) => object.start <= depth && object.end >= depth);

  const outerDiameter = outerObjectAtDepth
    ? outerObjectAtDepth.innerDiameter
      ? outerObjectAtDepth.innerDiameter
      : outerObjectAtDepth.diameter - HOLE_OUTLINE
    : defaultCementWidth;

  return {
    md: depth,
    innerDiameter,
    outerDiameter,
  };
};
