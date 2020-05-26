import { WellboreBaseComponentLayer } from './WellboreBaseComponentLayer';
import { CasingLayerOptions, OnMountEvent, OnUpdateEvent, OnRescaleEvent, HoleObjectData, Casing } from '..';
import { Texture, Point } from 'pixi.js';
import { createNormalCoords, generateHoleCoords } from '../datautils/wellboreItemShapeGenerator';
import { createNormal, arrayToPoint } from '../utils/vectorUtils';

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

    const sizes: HoleObjectData[] = data.map((d: Casing) => this.generateHoleSizeData(d));

    const maxDiameter = Math.max(...sizes.map((s: HoleObjectData) => s.data.diameter));
    const texture = this.createTexure(maxDiameter * maxTextureDiameterScale, firstColor, secondColor);
    sizes
      .sort((a: any, b: any) => (a.data.diameter <= b.data.diameter ? 1 : -1)) // draw smaller casings and holes inside bigger ones if overlapping
      .map((s: any) => this.drawHoleSize(s, texture));
  }

  drawHoleSize = (holeObject: HoleObjectData, defaultTexture: Texture): void => {
    if (holeObject == null || holeObject.points.length === 0) {
      return;
    }

    const { maxTextureDiameterScale, firstColor, secondColor, lineColor, topBottomLineColor } = this.options;
    const { wellBorePathCoords, normalOffsetCoordsDown, normalOffsetCoordsUp } = createNormalCoords(holeObject);

    const { top, bottom, left, right } = generateHoleCoords(normalOffsetCoordsUp, normalOffsetCoordsDown);
    const polygonCoords = [...left, ...right];
    const mask = this.drawBigPolygon(polygonCoords);
    let texture = defaultTexture;
    let casingWallWidth = 1;

    const pctOffset = 0.35;
    texture = this.createTexure(holeObject.data.diameter * maxTextureDiameterScale, firstColor, secondColor, pctOffset);
    casingWallWidth = Math.abs(holeObject.data.diameter - holeObject.innerDiameter);
    this.createRopeTextureBackground(wellBorePathCoords, texture, mask);

    this.drawLine(polygonCoords, lineColor, casingWallWidth);
    this.drawLine(top, topBottomLineColor, 1);
    this.drawLine(bottom, topBottomLineColor, 1);

    if (holeObject.hasShoe === true) {
      const shoeWidth = 25;
      const meters = 20;
      const shoeCoords = this.generateShoe(holeObject.data.end, holeObject.data.diameter, meters, shoeWidth);
      const shoeCoords2 = this.generateShoe(holeObject.data.end, holeObject.data.diameter, meters, -shoeWidth);
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

    const triangleSideShoe: Point[] = createNormal(pts, casingDiameter * (offset < 0 ? -1 : 1));

    const top = triangleSideShoe[0];
    const bottom = triangleSideShoe[triangleSideShoe.length - 1];
    const middle = triangleSideShoe[triangleSideShoe.length - 2];

    const normalOffset = createNormal([top, middle, bottom], offset);
    const outlier = normalOffset[normalOffset.length - 1];

    return [top, bottom, outlier];
  };
}
