import { WellboreBaseComponentLayer } from './WellboreBaseComponentLayer';
import { HoleSizeLayerOptions, OnMountEvent, OnUpdateEvent, OnRescaleEvent, HoleSize } from '..';
import { Texture } from 'pixi.js';
import { getEndLines, getRopePolygon } from '../datautils/wellboreItemShapeGenerator';
import { offsetPoints } from '../utils/vectorUtils';
import { HOLE_OUTLINE } from '../constants';

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
    const { data } = this;

    if (data == null) {
      return;
    }

    const { maxTextureDiameterScale, firstColor, secondColor } = this.options;

    const maxDiameter = Math.max(...data.map((s: HoleSize) => s.diameter));
    const texture = this.createTexure(maxDiameter * maxTextureDiameterScale, firstColor, secondColor);
    data
      .sort((a: HoleSize, b: HoleSize) => (a.diameter <= b.diameter ? 1 : -1)) // draw smaller casings and holes inside bigger ones if overlapping
      .forEach((hole: HoleSize) => this.drawHoleSize(hole, texture));
  }

  drawHoleSize = (holeObject: HoleSize, texture: Texture): void => {
    if (holeObject == null) {
      return;
    }

    const path = this.getPathWithNormals(holeObject.start, holeObject.end, []);
    const points = path.map((p) => p.point);
    const normals = path.map((p) => p.normal);

    const rightPath = offsetPoints(points, normals, holeObject.diameter);
    const leftPath = offsetPoints(points, normals, -holeObject.diameter);

    const { lineColor, topBottomLineColor } = this.options;

    if (points.length === 0) {
      return;
    }

    const { top, bottom } = getEndLines(rightPath, leftPath);
    const polygonCoords = getRopePolygon(leftPath, rightPath);
    const mask = this.drawBigPolygon(polygonCoords);

    this.createRopeTextureBackground(points, texture, mask);

    this.drawLine(polygonCoords, lineColor, HOLE_OUTLINE);
    this.drawLine(top, topBottomLineColor, 1);
    this.drawLine(bottom, topBottomLineColor, 1);
  };
}
