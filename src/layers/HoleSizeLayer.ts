import { Point, RENDERER_TYPE, Rectangle, Texture, SimpleRope } from 'pixi.js';
import { WellboreBaseComponentLayer, WellComponentBaseOptions } from './WellboreBaseComponentLayer';
import { HoleSize, PixiRenderApplication } from '..';
import { makeTubularPolygon } from '../datautils/wellboreItemShapeGenerator';
import { createNormals, offsetPoints } from '../utils/vectorUtils';
import { convertColor } from '../utils/color';
import { HOLE_OUTLINE } from '../constants';
import { max } from 'd3-array';

const createGradientFill = (
  canvas: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  firstColor: string,
  secondColor: string,
  startPctOffset: number,
): CanvasGradient => {
  const halfWayPct = 0.5;
  const gradient = canvasCtx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, firstColor);
  gradient.addColorStop(halfWayPct - startPctOffset, secondColor);
  gradient.addColorStop(halfWayPct + startPctOffset, secondColor);
  gradient.addColorStop(1, firstColor);

  return gradient;
};

const EXAGGERATED_DIAMETER = 100;

export interface HoleSizeLayerOptions<T extends HoleSize[]> extends WellComponentBaseOptions<T> {
  firstColor?: string;
  secondColor?: string;
  lineColor?: number;
}

export class HoleSizeLayer<T extends HoleSize[]> extends WellboreBaseComponentLayer<T> {
  maxDiameter: number;

  constructor(ctx: PixiRenderApplication, id?: string, options?: HoleSizeLayerOptions<T>) {
    super(ctx, id, options);
    this.options = {
      ...this.options,
      firstColor: 'rgb(140, 84, 29)',
      secondColor: 'rgb(238, 227, 216)',
      lineColor: 0x8b4513,
      ...options,
    };
  }

  preRender(): void {
    const { data } = this;

    if (!data || !this.rescaleEvent || !this.referenceSystem) {
      return;
    }

    data.sort((a: HoleSize, b: HoleSize) => b.diameter - a.diameter); // draw smaller casings and holes inside bigger ones if overlapping
    this.maxDiameter = data.length > 0 ? max(data, (d) => d.diameter) : EXAGGERATED_DIAMETER;
    data.forEach((hole: HoleSize) => this.drawHoleSize(hole));
  }

  drawHoleSize = (holeObject: HoleSize): void => {
    if (holeObject == null) {
      return;
    }

    const { exaggerationFactor, firstColor, lineColor } = this.options as HoleSizeLayerOptions<T>;

    const diameter = holeObject.diameter * exaggerationFactor;
    const radius = diameter / 2;

    const path = this.getZFactorScaledPathForPoints(holeObject.start, holeObject.end, [holeObject.start, holeObject.end]);
    const pathPoints = path.map((p) => p.point);
    const normals = createNormals(pathPoints);

    const rightPath = offsetPoints(pathPoints, normals, radius);
    const leftPath = offsetPoints(pathPoints, normals, -radius);

    if (pathPoints.length === 0) {
      return;
    }

    if (this.renderType() === RENDERER_TYPE.CANVAS) {
      const polygonCoords = makeTubularPolygon(leftPath, rightPath);
      this.drawBigPolygon(polygonCoords, convertColor(firstColor));
    } else {
      const texture = this.createTexture(diameter);
      this.drawRope(
        pathPoints.map((p) => new Point(p[0], p[1])),
        texture,
      );
    }

    this.drawOutline(leftPath, rightPath, lineColor, HOLE_OUTLINE * exaggerationFactor, false);
  };

  drawRope(path: Point[], texture: Texture, tint?: number): void {
    if (path.length === 0) {
      return null;
    }

    const { exaggerationFactor } = this.options as HoleSizeLayerOptions<T>;

    const rope: SimpleRope = new SimpleRope(texture, path, exaggerationFactor);

    rope.tint = tint || rope.tint;

    this.addChild(rope);
  }

  createTexture(diameter: number): Texture {
    const { exaggerationFactor } = this.options as HoleSizeLayerOptions<T>;

    const exaggeratedDiameter = diameter / exaggerationFactor;
    const height = this.maxDiameter;
    const width = 16;

    if (!this._textureCache) {
      this._textureCache = this.createBaseTexture(width, height);
    }

    const baseTexture = this._textureCache.baseTexture;
    const sidePadding = (height - exaggeratedDiameter) / 2;
    const frame = new Rectangle(0, sidePadding, width, exaggeratedDiameter);
    const texture = new Texture(baseTexture, frame);

    return texture;
  }

  createBaseTexture(width: number, height: number): Texture {
    const { firstColor, secondColor } = this.options as HoleSizeLayerOptions<T>;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const canvasCtx = canvas.getContext('2d');

    canvasCtx.fillStyle = createGradientFill(canvas, canvasCtx, firstColor, secondColor, 0);
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    return Texture.from(canvas);
  }

  getInternalLayerIds(): string[] {
    return [];
  }
}
