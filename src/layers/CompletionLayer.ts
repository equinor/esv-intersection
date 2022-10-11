import { Application, Point, RENDERER_TYPE, SimpleRope, Texture } from 'pixi.js';
import { PixiRenderApplication } from '..';
import { DEFAULT_TEXTURE_SIZE, SCREEN_OUTLINE } from '../constants';
import { makeTubularPolygon } from '../datautils/wellboreItemShapeGenerator';
import { Completion, foldCompletion, Screen, Tubing } from '../interfaces';
import { createNormals, offsetPoints } from '../utils/vectorUtils';
import { FixedWidthSimpleRope } from './CustomDisplayObjects/FixedWidthSimpleRope';
import { WellboreBaseComponentLayer, WellComponentBaseOptions } from './WellboreBaseComponentLayer';

interface TubularRenderingObject {
  pathPoints: number[][];
  polygon: Point[];
  leftPath: Point[];
  rightPath: Point[];
  radius: number;
}

export interface CompletionLayerOptions<T extends Completion[]> extends WellComponentBaseOptions<T> {
  screenScalingFactor?: number;
  screenLineColor?: number;
  tubingScalingFactor?: number;
}

export class CompletionLayer<T extends Completion[]> extends WellboreBaseComponentLayer<T> {
  private screenTextureCache: Texture | undefined = undefined;

  private tubingTextureCache: Texture[] = [];

  constructor(ctx: Application | PixiRenderApplication, id: string, options: CompletionLayerOptions<T>) {
    super(ctx, id, options);
    this.options = {
      ...this.options,
      screenScalingFactor: 4,
      tubingScalingFactor: 1,
      screenLineColor: 0x63666a,
      ...options,
    };
    this.render = this.render.bind(this);
  }

  preRender(): void {
    const wellborePath = this.referenceSystem ? this.referenceSystem.projectedPath : [];

    if (wellborePath == null || !this.data?.length) {
      return;
    }
    const { screenLineColor } = this.options as CompletionLayerOptions<T>;
    this.data.map(
      foldCompletion(
        (obj: Screen) => this.drawScreen(obj, screenLineColor),
        (obj: Tubing) => this.drawTubing(obj),
      ),
    );
  }

  private drawScreen(screen: Screen, lineColor: number): void {
    const { exaggerationFactor } = this.options as CompletionLayerOptions<T>;

    const texture = this.createScreenTexture();
    const { pathPoints, polygon, leftPath, rightPath } = this.createTubularPolygon(screen);

    if (this.renderType() === RENDERER_TYPE.CANVAS) {
      this.drawBigTexturedPolygon(polygon, texture);
    } else {
      this.drawCompletionRope(
        pathPoints.map((p) => new Point(p[0], p[1])),
        texture,
        screen.diameter,
      );
    }
    this.drawOutline(leftPath, rightPath, lineColor, SCREEN_OUTLINE * exaggerationFactor, false);
  }

  private drawTubing(tubing: Tubing): void {
    const texture = this.createTubingTexture(tubing.diameter);
    const { pathPoints, polygon } = this.createTubularPolygon(tubing);

    if (this.renderType() === RENDERER_TYPE.CANVAS) {
      this.drawBigTexturedPolygon(polygon, texture);
    } else {
      this.drawCompletionRope(
        pathPoints.map((p) => new Point(p[0], p[1])),
        texture,
        tubing.diameter,
      );
    }
  }

  private createTubularPolygon(completion: Screen | Tubing): TubularRenderingObject {
    if (completion == null) {
      return;
    }

    const { exaggerationFactor } = this.options as CompletionLayerOptions<T>;

    const diameter = completion.diameter * exaggerationFactor;

    const radius = diameter / 2;

    const path = this.getZFactorScaledPathForPoints(completion.start, completion.end, [completion.start, completion.end]);

    const pathPoints = path.map((p) => p.point);
    const normals = createNormals(pathPoints);
    const rightPath = offsetPoints(pathPoints, normals, radius);
    const leftPath = offsetPoints(pathPoints, normals, -radius);

    const polygon = makeTubularPolygon(leftPath, rightPath);

    return { pathPoints, polygon, leftPath, rightPath, radius };
  }

  private createTubingTexture(diameter: number): Texture {
    const { tubingScalingFactor } = this.options as CompletionLayerOptions<T>;
    const innerColor = '#EEEEFF';
    const outerColor = '#777788';

    if (!this.tubingTextureCache[diameter]) {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = diameter * tubingScalingFactor;
      const canvasCtx = canvas.getContext('2d');
      if (canvasCtx instanceof CanvasRenderingContext2D) {
        const gradient = canvasCtx.createLinearGradient(0, 0, 0, diameter * tubingScalingFactor);

        const innerColorStart = 0.3;
        const innerColorEnd = 0.7;
        gradient.addColorStop(0, outerColor);
        gradient.addColorStop(innerColorStart, innerColor);
        gradient.addColorStop(innerColorEnd, innerColor);
        gradient.addColorStop(1, outerColor);

        canvasCtx.fillStyle = gradient;
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        this.tubingTextureCache[diameter] = Texture.from(canvas);
      }
    }
    return this.tubingTextureCache[diameter];
  }

  private createScreenTexture(): Texture {
    const { screenScalingFactor } = this.options as CompletionLayerOptions<T>;

    if (!this.screenTextureCache) {
      const canvas = document.createElement('canvas');
      const size = DEFAULT_TEXTURE_SIZE * screenScalingFactor;
      canvas.width = size;
      canvas.height = size;
      const canvasCtx = canvas.getContext('2d');

      if (canvasCtx instanceof CanvasRenderingContext2D) {
        canvasCtx.fillStyle = 'white';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        const baseLineWidth = size / 10; // eslint-disable-line no-magic-numbers
        canvasCtx.strokeStyle = '#AAAAAA';
        canvasCtx.lineWidth = baseLineWidth;
        canvasCtx.beginPath();

        const distanceBetweenLines = size / 3;
        for (let i = -canvas.width; i < canvas.width; i++) {
          canvasCtx.moveTo(-canvas.width + distanceBetweenLines * i, -canvas.height);
          canvasCtx.lineTo(canvas.width + distanceBetweenLines * i, canvas.height * 2);
        }
        canvasCtx.stroke();
      }
      this.screenTextureCache = Texture.from(canvas);
    }
    return this.screenTextureCache;
  }

  private drawCompletionRope(path: Point[], texture: Texture, diameter: number): void {
    if (path.length === 0) {
      return;
    }

    const { exaggerationFactor } = this.options as CompletionLayerOptions<T>;

    const rope: FixedWidthSimpleRope = new FixedWidthSimpleRope(texture, path, diameter, exaggerationFactor);
    this.addChild(rope);
  }

  getInternalLayerIds(): string[] {
    return [];
  }
}
