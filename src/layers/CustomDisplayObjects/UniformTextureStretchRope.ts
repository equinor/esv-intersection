import { Point, Mesh, Texture } from 'pixi.js';
import { UniformTextureStretchRopeGeometry } from './UniformTextureStretchRopeGeometry';

/**
 * The UniformTextureStretchRope allows you to draw a texture across several points and then manipulate these points
 */
export class UniformTextureStretchRope extends Mesh {
  /**
   * re-calculate vertices by rope points each frame
   * @member {boolean}
   */
  public autoUpdate: boolean;

  /**
   * @param texture - The texture to use on the rope.
   * @param points - An array of {@link Point} objects to construct this rope.
   */
  constructor(texture: Texture, points: Point[]) {
    const ropeGeometry = new UniformTextureStretchRopeGeometry(points, texture.height);

    super({ geometry: ropeGeometry, texture });

    this.autoUpdate = true;

    this.onRender = () => {
      const geometry: UniformTextureStretchRopeGeometry = this.geometry as UniformTextureStretchRopeGeometry;

      if (this.autoUpdate || geometry._width !== this.shader?.texture.height) {
        geometry._width = this.shader?.texture.height ?? 0;
        geometry.update();
      }
    };
  }
}
