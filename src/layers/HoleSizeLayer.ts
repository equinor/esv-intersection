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

    data
      .sort((a: HoleSize, b: HoleSize) => (a.diameter <= b.diameter ? 1 : -1)) // draw smaller casings and holes inside bigger ones if overlapping
      .forEach((hole: HoleSize) => this.drawHoleSize(hole));
  }

  drawHoleSize = (holeObject: HoleSize): void => {
    if (holeObject == null) {
      return;
    }

    const { maxTextureDiameterScale, firstColor, secondColor } = this.options;

    const texture = this.createTexure(holeObject.diameter * maxTextureDiameterScale, firstColor, secondColor);

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

    this.drawRope(points, texture);

    this.drawLine(polygonCoords, lineColor, HOLE_OUTLINE);
    this.drawLine(top, topBottomLineColor, 1);
    this.drawLine(bottom, topBottomLineColor, 1);
  };
}
