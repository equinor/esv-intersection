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
    // const meshMaterial = new MeshMaterial(texture);

    super({ geometry: ropeGeometry, texture });

    this.autoUpdate = true;

    this.onRender = () => {
      const geometry: UniformTextureStretchRopeGeometry = this.geometry as UniformTextureStretchRopeGeometry;

      if (this.autoUpdate || geometry._width !== this.shader?.texture.height) {
        geometry._width = this.shader?.texture.height ?? 0;
        geometry.update();
      }

      // if (renderer) {
      //   super.onRender(renderer);
      // }
    };
  }

  // override _render(renderer: Renderer): void {
  //   const geometry: UniformTextureStretchRopeGeometry = this.geometry as UniformTextureStretchRopeGeometry;

  //   // TODO: Possible optimiztion here
  //   // Find correct check for when to update geometry
  //   if (this.autoUpdate || geometry._width !== this.shader.texture.height) {
  //     geometry._width = this.shader.texture.height;
  //     geometry.update();
  //   }

  //   super._render(renderer);
  // }
}
