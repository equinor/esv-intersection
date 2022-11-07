/* eslint-disable no-magic-numbers */
import { Casing, Completion, HoleSize } from '../src';
import * as SchematicShapeGenerator from '../src/datautils/schematicShapeGenerator';
import * as TestHelpers from './test-helpers';

describe('SVG', () => {
  it('object above/below each other should not overlap', () => {
    const above = {
      top: 10,
      bottom: 20,
    };
    const below = {
      top: 21,
      bottom: 30,
    };
    const test = SchematicShapeGenerator.overlaps(above.top, above.bottom, below.top, below.bottom);
    const test2 = SchematicShapeGenerator.overlaps(below.top, below.bottom, above.top, above.bottom);
    expect(test).toBe(false);
    expect(test2).toBe(false);
  });

  it('object overlaping half way should return true', () => {
    const above = {
      top: 10,
      bottom: 20,
    };
    const below = {
      top: 15,
      bottom: 25,
    };
    const test = SchematicShapeGenerator.overlaps(below.top, below.bottom, above.top, above.bottom);
    const test2 = SchematicShapeGenerator.overlaps(above.top, above.bottom, below.top, below.bottom);
    expect(test).toBe(true);
    expect(test2).toBe(true);
  });

  it('object inside another should return true', () => {
    const inside = {
      top: 20,
      bottom: 30,
    };
    const ouside = {
      top: 10,
      bottom: 40,
    };
    const test = SchematicShapeGenerator.overlaps(ouside.top, ouside.bottom, inside.top, inside.bottom);
    const test2 = SchematicShapeGenerator.overlaps(inside.top, inside.bottom, ouside.top, ouside.bottom);
    expect(test).toBe(true);
    expect(test2).toBe(true);
  });
});

describe('getUniqueDiameterChangeDepths', () => {
  it('should only return change depths within start/end interval', () => {
    const intervals: [number, number] = [100, 200];
    const diameterIntervals = [
      { start: 50, end: 70 },
      { start: 60, end: 90 },
      { start: 90, end: 110 },
      { start: 110, end: 190 },
      { start: 190, end: 210 },
      { start: 210, end: 220 },
    ];

    const expected = [100, 109.9999, 110, 110.0001, 189.9999, 190, 190.0001, 200];

    expect(SchematicShapeGenerator.getUniqueDiameterChangeDepths(intervals, diameterIntervals)).toStrictEqual(expected);
  });

  it('should return start/end interval if diameter intervals is outside', () => {
    const intervals: [number, number] = [100, 200];
    const diameterIntervals = [
      { start: 50, end: 70 },
      { start: 60, end: 90 },
      { start: 210, end: 220 },
    ];

    const expected = [100, 200];

    expect(SchematicShapeGenerator.getUniqueDiameterChangeDepths(intervals, diameterIntervals)).toStrictEqual(expected);
  });
});

describe('findCementPlugInnerDiameterAtDepth', () => {
  it('should return extreme diameter if nothing exists at referenced depth', () => {
    const depth = 1000;

    expect(SchematicShapeGenerator.findCementPlugInnerDiameterAtDepth([], [], [], depth)).toBe(100);
  });

  it('should prefer holeSize diameter over extreme diameter for given depth', () => {
    const depth = 1000;
    const attached: (Casing | Completion)[] = [];
    const nonAttached: (Casing | Completion)[] = [];
    const holes: HoleSize[] = [TestHelpers.createHole(100, 2000, 30)];

    expect(SchematicShapeGenerator.findCementPlugInnerDiameterAtDepth(attached, nonAttached, holes, depth)).toBe(30);
  });

  it('should prefer holeSize diameter over extreme diameter for given depth', () => {
    const depth = 1000;
    const attached: (Casing | Completion)[] = [];
    const nonAttached: (Casing | Completion)[] = [];
    const holes: HoleSize[] = [TestHelpers.createHole(100, 2000, 30)];

    expect(SchematicShapeGenerator.findCementPlugInnerDiameterAtDepth(attached, nonAttached, holes, depth)).toBe(30);
  });

  it('should prefer minimal non-attached string diameter over hole at depth', () => {
    const depth = 1000;
    const attached: (Casing | Completion)[] = [];
    const nonAttached: (Casing | Completion)[] = [
      TestHelpers.createTubing(500, 1500, 7),
      TestHelpers.createCasing(50, 1900, { innerDiameter: 10, outerDiameter: 12 }),
    ];
    const holes: HoleSize[] = [TestHelpers.createHole(100, 2000)];

    expect(SchematicShapeGenerator.findCementPlugInnerDiameterAtDepth(attached, nonAttached, holes, depth)).toBe(7);
  });

  it('should flow to equal or greater diameter outside attached range', () => {
    const depth = 1100;
    const attached = [TestHelpers.createCasing(500, 1000, { innerDiameter: 7, outerDiameter: 8 })];
    const nonAttached = [TestHelpers.createTubing(1000, 1500, 5), TestHelpers.createCasing(500, 1500, { innerDiameter: 10, outerDiameter: 11 })];
    const holes = [TestHelpers.createHole(100, 2000)];

    expect(SchematicShapeGenerator.findCementPlugInnerDiameterAtDepth(attached, nonAttached, holes, depth)).not.toBe(5); // Tubing
    expect(SchematicShapeGenerator.findCementPlugInnerDiameterAtDepth(attached, nonAttached, holes, depth)).toBe(10); // casing
  });

  it('should flow to extreme diameter if depth is out of range', () => {
    const depth = 9000;
    const attached = [TestHelpers.createCasing(500, 1000, { innerDiameter: 7, outerDiameter: 8 })];
    const nonAttached = [TestHelpers.createTubing(1000, 1500, 5), TestHelpers.createCasing(500, 1500, { innerDiameter: 10, outerDiameter: 11 })];
    const holes = [TestHelpers.createHole(100, 2000)];

    expect(SchematicShapeGenerator.findCementPlugInnerDiameterAtDepth(attached, nonAttached, holes, depth)).toBe(100);
  });
});
