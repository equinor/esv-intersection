import Vector2 from '@equinor/videx-vector2';
import { seqI } from '@equinor/videx-math';
// @ts-ignore
import { CurveInterpolator } from 'curve-interpolator';

type Position = {
  easting: number;
  northing: number;
  tvd: number;
  md: number;
};

type Interpolator = {
  scale: any;
  trajectory: any;
  position: any;
  curtain: any;
};

type ViewBox = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
};

const stepSize = 0.1;
const extensionLength = 1000;
const thresholdRelativeDist = 150;
const thresholdDirectionDist = 30;

const pathSteps = 10;
const margin = 1;

export class DataManager {
  wellborePath: number[][];

  projectedPath: number[][];

  trajectory: number[][];

  projectedTrajectory: number[][];

  offset: number;

  xy: number[][];

  displacement: number;

  depthReference: number;

  wellboreId: number;

  trajectoryOffset: number;

  trajectoryAngle: number;

  interpolators: Interpolator;

  constructor(poslog: Position[], defaultIntersectionAngle: number) {
    const points = poslog.map(p => [p.easting, p.northing, p.tvd, p.md]) || [];
    this.wellborePath = points;

    this.projectedPath = this.generateProjectedWellborePath();
    this.projectedTrajectory = this.generateProjectedTrajectory(defaultIntersectionAngle);
    this.xy = this.generateProjectedPosition();

    const interpolatorsScale = new CurveInterpolator(
      points.map(p => [p[3], p[2]]),
      0.75,
    );
    const interpolatorsTrajectory = new CurveInterpolator(this.projectedTrajectory, 0.75);
    const interpolatorsPosition = new CurveInterpolator(this.xy, 0.75, 5000);
    const interpolatorsCurtain = new CurveInterpolator(this.projectedPath, 0.75, 5000);

    this.interpolators = {
      curtain: interpolatorsCurtain,
      trajectory: interpolatorsTrajectory,
      position: interpolatorsPosition,
      scale: interpolatorsScale,
    };

    this.generateProjectedTrajectory = this.generateProjectedTrajectory.bind(this);
    this.generateProjectedWellborePath = this.generateProjectedWellborePath.bind(this);
    this.toMd = this.toMd.bind(this);
    this.toTvd = this.toTvd.bind(this);
    this.mdDomain = this.mdDomain.bind(this);
    this.getProjectedTrajectory = this.getProjectedTrajectory.bind(this);
    this.getProjectedOrientation = this.getProjectedOrientation.bind(this);
    this.getLengthAt = this.getLengthAt.bind(this);
    this.getProjectedCoords = this.getProjectedCoords.bind(this);
    this.getCoords = this.getCoords.bind(this);
    this.getScaleExtent = this.getScaleExtent.bind(this);
    this.getProjectedBBox = this.getProjectedBBox.bind(this);
    this.getWellboreLength = this.getWellboreLength.bind(this);
    this.getWellboreMD = this.getWellboreMD.bind(this);
  }

  generateProjectedPosition(): number[][] {
    const { wellborePath } = this;
    const interp = new CurveInterpolator(wellborePath, 0.75, 5000);
    this.displacement = interp.length;

    const nPoints = Math.round(this.displacement * pathSteps);
    if (nPoints > 0) {
      this.xy = DataManager.simplify(interp.getPoints(nPoints), 0.0005, 10);
    } else {
      this.xy = [[wellborePath[0][0], wellborePath[0][1]]];
    }

    let { xy } = this;
    if (this.xy.length < 4) {
      xy = [this.xy[0], this.xy[0], this.xy[0], this.xy[0]];
    }

    return xy;
  }

  generateProjectedWellborePath(): number[][] {
    const { wellborePath: path } = this;
    if (!path || path.length === 0) {
      return [];
    }

    const projection: number[][] = DataManager.simplify(DataManager.projectCurtain(path));
    const offset: number = projection[projection.length - 1][0];

    projection.forEach((p, i) => {
      projection[i][0] = offset - p[0];
    });

    return projection;
  }

