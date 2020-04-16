import Vector2 from '@equinor/videx-vector2';
import { CurveInterpolator, normalize } from 'curve-interpolator';
import { Position, Interpolator, Trajectory, ReferenceSystemOptions } from '../interfaces';

const defaultOptions = {
  defaultIntersectionAngle: 45,
  tension: 0.75,
  arcDivisions: 5000,
  thresholdDirectionDist: 30,
};

export class IntersectionReferenceSystem {
  options: ReferenceSystemOptions;

  path: number[][] = [];

  projectedPath: number[][] = [];

  trajectory: number[][];

  projectedTrajectory: number[][];

  private _offset: number = 0;

  displacement: number;

  depthReference: number;

  wellboreId: number;

  trajectoryOffset: number;

  trajectoryAngle: number;

  interpolators: Interpolator;

  startVector: number[];

  endVector: number[];

  constructor(poslog: Position[], options?: ReferenceSystemOptions) {
    this.setPoslog(poslog, options);

    this.project = this.project.bind(this);
    this.unproject = this.unproject.bind(this);
    this.getPosition = this.getPosition.bind(this);
    this.getProjectedLength = this.getProjectedLength.bind(this);
    this.getTrajectory = this.getTrajectory.bind(this);
  }

  private setPoslog(poslog: Position[], options?: ReferenceSystemOptions): void {
    this.options = options || defaultOptions;
    const { arcDivisions, tension, thresholdDirectionDist } = this.options;

    const path = poslog.map((p: Position) => [p.easting, p.northing, p.tvd]) || [];
    this.path = path;

    this.projectedPath = IntersectionReferenceSystem.toDisplacement(path);

    const [displacement] = this.projectedPath[this.projectedPath.length - 1];
    this.displacement = displacement;

    this.interpolators = {
      curve: new CurveInterpolator(path),
      trajectory: new CurveInterpolator(
        path.map((d: number[]) => [d[0], d[1]]),
        { tension, arcDivisions },
      ),
      curtain: new CurveInterpolator(this.projectedPath, { tension, arcDivisions }),
    };

    this.endVector = IntersectionReferenceSystem.getDirectionVector(this.interpolators.trajectory, 1 - thresholdDirectionDist, 1);
    this.startVector = this.endVector.map((d: number) => d * -1);
  }

  /**
   * Map a length along the curve to intersection coordinates
   */
  project(length: number): number[] {
    const { curtain } = this.interpolators;
    const l = (length - this._offset) / this.length;
    // TODO handle points outside
    if (l < 0 || l > 1) {
      return [0, 0];
    }
    const p = curtain.getPointAt(l);
    return p;
  }

  /**
   * Map a displacement back to length along the curve
   */
  unproject(displacement: number): number {
    if (displacement < 0) {
      return displacement;
    }
    if (displacement > this.displacement) {
      return this.length + (displacement - this.displacement);
    }
    const ls = this.interpolators.curtain.lookupPositions(displacement, 0, 1);
    if (ls && ls.length) {
      return ls[0] * this.length;
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
    if (Number.isNaN(l) || l < 0) {
      return 0;
    }
    if (l > 1) {
      return 1;
    }
    return l;
  }

  /**
   * Get the trajectory position at a length along the curve
   */
  getPosition(length: number): number[] {
    const { trajectory } = this.interpolators;
    const l = this.getProjectedLength(length);
    const p = trajectory.getPointAt(l);
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
    const curveSteps = Math.ceil(((t1 - t0) / tl) * steps);
    const preSteps = Math.floor((extensionStart / tl) * steps);
    const postSteps = steps - curveSteps - preSteps;

    if (p0) {
      points.push(p0);
      for (let i = 1; i < preSteps; i++) {
        const f = (i / preSteps) * extensionStart * this.displacement;
        points.push([p0[0] - this.startVector[0] * f, p0[1] - this.startVector[1] * f]);
      }
    }
    points.push(...this.interpolators.trajectory.getPoints(curveSteps, null, t0, t1));
    if (p3) {
      for (let i = 1; i < postSteps; i++) {
        const f = (i / postSteps) * extensionEnd * this.displacement;
        points.push([p2[0] + this.endVector[0] * f, p2[1] + this.endVector[1] * f]);
      }
      points.push(p3);
    }
    return { points, offset };
  }

  /**
   * Perform a curtain projection on a set of points in 3D
   * AKA toDisplacement, projectCurtain
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

  static getDirectionVector(interp: any, from: number, to: number): number[] {
    const p1 = interp.getPointAt(to);
    const p2 = interp.getPointAt(from);

    return normalize([p1[0] - p2[0], p1[1] - p2[1]]);
  }

  get length(): number {
    return this.interpolators.curve.length;
  }

  get offset(): number {
    return this._offset;
  }

  set offset(offset: number) {
    this._offset = offset;
  }
}
