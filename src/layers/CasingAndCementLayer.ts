import { Point, Rectangle, RENDERER_TYPE, Texture } from 'pixi.js';
import { CasingShoeSize, PixiRenderApplication } from '.';
import { DEFAULT_TEXTURE_SIZE, SHOE_LENGTH, SHOE_WIDTH } from '../constants';
import {
  createComplexRopeSegmentsForCement,
  makeTubularPolygon,
  createComplexRopeSegmentsForCementSqueeze,
} from '../datautils/wellboreItemShapeGenerator';
import { Casing, Cement, CementSqueeze, HoleSize } from '../interfaces';
import { createNormals, offsetPoint, offsetPoints } from '../utils/vectorUtils';
import { ComplexRope, ComplexRopeSegment } from './CustomDisplayObjects/ComplexRope';
import { WellboreBaseComponentLayer, WellComponentBaseOptions } from './WellboreBaseComponentLayer';

interface CasingRenderObject {
  casingId: string;
  pathPoints: number[][];
  polygon: Point[];
  leftPath: Point[];
  rightPath: Point[];
  radius: number;
  diameter: number;
  casingWallWidth: number;
  hasShoe: boolean;
  bottom: number;
}

const defaultCasingShoeSize: CasingShoeSize = {
  width: SHOE_WIDTH,
  length: SHOE_LENGTH,
};

export interface CasingAndCementData {
  holeSizes: HoleSize[];
  casings: Casing[];
  cements: Cement[];
  cementSqueezes: CementSqueeze[];
}

export interface CasingAndCementLayerOptions<T extends CasingAndCementData> extends WellComponentBaseOptions<T> {
  casingSolidColor?: number;
  casingLineColor?: number;
  firstCementColor?: string;
  secondCementColor?: string;
  firstCementSqueezeColor?: string;
  secondCementSqueezeColor?: string;
  casingShoeSize?: CasingShoeSize;
  cementTextureScalingFactor?: number;
  exaggerationFactor?: number;
  internalLayers?: {
    casingId: string;
    cementId: string;
  };
}

interface CementShape {
  segments: ComplexRopeSegment[];
  casingIds: string[];
}

interface CementSqueezeShape {
  segments: ComplexRopeSegment[];
  casingIds: string[];
}

export class CasingAndCementLayer<T extends CasingAndCementData> extends WellboreBaseComponentLayer<T> {
  private casingVisibility = true;
  private cementVisibility = true;
  private _cementSqueezeTextureCache: Texture = null;

  constructor(ctx: PixiRenderApplication, id?: string, options?: CasingAndCementLayerOptions<T>) {
    super(ctx, id, options);
    this.options = {
      ...this.options,
      casingSolidColor: 0xdcdcdc,
      casingLineColor: 0x575757,
      casingShoeSize: defaultCasingShoeSize,
      cementTextureScalingFactor: 4,
      firstCementColor: '#c7b9ab',
      secondCementColor: '#5b5b5b',
      firstCementSqueezeColor: 'rgb(139, 69, 19)',
      secondCementSqueezeColor: 'rgb(139, 103, 19)',
      ...options,
    };
  }

  preRender(): void {
    if (!this.data || !this.rescaleEvent || !this.referenceSystem) {
      return;
    }

    const { holeSizes, casings, cements, cementSqueezes } = this.data;

    // cement does not have enough data on its own to render it, so we add the bottom here
    // cementSqueeze does not need to have such a thing added since it comes with it's own top and bottom
    const sortedCasings = casings.sort((a: Casing, b: Casing) => b.diameter - a.diameter);
    const casingRenderObjects: CasingRenderObject[] = sortedCasings.map(this.prepareCasingRenderObject);
    const cementShapes: CementShape[] = cements.map(
      (cement: Cement): CementShape => ({
        segments: this.createCementShape(cement, sortedCasings, holeSizes),
        casingIds: [cement.casingId, ...(cement.casingIds || [])].filter((id) => id),
      }),
    );

    const CEMENT_SQUEEZE_SHAPES: CementSqueezeShape[] = cementSqueezes.map((squeeze: CementSqueeze) => {
      return {
        segments: this.createCementSqueezeShape(squeeze, sortedCasings, holeSizes),
        casingIds: squeeze.casingIds,
      };
    });

    this.pairCementAndCasingRenderObjects(casingRenderObjects, cementShapes).forEach(
      ([cementShape, casingRenderObject]: [CementShape | undefined, CasingRenderObject]) => {
        if (cementShape) {
          this.cementVisibility && this.drawComplexRope(cementShape.segments, this.createCementTexture());
        }
        this.casingVisibility && this.drawCasing(casingRenderObject);

        if (casingRenderObject.hasShoe) {
          this.casingVisibility && this.drawShoe(casingRenderObject.bottom, casingRenderObject.radius);
        }
      },
    );

    CEMENT_SQUEEZE_SHAPES.forEach((squeeze) => {
      this.drawComplexRope(squeeze.segments, this.createCementSqueezeTexture());
    });
  }

