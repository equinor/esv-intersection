import { IntersectionReferenceSystem } from '../src';

const wp = [
  [30, 40, 4],
  [40, 70, 6],
  [45, 100, 8],
  [50, 110, 10]
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
