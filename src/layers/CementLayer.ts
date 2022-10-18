import { Texture } from 'pixi.js';
import { WellboreBaseComponentLayer, WellComponentBaseOptions } from './WellboreBaseComponentLayer';
import { Cement, Casing, HoleSize } from '../interfaces';
import { createComplexRopeSegmentsForCement } from '../datautils/wellboreItemShapeGenerator';
import { ComplexRope, ComplexRopeSegment } from './CustomDisplayObjects/ComplexRope';
import { PixiRenderApplication } from './base';
import { DEFAULT_TEXTURE_SIZE } from '../constants';

export type CementData = { cement: Cement[]; casings: Casing[]; holes: HoleSize[] };

export interface CementLayerOptions<T extends CementData> extends WellComponentBaseOptions<T> {
  firstColor?: string;
  secondColor?: string;
  cementTextureScalingFactor?: number;
}

export class CementLayer<T extends CementData> extends WellboreBaseComponentLayer<T> {
  constructor(ctx: PixiRenderApplication, id?: string, options?: CementLayerOptions<T>) {
    super(ctx, id, options);
    this.options = {
      ...this.options,
      firstColor: '#c7b9ab',
      secondColor: '#5b5b5b',
      cementTextureScalingFactor: 4,
      ...options,
    };
  }

  preRender(): void {
    if (!this.data || !this.referenceSystem) {
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

    const { firstColor, secondColor, cementTextureScalingFactor } = this.options as CementLayerOptions<T>;

    const canvas = document.createElement('canvas');

    const size = DEFAULT_TEXTURE_SIZE * cementTextureScalingFactor;
    const lineWidth = cementTextureScalingFactor;
    canvas.width = size;
    canvas.height = size;
    const canvasCtx = canvas.getContext('2d');

    canvasCtx.fillStyle = firstColor;
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = lineWidth;
    canvasCtx.fillStyle = secondColor;

    canvasCtx.beginPath();

    const distanceBetweenLines = size / 12; // eslint-disable-line no-magic-numbers
    for (let i = -canvas.width; i < canvas.width; i++) {
      canvasCtx.moveTo(-canvas.width + distanceBetweenLines * i, -canvas.height);
      canvasCtx.lineTo(canvas.width + distanceBetweenLines * i, canvas.height * 2);
    }
    canvasCtx.stroke();

    this._textureCache = Texture.from(canvas);

    return this._textureCache;
  }

  getInternalLayerIds(): string[] {
    return [];
  }
}
