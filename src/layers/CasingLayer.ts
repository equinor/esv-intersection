import { WellboreBaseComponentLayer } from './WellboreBaseComponentLayer';
import { CasingLayerOptions, OnUpdateEvent, OnRescaleEvent, Casing } from '..';
import { Point, RENDERER_TYPE } from 'pixi.js';
import { makeTubularPolygon } from '../datautils/wellboreItemShapeGenerator';
import { createNormals, offsetPoint, offsetPoints } from '../utils/vectorUtils';

export class CasingLayer extends WellboreBaseComponentLayer {
  constructor(id?: string, options?: CasingLayerOptions) {
    super(id, options);
    this.options = {
      ...this.options,
      solidColor: '#dcdcdc',
      lineColor: 0x575757,
      topBottomLineColor: 0x575757,
      maxTextureDiameterScale: 2,
      ...options,
    };
    this.render = this.render.bind(this);
  }

  onUpdate(event: OnUpdateEvent): void {
    super.onUpdate(event);
    this.render(event);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(event: OnRescaleEvent | OnUpdateEvent): void {
    const { data }: { data: Casing[] } = this;

    if (data == null || !this.rescaleEvent) {
      return;
    }

    data
      .sort((a: Casing, b: Casing) => b.diameter - a.diameter) // draw smaller casings and holes on top of bigger ones if overlapping
      .forEach((casing: Casing) => this.drawCasing(casing));
  }

  drawCasing = (casing: Casing): void => {
    if (casing == null) {
      return;
    }
    const pctOffset = 0.35;
    const { maxTextureDiameterScale, lineColor, solidColor } = this.options as CasingLayerOptions;

    const texture = this.createTexture(casing.diameter * maxTextureDiameterScale, pctOffset);

    const path = this.getZFactorScaledPathForPoints(casing.start, casing.end, [casing.start, casing.end]);

    const pathPoints = path.map((p) => p.point);
    const normals = createNormals(pathPoints);
    const rightPath = offsetPoints(pathPoints, normals, casing.diameter);
    const leftPath = offsetPoints(pathPoints, normals, -casing.diameter);

    const polygon = makeTubularPolygon(leftPath, rightPath);

    const casingWallWidth = Math.abs(casing.diameter - casing.innerDiameter);

    // Pixi.js-legacy handles SimpleRope and advanced render methods poorly
    if (this.renderType() === RENDERER_TYPE.CANVAS) {
      this.drawBigPolygon(polygon, solidColor);
    } else {
      this.drawRope(
        pathPoints.map((p) => new Point(p[0], p[1])),
        texture,
      );
    }

    this.drawLine(polygon, lineColor, casingWallWidth, true);

    if (casing.hasShoe) {
      this.drawShoe(casing.end, casing.diameter);
    }
  };

  drawShoe(casingEnd: number, casingDiameter: number): void {
    const shoeWidth = 50;
    const shoeLength = 20;
    const shoeCoords = this.generateShoe(casingEnd, casingDiameter, shoeLength, shoeWidth);
    const shoeCoords2 = this.generateShoe(casingEnd, casingDiameter, shoeLength, -shoeWidth);
    this.drawBigPolygon(shoeCoords2);
    this.drawBigPolygon(shoeCoords);
  }

  generateShoe = (casingEnd: number, casingDiameter: number, length: number, width: number): Point[] => {
    const start = casingEnd - length;
    const end = casingEnd;
    const path = this.getZFactorScaledPathForPoints(start, end, [start, end]);

    const points = path.map((p) => p.point);
    const normal = createNormals(points);
    const shoeEdge: Point[] = offsetPoints(points, normal, casingDiameter * (width < 0 ? -1 : 1));

    const shoeTipPoint = points[points.length - 1];
    const shoeTipNormal = normal[normal.length - 1];
    const shoeTip: Point = offsetPoint(shoeTipPoint, shoeTipNormal, width);

    return [...shoeEdge, shoeTip];
  };
}
