import { WellboreBaseComponentLayer } from './WellboreBaseComponentLayer';
import { CasingLayerOptions, OnMountEvent, OnUpdateEvent, OnRescaleEvent, HoleObjectData, Casing } from '..';
import { Texture, Point } from 'pixi.js';
import { generateHoleCoords } from '../datautils/wellboreItemShapeGenerator';
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
    super.render(event);
    const { maxTextureDiameterScale, firstColor, secondColor } = this.options;
    const { data } = this;

    if (data == null) {
      return;
    }

    // const sizes: HoleObjectData[] = data.map((d: Casing) => this.generateHoleSizeData(d));

    const maxDiameter = Math.max(...data.map((s: Casing) => s.diameter));
    const texture = this.createTexure(maxDiameter * maxTextureDiameterScale, firstColor, secondColor);
    data
      .sort((a: any, b: any) => (a.diameter <= b.diameter ? 1 : -1)) // draw smaller casings and holes inside bigger ones if overlapping
      .map((s: any) => this.drawHoleSize(s, texture));
  }

  drawHoleSize = (holeObject: Casing, defaultTexture: Texture): void => {
    if (holeObject == null) {
      return;
    }

    const { maxTextureDiameterScale, firstColor, secondColor, lineColor, topBottomLineColor } = this.options;
    // const { wellBorePathCoords, offsetCoordsLeft, offsetCoordsRight } = createOffsetCoords(holeObject);
    const path = this.getPathWithNormals(holeObject.start, holeObject.end, []);

    const partPathPoints = path.map((p) => p.point);
    const normals = path.map((p) => p.normal);
    const offsetCoordsRight = offsetPoints(partPathPoints, normals, holeObject.diameter);
    const offsetCoordsLeft = offsetPoints(partPathPoints, normals, -holeObject.diameter);

    const { top, bottom, left, right } = generateHoleCoords(offsetCoordsRight, offsetCoordsLeft);
    const polygonCoords = [...left, ...right];
    const mask = this.drawBigPolygon(polygonCoords);
    let texture = defaultTexture;
    let casingWallWidth = 1;

    const pctOffset = 0.35;
    texture = this.createTexure(holeObject.diameter * maxTextureDiameterScale, firstColor, secondColor, pctOffset);
    casingWallWidth = Math.abs(holeObject.diameter - holeObject.innerDiameter);
    this.createRopeTextureBackground(partPathPoints, texture, mask);

    this.drawLine(polygonCoords, lineColor, casingWallWidth);
    this.drawLine(top, topBottomLineColor, 1);
    this.drawLine(bottom, topBottomLineColor, 1);

    if (holeObject.hasShoe === true) {
      const shoeWidth = 25;
      const meters = 20;
      const shoeCoords = this.generateShoe(holeObject.end, holeObject.diameter, meters, shoeWidth);
      const shoeCoords2 = this.generateShoe(holeObject.end, holeObject.diameter, meters, -shoeWidth);
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
