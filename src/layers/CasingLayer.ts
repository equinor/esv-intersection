import { WellboreBaseComponentLayer } from './WellboreBaseComponentLayer';
import { CasingLayerOptions, OnMountEvent, OnUpdateEvent, OnRescaleEvent, Casing } from '..';
import { Point } from 'pixi.js';
import { makeTubularPolygon } from '../datautils/wellboreItemShapeGenerator';
import { offsetPoint, offsetPoints } from '../utils/vectorUtils';

export class CasingLayer extends WellboreBaseComponentLayer {
  options: CasingLayerOptions;

  constructor(id?: string, options?: CasingLayerOptions) {
    super(id, options);
    this.options = {
      ...this.options,
      firstColor: '#777788',
      secondColor: '#EEEEFF',
      lineColor: 0x575757,
      topBottomLineColor: 0x575757,
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
    const { data }: { data: Casing[] } = this;

    if (data == null) {
      return;
    }

    this.clear();

    data
      .sort((a: Casing, b: Casing) => b.diameter - a.diameter) // draw smaller casings and holes on top of bigger ones if overlapping
      .forEach((casing: Casing) => this.drawCasing(casing));
  }

  drawCasing = (casing: Casing): void => {
    if (casing == null || !this.rescaleEvent) {
      return;
    }
    const pctOffset = 0.35;
    const { maxTextureDiameterScale, lineColor } = this.options;

    const texture = this.createTexture(this.dxScale(casing.diameter) * maxTextureDiameterScale, pctOffset);

    const path = this.getScalePathForPointsWithNormals(casing.start, casing.end, [casing.start, casing.end]);

    const pathPoints = path.map((p) => p.point);
    const normals = path.map((p) => p.normal);
    const rightPath = offsetPoints(pathPoints, normals, this.dxScale(casing.diameter));
    const leftPath = offsetPoints(pathPoints, normals, this.dxScale(-casing.diameter));

    const polygon = makeTubularPolygon(leftPath, rightPath);

    const casingWallWidth = Math.abs(casing.diameter - casing.innerDiameter);

    this.drawRope(
      pathPoints.map((p) => new Point(p[0], p[1])),
      texture,
    );
    this.drawLine(polygon, lineColor, this.dxScale(casingWallWidth), true);

    if (casing.hasShoe === true) {
      this.drawShoe(casing.end, casing.diameter);
    }
  };

  drawShoe(casingEnd: number, casingDiameter: number): void {
    const shoeWidth = 50;
    const shoeLength = 20;
    const shoeCoords = this.generateShoe(casingEnd, this.dxScale(casingDiameter), shoeLength, this.dxScale(shoeWidth));
    const shoeCoords2 = this.generateShoe(casingEnd, this.dxScale(casingDiameter), shoeLength, this.dxScale(-shoeWidth));
    this.drawBigPolygon(shoeCoords2);
    this.drawBigPolygon(shoeCoords);
  }

  generateShoe = (casingEnd: number, casingDiameter: number, length: number, width: number): Point[] => {
    if (!this.rescaleEvent) {
      return;
    }

    const start = casingEnd - length;
    const end = casingEnd;
    const path = this.getScalePathForPointsWithNormals(start, end, [start, end]);

    const points = path.map((p) => p.point);
    const normal = path.map((p) => p.normal);
    const shoeEdge: Point[] = offsetPoints(points, normal, casingDiameter * (width < 0 ? -1 : 1));

    const shoeTipPoint = points[points.length - 1];
    const shoeTipNormal = normal[normal.length - 1];
    const shoeTip: Point = offsetPoint(shoeTipPoint, shoeTipNormal, width);

    return [...shoeEdge, shoeTip];
  };
}
