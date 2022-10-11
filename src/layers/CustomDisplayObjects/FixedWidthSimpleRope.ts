import { IPoint, Mesh, MeshMaterial, Renderer, RopeGeometry, Texture, WRAP_MODES } from 'pixi.js';

/**
 * The rope allows you to draw a texture across several points and then manipulate these points
 * Width of rope is given in constructor
 */
export class FixedWidthSimpleRope extends Mesh {
  /**
   * re-calculate vertices by rope points each frame
   * @member {boolean}
   */
  public autoUpdate: boolean;

  /**
   * Note: The wrap mode of the texture is set to REPEAT if `textureScale` is positive.
   * @param texture - The texture to use on the rope. (attempt to set UV wrapping, will fail on non-power of two textures)
   * @param points - An array of {@link PIXI.Point} objects to construct this rope.
   * @param width - Width of rope
   * @param {number} textureScale - Optional. Positive values scale rope texture
   * keeping its aspect ratio. You can reduce alpha channel artifacts by providing a larger texture
   * and downsampling here. If set to zero, texture will be stretched instead.
   */
  constructor(texture: Texture, points: IPoint[], width: number, textureScale = 0) {
    const ropeGeometry = new RopeGeometry(width, points, textureScale);
    const meshMaterial = new MeshMaterial(texture);

    if (textureScale > 0) {
      // attempt to set UV wrapping, will fail on non-power of two textures
      texture.baseTexture.wrapMode = WRAP_MODES.REPEAT;
    }
    super(ropeGeometry, meshMaterial);

    this.autoUpdate = true;
  }

  _render(renderer: Renderer): void {
    const geometry: RopeGeometry = this.geometry as RopeGeometry;

    if (this.autoUpdate) {
      geometry.update();
    }

    super._render(renderer);
  }
}
