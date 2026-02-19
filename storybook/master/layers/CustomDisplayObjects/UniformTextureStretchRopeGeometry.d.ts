import { MeshGeometry, Point } from 'pixi.js';
/**
 * UniformTextureStretchRopeGeometry allows you to draw a geometry across several points and then manipulate these points.
 */
export declare class UniformTextureStretchRopeGeometry extends MeshGeometry {
    /** An array of points that determine the rope. */
    points: Point[];
    /**
     * The width (i.e., thickness) of the rope.
     * @readonly
     */
    _width: number;
    /**
     * @param width - The width (i.e., thickness) of the rope.
     * @param points - An array of Point objects to construct this rope.
     */
    constructor(points: Point[], width?: number);
    /** Refreshes Rope indices and uvs */
    private build;
    /** refreshes vertices of Rope mesh */
    updateVertices(): void;
    update(): void;
}
//# sourceMappingURL=UniformTextureStretchRopeGeometry.d.ts.map