import { IntersectionReferenceSystem } from '../src';

const wp = [
  [30, 40, 4],
  [40, 70, 6],
  [45, 100, 8],
  [50, 110, 10],
];

describe('Reference system', () => {
  let rs: IntersectionReferenceSystem;
  beforeEach(() => {
    rs = new IntersectionReferenceSystem(wp);
  });
  it('should set path on creation', () => {
    expect(rs.path).not.toEqual(undefined);
    expect(rs.path).toEqual(wp);
  });
  it('should return error on empty path', () => {
    const arr: any[] = [];
    expect(() => {
      const test = new IntersectionReferenceSystem(arr);
    }).toThrow('Missing coordinates');
  });
  it('should return error when path is in 4d and not 3d', () => {
    const arr: any[] = [[1, 1, 1, 1]];
    expect(() => {
      const test = new IntersectionReferenceSystem(arr);
    }).toThrow('Coordinates should be in 3d');
  });
  it('should return error when path is in 2d and not 3d', () => {
    const arr: any[] = [[1, 1]];
    expect(() => {
      const test = new IntersectionReferenceSystem(arr);
    }).toThrow('Coordinates should be in 3d');
  });
  it('should return error when path is in 1d and not 3d', () => {
    const arr: any[] = [[1]];
    expect(() => {
      const test = new IntersectionReferenceSystem(arr);
    }).toThrow('Coordinates should be in 3d');
  });
  it('should get start position at 0', () => {
    const pos = rs.getPosition(0);
    expect(pos).toEqual([30, 40]);
  });
  it('should clamp position to start position', () => {
    const pos = rs.getPosition(-10);
    expect(pos).toEqual([30, 40]);
  });
  it('should get end position', () => {
    const pos = rs.getPosition(110);
    expect(pos).toEqual([50, 110]);
  });
  it('should clamp position to end position', () => {
    const pos = rs.getPosition(120);
    expect(pos).toEqual([50, 110]);
  });
});
