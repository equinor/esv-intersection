import { WellboreBaseComponentLayer } from './WellboreBaseComponentLayer';
import { HoleSizeLayerOptions, HoleSize } from '..';
import { makeTubularPolygon } from '../datautils/wellboreItemShapeGenerator';
import { createNormals, offsetPoints } from '../utils/vectorUtils';
import { HOLE_OUTLINE } from '../constants';
import { Point, RENDERER_TYPE } from 'pixi.js';

export class HoleSizeLayer extends WellboreBaseComponentLayer {
  constructor(id?: string, options?: HoleSizeLayerOptions) {
    super(id, options);
    this.options = {
      ...this.options,
      firstColor: 'rgb(163, 102, 42)',
      secondColor: 'rgb(255, 255, 255)',
      lineColor: 0x8b4513,
      topBottomLineColor: 0x8b4513,
      ...options,
    };
  }

  render(): void {
    const { data } = this;

    if (!data || !this.rescaleEvent || !this.referenceSystem) {
      return;
    }

    data
      .sort((a: HoleSize, b: HoleSize) => (a.diameter <= b.diameter ? 1 : -1)) // draw smaller casings and holes inside bigger ones if overlapping
      .forEach((hole: HoleSize) => this.drawHoleSize(hole));
  }

  drawHoleSize = (holeObject: HoleSize): void => {
    if (holeObject == null) {
      return;
    }

    const { exaggerationFactor, firstColor, lineColor } = this.options as HoleSizeLayerOptions;

    const diameter = holeObject.diameter * exaggerationFactor;
    const radius = diameter / 2;
    const texture = this.createTexture(diameter);

    const path = this.getZFactorScaledPathForPoints(holeObject.start, holeObject.end, [holeObject.start, holeObject.end]);
    const pathPoints = path.map((p) => p.point);
    const normals = createNormals(pathPoints);

    const rightPath = offsetPoints(pathPoints, normals, radius);
    const leftPath = offsetPoints(pathPoints, normals, -radius);

    if (pathPoints.length === 0) {
      return;
    }

    const polygonCoords = makeTubularPolygon(leftPath, rightPath);
    if (this.renderType() === RENDERER_TYPE.CANVAS) {
      this.drawBigPolygon(polygonCoords, firstColor);
    } else {
      this.drawRope(
        pathPoints.map((p) => new Point(p[0], p[1])),
        texture,
      );
    }

    this.drawOutline(leftPath, rightPath, lineColor, HOLE_OUTLINE, false);
  };
}
