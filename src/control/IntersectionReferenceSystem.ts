/* eslint-disable no-magic-numbers */
import Vector2 from '@equinor/videx-vector2';
import { clamp, radians } from '@equinor/videx-math';
import { normalize } from 'curve-interpolator';

import { Interpolators, Trajectory, ReferenceSystemOptions, MDPoint } from '../interfaces';
import { ExtendedCurveInterpolator } from './ExtendedCurveInterpolator';

// determines how curvy the curve is
const TENSION = 0.75;
// determines how many segments to split the curve into
const ARC_DIVISIONS = 5000;
// specifies amount of steps (in the range [0,1]) to work back from the end of the curve
const THRESHOLD_DIRECTION_DISTANCE = 0.001;

const DEFAULT_START_EXTEND_LENGTH = 1000.0;
const DEFAULT_END_EXTEND_LENGTH = 1000.0;

const CURTAIN_SAMPLING_ANGLE_THRESHOLD = 0.0005;
const CURTAIN_SAMPLING_INTERVAL = 0.1;

const defaultOptions = {
  approxT: true,
};

export class IntersectionReferenceSystem {
  options: ReferenceSystemOptions;

  path: number[][] = [];

  projectedPath: number[][] = [];

  projectedTrajectory: number[][];

  private _offset: number = 0;

  displacement: number;

  depthReference: number;

  wellboreId: number;

  trajectoryOffset: number;

  interpolators: Interpolators;

  startVector: number[];

  endVector: number[];

  _curtainPathCache: MDPoint[];

  /**
   * Creates a common reference system that layers and other components can use
   * @param path (required) array of 3d coordinates: [x, y, z]
   * @param options (optional)
   * @param options.trajectoryAngle (optional) - trajectory angle in degrees, overrides the calculated value
   * @param options.calculateDisplacementFromBottom - (optional) specify if the path is passed from bottom up
   */
  constructor(path: number[][], options?: ReferenceSystemOptions) {
    if (path.length < 1) {
      throw new Error('Missing coordinates');
    }
    if (path[0] && path[0].length !== 3) {
      throw new Error('Coordinates should be in 3d');
    }
    this.setPath(path, options);

    this.project = this.project.bind(this);
    this.unproject = this.unproject.bind(this);
    this.getPosition = this.getPosition.bind(this);
    this.getProjectedLength = this.getProjectedLength.bind(this);
    this.getTrajectory = this.getTrajectory.bind(this);
  }

  private setPath(path: number[][], options: ReferenceSystemOptions = {}): void {
    this.options = { ...defaultOptions, ...options };
    const { arcDivisions, tension, calculateDisplacementFromBottom } = this.options;

    this.path = path;

    this.projectedPath = IntersectionReferenceSystem.toDisplacement(path);

    const [displacement] = this.projectedPath[this.projectedPath.length - 1];
    this.displacement = displacement;

    this.interpolators = {
      curve: options.curveInterpolator || new ExtendedCurveInterpolator(path),
      trajectory:
        options.trajectoryInterpolator ||
        new ExtendedCurveInterpolator(
          path.map((d: number[]) => [d[0], d[1]]),
          { tension: tension || TENSION, arcDivisions: arcDivisions || ARC_DIVISIONS },
        ),
      curtain:
        options.curtainInterpolator ||
        new ExtendedCurveInterpolator(this.projectedPath, { tension: tension || TENSION, arcDivisions: arcDivisions || ARC_DIVISIONS }),
    };

    const trajVector = this.getTrajectoryVector();
    const negativeTrajVector = trajVector.map((d: number) => d * -1);

    if (calculateDisplacementFromBottom) {
      this.endVector = negativeTrajVector;
      this.startVector = trajVector;
    } else {
      this.endVector = trajVector;
      this.startVector = negativeTrajVector;
    }

    this._curtainPathCache = undefined;
  }

  /**
   * Map a length along the curve to intersection coordinates
   * @param length length along the curve
   */
  project(length: number): number[] {
    const { curtain } = this.interpolators;
    const { calculateDisplacementFromBottom } = this.options;
    const cl = clamp(calculateDisplacementFromBottom ? this.length - (length - this._offset) : length - this._offset, 0, this.length);
    const p = curtain.getPointAtArcLength(cl, this.options);
    return p;
  }

  curtainTangent(length: number): number[] {
    const { curtain } = this.interpolators;
    const l = length - this._offset;
    const t = curtain.findTForArcLength(l, this.options);
    const tangent = t && curtain.getTangentAt(t);
    return tangent;
  }

