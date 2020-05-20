import { WellboreBaseComponentLayer, StaticWellboreBaseComponentIncrement } from './WellboreBaseComponentLayer';
import { HoleSizeLayerOptions, OnMountEvent, OnUpdateEvent, OnRescaleEvent, HoleObjectData, HoleSize } from '..';
import { Texture, Point } from 'pixi.js';
import { createNormalCoords, generateHoleCoords } from '../datautils/wellboreItemShapeGenerator';

export class HoleSizeLayer extends WellboreBaseComponentLayer {
  options: HoleSizeLayerOptions;

  constructor(id?: string, options?: HoleSizeLayerOptions) {
    super(id, options);
    this.options = {
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

    const sizes: HoleObjectData[] = data.map((d: HoleSize) => this.generateHoleSizeData(d));

    const maxDiameter = Math.max(...sizes.map((s: HoleObjectData) => s.data.diameter));
    const texture = this.createTexure(maxDiameter * maxTextureDiameterScale, firstColor, secondColor);
    sizes
      .sort((a: any, b: any) => (a.data.diameter <= b.data.diameter ? 1 : -1)) // draw smaller casings and holes inside bigger ones if overlapping
      .map((s: any) => this.drawHoleSize(s, texture));
  }

  drawHoleSize = (holeObject: HoleObjectData, texture: Texture): void => {
    if (holeObject == null || holeObject.points.length === 0) {
      return;
    }

    const { maxTextureDiameterScale, firstColor, secondColor, lineColor, topBottomLineColor } = this.options;
    const { wellBorePathCoords, normalOffsetCoordsDown, normalOffsetCoordsUp } = createNormalCoords(holeObject);

    const { top, bottom, left, right } = generateHoleCoords(normalOffsetCoordsUp, normalOffsetCoordsDown);
    const polygonCoords = [...left, ...right];
    const mask = this.drawBigPolygon(polygonCoords);
    const casingWallWidth = 1;

    this.createRopeTextureBackground(wellBorePathCoords, texture, mask);

    this.drawLine(polygonCoords, lineColor, casingWallWidth);
    this.drawLine(top, topBottomLineColor, 1);
    this.drawLine(bottom, topBottomLineColor, 1);
  };
}
