import { IPoint, Point, Texture, WRAP_MODES } from 'pixi.js';
import { DEFAULT_TEXTURE_SIZE } from '../constants';
import {
  Casing,
  Cement,
  CementOptions,
  CementPlug,
  CementPlugOptions,
  CementSqueeze,
  HoleOptions,
  HoleSize,
  ScreenOptions,
  TubingOptions,
  Perforation,
  PerforationOptions,
  foldPerforationSubKind,
  hasGravelPack,
  intersect,
  isSubKindCasedHoleFracPack,
  getPerforationsThatStartAtHoleDiameter,
  isOpenHoleFracPack,
} from '../layers/schematicInterfaces';
import { ComplexRopeSegment } from '../layers/CustomDisplayObjects/ComplexRope';
import { createNormals, offsetPoints } from '../utils/vectorUtils';

export type PerforationShape = ComplexRopeSegment;

export interface TubularRenderingObject {
  leftPath: Point[];
  rightPath: Point[];
  referenceDiameter: number;
  referenceRadius: number;
}

export interface CasingRenderObject extends TubularRenderingObject {
  kind: 'casing';
  pathPoints: number[][];
  polygon: Point[];
  casingId: string;
  casingWallWidth: number;
  hasShoe: boolean;
  bottom: number;
  zIndex?: number;
}

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
  const trimmedChangedDepths = diameterChangeDepths.filter((d) => d >= topOfCement && d <= bottomOfCement); // trim

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
    .sort((a, b) => a.innerDiameter - b.innerDiameter) // ascending
    .find((casing) => casing.start <= depth && casing.end >= depth && casing.diameter > innerDiameter);

  if (outerCasingAtDepth) {
    return outerCasingAtDepth.innerDiameter;
  }

  if (holeAtDepth) {
    return holeAtDepth.diameter;
  }

  return defaultCementWidth;
};

export const findCementInnerDiameterAtDepth = (innerCasing: Casing[], _nonAttachedCasings: Casing[], holes: HoleSize[], depth: number): number => {
  const innerCasingAtDepth = innerCasing.find((casing) => casing.start <= depth && casing.end >= depth);
  const innerDiameter = innerCasingAtDepth ? innerCasingAtDepth.innerDiameter : 0;

  const holeAtDepth = holes.find((hole) => hole.start <= depth && hole.end >= depth && hole.diameter > innerDiameter);

  if (innerCasingAtDepth) {
    return innerDiameter;
  }

  if (holeAtDepth) {
    return holeAtDepth.diameter;
  }
};

export const createComplexRopeSegmentsForCement = (
  cement: Cement,
  casings: Casing[],
  holes: HoleSize[],
  exaggerationFactor: number,
  getPoints: (start: number, end: number) => [number, number][],
): ComplexRopeSegment[] => {
  const casingIds = (cement.casingIds || []).filter((id) => id);

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

  const diameterIntervals = changeDepths.flatMap((depth: number, index: number, list: number[]) => {
    if (index === 0) {
      return [];
    }

    const nextDepth = list[index - 1];
    const diameter = findCementOuterDiameterAtDepth(attachedCasings, outerCasings, overlappingHoles, depth) * exaggerationFactor;

    return [{ top: nextDepth, bottom: depth, diameter }];
  });

  const ropeSegments = diameterIntervals.map((interval) => {
    const segmentPoints = getPoints(interval.top, interval.bottom);
    const points = segmentPoints.map(([x, y]) => new Point(x, y));

    return {
      diameter: interval.diameter,
      points,
    };
  });

  return ropeSegments;
};

export const cementSqueezeDiameterChangeDepths = (
  squeeze: CementSqueeze,
  diameterIntervals: {
    start: number;
    end: number;
  }[],
): number[] => {
  const { top: topOfCement, bottom: bottomOfCement } = squeeze;

  const diameterChangeDepths = diameterIntervals.flatMap((d) => [d.start, d.end]);
  const trimmedChangedDepths = diameterChangeDepths.filter((d) => d >= topOfCement && d <= bottomOfCement); // trim

  trimmedChangedDepths.push(topOfCement);
  trimmedChangedDepths.push(bottomOfCement);

  const uniqDepths = uniq(trimmedChangedDepths);

  return uniqDepths.sort((a: number, b: number) => a - b);
};

