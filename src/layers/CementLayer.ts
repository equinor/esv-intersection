import { Texture } from 'pixi.js';
import { WellboreBaseComponentLayer, WellComponentBaseOptions } from './WellboreBaseComponentLayer';
import { Cement, Casing, HoleSize } from '../interfaces';
import { createComplexRopeSegmentsForCement } from '../datautils/wellboreItemShapeGenerator';
import { ComplexRope, ComplexRopeSegment } from './CustomDisplayObjects/ComplexRope';
import { PixiRenderApplication } from './base';

export type CementData = { cement: Cement[]; casings: Casing[]; holes: HoleSize[] };

export interface CementLayerOptions<T extends CementData> extends WellComponentBaseOptions<T> {
  firstColor?: string;
  secondColor?: string;
}

export class CementLayer<T extends CementData> extends WellboreBaseComponentLayer<T> {
  constructor(ctx: PixiRenderApplication, id?: string, options?: CementLayerOptions<T>) {
    super(ctx, id, options);
    this.options = {
      ...this.options,
      firstColor: '#c7b9ab',
      secondColor: '#5b5b5b',
      ...options,
    };
  }

  preRender(): void {
    if (!this.data || !this.rescaleEvent || !this.referenceSystem) {
      return;
    }

    const { cement, casings, holes } = this.data;
    const cementShapes: ComplexRopeSegment[][] = cement.map((cement: Cement): ComplexRopeSegment[] => this.createCementShape(cement, casings, holes));

    cementShapes.map((shape) => {
      this.drawComplexRope(shape, this.createTexture());
    });
  }

  createCementShape = (cement: Cement, casings: Casing[], holes: HoleSize[]): ComplexRopeSegment[] => {
    const { exaggerationFactor } = this.options as CementLayerOptions<T>;
    return createComplexRopeSegmentsForCement(cement, casings, holes, exaggerationFactor, this.getZFactorScaledPathForPoints);
  };

  drawComplexRope(intervals: ComplexRopeSegment[], texture: Texture): void {
    if (intervals.length === 0) {
      return null;
    }
    const { exaggerationFactor } = this.options as CementLayerOptions<T>;

    const rope = new ComplexRope(texture, intervals, exaggerationFactor);

    this.addChild(rope);
  }

  createTexture(): Texture {
    if (this._textureCache) {
      return this._textureCache;
    }

    const { firstColor, secondColor } = this.options as CementLayerOptions<T>;

    const canvas = document.createElement('canvas');
    canvas.width = 150;
    canvas.height = 150;
    const canvasCtx = canvas.getContext('2d');

    canvasCtx.fillStyle = firstColor;
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 1;
    canvasCtx.fillStyle = secondColor;

    canvasCtx.beginPath();
    canvasCtx.lineWidth = 1;

    const distanceBetweenLines = 10;
    for (let i = -canvas.width; i < canvas.width; i++) {
      canvasCtx.moveTo(-canvas.width + distanceBetweenLines * i, -canvas.height);
      canvasCtx.lineTo(canvas.width + distanceBetweenLines * i, canvas.height);
    }
    canvasCtx.stroke();

    this._textureCache = Texture.from(canvas);

    return this._textureCache;
  }

  getInternalLayerIds(): string[] {
    return [];
  }
}
