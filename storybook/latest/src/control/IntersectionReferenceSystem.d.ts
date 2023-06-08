import { CurveInterpolator } from 'curve-interpolator';
import { Interpolators, Trajectory, MDPoint } from '../interfaces';
import { ExtendedCurveInterpolator } from './ExtendedCurveInterpolator';
export interface ReferenceSystemOptions {
    normalizedLength?: number;
    arcDivisions?: number;
    tension?: number;
    trajectoryAngle?: number;
    calculateDisplacementFromBottom?: boolean;
    curveInterpolator?: ExtendedCurveInterpolator;
    trajectoryInterpolator?: ExtendedCurveInterpolator;
    curtainInterpolator?: ExtendedCurveInterpolator;
    approxT?: boolean;
    quickT?: boolean;
}
export declare class IntersectionReferenceSystem {
    options: ReferenceSystemOptions;
    path: number[][];
    projectedPath: number[][];
    projectedTrajectory: number[][];
    private _offset;
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
    constructor(path: number[][], options?: ReferenceSystemOptions);
    private setPath;
    /**
     * Map a length along the curve to intersection coordinates
     * @param length length along the curve
     */
    project(length: number): number[];
    curtainTangent(length: number): number[];
    /**
     * Returns as resampled version of the projected path between start and end
     * Samples are picked from the beginning of the path at every CURTAIN_SAMPLING_INTERVAL meters
     * If the angle between two consecutive segments is close to 180 degrees depending on CURTAIN_SAMPLING_ANGLE_THRESHOLD,
     * a sample in between is discarded.
     *
     * The start and the end are not guaranteed to be part of the returned set of points
     * @param startMd in MD
     * @param endMd in MD
     * @param includeStartEnd guarantee to include the starting and end points
     */
    getCurtainPath(startMd: number, endMd: number, includeStartEnd?: boolean): MDPoint[];
    /**
     * Map a displacement back to length along the curve
     */
    unproject(displacement: number): number;
    /**
     * Get the normalized displacement [0 - 1] of a specific length along the curve
     */
    getProjectedLength(length: number): number;
    /**
     * Get the trajectory position at a length along the curve
     */
    getPosition(length: number): number[];
    /**
     * Generate a set of coordinates along the trajectory of the curve
     */
    getTrajectory(steps: number, from?: number, to?: number): Trajectory;
    /**
     * Generate a set of coordinates along the trajectory of the curve
     */
    getExtendedTrajectory(numPoints: number, startExtensionLength?: number, endExtensionLength?: number): Trajectory;
    getTrajectoryVector(): number[];
    /**
     * Perform a curtain projection on a set of points in 3D
     * @param points
     * @param origin
     * @param offset
     * @returns {array}
     */
    static toDisplacement(points: number[][], offset?: number): number[][];
    /**
     * returns a normalized vector
     * @param interpolator interpolated curve
     * @param from number between 0 and 1
     * @param to number between 0 and 1
     */
    static getDirectionVector(interpolator: CurveInterpolator, from: number, to: number): number[];
    get length(): number;
    get offset(): number;
    set offset(offset: number);
}
//# sourceMappingURL=IntersectionReferenceSystem.d.ts.map