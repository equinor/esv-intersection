import { MeshGeometry } from 'pixi.js';
import type { IPoint } from 'pixi.js';

/**
 * UniformTextureStretchRopeGeometry allows you to draw a geometry across several points and then manipulate these points.
 */
export class UniformTextureStretchRopeGeometry extends MeshGeometry {
  /** An array of points that determine the rope. */
  public points: IPoint[];

  /**
   * The width (i.e., thickness) of the rope.
   * @readonly
   */
  _width: number;

  /**
   * @param width - The width (i.e., thickness) of the rope.
   * @param points - An array of PIXI.Point objects to construct this rope.
   */
  constructor(points: IPoint[], width = 200) {
    // eslint-disable-next-line no-magic-numbers
    super(new Float32Array(points.length * 4), new Float32Array(points.length * 4), new Uint16Array((points.length - 1) * 6));

    this.points = points;
    this._width = width;

    this.build();
  }

  /** Refreshes Rope indices and uvs */
  private build(): void {
    const points = this.points;

    if (!points) {
      return;
    }

    const vertexBuffer = this.getBuffer('aVertexPosition');
    const uvBuffer = this.getBuffer('aTextureCoord');
    const indexBuffer = this.getIndex();

    // if too few points, or texture hasn't got UVs set yet just move on.
    if (points.length < 1) {
      return;
    }

    // if the number of points has changed we will need to recreate the arraybuffers
    if (vertexBuffer.data.length / 4 !== points.length) {
      vertexBuffer.data = new Float32Array(points.length * 4);
      uvBuffer.data = new Float32Array(points.length * 4);
      indexBuffer.data = new Uint16Array((points.length - 1) * 6); // eslint-disable-line no-magic-numbers
    }

    const total = points.length; // - 1;

    let totalLength = 0;
    let prevPoint = points[0]!;

    for (let i = 0; i < total; i++) {
      const dx = prevPoint.x - points[i]?.x!;
      const dy = prevPoint.y - points[i]?.y!;
      const distance = Math.sqrt(dx * dx + dy * dy);

      prevPoint = points[i]!;
      totalLength += distance;
    }

    const uvs = uvBuffer.data;
    const indices = indexBuffer.data;

    uvs[0] = 0;
    uvs[1] = 0;
    uvs[2] = 0;
    uvs[3] = 1;

    let amount = 0;
    let prev = points[0]!;

    for (let i = 0; i < total; i++) {
      // time to do some smart drawing!
      const index = i * 4;

      // calculate pixel distance from previous point
      const dx = prev.x - points[i]?.x!;
      const dy = prev.y - points[i]?.y!;
      const distance = Math.sqrt(dx * dx + dy * dy);

      prev = points[i]!;

      // strech texture on distance/length instead of point/points.length to get a more correct strech
      amount += distance / totalLength;

      uvs[index] = amount;
      uvs[index + 1] = 0;

      uvs[index + 2] = amount;
      uvs[index + 3] = 1;
    }

    let indexCount = 0;

    for (let i = 0; i < total - 1; i++) {
      const index = i * 2;

      indices[indexCount++] = index;
      indices[indexCount++] = index + 1;
      indices[indexCount++] = index + 2;

      indices[indexCount++] = index + 2;
      indices[indexCount++] = index + 1;
      indices[indexCount++] = index + 3;
    }

    // ensure that the changes are uploaded
    uvBuffer.update();
    indexBuffer.update();

    this.updateVertices();
  }

  /** refreshes vertices of Rope mesh */
  public updateVertices(): void {
    const points = this.points;

    if (points.length < 1) {
      return;
    }

    let lastPoint = points[0]!;
    let nextPoint;
    let perpX = 0;
    let perpY = 0;

    const vertices = this.buffers[0]?.data!;
    const total = points.length;

    for (let i = 0; i < total; i++) {
      const point = points[i]!;
      const index = i * 4;

      if (i < points.length - 1) {
        nextPoint = points[i + 1]!;
      } else {
        nextPoint = point;
      }

      perpY = -(nextPoint.x - lastPoint.x);
      perpX = nextPoint.y - lastPoint.y;

      const perpLength = Math.sqrt(perpX * perpX + perpY * perpY);
      const num = this._width / 2;

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

    this.buffers[0]?.update();
  }

  public update(): void {
    this.updateVertices();
  }
}
