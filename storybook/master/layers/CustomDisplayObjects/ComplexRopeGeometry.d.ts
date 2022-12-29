import { MeshGeometry } from 'pixi.js';
import { ComplexRopeSegment } from './ComplexRope';
/**
 * RopeGeometry allows you to draw a geometry across several several segments of points and then manipulate these points.
 */
export declare class ComplexRopeGeometry extends MeshGeometry {
    /** An array of segments with points and diameter that determine the rope. */
    private segments;
    /** Rope texture scale. */
    private readonly textureScale;
    /**
     * @param segments - An array of segments with points and diameter to construct this rope.
     * @param textureScale - scaling factor for repeated texture. To create a tiling rope
     *     set baseTexture.wrapMode to PIXI.WRAP_MODES.REPEAT and use a power of two texture.
     */
    constructor(segments: ComplexRopeSegment[], textureScale?: number);
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
