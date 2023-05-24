import { Mesh, MeshMaterial, IPoint, Renderer, Texture, WRAP_MODES } from 'pixi.js';
import { ComplexRopeGeometry } from './ComplexRopeGeometry';

export type ComplexRopeSegment = {
  points: IPoint[];
  diameter: number;
};

/**
 * The ComplexRope allows you to draw a texture across several segments of points and then manipulate these points
 */
export class ComplexRope extends Mesh {
  /**
   * re-calculate vertices by rope segment-points each frame
   * @member {boolean}
   */
  public autoUpdate: boolean;

  /**
   * @param texture - The texture to use on the rope.
   * @param segments - An array of segments with points and diaeter to construct this rope.
   */
  constructor(texture: Texture, segments: ComplexRopeSegment[]) {
    const ropeGeometry = new ComplexRopeGeometry(segments);
    const meshMaterial = new MeshMaterial(texture);

    // attempt to set UV wrapping, will fail on non-power of two textures
    texture.baseTexture.wrapMode = WRAP_MODES.REPEAT;

    super(ropeGeometry, meshMaterial);

    this.autoUpdate = true;
  }

  override _render(renderer: Renderer): void {
    const geometry: ComplexRopeGeometry = this.geometry as ComplexRopeGeometry;

    if (this.autoUpdate) {
      geometry.update();
    }

    super._render(renderer);
  }
}
