/* eslint-disable no-magic-numbers */
import { describe, expect, it, beforeEach } from 'vitest';
import { degrees } from '@equinor/videx-math';
import { IntersectionReferenceSystem } from '../src';

const wp = [
  [30, 40, 4],
  [40, 70, 6],
  [45, 100, 8],
  [50, 110, 10],
];

function dist(a: number[], b: number[]): number {
  const d0 = a[0]! - b[0]!;
  const d1 = a[1]! - b[1]!;
  return Math.sqrt(d0 * d0 + d1 * d1);
}

describe('Reference system', () => {
  let rs: IntersectionReferenceSystem;
  beforeEach(() => {
    const options = {
      trajectoryAngle: 0,
      quickT: true,
    };
    rs = new IntersectionReferenceSystem(wp, options);
  });
  it('should set path on creation', () => {
    expect(rs.path).not.toEqual(undefined);
    expect(rs.path).toEqual(wp);
  });
  it('should return error on empty path', () => {
    const arr: number[][] = [];
    expect(() => {
      new IntersectionReferenceSystem(arr);
    }).toThrow('Missing coordinates');
  });
  it('should return error when path is in 4d and not 3d', () => {
    const arr: number[][] = [[1, 1, 1, 1]];
    expect(() => {
      new IntersectionReferenceSystem(arr);
    }).toThrow('Coordinates should be in 3d');
  });
  it('should return error when path is in 2d and not 3d', () => {
    const arr: number[][] = [[1, 1]];
    expect(() => {
      new IntersectionReferenceSystem(arr);
    }).toThrow('Coordinates should be in 3d');
  });
  it('should return error when path is in 1d and not 3d', () => {
    const arr: number[][] = [[1]];
    expect(() => {
      new IntersectionReferenceSystem(arr);
    }).toThrow('Coordinates should be in 3d');
  });
  it('should get start position at 0', () => {
    const pos = rs.getPosition(0);
    expect(pos[0]).toBeCloseTo(30, 1);
    expect(pos[1]).toBeCloseTo(40, 1);
  });
  it('should clamp position to start position', () => {
    const pos = rs.getPosition(-100);
    expect(pos[0]).toBeCloseTo(30, 1);
    expect(pos[1]).toBeCloseTo(40, 1);
  });
  it('should clamp position to end position', () => {
    const pos = rs.getPosition(1000);
    expect(pos[0]).toBeCloseTo(50, 1);
    expect(pos[1]).toBeCloseTo(110, 1);
  });
  it('should have correct number of points', () => {
    const trajectory = rs.getTrajectory(100);
    expect(trajectory.points.length).toEqual(100);
  });
  it('should have same distance between points in trajectory', () => {
    const trajectory = rs.getTrajectory(80);
    const firstDistance = dist(trajectory.points[0]!, trajectory.points[1]!);
    let lastPoint = trajectory.points[1]!;
    for (let i = 2; i < trajectory.points.length; i++) {
      const point = trajectory.points[i]!;
      const currentDistance = dist(point, lastPoint);
      expect(currentDistance).toBeCloseTo(firstDistance);
      lastPoint = point;
    }
  });
  it('should have correct number of points', () => {
    const trajectory = rs.getExtendedTrajectory(100);
    expect(trajectory.points.length).toEqual(100);
  });

  it('should have same distance between points in extended trajectory', () => {
    const trajectory = rs.getExtendedTrajectory(200, 500.0, 500.0);
    const firstDistance = dist(trajectory.points[0]!, trajectory.points[1]!);
    let lastPoint = trajectory.points[1]!;
    for (let i = 2; i < trajectory.points.length; i++) {
      const point = trajectory.points[i]!;
      const currentDistance = dist(point, lastPoint);
      expect(currentDistance).toBeCloseTo(firstDistance, 0);
      lastPoint = point;
    }
  });
  it('should have correct length on extension', () => {
    const trajectory = rs.getExtendedTrajectory(100, 500.0, 500.0);
    const startExtend = dist(trajectory.points[0]!, rs.interpolators.trajectory.getPointAt(0.0) as number[]);
    const endExtend = dist(trajectory.points[99]!, rs.interpolators.trajectory.getPointAt(1.0) as number[]);
    expect(startExtend).toBeCloseTo(500.0);
    expect(endExtend).toBeCloseTo(500.0);
  });

  it('should throw error when parameters are negative', () => {
    expect(() => {
      rs.getExtendedTrajectory(100, -50.0, 500.0);
    }).toThrow('Invalid parameter, getExtendedTrajectory() must be called with a valid and positive startExtensionLength parameter');
    expect(() => {
      rs.getExtendedTrajectory(100, 50.0, -500.0);
    }).toThrow('Invalid parameter, getExtendedTrajectory() must be called with a valid and positive endExtensionLength parameter');
  });

  it('should work for vertical wellbore', () => {
    const verticalPosLog = [
      [30, 40, 100],
      [30, 40, 7000],
    ];
    const options = { trajectoryAngle: 45.0 };
    const irs = new IntersectionReferenceSystem(verticalPosLog, options);

    const trajectory = irs.getExtendedTrajectory(100, 1500.0, 1500.0);
    expect(trajectory.points.length).toEqual(100);

    const startExtend = dist(trajectory.points[0]!, irs.interpolators.trajectory.getPointAt(0.0) as number[]);
    const endExtend = dist(trajectory.points[99]!, irs.interpolators.trajectory.getPointAt(1.0) as number[]);
    expect(startExtend).toBeCloseTo(1500.0);
    expect(endExtend).toBeCloseTo(1500.0);
    const angle = degrees(
      Math.atan((trajectory.points[99]?.[0]! - trajectory.points[0]?.[0]!) / (trajectory.points[99]?.[1]! - trajectory.points[0]?.[1]!)),
    );
    expect(angle).toBeCloseTo(45.0);
  });

  it('should project to right depths on vertical wellbores', () => {
    // Note: this is used for picks
    const verticalPosLog = [
      [30, 40, 50],
      [30, 40, 6500],
    ];
    const options = { trajectoryAngle: 45.0 };
    const irs = new IntersectionReferenceSystem(verticalPosLog, options);
    irs.offset = 50;

    expect(irs.project(0)[1]).toBeCloseTo(50, 1);
    expect(irs.project(7000)[1]).toBeCloseTo(6500, 1);

    expect(irs.project(200)[1]).toBeCloseTo(200, 1);
    expect(irs.project(6000)[1]).toBeCloseTo(6000, 1);
  });

  it('should project to right depths on vertical wellbores with negative offset', () => {
    // Note: this is used for picks
    const verticalPosLog = [
      [80, 40, -25],
      [80, 40, 5000],
    ];
    const options = { trajectoryAngle: 45.0 };
    const irs = new IntersectionReferenceSystem(verticalPosLog, options);
    irs.offset = -25;

    expect(irs.project(-100)[1]).toBeCloseTo(-25, 1);
    expect(irs.project(0)[1]).toBeCloseTo(0, 1);
    expect(irs.project(7000)[1]).toBeCloseTo(5000, 1);

    expect(irs.project(200)[1]).toBeCloseTo(200, 1);
    expect(irs.project(4000)[1]).toBeCloseTo(4000, 1);
  });
});
