import { SurveySample } from './interfaces';
/**
 * Generate projected wellbore path for drawing using wellbore path layer
 * Code originally developed for REP
 * @param {[]} poslog Position log from SMDA
 */
export declare function generateProjectedWellborePath(poslog: SurveySample[]): [number, number][];
/**
 * Generate Trajectory
 * Code originally developed for REP
 * @param {[]} poslog Position log from SMDA
 * @param {number} defaultIntersectionAngle Default intersection angle for the field
 */
export declare function generateProjectedTrajectory(poslog: SurveySample[], defaultIntersectionAngle: number): number[][];
//# sourceMappingURL=trajectory.d.ts.map