export const cementPlugDiameterChangeDepths = (
  plug: CementPlug,
  diameterIntervals: {
    start: number;
    end: number;
  }[],
): number[] => {
  const { top: topOfCement, bottom: bottomOfCement } = plug;

  const diameterChangeDepths = diameterIntervals.flatMap((d) => [d.start, d.end]);
  const trimmedChangedDepths = diameterChangeDepths.filter((d) => d >= topOfCement && d <= bottomOfCement); // trim

  trimmedChangedDepths.push(topOfCement);
  trimmedChangedDepths.push(bottomOfCement);

  const uniqDepths = uniq(trimmedChangedDepths);

  return uniqDepths.sort((a: number, b: number) => a - b);
};

export const perforationDiameterChangeDepths = (
  perforation: Perforation,
  diameterIntervals: {
    start: number;
    end: number;
  }[],
): number[] => {
  const { top: topOfPerforation, bottom: bottomOfPerforation } = perforation;

  const diameterChangeDepths = diameterIntervals.flatMap((d) => [d.start, d.end]);
  const trimmedChangedDepths = diameterChangeDepths.filter((d) => d >= topOfPerforation && d <= bottomOfPerforation); // trim

  trimmedChangedDepths.push(topOfPerforation);
  trimmedChangedDepths.push(bottomOfPerforation);

  const uniqDepths = uniq(trimmedChangedDepths);

  return uniqDepths.sort((a: number, b: number) => a - b);
};

export const createComplexRopeSegmentsForCementSqueeze = (
  squeeze: CementSqueeze,
  casings: Casing[],
  holes: HoleSize[],
  exaggerationFactor: number,
  getPoints: (start: number, end: number) => [number, number][],
): ComplexRopeSegment[] => {
  const { casingIds, top: topOfCement, bottom: bottomOfCement } = squeeze;

  const attachedCasings = casingIds.map((casingId) => casings.find((casing) => casing.casingId === casingId));
  if (attachedCasings.length === 0 || attachedCasings.includes(undefined)) {
    throw new Error('Invalid cement squeeze data, cement is missing attached casing');
  }

  const { outerCasings, overlappingHoles } = findIntersectingItems(topOfCement, bottomOfCement, attachedCasings, casings, holes);

  const outerDiameterIntervals = [...outerCasings, ...overlappingHoles].map((d) => ({
    start: d.start,
    end: d.end,
  }));

  const changeDepths = cementSqueezeDiameterChangeDepths(squeeze, outerDiameterIntervals);

  const diameterIntervals = changeDepths.flatMap((depth, index, list) => {
    if (index === 0) {
      return [];
    }

    const nextDepth = list[index - 1];

    const diameter = findCementOuterDiameterAtDepth(attachedCasings, outerCasings, overlappingHoles, depth) * exaggerationFactor;

    return [{ top: nextDepth, bottom: depth, diameter }];
  });

  const ropeSegments = diameterIntervals.map((interval) => {
    const segmentPoints = getPoints(interval.top, interval.bottom);
    const points = segmentPoints.map(([x, y]) => new Point(x, y));

    return {
      diameter: interval.diameter,
      points,
    };
  });

  return ropeSegments;
};

export const createComplexRopeSegmentsForCementPlug = (
  plug: CementPlug,
  casings: Casing[],
  holes: HoleSize[],
  exaggerationFactor: number,
  getPoints: (start: number, end: number) => [number, number][],
): ComplexRopeSegment[] => {
  const { casingId, secondCasingId, top: topOfCementPlug, bottom: bottomOfCementPlug } = plug;

  const attachedCasings = [casings.find((c) => c.casingId === casingId), casings.find((c) => c.casingId === secondCasingId)].filter((c) => c);
  if (attachedCasings.length === 0 || attachedCasings.includes(undefined)) {
    throw new Error('Invalid cement plug data, cement plug is missing attached casing');
  }
  const { overlappingHoles } = findIntersectingItems(topOfCementPlug, bottomOfCementPlug, attachedCasings, casings, holes);
  const innerDiameterIntervals = [...attachedCasings, ...overlappingHoles].map((d) => ({
    start: d.start,
    end: d.end,
  }));

  const changeDepths = cementPlugDiameterChangeDepths(plug, innerDiameterIntervals);

  const diameterIntervals = changeDepths.flatMap((depth, index, list) => {
    if (index === 0) {
      return [];
    }

    const nextDepth = list[index - 1];
    const diameter = findCementInnerDiameterAtDepth(attachedCasings, attachedCasings, overlappingHoles, depth) * exaggerationFactor;

    return [{ top: nextDepth, bottom: depth, diameter }];
  });

  const ropeSegments = diameterIntervals.map((interval) => {
    const mdPoints = getPoints(interval.top, interval.bottom);
    const points = mdPoints.map(([x, y]) => new Point(x, y));

    return {
      diameter: interval.diameter,
      points,
    };
  });

  return ropeSegments;
};