  private pairCementAndCasingRenderObjects(
    casingRenderObjects: CasingRenderObject[],
    cementShapes: CementShape[],
  ): [CementShape | undefined, CasingRenderObject][] {
    const { tuples } = casingRenderObjects.reduce(
      (acc, casingRenderObject) => {
        const foundCementShape = acc.remainingCement.find((cement) => cement.casingIds.includes(casingRenderObject.casingId));
        return {
          tuples: [...acc.tuples, [foundCementShape, casingRenderObject]],
          remainingCement: acc.remainingCement.filter((c) => c !== foundCementShape),
        };
      },
      { tuples: [], remainingCement: cementShapes },
    );
    return tuples;
  }

  private prepareCasingRenderObject = (casing: Casing): CasingRenderObject => {
    if (casing == null) {
      return;
    }
    const { exaggerationFactor } = this.options as CasingAndCementLayerOptions<T>;

    const diameter = casing.diameter * exaggerationFactor;
    const innerDiameter = casing.innerDiameter * exaggerationFactor;

    const radius = diameter / 2;
    const innerRadius = innerDiameter / 2;

    const path = this.getZFactorScaledPathForPoints(casing.start, casing.end, [casing.start, casing.end]);

    const pathPoints = path.map((p) => p.point);
    const normals = createNormals(pathPoints);
    const rightPath = offsetPoints(pathPoints, normals, radius);
    const leftPath = offsetPoints(pathPoints, normals, -radius);

    const polygon = makeTubularPolygon(leftPath, rightPath);

    const casingWallWidth = radius - innerRadius;

    return {
      casingId: casing.casingId,
      pathPoints,
      polygon,
      leftPath,
      rightPath,
      radius,
      diameter,
      casingWallWidth,
      hasShoe: casing.hasShoe,
      bottom: casing.end,
    };
  };

  drawComplexRope(intervals: ComplexRopeSegment[], texture: Texture): void {
    if (intervals.length === 0) {
      return null;
    }
    const { exaggerationFactor } = this.options as CasingAndCementLayerOptions<T>;

    const rope = new ComplexRope(texture, intervals, exaggerationFactor);

    this.addChild(rope);
  }

  private drawCasing = (zippedRenderObject: CasingRenderObject): void => {
    const { casingLineColor, casingSolidColor } = this.options as CasingAndCementLayerOptions<T>;
    const { pathPoints, polygon, leftPath, rightPath, diameter, casingWallWidth } = zippedRenderObject;

    // Pixi.js-legacy handles SimpleRope and advanced render methods poorly
    if (this.renderType() === RENDERER_TYPE.CANVAS) {
      this.drawBigPolygon(polygon, casingSolidColor);
    } else {
      const texture = this.createCasingTexture(diameter);
      this.drawRope(
        pathPoints.map((p) => new Point(p[0], p[1])),
        texture,
        casingSolidColor,
      );
    }

    this.drawOutline(leftPath, rightPath, casingLineColor, casingWallWidth, true);
  };

  private createCasingTexture(diameter: number): Texture {
    const textureWidthPO2 = 16;
    return new Texture(Texture.WHITE.baseTexture, null, new Rectangle(0, 0, textureWidthPO2, diameter));
  }

  private drawShoe(casingEnd: number, casingRadius: number): void {
    const { exaggerationFactor, casingShoeSize } = this.options as CasingAndCementLayerOptions<T>;
    const shoeWidth = casingShoeSize.width * exaggerationFactor;
    const shoeLength = casingShoeSize.length * exaggerationFactor;
    const shoeCoords = this.generateShoe(casingEnd, casingRadius, shoeLength, shoeWidth);
    const shoeCoords2 = this.generateShoe(casingEnd, casingRadius, shoeLength, -shoeWidth);
    this.drawBigPolygon(shoeCoords2);
    this.drawBigPolygon(shoeCoords);
  }