  /**
   * Returns as resampled version of the projected path between start and end
   * Samples are picked from the beginning of the path at every CURTAIN_SAMPLING_INTERVAL meters
   * If the angle between two consecutive segments is close to 180 degrees depending on CURTAIN_SAMPLING_ANGLE_THRESHOLD,
   * a sample in between is discarded.
   *
   * The start and the end are not guaranteed to be part of the returned set of points
   * @param start in MD
   * @param end in MD
   */
  getCurtainPath(start: number, end: number): MDPoint[] {
    if (!this._curtainPathCache) {
      const points = [];
      let prevAngle = Math.PI * 2; // Always add first point
      for (let i = this._offset; i <= this.length + this._offset; i += CURTAIN_SAMPLING_INTERVAL) {
        const point = this.project(i);
        const angle = Math.atan2(point[1], point[0]);

        // Reduce number of points on a straight line by angle since last point
        if (Math.abs(angle - prevAngle) > CURTAIN_SAMPLING_ANGLE_THRESHOLD) {
          points.push({ point, md: i });
          prevAngle = angle;
        }
      }
      this._curtainPathCache = points;
    }

    return this._curtainPathCache.filter((p) => p.md >= start && p.md <= end);
  }

  /**
   * Map a displacement back to length along the curve
   */
  unproject(displacement: number): number {
    const { normalizedLength, calculateDisplacementFromBottom } = this.options;
    const displacementFromStart = calculateDisplacementFromBottom ? this.displacement - displacement : displacement;
    const length = normalizedLength || this.length;

    if (displacementFromStart < 0) {
      return displacementFromStart;
    }
    if (displacementFromStart > this.displacement) {
      return length + (displacementFromStart - this.displacement);
    }

    const ls = this.interpolators.curtain.lookupPositions(displacementFromStart, 0, 1);
    if (ls && ls.length) {
      return ls[0] * length + this._offset;
    }
    return null;
  }

  /**
   * Get the normalized displacement [0 - 1] of a specific length along the curve
   */
  getProjectedLength(length: number): number {
    const { curtain } = this.interpolators;
    const pl = this.project(length);
    const l = pl[0] / curtain.maxX;
    return Number.isFinite(l) ? clamp(l, 0, 1) : 0;
  }

  /**
   * Get the trajectory position at a length along the curve
   */
  getPosition(length: number): number[] {
    const { trajectory } = this.interpolators;
    const t = this.getProjectedLength(length);
    const p = trajectory.getPointAt(t);
    return p;
  }

  /**
   * Generate a set of coordinates along the trajectory of the curve
   */
  getTrajectory(steps: number, from = 0, to = 1): Trajectory {
    const extensionStart = from < 0 ? -from : 0;
    const extensionEnd = to > 1 ? to - 1 : 0;

    const refStart = this.interpolators.trajectory.getPointAt(0);
    const refEnd = this.interpolators.trajectory.getPointAt(1);

    let p0;
    let p3;
    let offset = 0;
    const t0 = Math.max(0, from);
    const t1 = Math.min(1, to);
    const p1 = this.interpolators.trajectory.getPointAt(t0);
    const p2 = this.interpolators.trajectory.getPointAt(t1);

    if (extensionStart) {
      p0 = [
        refStart[0] + this.startVector[0] * extensionStart * this.displacement,
        refStart[1] + this.startVector[1] * extensionStart * this.displacement,
      ];
      offset = -Vector2.distance(p0, refStart);
    } else if (from > 0) {
      offset = Vector2.distance(p1, refStart);
    }

    if (extensionEnd) {
      p3 = [refEnd[0] + this.endVector[0] * extensionEnd * this.displacement, refEnd[1] + this.endVector[1] * extensionEnd * this.displacement];
    }
    const points = [];
    const tl = to - from;
    const preSteps = Math.floor((extensionStart / tl) * steps);
    const curveSteps = Math.ceil(((t1 - t0) / tl) * steps);
    const postSteps = steps - curveSteps - preSteps;

    if (p0) {
      points.push(p0);
      for (let i = 1; i < preSteps; i++) {
        const f = (i / preSteps) * extensionStart * this.displacement;
        points.push([p0[0] - this.startVector[0] * f, p0[1] - this.startVector[1] * f]);
      }
    }
    const curvePoints = this.interpolators.trajectory.getPoints(curveSteps - 1, null, t0, t1); // returns steps + 1 points
    points.push(...curvePoints);
    if (p3) {
      for (let i = 1; i < postSteps - 1; i++) {
        const f = (i / postSteps) * extensionEnd * this.displacement;
        points.push([p2[0] + this.endVector[0] * f, p2[1] + this.endVector[1] * f]);
      }
      points.push(p3);
    }
    return { points, offset };
  }