const createGradientFill = (
  canvas: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  firstColor: string,
  secondColor: string,
  startPctOffset: number,
): CanvasGradient => {
  const halfWayPct = 0.5;
  const gradient = canvasCtx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, firstColor);
  gradient.addColorStop(halfWayPct - startPctOffset, secondColor);
  gradient.addColorStop(halfWayPct + startPctOffset, secondColor);
  gradient.addColorStop(1, firstColor);

  return gradient;
};

export const createHoleBaseTexture = ({ firstColor, secondColor }: HoleOptions, width: number, height: number): Texture => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const canvasCtx = canvas.getContext('2d');

  canvasCtx.fillStyle = createGradientFill(canvas, canvasCtx, firstColor, secondColor, 0);
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

  return Texture.from(canvas);
};

export const createScreenTexture = ({ scalingFactor }: ScreenOptions): Texture => {
  const canvas = document.createElement('canvas');
  const size = DEFAULT_TEXTURE_SIZE * scalingFactor;
  canvas.width = size;
  canvas.height = size;
  const canvasCtx = canvas.getContext('2d');

  canvasCtx.fillStyle = 'white';
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

  const baseLineWidth = size / 10; // eslint-disable-line no-magic-numbers
  canvasCtx.strokeStyle = '#AAAAAA';
  canvasCtx.lineWidth = baseLineWidth;
  canvasCtx.beginPath();

  const distanceBetweenLines = size / 3;
  for (let i = -canvas.width; i < canvas.width; i++) {
    canvasCtx.moveTo(-canvas.width + distanceBetweenLines * i, -canvas.height);
    canvasCtx.lineTo(canvas.width + distanceBetweenLines * i, canvas.height * 2);
  }
  canvasCtx.stroke();
  return Texture.from(canvas);
};

export const createTubingTexture = ({ innerColor, outerColor, scalingFactor }: TubingOptions): Texture => {
  const size = DEFAULT_TEXTURE_SIZE * scalingFactor;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const canvasCtx = canvas.getContext('2d');
  const gradient = canvasCtx.createLinearGradient(0, 0, 0, size);

  const innerColorStart = 0.3;
  const innerColorEnd = 0.7;
  gradient.addColorStop(0, outerColor);
  gradient.addColorStop(innerColorStart, innerColor);
  gradient.addColorStop(innerColorEnd, innerColor);
  gradient.addColorStop(1, outerColor);

  canvasCtx.fillStyle = gradient;
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

  return Texture.from(canvas);
};

export const createCementTexture = ({ firstColor, secondColor, scalingFactor }: CementOptions) => {
  const canvas = document.createElement('canvas');

  const size = DEFAULT_TEXTURE_SIZE * scalingFactor;
  const lineWidth = scalingFactor;
  canvas.width = size;
  canvas.height = size;
  const canvasCtx = canvas.getContext('2d');

  canvasCtx.fillStyle = firstColor;
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  canvasCtx.lineWidth = lineWidth;
  canvasCtx.fillStyle = secondColor;
  canvasCtx.beginPath();

  const distanceBetweenLines = size / 12; // eslint-disable-line no-magic-numbers
  for (let i = -canvas.width; i < canvas.width; i++) {
    canvasCtx.moveTo(-canvas.width + distanceBetweenLines * i, -canvas.height);
    canvasCtx.lineTo(canvas.width + distanceBetweenLines * i, canvas.height);
  }
  canvasCtx.stroke();

  return Texture.from(canvas);
};

