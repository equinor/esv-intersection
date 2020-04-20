import { WellboreBaseComponentLayer, StaticWellboreBaseComponentIncrement } from './WellboreBaseComponentLayer';
import { CasingLayerOptions, OnMountEvent, OnUpdateEvent, OnRescaleEvent, HoleObjectData, Casing } from '..';
import { Texture, Point } from 'pixi.js';
import { createNormalCoords, generateHoleCoords } from '../datautils/wellboreItemShapeGenerator';
import { createNormal } from '../utils/vectorUtils';

export class CasingLayer extends WellboreBaseComponentLayer {
  options: CasingLayerOptions;

  constructor(id?: string, options?: CasingLayerOptions) {
    super(id, options);
    this.options = {
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

    const takeMeters = (points: Point[], meters: number): Point[] => {
      let tot = 0;
      const lastMeterPoint = 2;
      const newPoints: Point[] = [];

      for (let i = 0; tot < meters && i > points.length - lastMeterPoint; i++) {
        tot += StaticWellboreBaseComponentIncrement;
        newPoints.push(points[points.length - 1 - i].clone());
      }

      return newPoints.reverse();
    };

    if (holeObject.hasShoe === true) {
      const shoeWidth = 5;
      const meters = 10;
      const shoeHeightCoords = takeMeters(normalOffsetCoordsDown, meters);
      const shoeCoords = this.generateShoe(shoeHeightCoords, -shoeWidth);
      this.drawBigPolygon(shoeCoords);

      const shoeHeightCoords2 = takeMeters(normalOffsetCoordsUp, meters);
      const shoeCoords2 = this.generateShoe(shoeHeightCoords2, shoeWidth);
      this.drawBigPolygon(shoeCoords2);
    }
  };

  generateShoe = (triangleSideShoe: Point[], offset: number): Point[] => {
    if (triangleSideShoe.length < 1) {
      return [];
    }
    const normalOffset = createNormal(
      [triangleSideShoe[0], triangleSideShoe[1], triangleSideShoe[triangleSideShoe.length - 1], triangleSideShoe[triangleSideShoe.length - 1]],
      offset,
    );

    const a = [triangleSideShoe[0], triangleSideShoe[triangleSideShoe.length - 1], normalOffset[normalOffset.length - 1], triangleSideShoe[0]];
    return a;
  };
}
