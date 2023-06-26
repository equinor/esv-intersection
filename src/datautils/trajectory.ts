import Vector2 from '@equinor/videx-vector2';
import { seqI } from '@equinor/videx-math';
import { CurveInterpolator } from 'curve-interpolator';
import { SurveySample } from './interfaces';

const stepSize = 0.1;
const extensionLength = 1000;
const thresholdRelativeDist = 150;
const thresholdDirectionDist = 30;

const pathSteps = 10;

/**
 * Generate projected wellbore path for drawing using wellbore path layer
 * Code originally developed for REP
 * @param {[]} poslog Position log from SMDA
 */
export function generateProjectedWellborePath(poslog: SurveySample[]): [number, number][] {
  if (!poslog || poslog.length === 0) {
    return [];
  }

  const points: [number, number, number, number][] = poslog ? poslog.map((p: SurveySample) => [p.easting, p.northing, p.tvd, p.md]) : [];

  const projection = simplify(projectCurtain(points));
  const offset = projection[projection.length - 1]?.[0];

  if (offset != null) {
    projection.forEach((p, i) => {
      projection[i]![0] = offset - p[0];
    });
  }

  return projection;
}

/**
 * Generate Trajectory
 * Code originally developed for REP
 * @param {[]} poslog Position log from SMDA
 * @param {number} defaultIntersectionAngle Default intersection angle for the field
 */
export function generateProjectedTrajectory(poslog: SurveySample[], defaultIntersectionAngle: number): number[][] {
  if (!poslog || poslog.length === 0) {
    return [];
  }

  const points: [number, number, number, number][] = poslog ? poslog.map((p) => [p.easting, p.northing, p.tvd, p.md]) : [];

  const interpolator: CurveInterpolator = new CurveInterpolator(points, { tension: 0.75, arcDivisions: 5000 });
  const displacement: number = interpolator.length;

  const nPoints: number = Math.round(displacement * pathSteps);
  let path: [number, number][];
  if (nPoints > 0) {
    const maxOffset = 0.0005;
    const maxDistance = 10;
    path = simplify(interpolator.getPoints(nPoints), maxOffset, maxDistance);
  } else {
    path = [[points[0]![0], points[0]![1]]];
  }

  const first = path[0]!;
  const last = path[path.length - 1]!;
  const relativeDist: number = Vector2.distance(first, last);
  let v: Vector2;

  if (relativeDist < thresholdRelativeDist) {
    const oneEighty = 180;
    const radCurtainDirection = (defaultIntersectionAngle / oneEighty) * Math.PI;
    v = new Vector2(Math.cos(radCurtainDirection), Math.sin(radCurtainDirection)).mutable;
  } else {
    v = getDirectionVector(path, thresholdDirectionDist);
  }
  const extensionLengthStart: number = Math.max(0, extensionLength - displacement);
  const offset: number = extensionLengthStart + displacement;
  const trajectory: [number, number][] = [];

  let firstPoints: [number, number][] = [];

  // Reference to initial vector
  const initial: number[] = v.toArray();

  if (extensionLengthStart > 0) {
    // extend from start
    firstPoints = seqI(Math.ceil(extensionLengthStart * stepSize)).map((t) =>
      v
        .set(initial)
        .scale(extensionLengthStart * (1 - t))
        .subFrom(first)
        .toArray(),
    );
    firstPoints.pop();
    trajectory.push(...firstPoints);
  }
  trajectory.push(...path);

  const endPoints = seqI(Math.ceil(extensionLength * stepSize))
    .map((t) =>
      v
        .set(initial)
        .scale(extensionLength * t)
        .add(last)
        .toArray(),
    )
    .splice(1);

  trajectory.push(...endPoints);

  const projectedTrajectory: number[][] = projectCurtain(trajectory, undefined, offset);

  return projectedTrajectory;
}

/**
 * Get direction vector
 * Code originally developed for REP
 * @param {[]} path
 * @param {number} threshold
 * @returns {Vector2}
 */
function getDirectionVector(path: number[][], threshold: number): Vector2 {
  const res: Vector2 = Vector2.zero.mutable;
  let len = 0;
  const temp: Vector2 = Vector2.zero.mutable;

  for (let i = 0; i < path.length - 1; i++) {
    const index = path.length - 1 - i;
    temp.set(path[index]!).sub(path[index - 1]!);
    res.add(temp);

    len = res.magnitude;
    if (len > threshold) {
      break;
    }
  }

  if (len === 0) {
    return new Vector2([0, 0]);
  }
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
function simplify(inputArr: [number, number][], maxOffset = 0.001, maxDistance = 10): [number, number][] {
  if (inputArr.length <= 4) {
    return inputArr;
  }
  const [o0, o1] = inputArr[0]!;
  const arr = inputArr.map<[number, number]>((d) => [d[0]! - o0, d[1]! - o1]);
  let [a0, a1] = arr[0]!;
  const sim = [inputArr[0]!];

  for (let i = 1; i + 1 < arr.length; i++) {
    const [t0, t1] = arr[i] ?? [];
    const [b0, b1] = arr[i + 1] ?? [];

    // If t->b vector is NOT [0, 0]
    if (t0 != null && t1 != null && b0 != null && b1 != null && (b0 - t0 !== 0 || b1 - t1 !== 0)) {
      // Proximity check
      const proximity: number = Math.abs(a0 * b1 - a1 * b0 + b0 * t1 - b1 * t0 + a1 * t0 - a0 * t1) / Math.sqrt((b0 - a0) ** 2 + (b1 - a1) ** 2);

      const dir: [number, number] = [a0 - t0, a1 - t1];
      const len: number = Math.sqrt(dir[0] ** 2 + dir[1] ** 2);

      if (proximity > maxOffset || len >= maxDistance) {
        sim.push([t0 + o0, t1 + o1]);
        [a0, a1] = [t0, t1];
      }
    }
  }
  const last = arr[arr.length - 1]!;
  sim.push([last[0] + o0, last[1] + o1]);

  return sim;
}

/**
 * Perform a curtain projection on a set of points in 3D
 * @param points
 * @param origin
 * @param offset
 * @returns {array}
 */
function projectCurtain(points: [number, number, ...number[]][], origin?: [number, number, number, number], offset = 0): [number, number][] {
  let p0 = origin || points[0]!;
  let l = 0;
  const projected = points.map<[number, number]>((p1) => {
    const dx = p1[0] - p0[0];
    const dy = p1[1] - p0[1];
    l += Math.sqrt(dx ** 2 + dy ** 2);
    p0 = p1;
    return [offset > 0 ? offset - l : l, p1[2] ?? 0];
  });
  return projected;
}