export const createCementPlugTexture = ({ firstColor, secondColor, scalingFactor }: CementPlugOptions) => {
  const canvas = document.createElement('canvas');

  const size = DEFAULT_TEXTURE_SIZE * scalingFactor;
  canvas.width = size;
  canvas.height = size;
  const canvasCtx = canvas.getContext('2d');

  canvasCtx.fillStyle = firstColor;
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  canvasCtx.lineWidth = scalingFactor;
  canvasCtx.fillStyle = secondColor;
  canvasCtx.beginPath();

  canvasCtx.setLineDash([20, 10]); // eslint-disable-line no-magic-numbers
  const distanceBetweenLines = size / 12; // eslint-disable-line no-magic-numbers
  for (let i = -canvas.width; i < canvas.width; i++) {
    canvasCtx.moveTo(-canvas.width + distanceBetweenLines * i, -canvas.height);
    canvasCtx.lineTo(canvas.width + distanceBetweenLines * i, canvas.height * 2);
  }
  canvasCtx.stroke();

  return Texture.from(canvas);
};

export const createTubularRenderingObject = (diameter: number, pathPoints: [number, number][]): TubularRenderingObject => {
  const radius = diameter / 2;

  const normals = createNormals(pathPoints);
  const rightPath = offsetPoints(pathPoints, normals, radius);
  const leftPath = offsetPoints(pathPoints, normals, -radius);

  return { leftPath, rightPath, referenceDiameter: diameter, referenceRadius: radius };
};

export const prepareCasingRenderObject = (exaggerationFactor: number, casing: Casing, pathPoints: [number, number][]): CasingRenderObject => {
  const exaggeratedDiameter = casing.diameter * exaggerationFactor;
  const exaggeratedInnerDiameter = casing.innerDiameter * exaggerationFactor;
  const exaggeratedInnerRadius = exaggeratedInnerDiameter / 2;
  const renderObject = createTubularRenderingObject(exaggeratedDiameter, pathPoints);

  const casingWallWidth = renderObject.referenceRadius - exaggeratedInnerRadius;

  const polygon = makeTubularPolygon(renderObject.leftPath, renderObject.rightPath);

  return {
    ...renderObject,
    kind: 'casing',
    pathPoints,
    polygon,
    casingId: casing.casingId,
    casingWallWidth,
    hasShoe: casing.hasShoe,
    bottom: casing.end,
  };
};

export const createComplexRopeSegmentsForPerforation = (
  perforation: Perforation,
  casings: Casing[],
  holes: HoleSize[],
  exaggerationFactor: number,
  getPoints: (start: number, end: number) => [number, number][],
): ComplexRopeSegment[] => {
  const attachedCasings = perforation.referenceIds.map((referenceId: string) => casings.find((casing) => casing.id === referenceId));
  if (attachedCasings.length === 0 || attachedCasings.includes(undefined)) {
    throw new Error('Invalid perforation data, perforation is missing attached casing');
  }

  const { outerCasings, overlappingHoles } = findIntersectingItems(perforation.top, perforation.bottom, attachedCasings, casings, holes);

  const outerDiameterIntervals = [...outerCasings, ...overlappingHoles].map((d) => ({
    start: d.start,
    end: d.end,
  }));

  const changeDepths = perforationDiameterChangeDepths(perforation, outerDiameterIntervals);

  const diameterIntervals = changeDepths.flatMap((depth, index, list) => {
    if (index === 0) {
      return [];
    }

    const nextDepth = list[index - 1];

    const diameter = findCementOuterDiameterAtDepth(attachedCasings, outerCasings, overlappingHoles, depth) * exaggerationFactor;

    return [{ top: nextDepth, bottom: depth, diameter }];
  });

  const ropeSegments = diameterIntervals.map((interval) => {
    const mdPoints = getPoints(interval.top, interval.bottom);
    const points = mdPoints.map((mdPoint) => new Point(mdPoint[0], mdPoint[1]));

    const diameter =
      getPerforationsThatStartAtHoleDiameter([perforation]).length === 1 || isOpenHoleFracPack(perforation)
        ? interval.diameter * 4
        : interval.diameter;

    return {
      diameter,
      points,
    };
  });

  return ropeSegments;
};

