import { IPoint, Mesh, MeshMaterial, Renderer, Texture, WRAP_MODES } from 'pixi.js';
import { ComplexRopeGeometry } from './ComplexRopeGeometry';

export type ComplexRopeSegment = {
  points: IPoint[];
  diameter: number;
};

/**
 * The rope allows you to draw a texture across several points and then manipulate these points
 * @example
 * import { SimpleRope, Texture, Point } from 'pixi.js';
 *
 * for (let i = 0; i < 20; i++) {
 *     points.push(new Point(i * 50, 0));
 * };
 * const rope = new SimpleRope(Texture.from("snake.png"), points);
 * @memberof PIXI
 */
export class ComplexRope extends Mesh {
  public autoUpdate: boolean;

  /**
   * @param texture - The texture to use on the rope.
   * @param points - An array of {@link PIXI.Point} objects to construct this rope.
   * @param {number} textureScale - Optional. Adjust intreval of repeated texture
   */
  constructor(texture: Texture, segments: ComplexRopeSegment[], textureScale = 0) {
    const ropeGeometry = new ComplexRopeGeometry(texture.height, segments, textureScale);
    const meshMaterial = new MeshMaterial(texture);

    // attempt to set UV wrapping, will fail on non-power of two textures
    texture.baseTexture.wrapMode = WRAP_MODES.REPEAT;

    super(ropeGeometry, meshMaterial);

    /**
     * re-calculate vertices by rope points each frame
     * @member {boolean}
     */
    this.autoUpdate = true;
  }

  _render(renderer: Renderer): void {
    const geometry: ComplexRopeGeometry = this.geometry as ComplexRopeGeometry;

    if (this.autoUpdate || geometry._width !== this.shader.texture.height) {
      geometry._width = this.shader.texture.height;
      geometry.update();
    }

    super._render(renderer);
  }
}
