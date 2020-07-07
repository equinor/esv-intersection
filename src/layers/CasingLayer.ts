import { WellboreBaseComponentLayer } from './WellboreBaseComponentLayer';
import { CasingLayerOptions, OnMountEvent, OnUpdateEvent, OnRescaleEvent, Casing } from '..';
import { Texture, Point } from 'pixi.js';
import { groupCoords } from '../datautils/wellboreItemShapeGenerator';
import { arrayToPoint, createNormals, offsetPoints } from '../utils/vectorUtils';

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
    const { data } = this;

    if (data == null) {
      return;
    }

    const { maxTextureDiameterScale, firstColor, secondColor } = this.options;

    const maxDiameter = Math.max(...data.map((s: Casing) => s.diameter));
    const texture = this.createTexure(maxDiameter * maxTextureDiameterScale, firstColor, secondColor);
    data
      .sort((a: Casing, b: Casing) => a.diameter - b.diameter) // draw smaller casings and holes on top of bigger ones if overlapping
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
      const shoeWidth = 25;
      const meters = 20;
      const shoeCoords = this.generateShoe(casing.end, casing.diameter, meters, shoeWidth);
      const shoeCoords2 = this.generateShoe(casing.end, casing.diameter, meters, -shoeWidth);
      this.drawBigPolygon(shoeCoords2);
      this.drawBigPolygon(shoeCoords);
    }
  };

  generateShoe = (casingEnd: number, casingDiameter: number, meters: number, offset: number): Point[] => {
    const pts: Point[] = [];
    for (let i = casingEnd; i > casingEnd - meters; i -= this.options.wellboreBaseComponentIncrement) {
      pts.push(arrayToPoint(this.referenceSystem.project(i) as [number, number]));
    }
    pts.reverse();

    const ptNormals = createNormals(pts);
    const triangleSideShoe: Point[] = offsetPoints(pts, ptNormals, casingDiameter * (offset < 0 ? -1 : 1));

    const top = triangleSideShoe[0];
    const bottom = triangleSideShoe[triangleSideShoe.length - 1];
    const middle = triangleSideShoe[triangleSideShoe.length - 2];

    const outlierNormals = createNormals([top, middle, bottom]);
    const normalOffset = offsetPoints([top, middle, bottom], outlierNormals, offset);
    const outlier = normalOffset[normalOffset.length - 1];

    return [top, bottom, outlier];
  };
}
