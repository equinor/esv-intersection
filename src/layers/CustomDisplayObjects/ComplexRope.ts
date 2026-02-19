import { Mesh, Point, Texture } from 'pixi.js';
import { ComplexRopeGeometry } from './ComplexRopeGeometry';

export type ComplexRopeSegment = {
  points: Point[];
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

    // attempt to set UV wrapping, will fail on non-power of two textures
    texture.source.addressMode = 'repeat';

    super({ geometry: ropeGeometry, texture });

    this.autoUpdate = true;

    this.onRender = () => {
      const geometry: ComplexRopeGeometry = this.geometry as ComplexRopeGeometry;

      if (this.autoUpdate) {
        geometry.update();
      }
    };
  }
}
