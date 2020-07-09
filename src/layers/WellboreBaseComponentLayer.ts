import { Graphics, Texture, Point, SimpleRope } from 'pixi.js';
import { merge } from 'd3-array';
import { PixiLayer } from './base/PixiLayer';
import { HoleSizeLayerOptions, OnUpdateEvent, OnRescaleEvent, MDPoint, OnMountEvent } from '../interfaces';
import Vector2 from '@equinor/videx-vector2';
import { arrayToPoint } from '../utils/vectorUtils';

export class WellboreBaseComponentLayer extends PixiLayer {
  options: HoleSizeLayerOptions;

  constructor(id?: string, options?: HoleSizeLayerOptions) {
    super(id, options);
    this.options = {
      ...this.options,
      ...options,
    };
    this.render = this.render.bind(this);
  }

  onMount(event: OnMountEvent): void {
    super.onMount(event);
  }

  onUpdate(event: OnUpdateEvent): void {
    super.onUpdate(event);
    const children = this.ctx.stage.removeChildren();
    children.forEach((child) => {
      child.destroy();
    });
  }

  onRescale(event: OnRescaleEvent): void {
    super.onRescale(event);
    this.ctx.stage.position.set(event.transform.x, event.transform.y);
    this.ctx.stage.scale.set(event.xRatio, event.yRatio);
  }

  // This is overridden by the extended well bore items layers (casing, hole)
  render(event: OnRescaleEvent | OnUpdateEvent): void {}

  getMdPoint = (md: number): MDPoint => {
    const p = this.referenceSystem.project(md);
    const point = { point: arrayToPoint(p as [number, number]), md: md };
    return point;
  };

  computeNormal(md: number): Vector2 {
    const tangent = this.referenceSystem.curtainTangent(md);
    const normal = new Vector2(tangent).rotate90();
    return normal;
  }

  getNormal = (point: MDPoint): MDPoint => {
    const normal = this.computeNormal(point.md);
    return { ...point, normal };
  };

  getPathForPoints = (start: number, end: number, interestPoints: number[]): MDPoint[] => {
    const pathPoints = this.referenceSystem.getCurtainPath(start, end).map((p) => ({ point: arrayToPoint(p.point as [number, number]), md: p.md }));
    const interestMdPoints = interestPoints.map(this.getMdPoint);

    const points = merge<MDPoint>([pathPoints, interestMdPoints]);
    points.sort((a, b) => a.md - b.md);

    return points;
  };

  getPathWithNormals = (start: number, end: number, interestPoints: number[]): MDPoint[] => {
    const points = this.getPathForPoints(start, end, [start, ...interestPoints, end]);
    const pointsWithNormal = points.map<MDPoint>(this.getNormal);

    return pointsWithNormal;
  };

  drawBigPolygon = (coords: Point[], t?: Texture): Graphics => {
    const polygon = new Graphics();
    if (t != null) {
      polygon.beginTextureFill({ texture: t });
    } else {
      polygon.beginFill(0);
    }
    polygon.drawPolygon(coords);
    polygon.endFill();
    this.ctx.stage.addChild(polygon);

    return polygon;
  };

  drawRope = (polygon: Point[], texture: Texture, maskTexture: boolean = false): SimpleRope => {
    if (polygon.length === 0) {
      return null;
    }

    const rope: SimpleRope = new SimpleRope(texture, polygon, 1);

    if (maskTexture) {
      const mask = new Graphics();
      mask.beginFill(0);
      mask.drawPolygon(polygon);
      mask.endFill();
      this.ctx.stage.addChild(mask);
      rope.mask = mask;
    }

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

    const t = Texture.from(canvas);
    return t;
  };
}
