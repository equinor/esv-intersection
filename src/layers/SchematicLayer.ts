import { max } from 'd3-array';
import { Point, Rectangle, RENDERER_TYPE, SimpleRope, Texture } from 'pixi.js';
import { CasingShoeSize, PixiRenderApplication } from '.';
import { DEFAULT_TEXTURE_SIZE, EXAGGERATED_DIAMETER, HOLE_OUTLINE, SHOE_LENGTH, SHOE_WIDTH } from '../constants';
import { createComplexRopeSegmentsForCement, makeTubularPolygon } from '../datautils/wellboreItemShapeGenerator';
import { Casing, Cement, HoleSize } from '../interfaces';
import { convertColor } from '../utils/color';
import { createNormals, offsetPoint, offsetPoints } from '../utils/vectorUtils';
import { ComplexRope, ComplexRopeSegment } from './CustomDisplayObjects/ComplexRope';
import { WellboreBaseComponentLayer, WellComponentBaseOptions } from './WellboreBaseComponentLayer';

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

interface CementShape {
  segments: ComplexRopeSegment[];
  casingIds: string[];
}

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

export interface SchematicData {
  holeSizes: HoleSize[];
  casings: Casing[];
  cements: Cement[];
}

export interface SchematicLayerOptions<T extends SchematicData> extends WellComponentBaseOptions<T> {
  holeFirstColor?: string;
  holeSecondColor?: string;
  holeLineColor?: number;
  casingSolidColor?: number;
  casingLineColor?: number;
  cementFirstColor?: string;
  cementSecondColor?: string;
  casingShoeSize?: CasingShoeSize;
  cementTextureScalingFactor?: number;
  internalLayers?: {
    casingId: string;
    cementId: string;
  };
}

export class SchematicLayer<T extends SchematicData> extends WellboreBaseComponentLayer<T> {
  private casingVisibility = true;
  private cementVisibility = true;
  private cementTextureCache: Texture;
  private holeTextureCache: Texture;

  private maxDiameter: number;

  constructor(ctx: PixiRenderApplication, id?: string, options?: SchematicLayerOptions<T>) {
    super(ctx, id, options);
    this.options = {
      ...this.options,
      holeFirstColor: '#8c541d',
      holeSecondColor: '#eee3d8',
      holeLineColor: 0x8b4513,
      casingSolidColor: 0xdcdcdc,
      casingLineColor: 0x575757,
      casingShoeSize: defaultCasingShoeSize,
      cementTextureScalingFactor: 4,
      cementFirstColor: '#c7b9ab',
      cementSecondColor: '#5b5b5b',
      ...options,
    };
  }

  preRender(): void {
    if (!this.data || !this.rescaleEvent || !this.referenceSystem) {
      return;
    }

    const { holeSizes, casings, cements } = this.data;

    // eslint-disable-next-line max-len
    holeSizes.sort((a: HoleSize, b: HoleSize) => b.diameter - a.diameter); // draw smaller casings and holes inside bigger ones if overlapping
    this.maxDiameter = holeSizes.length > 0 ? max(holeSizes, (d) => d.diameter) : EXAGGERATED_DIAMETER;
    holeSizes.forEach((hole: HoleSize) => this.drawHoleSize(hole));

    const sortedCasings = casings.sort((a: Casing, b: Casing) => b.diameter - a.diameter);
    const casingRenderObjects: CasingRenderObject[] = sortedCasings.map(this.prepareCasingRenderObject);
    const cementShapes: CementShape[] = cements.map(
      (cement: Cement): CementShape => ({
        segments: this.createCementShape(cement, sortedCasings, holeSizes),
        casingIds: [cement.casingId, ...(cement.casingIds || [])].filter((id) => id),
      }),
    );

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
  }

  private drawHoleSize = (holeObject: HoleSize): void => {
    if (holeObject == null) {
      return;
    }

    const { exaggerationFactor, holeFirstColor, holeLineColor } = this.options as SchematicLayerOptions<T>;

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
      this.drawBigPolygon(polygonCoords, convertColor(holeFirstColor));
    } else {
      const texture = this.createHoleTexture(diameter);
      this.drawHoleRope(
        pathPoints.map((p) => new Point(p[0], p[1])),
        texture,
      );
    }

