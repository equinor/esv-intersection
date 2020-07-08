import { WellboreBaseComponentLayer } from './WellboreBaseComponentLayer';
import { CasingLayerOptions, OnMountEvent, OnUpdateEvent, OnRescaleEvent, Casing } from '..';
import { Texture, Point } from 'pixi.js';
import { groupCoords } from '../datautils/wellboreItemShapeGenerator';
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

    const maxDiameter = Math.max(...data.map((s: Casing) => s.diameter));
    const texture = this.createTexure(maxDiameter * maxTextureDiameterScale, firstColor, secondColor);
    data
      .sort((a: Casing, b: Casing) => b.diameter - a.diameter) // draw smaller casings and holes on top of bigger ones if overlapping
      .forEach((casing: Casing) => this.drawCasing(casing, texture));
  }

  drawCasing = (casing: Casing, defaultTexture: Texture): void => {
    if (casing == null) {
      return;
    }

    const { maxTextureDiameterScale, firstColor, secondColor, lineColor, topBottomLineColor } = this.options;

    const path = this.getPathWithNormals(casing.start, casing.end, []);

    const partPathPoints = path.map((p) => p.point);
    const normals = path.map((p) => p.normal);
    const offsetCoordsRight = offsetPoints(partPathPoints, normals, casing.diameter);
    const offsetCoordsLeft = offsetPoints(partPathPoints, normals, -casing.diameter);

    const { top, bottom, left, right } = groupCoords(offsetCoordsRight, offsetCoordsLeft);
    const polygonCoords = [...left, ...right];
    const mask = this.drawBigPolygon(polygonCoords);
    let texture = defaultTexture;

    const pctOffset = 0.35;
    texture = this.createTexure(casing.diameter * maxTextureDiameterScale, firstColor, secondColor, pctOffset);
    const casingWallWidth = Math.abs(casing.diameter - casing.innerDiameter);
    this.createRopeTextureBackground(partPathPoints, texture, mask);

    this.drawLine(polygonCoords, lineColor, casingWallWidth);
    this.drawLine(top, topBottomLineColor, 1);
    this.drawLine(bottom, topBottomLineColor, 1);

    if (casing.hasShoe === true) {
      const shoeWidth = 50;
      const shoeLength = 20;
      const shoeCoords = this.generateShoe(casing.end, casing.diameter, shoeLength, shoeWidth);
      const shoeCoords2 = this.generateShoe(casing.end, casing.diameter, shoeLength, -shoeWidth);
      this.drawBigPolygon(shoeCoords2);
      this.drawBigPolygon(shoeCoords);
    }
  };

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