const createFracLines = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  widestPerfShapeDiameter: number,
  perforationOptions: PerforationOptions,
  startAt: 'diameter' | 'spike',
) => {
  const { spikeWidth, fracLineHalfWidth, fracLineLength } = perforationOptions;

  const amountOfSpikes = canvas.width / spikeWidth;

  for (let i = 0; i < amountOfSpikes; i++) {
    const right: [number, number] = [i * spikeWidth + spikeWidth, canvas.height / 2];
    const top: [number, number] =
      startAt === 'diameter' ? [right[0] - spikeWidth / 2, fracLineLength + widestPerfShapeDiameter] : [right[0] - spikeWidth / 2, fracLineLength];

    ctx.beginPath();

    const start: [number, number] = [...top];
    const controlPoint1: [number, number] = [top[0] - fracLineHalfWidth, fracLineLength / 2 + (startAt === 'diameter' ? widestPerfShapeDiameter : 0)];
    const middle: [number, number] = [top[0], fracLineLength / 2 + (startAt === 'diameter' ? widestPerfShapeDiameter : 0)];
    const controlPoint2: [number, number] = [top[0] + fracLineHalfWidth, fracLineLength / 4 + (startAt === 'diameter' ? widestPerfShapeDiameter : 0)];
    const end: [number, number] = [top[0], startAt === 'diameter' ? widestPerfShapeDiameter : 0];

    ctx.bezierCurveTo(...start, ...controlPoint1, ...middle);
    ctx.bezierCurveTo(...middle, ...controlPoint2, ...end);
    ctx.stroke();
  }

  for (let i = 0; i < amountOfSpikes; i++) {
    const right: [number, number] = [i * spikeWidth + spikeWidth, canvas.height / 2];
    const bottom: [number, number] = [
      right[0] - spikeWidth / 2,
      canvas.height - fracLineLength - (startAt === 'diameter' ? widestPerfShapeDiameter : 0),
    ];

    ctx.beginPath();

    const start: [number, number] = [...bottom];
    const controlPoint1: [number, number] = [
      bottom[0] - fracLineHalfWidth,
      canvas.height - fracLineLength / 2 - (startAt === 'diameter' ? widestPerfShapeDiameter : 0),
    ];
    const middle: [number, number] = [bottom[0], canvas.height - fracLineLength / 2 - (startAt === 'diameter' ? widestPerfShapeDiameter : 0)];
    const controlPoint2: [number, number] = [
      bottom[0] + fracLineHalfWidth,
      canvas.height - fracLineLength / 4 - (startAt === 'diameter' ? widestPerfShapeDiameter : 0),
    ];
    const end: [number, number] = [bottom[0], canvas.height - (startAt === 'diameter' ? widestPerfShapeDiameter : 0)];

    ctx.bezierCurveTo(...start, ...controlPoint1, ...middle);
    ctx.bezierCurveTo(...middle, ...controlPoint2, ...end);
    ctx.stroke();
  }
};

/**
 *  If a perforation does not overlap with another perforations of type with gravel,
 * the perforation spikes are either red when open or grey when closed.
 * Open and closed refers to two fields on a perforation item referencing runs.
 * If a perforation overlaps with another perforation of type with gravel and the perforation is open,
 * the perforation spikes should be yellow.
 * If closed the perforation remains grey.
 * Cased hole frac pack
 * Makes perforations of type "Perforation" yellow if overlapping and perforation are open.
 * Makes perforations of type "Perforation" yellow if overlapping and perforation are open.
 * If no perforation of type "perforation" are overlapping, there are no fracturation lines and no spikes.
 * If a perforation of type "perforation" is overlapping,
 * the fracturation lines extends from the tip of the perforation spikes into formation.
 * @param perforation
 * @param otherPerforations
 * @param widestPerfShapeDiameter
 * @param perforationOptions
 * @returns
 */