  /**
   * Generate Trajectory
   * Code originally developed for REP
   * @param {number} defaultIntersectionAngle Default intersection angle for the field
   */
  generateProjectedTrajectory(defaultIntersectionAngle: number): number[][] {
    const { wellborePath: points } = this;
    if (!points || points.length === 0) {
      return [];
    }

    const interpolator: any = new CurveInterpolator(points, 0.75, 5000);
    const displacement: number = interpolator.length;

    const nPoints: number = Math.round(displacement * pathSteps);
    let path: number[][] = null;
    if (nPoints > 0) {
      path = DataManager.simplify(interpolator.getPoints(nPoints), 0.0005, 10);
    } else {
      path = [[points[0][0], points[0][1]]];
    }

    const first: number[] = path[0];
    const last: number[] = path[path.length - 1];
    const relativeDist: number = Vector2.distance(first, last);
    let v: Vector2 = null;

    if (relativeDist < thresholdRelativeDist) {
      const radCurtainDirection = (defaultIntersectionAngle / 180) * Math.PI;
      v = new Vector2(Math.cos(radCurtainDirection), Math.sin(radCurtainDirection)).mutable;
    } else {
      v = DataManager.getDirectionVector(path, thresholdDirectionDist);
    }
    const extensionLengthStart: number = Math.max(0, extensionLength - displacement);
    const offset: number = extensionLengthStart + displacement;
    const trajectory: number[][] = [];

    let firstPoints: number[][] = [];

    // Reference to initial vector
    const initial: number[] = v.toArray();

    if (extensionLengthStart > 0) {
      // extend from start
      firstPoints = seqI(Math.ceil(extensionLengthStart * stepSize)).map(t =>
        v
        .set(initial)
        .scale(extensionLengthStart * (1 - t))
        .subFrom(first)
        .toArray());
      firstPoints.pop();
      trajectory.push(...firstPoints);
    }
    trajectory.push(...path);

    const endPoints: number[][] = seqI(Math.ceil(extensionLength * stepSize))
      .map(t =>
        v
        .set(initial)
        .scale(extensionLength * t)
        .add(last)
        .toArray())
      .splice(1);

    trajectory.push(...endPoints);
    const a1: number = Vector2.angleRight(initial);

    const angle: number = ((a1 > 0 ? a1 : 2 * Math.PI + a1) * 360) / (2 * Math.PI);

    const projectedTrajectory: number[][] = DataManager.projectCurtain(trajectory, null, offset);

    return projectedTrajectory;
  }

