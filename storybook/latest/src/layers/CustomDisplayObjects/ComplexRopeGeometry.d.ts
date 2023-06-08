import { MeshGeometry } from 'pixi.js';
import { ComplexRopeSegment } from './ComplexRope';
/**
 * RopeGeometry allows you to draw a geometry across several several segments of points and then manipulate these points.
 */
export declare class ComplexRopeGeometry extends MeshGeometry {
    /** An array of segments with points and diameter that determine the rope. */
    private segments;
    /**
     * @param segments - An array of segments with points and diameter to construct this rope.
     */
    constructor(segments: ComplexRopeSegment[]);
    /**
     * The max width (i.e., thickness) of the rope.
     * @readonly
     */
    get width(): number;
    /** Refreshes Rope indices and uvs */
    private build;
    /** refreshes vertices of Rope mesh */
    updateVertices(): void;
    update(): void;
}
//# sourceMappingURL=ComplexRopeGeometry.d.ts.map