const createSubkindPerforationTexture = (
  perforation: Perforation,
  otherPerforations: Perforation[],
  widestPerfShapeDiameter: number,
  perforationOptions: PerforationOptions,
) => {
  const canvas = document.createElement('canvas');

  const size = DEFAULT_TEXTURE_SIZE * perforationOptions.scalingFactor;

  canvas.width = size / 2;
  canvas.height = size;
  const canvasCtx = canvas.getContext('2d');

  canvasCtx.fillStyle = perforationOptions.red;

  const { spikeWidth, fracLineLength } = perforationOptions;

  const amountOfSpikes = canvas.width / spikeWidth;

  const intersectionsWithGravel: boolean = otherPerforations.some((perf) => hasGravelPack(perf) && intersect(perforation, perf));

  const intersectionsWithCasedHoleFracPack: boolean = otherPerforations.some(
    (perf) => isSubKindCasedHoleFracPack(perf) && intersect(perforation, perf),
  );

  let hasFracLines = false;

  if (intersectionsWithGravel || intersectionsWithCasedHoleFracPack) {
    hasFracLines = true;
    if (perforation.isOpen) {
      canvasCtx.fillStyle = perforationOptions.yellow;
      canvasCtx.strokeStyle = perforationOptions.yellow;
    } else {
      canvasCtx.fillStyle = perforationOptions.grey;
      canvasCtx.strokeStyle = perforationOptions.grey;
    }
  } else {
    if (perforation.isOpen) {
      canvasCtx.fillStyle = perforationOptions.red;
      canvasCtx.strokeStyle = perforationOptions.red;
    } else {
      canvasCtx.fillStyle = perforationOptions.grey;
      canvasCtx.strokeStyle = perforationOptions.grey;
    }
  }

  for (let i = 0; i < amountOfSpikes; i++) {
    const left: [number, number] = [i * spikeWidth, canvas.height / 2];
    const right: [number, number] = [i * spikeWidth + spikeWidth, canvas.height / 2];
    const top: [number, number] = [right[0] - spikeWidth / 2, fracLineLength];

    canvasCtx.beginPath();
    canvasCtx.moveTo(...top);
    canvasCtx.lineTo(...left);
    canvasCtx.lineTo(...right);
    canvasCtx.closePath();
    canvasCtx.fill();
  }

  for (let i = 0; i < amountOfSpikes; i++) {
    const left: [number, number] = [i * spikeWidth, canvas.height / 2];
    const right: [number, number] = [i * spikeWidth + spikeWidth, canvas.height / 2];
    const bottom: [number, number] = [right[0] - spikeWidth / 2, canvas.height - fracLineLength];

    canvasCtx.beginPath();
    canvasCtx.moveTo(...left);
    canvasCtx.lineTo(...bottom);
    canvasCtx.lineTo(...right);
    canvasCtx.closePath();
    canvasCtx.fill();
  }

  if (hasFracLines) {
    createFracLines(canvas, canvasCtx, widestPerfShapeDiameter, perforationOptions, 'spike');
  }

  return Texture.from(canvas, { wrapMode: WRAP_MODES.CLAMP });
};

/**
 * Yellow gravel
 * @param perforationOptions
 * @returns
 */
const createSubkindOpenHoleGravelPackTexture = (perforationOptions: PerforationOptions) => {
  const canvas = document.createElement('canvas');

  const size = DEFAULT_TEXTURE_SIZE * perforationOptions.scalingFactor;
  const canvasCtx = canvas.getContext('2d');

  canvasCtx.save();
  canvasCtx.globalAlpha = perforationOptions.packingOpacity;
  canvas.width = size / 2;
  canvas.height = size;
  canvasCtx.fillStyle = perforationOptions.yellow;
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  canvasCtx.restore();
  return Texture.from(canvas, { wrapMode: WRAP_MODES.CLAMP });
};

/**
 * Yellow gravel. Yellow frac lines from hole OD into formation
 * @param widestPerfShapeDiameter
 * @param perforationOptions
 * @returns
 */
