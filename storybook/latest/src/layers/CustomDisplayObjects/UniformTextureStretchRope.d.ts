import { IPoint, Mesh, Renderer, Texture } from 'pixi.js';
/**
 * The UniformTextureStretchRope allows you to draw a texture across several points and then manipulate these points
 */
export declare class UniformTextureStretchRope extends Mesh {
    /**
     * re-calculate vertices by rope points each frame
     * @member {boolean}
     */
    autoUpdate: boolean;
    /**
     * @param texture - The texture to use on the rope.
     * @param points - An array of {@link PIXI.Point} objects to construct this rope.
     */
    constructor(texture: Texture, points: IPoint[]);
    _render(renderer: Renderer): void;
}
//# sourceMappingURL=UniformTextureStretchRope.d.ts.map