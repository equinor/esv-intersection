import { WellboreBaseComponentLayer } from './WellboreBaseComponentLayer';
import { CasingLayerOptions, OnMountEvent, OnUpdateEvent, OnRescaleEvent, Casing } from '..';
import { Texture, Point } from 'pixi.js';
import { getEndLines, getRopePolygon } from '../datautils/wellboreItemShapeGenerator';
import { offsetPoints, offsetPoint } from '../utils/vectorUtils';
import { MDPoint } from '../interfaces';

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

  onRescale(event: OnRescaleEvent): void {
    super.onRescale(event);
  }

  render(event: OnRescaleEvent | OnUpdateEvent): void {
    const { data }: { data: Casing[] } = this;

    if (data == null) {
      return;
    }

    const { maxTextureDiameterScale, firstColor, secondColor } = this.options;

    data
      .sort((a: Casing, b: Casing) => b.diameter - a.diameter) // draw smaller casings and holes on top of bigger ones if overlapping
      .forEach((casing: Casing) => this.drawCasing(casing));
  }

  drawCasing = (casing: Casing): void => {
    if (casing == null) {
      return;
    }
    const pctOffset = 0.35;
    const { maxTextureDiameterScale, firstColor, secondColor, lineColor, topBottomLineColor } = this.options;

    const texture = this.createTexure(casing.diameter * maxTextureDiameterScale, firstColor, secondColor, pctOffset);

    const path = this.getPathWithNormals(casing.start, casing.end, []);

    const points = path.map((p) => p.point);
    const normals = path.map((p) => p.normal);
    const rightPath = offsetPoints(points, normals, casing.diameter);
    const leftPath = offsetPoints(points, normals, -casing.diameter);

    const { top, bottom } = getEndLines(rightPath, leftPath);
    const polygonCoords = getRopePolygon(leftPath, rightPath);

    const casingWallWidth = Math.abs(casing.diameter - casing.innerDiameter);

    this.drawRope(points, texture);

    this.drawLine(polygonCoords, lineColor, casingWallWidth);
    this.drawLine(top, topBottomLineColor, 1);
    this.drawLine(bottom, topBottomLineColor, 1);

    if (casing.hasShoe === true) {
      this.drawShoe(casing.end, casing.diameter);
    }
  };

  drawShoe(casingEnd: number, casingDiameter: number) {
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
    const path: MDPoint[] = this.getPathWithNormals(start, end, [start, end]);

    const points = path.map((p) => p.point);
    const normal = path.map((p) => p.normal);
    const shoeEdge: Point[] = offsetPoints(points, normal, casingDiameter * (width < 0 ? -1 : 1));

    const shoeTipPoint = points[points.length - 1];
    const shoeTipNormal = normal[normal.length - 1];
    const shoeTip: Point = offsetPoint(shoeTipPoint, shoeTipNormal, width);

    return [...shoeEdge, shoeTip];
  };
}
