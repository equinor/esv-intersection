import { WellboreBaseComponentLayer } from './WellboreBaseComponentLayer';
import { HoleSizeLayerOptions, OnMountEvent, OnUpdateEvent, OnRescaleEvent, HoleSize } from '..';
import { makeTubularPolygon } from '../datautils/wellboreItemShapeGenerator';
import { offsetPoints } from '../utils/vectorUtils';
import { HOLE_OUTLINE } from '../constants';
import { Point } from 'pixi.js';

export class HoleSizeLayer extends WellboreBaseComponentLayer {
  options: HoleSizeLayerOptions;

  constructor(id?: string, options?: HoleSizeLayerOptions) {
    super(id, options);
    this.options = {
      ...this.options,
      firstColor: 'rgb(163, 102, 42)',
      secondColor: 'rgb(255, 255, 255)',
      lineColor: 0x8b4513,
      topBottomLineColor: 0x8b4513,
      maxTextureDiameterScale: 2,
      ...options,
    };
    this.render = this.render.bind(this);
  }

  onMount(event: OnMountEvent): void {
    super.onMount(event);
  }

  onUpdate(event: OnUpdateEvent): void {
    super.onUpdate(event);
    this.render(event);
  }

  render(event: OnRescaleEvent | OnUpdateEvent): void {
    const { data } = this;

    if (data == null) {
      return;
    }

    this.clear();

    data
      .sort((a: HoleSize, b: HoleSize) => (a.diameter <= b.diameter ? 1 : -1)) // draw smaller casings and holes inside bigger ones if overlapping
      .forEach((hole: HoleSize) => this.drawHoleSize(hole));
  }

  drawHoleSize = (holeObject: HoleSize): void => {
    if (holeObject == null || !this.rescaleEvent) {
      return;
    }

    const { maxTextureDiameterScale } = this.options;

    const texture = this.createTexture(this.dxScale(holeObject.diameter * maxTextureDiameterScale));

    const path = this.getScalePathForPointsWithNormals(holeObject.start, holeObject.end, [holeObject.start, holeObject.end]);
    const pathPoints = path.map((p) => p.point);
    const normals = path.map((p) => p.normal);

    const rightPath = offsetPoints(pathPoints, normals, this.dxScale(holeObject.diameter));
    const leftPath = offsetPoints(pathPoints, normals, this.dxScale(-holeObject.diameter));

    const { lineColor } = this.options;

    if (pathPoints.length === 0) {
      return;
    }

    const polygonCoords = makeTubularPolygon(leftPath, rightPath);

    this.drawRope(
      pathPoints.map((p) => new Point(p[0], p[1])),
      texture,
    );

    this.drawLine(polygonCoords, lineColor, this.dxScale(HOLE_OUTLINE), true);
  };
}
