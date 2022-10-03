import { Application, Point, Rectangle, RENDERER_TYPE, SimpleRope, Texture } from 'pixi.js';
import { OnUpdateEvent, PixiRenderApplication } from '..';
import { makeTubularPolygon } from '../datautils/wellboreItemShapeGenerator';
import { Completion, foldCompletion, Screen, Tubing, OnRescaleEvent } from '../interfaces';
import { createNormals, offsetPoints } from '../utils/vectorUtils';
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

  override onRescale(event: OnRescaleEvent): void {
    super.onRescale(event);
    this.clearLayer();
    this.preRender();
    this.render();
  }

  override onUpdate(event: OnUpdateEvent<T>): void {
    super.onUpdate(event);
    this.clearLayer();
    this.preRender();
    this.render();
  }

  preRender(): void {
    const wellborePath = this.referenceSystem ? this.referenceSystem.projectedPath : [];

    if (wellborePath == null || !this.data?.length) {
      return;
    }
    const { screenScalingFactor, tubingScalingFactor, screenLineColor } = this.options as CompletionLayerOptions<T>;
    this.data.map(
      foldCompletion(
        (obj: Screen) => this.drawScreen(obj, screenScalingFactor, screenLineColor),
        (obj: Tubing) => this.drawTubing(obj, tubingScalingFactor),
      ),
    );
  }

  private drawScreen(screen: Screen, scalingFactor: number, lineColor: number): void {
    const texture = this.createScreenTexture(screen.diameter);
    const { pathPoints, polygon, leftPath, rightPath } = this.createTubularPolygon(screen);

    if (this.renderType() === RENDERER_TYPE.CANVAS) {
      this.drawBigTexturedPolygon(polygon, texture);
    } else {
      this.drawCompletionRope(
        pathPoints.map((p) => new Point(p[0], p[1])),
        texture,
        scalingFactor,
      );
    }
    this.drawOutline(leftPath, rightPath, lineColor, 0.5, true);
  }

  private drawTubing(tubing: Tubing, scalingFactor: number): void {
    const texture = this.createTubingTexture(tubing.diameter);
    const { pathPoints, polygon } = this.createTubularPolygon(tubing);

    if (this.renderType() === RENDERER_TYPE.CANVAS) {
      this.drawBigTexturedPolygon(polygon, texture);
    } else {
      this.drawCompletionRope(
        pathPoints.map((p) => new Point(p[0], p[1])),
        texture,
        scalingFactor,
      );
    }
  }

  private createTubularPolygon(completion: Screen | Tubing): TubularRenderingObject {
    if (completion == null) {
      return;
    }

    const diameter = completion.diameter;

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

  private createScreenTexture(diameter: number): Texture {
    const { screenScalingFactor } = this.options as CompletionLayerOptions<T>;

    if (!this.screenTextureCache) {
      const canvas = document.createElement('canvas');
      const size = 512;
      canvas.width = size * screenScalingFactor;
      canvas.height = size * screenScalingFactor;
      const canvasCtx = canvas.getContext('2d');

      if (canvasCtx instanceof CanvasRenderingContext2D) {
        canvasCtx.fillStyle = 'white';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        const baseLineWidth = 6;
        canvasCtx.strokeStyle = '#AAAAAA';
        canvasCtx.lineWidth = baseLineWidth * screenScalingFactor;
        canvasCtx.beginPath();

        const distanceBetweenLines = 16 * screenScalingFactor;
        for (let i = -canvas.width; i < canvas.width; i++) {
          canvasCtx.moveTo(-canvas.width + distanceBetweenLines * i, -canvas.height);
          canvasCtx.lineTo(canvas.width + distanceBetweenLines * i, canvas.height);
        }
        canvasCtx.stroke();
      }
      this.screenTextureCache = Texture.from(canvas);
    }

    const resizedTexture = this.screenTextureCache.clone();
    resizedTexture.frame = new Rectangle(0, 0, 16 * screenScalingFactor, diameter * screenScalingFactor);
    return resizedTexture;
  }

  private drawCompletionRope(path: Point[], texture: Texture, textureScaleFactor: number): void {
    if (path.length === 0) {
      return;
    }
    const rope: SimpleRope = new SimpleRope(texture, path, 1 / textureScaleFactor);
    this.addChild(rope);
  }

  getInternalLayerIds(): string[] {
    return [];
  }
}