  private generateShoe = (casingEnd: number, casingRadius: number, length: number, width: number): Point[] => {
    const start = casingEnd - length;
    const end = casingEnd;

    const path = this.getZFactorScaledPathForPoints(start, end, [start, end]);

    const points = path.map((p) => p.point);
    const normal = createNormals(points);
    const shoeEdge: Point[] = offsetPoints(points, normal, casingRadius * (width < 0 ? -1 : 1));

    const shoeTipPoint = points[points.length - 1];
    const shoeTipNormal = normal[normal.length - 1];
    const shoeTip: Point = offsetPoint(shoeTipPoint, shoeTipNormal, width);

    return [...shoeEdge, shoeTip];
  };

  createCementShape = (cement: Cement, casings: Casing[], holes: HoleSize[]): ComplexRopeSegment[] => {
    const { exaggerationFactor } = this.options as CasingAndCementLayerOptions<T>;
    return createComplexRopeSegmentsForCement(cement, casings, holes, exaggerationFactor, this.getZFactorScaledPathForPoints);
  };

  createCementSqueezeShape = (squeeze: CementSqueeze, casings: Casing[], holes: HoleSize[]): ComplexRopeSegment[] => {
    const { exaggerationFactor } = this.options as CasingAndCementLayerOptions<T>;
    return createComplexRopeSegmentsForCementSqueeze(squeeze, casings, holes, exaggerationFactor, this.getZFactorScaledPathForPoints);
  };

  private createCementTexture(): Texture {
    if (this._textureCache) {
      return this._textureCache;
    }

    const { firstCementColor, secondCementColor, cementTextureScalingFactor } = this.options as CasingAndCementLayerOptions<T>;

    const canvas = document.createElement('canvas');

    const size = DEFAULT_TEXTURE_SIZE * cementTextureScalingFactor;
    const lineWidth = cementTextureScalingFactor;
    canvas.width = size;
    canvas.height = size;
    const canvasCtx = canvas.getContext('2d');

    canvasCtx.fillStyle = firstCementColor;
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    canvasCtx.lineWidth = lineWidth;
    canvasCtx.fillStyle = secondCementColor;
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

  private createCementSqueezeTexture(): Texture {
    if (this._cementSqueezeTextureCache) {
      return this._cementSqueezeTextureCache;
    }

    const { firstCementSqueezeColor, secondCementSqueezeColor, cementTextureScalingFactor } = this.options as CasingAndCementLayerOptions<T>;

    const canvas = document.createElement('canvas');

    const size = DEFAULT_TEXTURE_SIZE * cementTextureScalingFactor;
    const lineWidth = cementTextureScalingFactor;
    canvas.width = size;
    canvas.height = size;
    const canvasCtx = canvas.getContext('2d');

    canvasCtx.fillStyle = firstCementSqueezeColor;
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    canvasCtx.lineWidth = lineWidth;
    canvasCtx.fillStyle = secondCementSqueezeColor;
    canvasCtx.beginPath();

    canvasCtx.setLineDash([20, 10]); // eslint-disable-line no-magic-numbers
    const distanceBetweenLines = size / 12; // eslint-disable-line no-magic-numbers
    for (let i = -canvas.width; i < canvas.width; i++) {
      canvasCtx.moveTo(-canvas.width + distanceBetweenLines * i, -canvas.height);
      canvasCtx.lineTo(canvas.width + distanceBetweenLines * i, canvas.height * 2);
    }
    canvasCtx.stroke();

    this._cementSqueezeTextureCache = Texture.from(canvas);

    return this._cementSqueezeTextureCache;
  }

  getInternalLayerIds(): string[] {
    const { internalLayers } = this.options as CasingAndCementLayerOptions<T>;
    return internalLayers ? [internalLayers.casingId, internalLayers.cementId] : [];
  }

  override setVisibility(isVisible: boolean, layerId: string) {
    if (layerId === this.id) {
      super.setVisibility(isVisible, layerId);
      return;
    }

    const isCement = (this.options as CasingAndCementLayerOptions<T>)?.internalLayers?.cementId === layerId;
    const isCasing = (this.options as CasingAndCementLayerOptions<T>)?.internalLayers?.casingId === layerId;

    if (!isCement && !isCasing) {
      return;
    }

    if (isCement) {
      this.cementVisibility = isVisible;
    }

    if (isCasing) {
      this.casingVisibility = isVisible;
    }

    this.clearLayer();
    this.preRender();
    this.render();
  }
}
