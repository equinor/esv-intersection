import { Graphics, Texture, Point, SimpleRope } from 'pixi.js';
import { PixiLayer } from './PixiLayer';
import { createNormal } from '../utils/vectorUtils';
import { HoleSizeLayerOptions, OnUpdateEvent, OnRescaleEvent, HoleObjectData, HoleSize, Casing, OnMountEvent } from '../interfaces';
import { createNormalCoords, generateHoleCoords } from '../datautils/wellboreItemShapeGenerator';

export const StaticWellboreBaseComponentIncrement = 0.1;

export class WellboreBaseComponentLayer extends PixiLayer {
  options: HoleSizeLayerOptions;

  constructor(id?: string, options?: HoleSizeLayerOptions) {
    super(id, options);
    this.options = {
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
    this.ctx.stage.position.set(event.transform.x, event.transform.y);
    this.ctx.stage.scale.set(event.xRatio, event.yRatio);
  }

  render(event: OnRescaleEvent | OnUpdateEvent): void {
    // drawholesize ...
  }

  drawBigPolygon = (coords: Point[]): Graphics => {
    const polygon = new Graphics();
    polygon.beginFill(0);
    polygon.drawPolygon(coords);
    polygon.endFill();
    this.ctx.stage.addChild(polygon);

    return polygon;
  };

  createRopeTextureBackground = (coods: Point[], texture: Texture, mask: Graphics): SimpleRope => {
    const rope: SimpleRope = new SimpleRope(texture, coods);
    rope.mask = mask;
    this.ctx.stage.addChild(rope);

    return rope;
  };

  drawLine = (coords: Point[], lineColor: number, lineWidth = 1): void => {
    const DRAW_ALIGNMENT_INSIDE = 1;
    const startPoint = coords[0];
    const line = new Graphics();
    line.lineStyle(lineWidth, lineColor, undefined, DRAW_ALIGNMENT_INSIDE).moveTo(startPoint.x, startPoint.y);
    coords.map((p: Point) => line.lineTo(p.x, p.y));

    this.ctx.stage.addChild(line);
  };

  createTexure = (maxWidth: number, firstColor: string, secondColor: string, startPctOffset = 0): Texture => {
    const halfWayPct = 0.5;
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = maxWidth > 0 ? maxWidth : canvas.width; // TODO needs to grow with scale
    const canvasCtx = canvas.getContext('2d');

    const gradient = canvasCtx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, firstColor);
    gradient.addColorStop(halfWayPct - startPctOffset, secondColor);
    gradient.addColorStop(halfWayPct + startPctOffset, secondColor);
    gradient.addColorStop(1, firstColor);

    canvasCtx.fillStyle = gradient;
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    return Texture.from(canvas);
  };

  generateHoleSizeData = (data: HoleSize | Casing): HoleObjectData => {
    const points: any = [];

    // Add distance to points
    for (let i = data.start; i < data.start + data.length; i += StaticWellboreBaseComponentIncrement) {
      const p = this.referenceSystem.project(i);
      points.push({ point: new Point(p[0], p[1]), md: i });
    }

    return { data: { ...data, diameter: data.diameter }, points, hasShoe: data.hasShoe, innerDiameter: data.innerDiameter };
  };
}
