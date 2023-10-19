import { MeshGeometry } from 'pixi.js';
import type { IPoint } from 'pixi.js';
/**
 * UniformTextureStretchRopeGeometry allows you to draw a geometry across several points and then manipulate these points.
 */
export declare class UniformTextureStretchRopeGeometry extends MeshGeometry {
    /** An array of points that determine the rope. */
    points: IPoint[];
    /**
     * The width (i.e., thickness) of the rope.
     * @readonly
     */
    _width: number;
    /**
     * @param width - The width (i.e., thickness) of the rope.
     * @param points - An array of PIXI.Point objects to construct this rope.
     */
    constructor(points: IPoint[], width?: number);
    /** Refreshes Rope indices and uvs */
    private build;
    /** refreshes vertices of Rope mesh */
    updateVertices(): void;
    update(): void;
}
//# sourceMappingURL=UniformTextureStretchRopeGeometry.d.ts.map