import { Point, Mesh, Texture } from 'pixi.js';
/**
 * The rope allows you to draw a texture across several points and then manipulate these points
 * Width of rope is given in constructor
 */
export declare class FixedWidthSimpleRope extends Mesh {
    /**
     * re-calculate vertices by rope points each frame
     * @member {boolean}
     */
    autoUpdate: boolean;
    /**
     * Note: The wrap mode of the texture is set to REPEAT if `textureScale` is positive.
     * @param texture - The texture to use on the rope. (attempt to set UV wrapping, will fail on non-power of two textures)
     * @param points - An array of {@link Point} objects to construct this rope.
     * @param width - Width of rope
     */
    constructor(texture: Texture, points: Point[], width: number);
}
//# sourceMappingURL=FixedWidthSimpleRope.d.ts.map