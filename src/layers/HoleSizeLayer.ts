import { WellboreBaseComponentLayer } from './WellboreBaseComponentLayer';
import { HoleSizeLayerOptions, OnMountEvent, OnUpdateEvent, OnRescaleEvent, HoleObjectData, HoleSize } from '..';
import { Texture } from 'pixi.js';
import { generateHoleCoords } from '../datautils/wellboreItemShapeGenerator';
import { offsetPoints } from '../utils/vectorUtils';

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

    // const sizes: HoleObjectData[] = data.map((d: HoleSize) => this.generateHoleSizeData(d));

    const maxDiameter = Math.max(...data.map((s: HoleSize) => s.diameter));
    const texture = this.createTexure(maxDiameter * maxTextureDiameterScale, firstColor, secondColor);
    data
      .sort((a: any, b: any) => (a.diameter <= b.diameter ? 1 : -1)) // draw smaller casings and holes inside bigger ones if overlapping
      .map((s: any) => this.drawHoleSize(s, texture));
  }

  drawHoleSize = (holeObject: HoleSize, texture: Texture): void => {
    if (holeObject == null) {
      return;
    }

    const path = this.getPathWithNormals(holeObject.start, holeObject.end, []);

    const partPathPoints = path.map((p) => p.point);
    const normals = path.map((p) => p.normal);
    const offsetCoordsRight = offsetPoints(partPathPoints, normals, holeObject.diameter);
    const offsetCoordsLeft = offsetPoints(partPathPoints, normals, -holeObject.diameter);

    const { maxTextureDiameterScale, firstColor, secondColor, lineColor, topBottomLineColor } = this.options;

    if (partPathPoints.length === 0) {
      return;
    }

    const { top, bottom, left, right } = generateHoleCoords(offsetCoordsRight, offsetCoordsLeft);
    const polygonCoords = [...left, ...right];
    const mask = this.drawBigPolygon(polygonCoords);
    const casingWallWidth = 1;

    this.createRopeTextureBackground(partPathPoints, texture, mask);

    this.drawLine(polygonCoords, lineColor, casingWallWidth);
    this.drawLine(top, topBottomLineColor, 1);
    this.drawLine(bottom, topBottomLineColor, 1);
  };
}
