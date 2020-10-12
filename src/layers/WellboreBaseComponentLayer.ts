import { Graphics, Texture, Point, SimpleRope } from 'pixi.js';
import { merge } from 'd3-array';
import { PixiLayer } from './base/PixiLayer';
import { OnUpdateEvent, OnRescaleEvent, OnMountEvent, WellComponentBaseOptions, MDPoint } from '../interfaces';
import Vector2 from '@equinor/videx-vector2';
import { createNormals } from '../utils/vectorUtils';
import { ScaleLinear, scaleLinear } from 'd3-scale';

export abstract class WellboreBaseComponentLayer extends PixiLayer {
  options: WellComponentBaseOptions;

  rescaleEvent: OnRescaleEvent;

  dxScale: ScaleLinear<number, number>;

  _textureCache: Record<string, Texture> = {};

  constructor(id?: string, options?: WellComponentBaseOptions) {
    super(id, options);
    this.options = {
      ...this.options,
      maxDiameter: 36,
      ...options,
    };
    this.render = this.render.bind(this);
  }

  onMount(event: OnMountEvent): void {
    super.onMount(event);
  }

  onUpdate(event: OnUpdateEvent): void {
    super.onUpdate(event);
    this.clear();
    this.render(this.rescaleEvent);
  }

  onRescale(event: OnRescaleEvent): void {
    const isPanning = this.rescaleEvent && Math.abs(event.yRatio - this.rescaleEvent.yRatio) < 0.00001;

    this.rescaleEvent = event;

    if (!this.ctx) {
      return;
    }

    this.ctx.stage.position.set(event.xScale(0), event.yScale(0));

    const [min] = event.xScale.domain();
    const ppu = Math.abs(event.xScale(min + 1)); // Points per unit
    this.dxScale = scaleLinear()
      .range([0, Math.max(this.options.maxDiameter * ppu * event.zFactor, 0)])
      .domain([0, this.options.maxDiameter]);

    if (!isPanning) {
      this.render(event);
    }

    // Since we are not calling super.onRescale()
    this.optionsRescale(event);
  }

  // This is overridden by the extended well bore items layers (casing, hole)
  render(event: OnRescaleEvent | OnUpdateEvent): void {}

  clear() {
    const children = this.ctx.stage.removeChildren();
    children.forEach((child) => {
      child.destroy();
    });
  }

  getMdPoint = (md: number): MDPoint => {
    const p = this.referenceSystem.project(md);
    const point = { point: p, md: md };
    return point;
  };

  getPathForPoints = (start: number, end: number, interestPoints: number[]): MDPoint[] => {
    const pathPoints = this.referenceSystem.getCurtainPath(start, end);

    // Filter duplicate points
    const uniqueInterestPoints = interestPoints.filter((ip) => !pathPoints.some((p) => p.md === ip));
    const interestMdPoints = uniqueInterestPoints.map(this.getMdPoint);

    const points = merge<MDPoint>([pathPoints, interestMdPoints]);
    points.sort((a, b) => a.md - b.md);

    return points;
  };

  getScalePathForPoints = (start: number, end: number, interestPoints: number[]): MDPoint[] => {
    const { xScale, yScale } = this.rescaleEvent;
    const x = (x: number): number => xScale(x) - xScale(0);
    const y = (y: number): number => yScale(y) - yScale(0);

    const path = this.getPathForPoints(start, end, interestPoints);
    return path.map((p) => ({
      point: [x(p.point[0]), y(p.point[1])],
      md: p.md,
    }));
  };

  getScalePathForPointsWithNormals = (
    start: number,
    end: number,
    interestPoints: number[] = [],
  ): { point: number[]; md: number; normal: Vector2 }[] => {
    const points = this.getScalePathForPoints(start, end, interestPoints);
    const normals = createNormals(points.map((p) => p.point));
    return points.map((p, i) => ({ point: p.point, md: p.md, normal: normals[i] }));
  };

  drawBigPolygon = (coords: Point[], t?: Texture): Graphics => {
    if (!this.rescaleEvent) {
      return;
    }

    coords.forEach((point) => point.set(point.x, point.y));

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

  drawRopeWithMask(path: Point[], maskPolygon: Point[], texture: Texture): void {
    if (maskPolygon.length === 0 || path.length === 0) {
      return null;
    }

    if (!this.rescaleEvent) {
      return;
    }

    const rope: SimpleRope = new SimpleRope(texture, path, 1);

    const mask = new Graphics();
    mask.beginFill(0);
    mask.drawPolygon(maskPolygon);
    mask.endFill();
    this.ctx.stage.addChild(mask);
    rope.mask = mask;

    this.ctx.stage.addChild(rope);
  }

  drawCircle(point: Point, color: number) {
    const circle = new Graphics();
    circle.beginFill(color);
    circle.drawCircle(point.x, point.y, 2);
    circle.endFill();
    this.ctx.stage.addChild(circle);
  }

  drawRope(path: Point[], texture: Texture): void {
    if (path.length === 0) {
      return null;
    }

    const rope: SimpleRope = new SimpleRope(texture, path, 1);
    this.ctx.stage.addChild(rope);
  }

  drawLine(coords: Point[], lineColor: number, lineWidth = 1, close: boolean = false): void {
    const DRAW_ALIGNMENT_INSIDE = 1;
    const startPoint = coords[0];
    const line = new Graphics();
    line.lineStyle(lineWidth, lineColor, undefined, DRAW_ALIGNMENT_INSIDE).moveTo(startPoint.x, startPoint.y);
    coords.map((p: Point) => line.lineTo(p.x, p.y));
    if (close) {
      line.lineTo(coords[0].x, coords[0].y);
    }

    this.ctx.stage.addChild(line);
  }

  createTexture(maxWidth: number, startPctOffset: number = 0): Texture {
    const cacheKey = `${maxWidth}X${startPctOffset}`;
    if (this._textureCache.hasOwnProperty(cacheKey)) {
      return this._textureCache[cacheKey];
    }

    const { firstColor, secondColor } = this.options;

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
    this._textureCache[cacheKey] = t;

    return this._textureCache[cacheKey];
  }
}
