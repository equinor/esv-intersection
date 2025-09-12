import { scaleLinear } from 'd3-scale';
import { zoomIdentity } from 'd3-zoom';
import { Casing, CasingWindow, CementPlug, HoleSize, OnRescaleEvent, Tubing } from '../src';

export function rescaleEventStub(): OnRescaleEvent {
  const xBounds = [0, 1000] as [number, number];
  const yBounds = [0, 1000] as [number, number];
  const event = {
    xBounds,
    yBounds,
    zFactor: 1,
    viewportRatio: 1,
    xRatio: 1,
    yRatio: 1,
    width: 1,
    height: 1,
    transform: zoomIdentity,
    xScale: scaleLinear().domain(xBounds).range([0, 1]),
    yScale: scaleLinear().domain(yBounds).range([0, 1]),
  };

  return event;
}

export const generateId = (prefix: string) => `${prefix}-${Math.round(Math.random() * 10000)}`;

export const createCementPlug = (start: number, end: number, referenceIds?: string[]): CementPlug => ({
  kind: 'cementPlug',
  id: generateId('cementPlug'),
  start,
  end,
  referenceIds: referenceIds ?? [],
});

export const createCasingWindow = (start: number, end: number): CasingWindow => ({
  id: generateId('casing-window'),
  start,
  end,
});

export const createCasing = (
  start: number,
  end: number,
  options?: {
    diameters?: { innerDiameter: number; outerDiameter: number };
    hasShoe?: boolean;
    windows?: CasingWindow[];
  },
): Casing => ({
  kind: 'casing',
  id: generateId('casing'),
  innerDiameter: options?.diameters?.innerDiameter ?? 6,
  diameter: options?.diameters?.outerDiameter ?? 7,
  start,
  end,
  hasShoe: options?.hasShoe ?? false,
  windows: options?.windows ?? [],
});

export const createHole = (start: number, end: number, diameter?: number): HoleSize => ({
  kind: 'hole',
  id: generateId('holeSize'),
  diameter: diameter ?? 30,
  start,
  end,
});

export const createTubing = (start: number, end: number, diameter?: number): Tubing => ({
  kind: 'tubing',
  id: generateId('holeSize'),
  diameter: diameter ?? 7,
  start,
  end,
});
