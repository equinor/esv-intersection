import { clamp } from '@equinor/videx-math';

import { BoundingBox } from '../interfaces';
import { ScaleLinear } from 'd3-scale';

const DEFAULT_HORIZONTAL_PADDING = 4;
const DEFAULT_VERTICAL_PADDING = 2;

export function pixelsPerUnit(x: ScaleLinear<number, number>): number {
  const [min] = x.domain();
  return Math.abs(x(min + 1));
}

export function calcSize(factor: number, min: number, max: number, x: ScaleLinear<number, number>): number {
  return clamp(pixelsPerUnit(x) * factor, min, max);
}

export function isOverlappingHorizontally(r1: BoundingBox, r2: BoundingBox): boolean {
  const r1x2 = r1.x + r1.width;
  const r2x2 = r2.x + r2.width;

  if (r2.x > r1x2 || r2x2 < r1.x) {
    return false;
  }
  return true;
}

export function isOverlapping(
  r1: BoundingBox,
  r2: BoundingBox,
  horizontalPadding: number = DEFAULT_HORIZONTAL_PADDING,
  verticalPadding: number = DEFAULT_VERTICAL_PADDING,
): boolean {
  const r1x2 = r1.x + r1.width + horizontalPadding;
  const r2x2 = r2.x + r2.width + horizontalPadding;
  const r1y2 = r1.y + r1.height + verticalPadding;
  const r2y2 = r2.y + r2.height + verticalPadding;

  if (r2.x - horizontalPadding > r1x2 || r2.y - verticalPadding > r1y2 || r2x2 + horizontalPadding < r1.x || r2y2 + verticalPadding < r1.y) {
    return false;
  }
  return true;
}

export function getOverlap(r1: BoundingBox, r2: BoundingBox): { dx: number; dy: number } {
  const r1x2 = r1.x + r1.width;
  const r2x2 = r2.x + r2.width;
  const r1y2 = r1.y + r1.height;
  const r2y2 = r2.y + r2.height;

  if (r2.x > r1x2 || r2.y > r1y2 || r2x2 < r1.x || r2y2 < r1.y) {
    return null;
  }

  const dx = Math.max(0, Math.min(r1.x + r1.width, r2.x + r2.width) - Math.max(r1.x, r2.x));
  const dy = Math.max(0, Math.min(r1.y + r1.height, r2.y + r2.height) - Math.max(r1.y, r2.y));

  const newPoints = {
    dx,
    dy,
  };
  return newPoints;
}

export function getOverlapOffset(
  r1: BoundingBox,
  r2: BoundingBox,
  horizontalPadding = DEFAULT_HORIZONTAL_PADDING,
  verticalPadding = DEFAULT_VERTICAL_PADDING,
): { dx: number; dy: number } {
  const r1x2 = r1.x + r1.width;
  const r2x2 = r2.x + r2.width;
  const r1y2 = r1.y + r1.height;
  const r2y2 = r2.y + r2.height;

  if (r2.x - horizontalPadding > r1x2 || r2.y - verticalPadding > r1y2 || r2x2 + horizontalPadding < r1.x || r2y2 + verticalPadding < r1.y) {
    return null;
  }

  const dx = r1.x + r1.width - r2.x + horizontalPadding;
  const dy = r1.y + r1.height - r2.y + verticalPadding;

  const newPoints = {
    dx,
    dy,
  };
  return newPoints;
}
