import { overlaps } from '../src/datautils/schematicShapeGenerator';

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
    const test = overlaps(above.top, above.bottom, below.top, below.bottom);
    const test2 = overlaps(below.top, below.bottom, above.top, above.bottom);
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
    const test = overlaps(below.top, below.bottom, above.top, above.bottom);
    const test2 = overlaps(above.top, above.bottom, below.top, below.bottom);
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
    const test = overlaps(ouside.top, ouside.bottom, inside.top, inside.bottom);
    const test2 = overlaps(inside.top, inside.bottom, ouside.top, ouside.bottom);
    expect(test).toBe(true);
    expect(test2).toBe(true);
  });
});
