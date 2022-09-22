import { Graphics, Texture, Point, SimpleRope } from 'pixi.js';
import { PixiLayer, PixiRenderApplication } from './base/PixiLayer';
import { OnUpdateEvent, OnRescaleEvent, MDPoint, OnUnmountEvent } from '../interfaces';
import { LayerOptions } from './base';

export interface WellComponentBaseOptions<T> extends LayerOptions<T> {
  exaggerationFactor?: number;
}

export abstract class WellboreBaseComponentLayer<T> extends PixiLayer<T> {
  _textureCache: Texture;

  rescaleEvent: OnRescaleEvent;

  constructor(pixiRenderApplication?: PixiRenderApplication, id?: string, options?: WellComponentBaseOptions) {
    super(pixiRenderApplication, id, options);
    this.options = {
      ...this.options,
      exaggerationFactor: 2,
      ...options,
    };
    this.render = this.render.bind(this);
  }

  abstract preRender(): void;

  onUnmount(event?: OnUnmountEvent): void {
    super.onUnmount(event);
    this._textureCache = null;
    this.rescaleEvent = null;
  }

  onUpdate(event: OnUpdateEvent<T>): void {
    super.onUpdate(event);
    this.clearStage();
    this.preRender();
    this.render();
  }

  onRescale(event: OnRescaleEvent): void {
    const shouldRecalculate = this.rescaleEvent?.zFactor !== event.zFactor;

    this.rescaleEvent = event;
    super.optionsRescale(event);

    if (!this.ctx) {
      return;
    }

    const yRatio = this.yRatio();
    const flippedX = event.xBounds[0] > event.xBounds[1];
    const flippedY = event.yBounds[0] > event.yBounds[1];
    this.container.position.set(event.xScale(0), event.yScale(0));
    this.container.scale.set(event.xRatio * (flippedX ? -1 : 1), yRatio * (flippedY ? -1 : 1));
    if (shouldRecalculate) {
      this.clearStage();
      this.preRender();
    }

    this.render();
  }

  clearStage(): void {
    const children = this.container.removeChildren();
    children.forEach((child) => {
      child.destroy();
    });
  }

  /**
   * Calculate yRatio without zFactor
   * TODO consider to move this into ZoomPanHandler
   */
  yRatio(): number {
    const domain = this.rescaleEvent.yScale.domain();
    const ySpan = domain[1] - domain[0];
    const baseYSpan = ySpan * this.rescaleEvent.zFactor;
    const baseDomain = [domain[0], domain[0] + baseYSpan];
    return Math.abs(this.rescaleEvent.height / (baseDomain[1] - baseDomain[0]));
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

    const points = [...pathPoints, ...interestMdPoints];
    points.sort((a, b) => a.md - b.md);

    return points;
  };

  getZFactorScaledPathForPoints = (start: number, end: number, interestPoints: number[]): MDPoint[] => {
    const y = (y: number): number => y * this.rescaleEvent.zFactor;

    const path = this.getPathForPoints(start, end, interestPoints);
    return path.map((p) => ({
      point: [p.point[0], y(p.point[1])],
      md: p.md,
    }));
  };

  drawBigPolygon = (coords: Point[], color = 0x000000): Graphics => {
    const polygon = new Graphics();
    polygon.beginFill(color);
    polygon.drawPolygon(coords);
    polygon.endFill();

    this.container.addChild(polygon);

    return polygon;
  };

  drawBigTexturedPolygon = (coords: Point[], t: Texture): Graphics => {
    const polygon = new Graphics();
    polygon.beginTextureFill({ texture: t });
    polygon.drawPolygon(coords);
    polygon.endFill();

    this.container.addChild(polygon);

    return polygon;
  };

  drawRopeWithMask(path: Point[], maskPolygon: Point[], texture: Texture): void {
    if (maskPolygon.length === 0 || path.length === 0) {
      return null;
    }
    const rope: SimpleRope = new SimpleRope(texture, path, 1);

    const mask = new Graphics();
    mask.beginFill(0);
    mask.drawPolygon(maskPolygon);
    mask.endFill();
    this.container.addChild(mask);
    rope.mask = mask;

    this.container.addChild(rope);
  }

  drawRope(path: Point[], texture: Texture, tint?: number): void {
    if (path.length === 0) {
      return null;
    }

    const rope: SimpleRope = new SimpleRope(texture, path, 1);

    rope.tint = tint || rope.tint;

    this.container.addChild(rope);
  }

  drawOutline(leftPath: Point[], rightPath: Point[], lineColor: number, lineWidth = 1, close: boolean = false): void {
    const DRAW_ALIGNMENT_INSIDE = 1;

    const leftPathReverse = leftPath.map<Point>((d) => d.clone()).reverse();

    const startPointRight = rightPath[0];
    const startPointLeft = leftPathReverse[0];

    const line = new Graphics();
    line.lineStyle(lineWidth, lineColor, undefined, DRAW_ALIGNMENT_INSIDE);
    line.moveTo(startPointRight.x, startPointRight.y);
    rightPath.forEach((p: Point) => line.lineTo(p.x, p.y));

    if (!close) {
      line.moveTo(startPointLeft.x, startPointLeft.y);
    }

    leftPathReverse.forEach((p: Point) => line.lineTo(p.x, p.y));

    if (close) {
      line.lineTo(startPointRight.x, startPointRight.y);
    }

    this.container.addChild(line);
  }
}
