import { MeshGeometry } from 'pixi.js';
import { sum, max } from 'd3-array';
import { ComplexRopeSegment } from './ComplexRope';

/**
 * RopeGeometry allows you to draw a geometry across several points and then manipulate these points.
 * @example
 * import { RopeGeometry, Point } from 'pixi.js';
 *
 * for (let i = 0; i < 20; i++) {
 *     points.push(new Point(i * 50, 0));
 * };
 * const rope = new RopeGeometry(100, points);
 * @memberof PIXI
 */
export class ComplexRopeGeometry extends MeshGeometry {
  /** An array of segments with points and diameter that determine the rope. */
  public segments: ComplexRopeSegment[];

  /** Rope texture scale. */
  public readonly textureScale: number;

  /**
   * The width (i.e., thickness) of the rope.
   * @readonly
   */
  _width: number;

  /**
   * @param width - The width (i.e., thickness) of the rope.
   * @param points - An array of {@link PIXI.Point} objects to construct this rope.
   * @param textureScale - scaling factor for repeated texture. To create a tiling rope
   *     set baseTexture.wrapMode to {@link PIXI.WRAP_MODES.REPEAT} and use a power of two texture.
   */
  constructor(width = 200, segments: ComplexRopeSegment[], textureScale = 0) {
    const pointCount = sum(segments, (segment) => segment.points.length);

    // eslint-disable-next-line no-magic-numbers
    super(new Float32Array(pointCount * 4), new Float32Array(pointCount * 4), new Uint16Array((pointCount - 1) * 6));

    this.segments = segments;
    this._width = width;
    this.textureScale = textureScale;

    this.build();
  }

  /**
   * The width (i.e., thickness) of the rope.
   * @readonly
   */
  get width(): number {
    // TODO Update this if ever used
    return this._width * this.textureScale;
  }

  /** Refreshes Rope indices and uvs */
  private build(): void {
    const segments = this.segments;

    if (!segments) {
      return;
    }

    const vertexBuffer = this.getBuffer('aVertexPosition');
    const uvBuffer = this.getBuffer('aTextureCoord');
    const indexBuffer = this.getIndex();

    const pointCount = sum(segments, (segment) => segment.points.length);

    // if too little points, or texture hasn't got UVs set yet just move on.
    if (pointCount < 1) {
      return;
    }

    // if the number of points has changed we will need to recreate the arraybuffers
    if (vertexBuffer.data.length / 4 !== pointCount) {
      vertexBuffer.data = new Float32Array(pointCount * 4);
      uvBuffer.data = new Float32Array(pointCount * 4);
      indexBuffer.data = new Uint16Array((pointCount - 1) * 6); // eslint-disable-line no-magic-numbers
    }

    const uvs = uvBuffer.data;
    const indices = indexBuffer.data;

    uvs[0] = 0;
    uvs[1] = 0;
    uvs[2] = 0;
    uvs[3] = 1;

    const segmentCount = segments.length;
    const maxDiameter = max(segments, (segment) => segment.diameter) * this.textureScale;

    let amount = 0;
    let uvIndex = 0;
    let indicesIndex = 0;
    let indexCount = 0;

    for (let i = 0; i < segmentCount; i++) {
      let prev = segments[i].points[0];
      const textureWidth = this._width * this.textureScale;
      const radius = segments[i].diameter / maxDiameter / 2;

      const total = segments[i].points.length; // - 1;

      for (let j = 0; j < total; j++) {
        // time to do some smart drawing!

        // calculate pixel distance from previous point
        const dx = prev.x - segments[i].points[j].x;
        const dy = prev.y - segments[i].points[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        prev = segments[i].points[j];
        amount += distance / textureWidth;

        uvs[uvIndex] = amount;
        uvs[uvIndex + 1] = 0.5 - radius;

        uvs[uvIndex + 2] = amount;
        uvs[uvIndex + 3] = 0.5 + radius;
        uvIndex += 4;
      }

      for (let j = 0; j < total - 1; j++) {
        indices[indexCount++] = indicesIndex;
        indices[indexCount++] = indicesIndex + 1;
        indices[indexCount++] = indicesIndex + 2;

        indices[indexCount++] = indicesIndex + 2;
        indices[indexCount++] = indicesIndex + 1;
        indices[indexCount++] = indicesIndex + 3;
        indicesIndex += 2;
      }
      indicesIndex += 2;
    }

    // ensure that the changes are uploaded
    uvBuffer.update();
    indexBuffer.update();

    this.updateVertices();
  }

  /** refreshes vertices of Rope mesh */
  public updateVertices(): void {
    const segments = this.segments;
    const pointCount = sum(segments, (segment) => segment.points.length);

    if (pointCount < 1) {
      return;
    }

    const segmentCount = segments.length;
    let lastIndex = 0;
    for (let i = 0; i < segmentCount; i++) {
      let lastPoint = segments[i].points[0];
      let nextPoint;
      let perpX = 0;
      let perpY = 0;

      const vertices = this.buffers[0].data;
      const total = segments[i].points.length;
      let index = 0;
      for (let j = 0; j < total; j++) {
        const point = segments[i].points[j];
        index = lastIndex + j * 4;

        if (j < segments[i].points.length - 1) {
          nextPoint = segments[i].points[j + 1];
        } else {
          nextPoint = point;
        }

        perpY = -(nextPoint.x - lastPoint.x);
        perpX = nextPoint.y - lastPoint.y;

        const perpLength = Math.sqrt(perpX * perpX + perpY * perpY);
        const num = segments[i].diameter / 2;

        perpX /= perpLength;
        perpY /= perpLength;

        perpX *= num;
        perpY *= num;

        vertices[index] = point.x + perpX;
        vertices[index + 1] = point.y + perpY;
        vertices[index + 2] = point.x - perpX;
        vertices[index + 3] = point.y - perpY;
        lastPoint = point;
      }
      lastIndex = index + 4;
    }

    this.buffers[0].update();
  }

  public update(): void {
    // TODO check what we need here
    // this.build() calls this.updateVertices()
    this.build();

    // if (this.textureScale > 0) {
    // this.build(); // we need to update UVs
    // } else {
    //   this.updateVertices();
    // }

    // this.updateVertices();
  }
}