    this.drawOutline(leftPath, rightPath, holeLineColor, HOLE_OUTLINE * exaggerationFactor, false, 0);
  };

  private drawHoleRope(path: Point[], texture: Texture, tint?: number): void {
    if (path.length === 0) {
      return null;
    }

    const { exaggerationFactor } = this.options as SchematicLayerOptions<T>;

    const rope: SimpleRope = new SimpleRope(texture, path, exaggerationFactor);

    rope.tint = tint || rope.tint;

    this.addChild(rope);
  }

  private createHoleTexture(diameter: number): Texture {
    const { exaggerationFactor } = this.options as SchematicLayerOptions<T>;

    const exaggeratedDiameter = diameter / exaggerationFactor;
    const height = this.maxDiameter;
    const width = 16;

    if (!this.holeTextureCache) {
      this.holeTextureCache = this.createHoleBaseTexture(width, height);
    }

    const baseTexture = this.holeTextureCache.baseTexture;
    const sidePadding = (height - exaggeratedDiameter) / 2;
    const frame = new Rectangle(0, sidePadding, width, exaggeratedDiameter);
    const texture = new Texture(baseTexture, frame);

    return texture;
  }

  private createHoleBaseTexture(width: number, height: number): Texture {
    const { holeFirstColor, holeSecondColor } = this.options as SchematicLayerOptions<T>;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const canvasCtx = canvas.getContext('2d');

    canvasCtx.fillStyle = createGradientFill(canvas, canvasCtx, holeFirstColor, holeSecondColor, 0);
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    return Texture.from(canvas);
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
    const { exaggerationFactor } = this.options as SchematicLayerOptions<T>;

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

  private drawComplexRope(intervals: ComplexRopeSegment[], texture: Texture): void {
    if (intervals.length === 0) {
      return null;
    }
    const { exaggerationFactor } = this.options as SchematicLayerOptions<T>;

    const rope = new ComplexRope(texture, intervals, exaggerationFactor);

    this.addChild(rope);
  }

  private drawCasing = (zippedRenderObject: CasingRenderObject): void => {
    const { casingLineColor, casingSolidColor } = this.options as SchematicLayerOptions<T>;
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
    const { exaggerationFactor, casingShoeSize } = this.options as SchematicLayerOptions<T>;
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

  private createCementShape = (cement: Cement, casings: Casing[], holes: HoleSize[]): ComplexRopeSegment[] => {
    const { exaggerationFactor } = this.options as SchematicLayerOptions<T>;
    return createComplexRopeSegmentsForCement(cement, casings, holes, exaggerationFactor, this.getZFactorScaledPathForPoints);
  };

  private createCementTexture(): Texture {
    if (this.cementTextureCache) {
      return this.cementTextureCache;
    }

    const { cementFirstColor, cementSecondColor, cementTextureScalingFactor } = this.options as SchematicLayerOptions<T>;

    const canvas = document.createElement('canvas');

    const size = DEFAULT_TEXTURE_SIZE * cementTextureScalingFactor;
    const lineWidth = cementTextureScalingFactor;
    canvas.width = size;
    canvas.height = size;
    const canvasCtx = canvas.getContext('2d');

    canvasCtx.fillStyle = cementFirstColor;
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    canvasCtx.lineWidth = lineWidth;
    canvasCtx.fillStyle = cementSecondColor;
    canvasCtx.beginPath();

    const distanceBetweenLines = size / 12; // eslint-disable-line no-magic-numbers
    for (let i = -canvas.width; i < canvas.width; i++) {
      canvasCtx.moveTo(-canvas.width + distanceBetweenLines * i, -canvas.height);
      canvasCtx.lineTo(canvas.width + distanceBetweenLines * i, canvas.height);
    }
    canvasCtx.stroke();

    this.cementTextureCache = Texture.from(canvas);

    return this.cementTextureCache;
  }

  getInternalLayerIds(): string[] {
    const { internalLayers } = this.options as SchematicLayerOptions<T>;
    return internalLayers ? [internalLayers.casingId, internalLayers.cementId] : [];
  }

  override setVisibility(isVisible: boolean, layerId: string) {
    if (layerId === this.id) {
      super.setVisibility(isVisible, layerId);
      return;
    }

    const isCement = (this.options as SchematicLayerOptions<T>)?.internalLayers?.cementId === layerId;
    const isCasing = (this.options as SchematicLayerOptions<T>)?.internalLayers?.casingId === layerId;

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