  /**
   * Perform a curtain projection on a set of points in 3D
   * @param points
   * @param origin
   * @param offset
   * @returns {array}
   */
  static projectCurtain(points: number[][], origin: number[] = null, offset = 0): number[][] {
    let p0: number[] = origin || points[0];
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
   * Get direction vector
   * Code originally developed for REP
   * @param {[]} path
   * @param {number} threshold
   * @returns {Vector2}
   */
  static getDirectionVector(path: number[][], threshold: number): Vector2 {
    const res: Vector2 = Vector2.zero.mutable;
    let len = 0;
    const temp: Vector2 = Vector2.zero.mutable;

    for (let i = 0; i < path.length - 1; i++) {
      const index = path.length - 1 - i;
      temp.set(path[index]).sub(path[index - 1]);
      res.add(temp);

      len = res.magnitude;
      if (len > threshold) break;
    }

    if (len === 0) return null;
    return res.scale(1 / len);
  }

  /**
   * Simplify array
   *
   * Simplifies an array using given parameters.
   * Code originally developed for REP
   * @access public
   *
   * @param {Number[]}      inputArr           Array to simplify
   * @param {Number}        [maxOffset=0.001]  Max offset (Default = 0.001)
   * @param {Number}        [maxDistance=10]   Max distance (Default = 10)
   *
   * @return {Number[]}    Simplified array
   */
  static simplify(inputArr: number[][], maxOffset = 0.001, maxDistance = 10): number[][] {
    if (inputArr.length <= 4) {
      return inputArr;
    }
    const [o0, o1] = inputArr[0];
    const arr = inputArr.map(d => [d[0] - o0, d[1] - o1]);
    let [a0, a1] = arr[0];
    const sim: number[][] = [inputArr[0]];

    for (let i = 1; i + 1 < arr.length; i++) {
      const [t0, t1] = arr[i];
      const [b0, b1] = arr[i + 1];

      // If t->b vector is NOT [0, 0]
      if (b0 - t0 !== 0 || b1 - t1 !== 0) {
        // Proximity check
        const proximity: number = Math.abs(a0 * b1 - a1 * b0 + b0 * t1 - b1 * t0 + a1 * t0 - a0 * t1) / Math.sqrt((b0 - a0) ** 2 + (b1 - a1) ** 2);

        const dir: number[] = [a0 - t0, a1 - t1];
        const len: number = Math.sqrt(dir[0] ** 2 + dir[1] ** 2);

        if (proximity > maxOffset || len >= maxDistance) {
          sim.push([t0 + o0, t1 + o1]);
          [a0, a1] = [t0, t1];
        }
      }
    }
    const last: number[] = arr[arr.length - 1];
    sim.push([last[0] + o0, last[1] + o1]);

    return sim;
  }

  /**
   * @param {number|string} tvd - true vertical depth
   * @returns {number} either md or undefined
   */
  toMd(tvd: number): number {
    const { scale } = this.interpolators;
    if (!scale) throw Error('Called before scale interpolator was created');
    if (!Number.isFinite(tvd)) throw Error('Invalid input!');
    const v = scale.x(tvd, -1, margin);
    if (v === undefined) {
      if (tvd < scale.points[0][1]) {
        return scale.points[0][0];
      }
      return scale.points[scale.points.length - 1][0];
    }
    return v;
  }

  /**
   * @param {number|string} md - measured depth
   * @returns {number} either tvd or undefined
   */
  toTvd(md: number): number {
    const { scale } = this.interpolators;
    if (!scale) throw Error('Called before scale interpolator was created');
    if (!Number.isFinite(md)) throw Error('Invalid input!');
    const v = scale.y(md, 1, margin);
    if (v === undefined) {
      if (md < scale.points[0][0]) {
        return scale.points[0][1];
      }
      return scale.points[scale.points.length - 1][1];
    }
    return v;
  }


  /**
   * @returns {number} measured depth
   */
  getWellboreMD(): number {
    const { wellborePath } = this;
    return wellborePath[wellborePath.length - 1][3];
  }

  /**
   * @returns {number}
   */
  getWellboreLength(): number {
    const { wellborePath } = this;
    return this.getWellboreMD() - wellborePath[0][3];
  }

  mdDomain(): number[] {
    const { wellborePath: path } = this;
    if (path.length > 2) {
      return [path[0][3], path[path.length - 1][3]];
    }
    return null;
  }

  /**
   * @param {number} displacement
   * @returns {[number, number]} x, y
   */
  getTrajectoryCoords(displacement: number, defaultIntersectionAngle: number): number[] {
    if (!this.interpolators.trajectory) {
      this.interpolators.trajectory = new CurveInterpolator(this.trajectory, 0.75);
    }

    const { trajectory } = this.interpolators;
    const projTraj = this.generateProjectedTrajectory(defaultIntersectionAngle);
    const max = projTraj[0][0];
    const min = projTraj[projTraj.length - 1][0];
    if (displacement > max || displacement < min) return null;

    const l = 1 - Math.min(1, Math.max(0, (displacement - min) / (max - min)));
    const p = trajectory.getPointAt(l);
    return p;
  }

  /**
   * @returns {array}
   */
  getProjectedTrajectory(): number[][] {
    if (!this.projectedTrajectory) {
      const { trajectory } = this;
      const offset = this.trajectoryOffset;
      this.projectedTrajectory = DataManager.projectCurtain(trajectory, null, offset);
    }

    return this.projectedTrajectory;
  }

  /**
   * @returns {string} ltr or rtl depending on angle
   */
  getProjectedOrientation(): string {
    const { trajectoryAngle: a } = this;
    return a < 90 || a > 270 ? 'ltr' : 'rtl';
  }

  /**
   * @param {number} md - measured depth
   * @returns {number}
   */
  getLengthAt(md: number): number {
    const { wellborePath } = this;
    const top = wellborePath[0][3]; // md
    const bottom = wellborePath[wellborePath.length - 1][3]; // md
    const tl = bottom - top;

    if (md <= top) return 0;
    if (md >= bottom) return 1;
    const l = (md - top) / tl;
    return l;
  }

  /**
   * @param {number} md - measured depth
   * @returns {[number, number]} x, y
   */
  getProjectedCoords(md: number): number[] {
    const { curtain } = this.interpolators;
    const l = this.getLengthAt(md);
    const p = curtain.getPointAt(l);
    return p;
  }

  /**
   * @param {number} md - measured depth
   * @returns {number}
   */
  getProjectedLengthAt(md: number): number {
    const { curtain } = this.interpolators;
    const pl = this.getProjectedCoords(md);
    const l = (curtain.maxX - pl[0]) / curtain.maxX;
    if (Number.isNaN(l) || l < 0) return 0;
    if (l > 1) return 1;
    return l;
  }

  /**
   * @param {number} md - measured depth
   * @returns {[number, number]} x, y
   */
  getCoords(md: number): number[] {
    const { position } = this.interpolators;
    const l = this.getProjectedLengthAt(md);
    const p = position.getPointAt(l);
    return p;
  }

  /**
   * @returns {{ md: { min: number, max: number}, tvd: { min: number, max: number }}}
   */
  getScaleExtent(): any {
    if (!this.interpolators.scale) {
      return { md: null, tvd: null };
    }

    const { minX, maxX, minY, maxY } = this.interpolators.scale;

    return {
      md: { min: minX, max: maxX },
      tvd: { min: minY, max: maxY },
    };
  }

  getProjectedBBox(viewbox: ViewBox): ViewBox {
    const { projectedPath } = this;

    const [x1, y1] = projectedPath[0];
    const [x2, y2] = projectedPath[projectedPath.length - 1];

    const flipped = viewbox.x1 < viewbox.x2;
    const vb = {
      x1: flipped ? viewbox.x2 : viewbox.x1,
      x2: flipped ? viewbox.x1 : viewbox.x2,
      y1: viewbox.y1,
      y2: viewbox.y2,
    };

    if (x2 > vb.x1 || x1 < vb.x2 || y2 < vb.y1 || y1 > vb.y2) {
      return null;
    }
    const r = {
      x1: Math.min(x1, vb.x1),
      y1: Math.max(y1, vb.y1),
      x2: Math.max(x2, vb.x2),
      y2: Math.min(y2, vb.y2),
    };

    let xy1 = null;
    let xy2 = null;
    let yx1 = null;
    let yx2 = null;

    const iy1 = projectedPath.findIndex(p => p[1] >= r.y1);
    if (iy1 !== -1) {
      xy1 = projectedPath[iy1][0];
      if (xy1 < r.x1) {
        r.x1 = xy1;
      }
    }

    const iy2 = projectedPath.findIndex(p => p[1] > r.y2);
    if (iy2 > 0) {
      xy2 = projectedPath[iy2 - 1][0];
      if (xy2 < r.x2) {
        r.x2 = xy2;
      }
    }

    if ((xy1 === null && xy2 === null) || (xy1 > r.x1 && xy2 > r.x1) || (xy1 < r.x2 && xy2 < r.x2)) {
      return null;
    }

    const ix1 = projectedPath.findIndex(p => p[0] >= r.x1);
    if (ix1 !== -1) {
      yx1 = projectedPath[ix1][1];
      if (yx1 > r.y1) {
        r.y1 = yx1;
      }
    }

    const ix2 = projectedPath.findIndex(p => p[0] > r.x2);
    if (ix2 > 0) {
      yx2 = projectedPath[ix2 - 1][1];
      if (yx2 < r.y2) {
        r.y2 = yx2;
      }
    }

    if ((yx1 === null && yx2 === null) || (yx1 > r.y2 && yx2 > r.y2) || (yx1 < r.y1 && yx2 > r.y1)) {
      return null;
    }

    if (flipped) {
      const rx1 = r.x1;
      r.x1 = r.x2;
      r.x2 = rx1;
    }
    return r;
  }
}
