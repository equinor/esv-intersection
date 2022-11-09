import { IPoint, Point, Texture, WRAP_MODES } from 'pixi.js';
import { DEFAULT_TEXTURE_SIZE } from '../constants';
import {
  Casing,
  CasingWindow,
  Cement,
  CementOptions,
  CementPlug,
  CementPlugOptions,
  CementSqueeze,
  CementSqueezeOptions,
  Completion,
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
}

export interface CasingRenderObject {
  id: string;
  kind: 'casing';
  referenceDiameter: number;
  referenceRadius: number;
  casingWallWidth: number;
  hasShoe: boolean;
  bottom: number;
  zIndex?: number;
  sections: {
    kind: 'casing' | 'casing-window';
    leftPath: Point[];
    rightPath: Point[];
    pathPoints: Point[];
    polygon: IPoint[];
  }[];
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

const findIntersectingItems = (
  start: number,
  end: number,
  otherStrings: (Casing | Completion)[],
  holes: HoleSize[],
): { overlappingHoles: HoleSize[]; overlappingOuterStrings: (Casing | Completion)[] } => {
  const overlappingHoles = holes.filter((hole: HoleSize) => overlaps(start, end, hole.start, hole.end));

  const overlappingOuterStrings = otherStrings.filter((casing: Casing | Completion) => overlaps(start, end, casing.start, casing.end));

  return {
    overlappingHoles,
    overlappingOuterStrings,
  };
};

export const getUniqueDiameterChangeDepths = (
  [intervalStart, intervalEnd]: [number, number],
  diameterIntervals: { start: number; end: number }[],
): number[] => {
  const epsilon = 0.0001;
  const diameterChangeDepths = diameterIntervals.flatMap(
    (
      d, // to find diameter right before/after object
    ) => [d.start - epsilon, d.start, d.end, d.end + epsilon],
  );
  const trimmedChangedDepths = diameterChangeDepths.filter((d) => d >= intervalStart && d <= intervalEnd); // trim

  trimmedChangedDepths.push(intervalStart);
  trimmedChangedDepths.push(intervalEnd);

  const uniqDepths = uniq(trimmedChangedDepths);
  return uniqDepths.sort((a: number, b: number) => a - b);
};

const getInnerStringDiameter = (stringType: Casing | Completion): number =>
  stringType.kind === 'casing' ? stringType.innerDiameter : stringType.diameter;

export const findCementOuterDiameterAtDepth = (
  attachedStrings: (Casing | Completion)[],
  nonAttachedStrings: (Casing | Completion)[],
  holes: HoleSize[],
  depth: number,
): number => {
  const defaultCementWidth = 100; // Default to flow cement outside to show error in data

  const attachedStringAtDepth = attachedStrings.find(
    (casingOrCompletion: Casing | Completion) => casingOrCompletion.start <= depth && casingOrCompletion.end >= depth,
  );
  const attachedOuterDiameter = attachedStringAtDepth ? attachedStringAtDepth.diameter : 0;

  const outerCasingAtDepth = nonAttachedStrings
    .filter((casingOrCompletion: Casing | Completion) => getInnerStringDiameter(casingOrCompletion) > attachedOuterDiameter)
    .sort((a: Casing | Completion, b: Casing | Completion) => getInnerStringDiameter(a) - getInnerStringDiameter(b)) // ascending
    .find((casing) => casing.start <= depth && casing.end >= depth);

  const holeAtDepth = holes.find((hole: HoleSize) => hole.start <= depth && hole.end >= depth && hole.diameter > attachedOuterDiameter);

  if (outerCasingAtDepth) {
    return getInnerStringDiameter(outerCasingAtDepth);
  }

  if (holeAtDepth) {
    return holeAtDepth.diameter;
  }

  return defaultCementWidth;
};

export const findCementPlugInnerDiameterAtDepth = (
  attachedStrings: (Casing | Completion)[],
  nonAttachedStrings: (Casing | Completion)[],
  holes: HoleSize[],
  depth: number,
): number => {
  // Default to flow cement outside to show error in data
  const defaultCementWidth = 100;
  const attachedStringAtDepth = attachedStrings
    .sort((a: Casing | Completion, b: Casing | Completion) => getInnerStringDiameter(a) - getInnerStringDiameter(b)) // ascending
    .find((casingOrCompletion) => casingOrCompletion.start <= depth && casingOrCompletion.end >= depth);

  if (attachedStringAtDepth) {
    return getInnerStringDiameter(attachedStringAtDepth);
  }

  // Start from an attached diameter
  const minimumDiameter = attachedStrings.length ? Math.min(...attachedStrings.map((c) => getInnerStringDiameter(c))) : 0;
  const nonAttachedStringAtDepth = nonAttachedStrings
    .sort((a: Casing | Completion, b: Casing | Completion) => getInnerStringDiameter(a) - getInnerStringDiameter(b)) // ascending
    .find(
      (casingOrCompletion: Casing | Completion) =>
        casingOrCompletion.start <= depth && casingOrCompletion.end >= depth && minimumDiameter <= getInnerStringDiameter(casingOrCompletion),
    );

  if (nonAttachedStringAtDepth) {
    return getInnerStringDiameter(nonAttachedStringAtDepth);
  }

  const holeAtDepth = holes.find((hole) => hole.start <= depth && hole.end >= depth && hole.diameter);

  if (holeAtDepth) {
    return holeAtDepth.diameter;
  }

  return defaultCementWidth;
};

export const createComplexRopeSegmentsForCement = (
  cement: Cement,
  casings: Casing[],
  completion: Completion[],
  holes: HoleSize[],
  exaggerationFactor: number,
  getPoints: (start: number, end: number) => Point[],
): ComplexRopeSegment[] => {
  const { attachedStrings, nonAttachedStrings } = splitByReferencedStrings(cement.referenceIds, casings, completion);

  if (attachedStrings.length === 0) {
    throw new Error(`Invalid cement data, can't find referenced casing/completion string for cement with id '${cement.id}'`);
  }

  attachedStrings.sort((a: Casing, b: Casing) => a.end - b.end); // ascending
  const bottomOfCement = attachedStrings[attachedStrings.length - 1].end;

  const { overlappingOuterStrings, overlappingHoles } = findIntersectingItems(cement.toc, bottomOfCement, nonAttachedStrings, holes);

  const outerDiameterIntervals = [...overlappingOuterStrings, ...overlappingHoles].map((d) => ({
    start: d.start,
    end: d.end,
  }));

  const changeDepths = getUniqueDiameterChangeDepths([cement.toc, bottomOfCement], outerDiameterIntervals);

  const diameterIntervals = changeDepths.flatMap((depth: number, index: number, list: number[]) => {
    if (index === list.length - 1) {
      return [];
    }

    const nextDepth = list[index + 1];
    const diameterAtChangeDepth = findCementOuterDiameterAtDepth(attachedStrings, overlappingOuterStrings, overlappingHoles, depth);

    return [{ top: depth, bottom: nextDepth, diameter: diameterAtChangeDepth * exaggerationFactor }];
  });

  const ropeSegments = diameterIntervals.map((interval) => ({
    diameter: interval.diameter,
    points: getPoints(interval.top, interval.bottom),
  }));

  return ropeSegments;
};

const splitByReferencedStrings = (
  referenceIds: string[],
  casings: Casing[],
  completion: Completion[],
): { attachedStrings: (Casing | Completion)[]; nonAttachedStrings: (Casing | Completion)[] } =>
  [...casings, ...completion].reduce(
    (acc, current) => {
      if (referenceIds.includes(current.id)) {
        return { ...acc, attachedStrings: [...acc.attachedStrings, current] };
      }
      return { ...acc, nonAttachedStrings: [...acc.nonAttachedStrings, current] };
    },
    { attachedStrings: [], nonAttachedStrings: [] },
  );

export const perforationDiameterChangeDepths = (
  perforation: Perforation,
  diameterIntervals: {
    start: number;
    end: number;
  }[],
): number[] => {
  const { start: topOfPerforation, end: bottomOfPerforation } = perforation;

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
  completion: Completion[],
  holes: HoleSize[],
  exaggerationFactor: number,
  getPoints: (start: number, end: number) => Point[],
): ComplexRopeSegment[] => {
  const { attachedStrings, nonAttachedStrings } = splitByReferencedStrings(squeeze.referenceIds, casings, completion);

  if (attachedStrings.length === 0) {
    throw new Error(`Invalid cement squeeze data, can't find referenced casing/completion for squeeze with id '${squeeze.id}'`);
  }

  const { overlappingOuterStrings, overlappingHoles } = findIntersectingItems(squeeze.start, squeeze.end, nonAttachedStrings, holes);

  const outerDiameterIntervals = [...overlappingOuterStrings, ...overlappingHoles].map((d) => ({
    start: d.start,
    end: d.end,
  }));

  const changeDepths = getUniqueDiameterChangeDepths([squeeze.start, squeeze.end], outerDiameterIntervals);

  const diameterIntervals = changeDepths.flatMap((depth, index, list) => {
    if (index === list.length - 1) {
      return [];
    }

    const nextDepth = list[index + 1];

    const diameterAtDepth = findCementOuterDiameterAtDepth(attachedStrings, overlappingOuterStrings, overlappingHoles, depth);

    return [{ top: depth, bottom: nextDepth, diameter: diameterAtDepth * exaggerationFactor }];
  });

  const ropeSegments = diameterIntervals.map((interval) => ({
    diameter: interval.diameter,
    points: getPoints(interval.top, interval.bottom),
  }));

  return ropeSegments;
};

export const createComplexRopeSegmentsForCementPlug = (
  plug: CementPlug,
  casings: Casing[],
  completion: Completion[],
  holes: HoleSize[],
  exaggerationFactor: number,
  getPoints: (start: number, end: number) => Point[],
): ComplexRopeSegment[] => {
  const { attachedStrings, nonAttachedStrings } = splitByReferencedStrings(plug.referenceIds, casings, completion);

  const { overlappingHoles, overlappingOuterStrings } = findIntersectingItems(plug.start, plug.end, nonAttachedStrings, holes);
  const innerDiameterIntervals = [...attachedStrings, ...overlappingHoles, ...overlappingOuterStrings].map((d) => ({
    start: d.start,
    end: d.end,
  }));

  const changeDepths = getUniqueDiameterChangeDepths([plug.start, plug.end], innerDiameterIntervals);

  const diameterIntervals = changeDepths.flatMap((depth, index, list) => {
    if (index === list.length - 1) {
      return [];
    }

    const nextDepth = list[index + 1];
    const diameterAtDepth = findCementPlugInnerDiameterAtDepth(attachedStrings, overlappingOuterStrings, overlappingHoles, depth);

    return [{ top: depth, bottom: nextDepth, diameter: diameterAtDepth * exaggerationFactor }];
  });

  const ropeSegments = diameterIntervals.map((interval) => ({
    diameter: interval.diameter,
    points: getPoints(interval.top, interval.bottom),
  }));

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

export const createCementTexture = ({ firstColor, secondColor, scalingFactor }: CementOptions): Texture => {
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

export const createCementPlugTexture = ({ firstColor, secondColor, scalingFactor }: CementPlugOptions): Texture => {
  const canvas = document.createElement('canvas');

  const size = DEFAULT_TEXTURE_SIZE * scalingFactor;
  canvas.width = size;
  canvas.height = size;
  const canvasCtx = canvas.getContext('2d');

  canvasCtx.fillStyle = firstColor;
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  canvasCtx.lineWidth = scalingFactor;
  canvasCtx.strokeStyle = secondColor;
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

export const createCementSqueezeTexture = ({ firstColor, secondColor, scalingFactor }: CementSqueezeOptions): Texture => {
  const canvas = document.createElement('canvas');

  const size = DEFAULT_TEXTURE_SIZE * scalingFactor;
  const lineWidth = scalingFactor;
  canvas.width = size;
  canvas.height = size;

  const canvasCtx = canvas.getContext('2d');
  canvasCtx.lineWidth = lineWidth;
  canvasCtx.fillStyle = firstColor;
  canvasCtx.strokeStyle = secondColor;

  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
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

export const createTubularRenderingObject = (radius: number, pathPoints: IPoint[]): TubularRenderingObject => {
  const normals = createNormals(pathPoints);
  const rightPath = offsetPoints(pathPoints, normals, radius);
  const leftPath = offsetPoints(pathPoints, normals, -radius);

  return { leftPath, rightPath };
};

export type CasingInterval = {
  kind: 'casing' | 'casing-window';
  start: number;
  end: number;
};

const createCasingInterval = (start: number, end: number): CasingInterval => ({ kind: 'casing', start, end });
const createCasingWindowInterval = (start: number, end: number): CasingInterval => ({ kind: 'casing-window', start, end });

export const getCasingIntervalsWithWindows = (casing: Casing): CasingInterval[] => {
  if (!casing.windows.length) {
    return [createCasingInterval(casing.start, casing.end)];
  }

  const result = casing.windows.reduce<{ intervals: CasingInterval[]; lastBottom: number }>(
    ({ intervals, lastBottom }, currentWindow: CasingWindow, index: number, list: CasingWindow[]) => {
      const startCasingInterval: CasingInterval | null =
        // last bottom before current start?
        lastBottom < currentWindow.start ? createCasingInterval(lastBottom, currentWindow.start) : null;

      const updatedLastBottom = startCasingInterval ? startCasingInterval.end : lastBottom;

      const windowStart = Math.max(updatedLastBottom, currentWindow.start);
      const windowEnd = Math.min(casing.end, currentWindow.end);
      const windowInterval: CasingInterval = createCasingWindowInterval(windowStart, windowEnd);

      const nextLastBottom = windowEnd;

      const isLastWindow = index === list.length - 1;
      const endCasingInterval: CasingInterval | null =
        isLastWindow &&
        // still room for a casing interval?
        nextLastBottom < casing.end
          ? createCasingInterval(nextLastBottom, casing.end)
          : null;

      const newIntervals: CasingInterval[] = [startCasingInterval, windowInterval, endCasingInterval].filter((i) => i);

      return { intervals: [...intervals, ...newIntervals], lastBottom: nextLastBottom };
    },
    { intervals: [], lastBottom: casing.start },
  );

  return result.intervals;
};

export const prepareCasingRenderObject = (
  exaggerationFactor: number,
  casing: Casing,
  getPathPoints: (start: number, end: number) => Point[],
): CasingRenderObject => {
  const exaggeratedDiameter = casing.diameter * exaggerationFactor;
  const exaggeratedRadius = exaggeratedDiameter / 2;
  const exaggeratedInnerDiameter = casing.innerDiameter * exaggerationFactor;
  const exaggeratedInnerRadius = exaggeratedInnerDiameter / 2;
  const casingWallWidth = exaggeratedRadius - exaggeratedInnerRadius;

  const sections = getCasingIntervalsWithWindows(casing).map((casingInterval: CasingInterval) => {
    const pathPoints = getPathPoints(casingInterval.start, casingInterval.end);
    const { leftPath, rightPath } = createTubularRenderingObject(exaggeratedRadius, pathPoints);
    return { kind: casingInterval.kind, leftPath, rightPath, pathPoints, polygon: makeTubularPolygon(leftPath, rightPath) };
  });

  return {
    kind: 'casing',
    id: casing.id,
    referenceDiameter: exaggeratedDiameter,
    referenceRadius: exaggeratedRadius,
    sections,
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
  getPoints: (start: number, end: number) => Point[],
): ComplexRopeSegment[] => {
  const attachedCasings = perforation.referenceIds.map((referenceId: string) => casings.find((casing) => casing.id === referenceId));
  if (attachedCasings.length === 0 || attachedCasings.includes(undefined)) {
    throw new Error('Invalid perforation data, perforation is missing attached casing');
  }

  const { overlappingOuterStrings, overlappingHoles } = findIntersectingItems(perforation.start, perforation.end, casings, holes);

  const outerDiameterIntervals = [...overlappingOuterStrings, ...overlappingHoles].map((d) => ({
    start: d.start,
    end: d.end,
  }));

  const changeDepths = perforationDiameterChangeDepths(perforation, outerDiameterIntervals);

  const diameterIntervals = changeDepths.flatMap((depth, index, list) => {
    if (index === 0) {
      return [];
    }

    const nextDepth = list[index - 1];

    const diameter = findCementOuterDiameterAtDepth(attachedCasings, overlappingOuterStrings, overlappingHoles, depth) * exaggerationFactor;

    return [{ top: nextDepth, bottom: depth, diameter }];
  });

  const ropeSegments = diameterIntervals.map((interval) => {
    const points = getPoints(interval.top, interval.bottom);

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