  /**
   * Generate a set of coordinates along the trajectory of the curve
   */
  getExtendedTrajectory(
    numPoints: number,
    startExtensionLength = DEFAULT_START_EXTEND_LENGTH,
    endExtensionLength = DEFAULT_END_EXTEND_LENGTH,
  ): Trajectory {
    if (!isFinite(startExtensionLength) || startExtensionLength < 0.0) {
      throw new Error('Invalid parameter, getExtendedTrajectory() must be called with a valid and positive startExtensionLength parameter');
    }
    if (!isFinite(endExtensionLength) || endExtensionLength < 0.0) {
      throw new Error('Invalid parameter, getExtendedTrajectory() must be called with a valid and positive endExtensionLength parameter');
    }

    const totalLength = this.displacement + startExtensionLength + endExtensionLength;
    const startExtensionNumPoints = Math.floor((startExtensionLength / totalLength) * numPoints);
    const curveSteps = Math.max(Math.ceil((this.displacement / totalLength) * numPoints), 1);
    const endExtensionNumPoints = numPoints - curveSteps - startExtensionNumPoints;

    const points = [];

    const refStart = new Vector2(this.interpolators.trajectory.getPointAt(0.0));
    const startVec = new Vector2(this.startVector);
    const startExtensionStepLength = startExtensionLength / startExtensionNumPoints;
    for (let i = startExtensionNumPoints; i > 0; i--) {
      const f = i * startExtensionStepLength;
      const point = refStart.add(startVec.scale(f));
      points.push(point.toArray());
    }

    points.push(...this.interpolators.trajectory.getPoints(curveSteps, null, 0.0, 1.0));

    const refEnd = new Vector2(this.interpolators.trajectory.getPointAt(1.0));
    const endVec = new Vector2(this.endVector);
    const endExtensionStepLength = endExtensionLength / (endExtensionNumPoints - 1); // -1 so last point is at end of extension
    for (let i = 1; i < endExtensionNumPoints; i++) {
      const f = i * endExtensionStepLength;
      const point = refEnd.add(endVec.scale(f));
      points.push(point.toArray());
    }

    const offset = -startExtensionLength;

    const trajectory = { points, offset };
    return trajectory;
  }

  getTrajectoryVector(): number[] {
    const { trajectoryAngle, calculateDisplacementFromBottom } = this.options;

    if (isFinite(trajectoryAngle)) {
      const angleInRad = radians(trajectoryAngle);
      return new Vector2(Math.cos(angleInRad), Math.sin(angleInRad)).toArray();
    }

    const trajectoryVec = IntersectionReferenceSystem.getDirectionVector(
      this.interpolators.trajectory,
      calculateDisplacementFromBottom ? THRESHOLD_DIRECTION_DISTANCE : 1 - THRESHOLD_DIRECTION_DISTANCE,
      calculateDisplacementFromBottom ? 0 : 1,
    );
    return trajectoryVec;
  }

  /**
   * Perform a curtain projection on a set of points in 3D
   * @param points
   * @param origin
   * @param offset
   * @returns {array}
   */
  static toDisplacement(points: number[][], offset = 0): number[][] {
    let p0: number[] = points[0];
    let l = 0;
    const projected = points.map((p1: number[]) => {
      const dx = p1[0] - p0[0];
      const dy = p1[1] - p0[1];
      l += Math.sqrt(dx ** 2 + dy ** 2);
      p0 = p1;
      return [offset > 0 ? offset - l : l, p1[2] || 0];
    });
    return projected;
  }

  /**
   * returns a normalized vector
   * @param interpolator interpolated curve
   * @param from number between 0 and 1
   * @param to number between 0 and 1
   */
  static getDirectionVector(interpolator: any, from: number, to: number): number[] {
    const p1 = interpolator.getPointAt(to);
    const p2 = interpolator.getPointAt(from);

    return normalize([p1[0] - p2[0], p1[1] - p2[1]]) as number[];
  }

  get length(): number {
    return this.interpolators.curve.length;
  }

  get offset(): number {
    return this._offset;
  }

  set offset(offset: number) {
    this._curtainPathCache = undefined;
    this._offset = offset;
  }
}