const createSubkindOpenHoleFracPackTexture = (widestPerfShapeDiameter: number, perforationOptions: PerforationOptions) => {
  const canvas = document.createElement('canvas');

  const size = DEFAULT_TEXTURE_SIZE * perforationOptions.scalingFactor;
  canvas.width = size / 2;
  canvas.height = size;
  const canvasCtx = canvas.getContext('2d');

  canvasCtx.fillStyle = perforationOptions.yellow;
  canvasCtx.strokeStyle = perforationOptions.yellow;

  const { fracLineLength, packingOpacity } = perforationOptions;

  const xy: [number, number] = [0, fracLineLength + widestPerfShapeDiameter];
  const wh: [number, number] = [canvas.width, widestPerfShapeDiameter];
  canvasCtx.save();
  canvasCtx.globalAlpha = packingOpacity;
  canvasCtx.fillRect(...xy, ...wh);
  canvasCtx.restore();

  createFracLines(canvas, canvasCtx, widestPerfShapeDiameter, perforationOptions, 'diameter');
  return Texture.from(canvas, { wrapMode: WRAP_MODES.CLAMP });
};

/**
 * Cased hole fracturation
 * Yellow fracturation lines from casing OD into formation
 * @param widestPerfShapeDiameter
 * @param perforationOptions
 * @returns
 */
const createSubkindCasedHoleFracturationTexture = (widestPerfShapeDiameter: number, perforationOptions: PerforationOptions) => {
  const canvas = document.createElement('canvas');
  const size = DEFAULT_TEXTURE_SIZE * perforationOptions.scalingFactor;
  canvas.width = size / 2;
  canvas.height = size;
  const canvasCtx = canvas.getContext('2d');
  canvasCtx.fillStyle = perforationOptions.yellow;
  canvasCtx.strokeStyle = perforationOptions.yellow;
  createFracLines(canvas, canvasCtx, widestPerfShapeDiameter, perforationOptions, 'diameter');

  return Texture.from(canvas, { wrapMode: WRAP_MODES.CLAMP });
};

/**
 * Yellow gravel. Makes perforations of type "Perforation" yellow if overlapping and perforation are open.
 * @param perforationOptions
 * @returns
 */
const createSubkindCasedHoleGravelPackTexture = (perforationOptions: PerforationOptions) => {
  const canvas = document.createElement('canvas');
  const size = DEFAULT_TEXTURE_SIZE * perforationOptions.scalingFactor;
  canvas.width = size / 2;
  canvas.height = size;

  const canvasCtx = canvas.getContext('2d');

  canvasCtx.fillStyle = perforationOptions.yellow;
  canvasCtx.save();
  canvasCtx.globalAlpha = perforationOptions.packingOpacity;
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  canvasCtx.restore();

  return Texture.from(canvas, { wrapMode: WRAP_MODES.CLAMP });
};

/**
 *
 * Yellow gravel and fracturation lines.
 * @param perforationOptions
 * @returns
 */
const createSubkindCasedHoleFracPack = (perforationOptions: PerforationOptions) => {
  const canvas = document.createElement('canvas');

  const size = DEFAULT_TEXTURE_SIZE * perforationOptions.scalingFactor;

  canvas.width = size / 2;
  canvas.height = size;
  const canvasCtx = canvas.getContext('2d');

  canvasCtx.fillStyle = perforationOptions.yellow;
  canvasCtx.save();
  canvasCtx.globalAlpha = perforationOptions.packingOpacity;
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  canvasCtx.restore();
  return Texture.from(canvas, { wrapMode: WRAP_MODES.CLAMP });
};

export const createPerforationTexture = (
  perforation: Perforation,
  widestPerfShapeDiameter: number,
  otherPerforations: Perforation[],
  perforationOptions: PerforationOptions,
): Texture => {
  return foldPerforationSubKind(
    {
      Perforation: () => createSubkindPerforationTexture(perforation, otherPerforations, widestPerfShapeDiameter, perforationOptions),
      OpenHoleGravelPack: () => createSubkindOpenHoleGravelPackTexture(perforationOptions),
      OpenHoleFracPack: () => createSubkindOpenHoleFracPackTexture(widestPerfShapeDiameter, perforationOptions),
      CasedHoleFracturation: () => createSubkindCasedHoleFracturationTexture(widestPerfShapeDiameter, perforationOptions),
      CasedHoleGravelPack: () => createSubkindCasedHoleGravelPackTexture(perforationOptions),
      CasedHoleFracPack: () => createSubkindCasedHoleFracPack(perforationOptions),
    },
    perforation.subKind,
  );
};
