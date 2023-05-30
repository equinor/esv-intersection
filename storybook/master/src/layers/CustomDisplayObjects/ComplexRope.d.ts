import { Mesh, IPoint, Renderer, Texture } from 'pixi.js';
export type ComplexRopeSegment = {
    points: IPoint[];
    diameter: number;
};
/**
 * The ComplexRope allows you to draw a texture across several segments of points and then manipulate these points
 */
export declare class ComplexRope extends Mesh {
    /**
     * re-calculate vertices by rope segment-points each frame
     * @member {boolean}
     */
    autoUpdate: boolean;
    /**
     * @param texture - The texture to use on the rope.
     * @param segments - An array of segments with points and diaeter to construct this rope.
     */
    constructor(texture: Texture, segments: ComplexRopeSegment[]);
    _render(renderer: Renderer): void;
}
//# sourceMappingURL=ComplexRope.d.ts.map