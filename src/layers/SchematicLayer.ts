import { max } from 'd3-array';
import { Point, Rectangle, RENDERER_TYPE, SimpleRope, Texture } from 'pixi.js';
import { CasingShoeSize, PixiRenderApplication } from '.';
import { DEFAULT_TEXTURE_SIZE, EXAGGERATED_DIAMETER, HOLE_OUTLINE, SCREEN_OUTLINE, SHOE_LENGTH, SHOE_WIDTH } from '../constants';
import {
  createComplexRopeSegmentsForCement,
  createComplexRopeSegmentsForCementSqueeze,
  createComplexRopeSegmentsForCementPlug,
  makeTubularPolygon,
} from '../datautils/wellboreItemShapeGenerator';
import {
  Casing,
  Cement,
  Completion,
  foldCompletion,
  HoleSize,
  Tubing,
  Screen,
  CompletionSymbol,
  PAndA,
  PAndASymbol,
  CementSqueeze,
  isCementSqueeze,
  CementPlug,
} from '../interfaces';
import { convertColor } from '../utils/color';
import { createNormals, offsetPoint, offsetPoints } from '../utils/vectorUtils';
import { ComplexRope, ComplexRopeSegment } from './CustomDisplayObjects/ComplexRope';
import { FixedWidthSimpleRope } from './CustomDisplayObjects/FixedWidthSimpleRope';
import { UniformTextureStretchRope } from './CustomDisplayObjects/UniformTextureStretchRope';
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

interface SymbolRenderObject {
  pathPoints: number[][];
  diameter: number;
  symbolKey: string;
}

interface CementShape {
  segments: ComplexRopeSegment[];
  casingIds: string[];
}

interface CementSqueezeShape {
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

interface TubularRenderingObject {
  pathPoints: number[][];
  polygon: Point[];
  leftPath: Point[];
  rightPath: Point[];
  radius: number;
}

const defaultCasingShoeSize: CasingShoeSize = {
  width: SHOE_WIDTH,
  length: SHOE_LENGTH,
};

export interface SchematicData {
  holeSizes: HoleSize[];
  casings: Casing[];
  cements: Cement[];
  completion: Completion[];
  pAndA: PAndA[];
  symbols: {
    [key: string]: string;
  };
}

export interface SchematicLayerOptions<T extends SchematicData> extends WellComponentBaseOptions<T> {
  holeFirstColor?: string;
  holeSecondColor?: string;
  holeLineColor?: number;
  casingSolidColor?: number;
  casingLineColor?: number;
  cementFirstColor?: string;
  cementSecondColor?: string;
  cementSqueezeFirstColor?: string;
  cementSqueezeSecondColor?: string;
  casingShoeSize?: CasingShoeSize;
  cementTextureScalingFactor?: number;
  screenScalingFactor?: number;
  tubingScalingFactor?: number;
  screenLineColor?: number;
  internalLayers?: {
    casingId: string;
    cementId: string;
  };
  firstCementPlugColor?: string;
  secondCementPlugColor?: string;
}

export class SchematicLayer<T extends SchematicData> extends WellboreBaseComponentLayer<T> {
  private casingVisibility = true;
  private cementVisibility = true;

  private cementTextureCache: Texture;
  private cementSqueezeTextureCache: Texture;
  private cementPlugTextureCache: Texture;
  private holeTextureCache: Texture;
  private screenTextureCache: Texture;
  private tubingTextureCache: Texture;
  private textureSymbolCacheArray: { [key: string]: Texture };

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
      cementSqueezeFirstColor: 'rgb(139, 69, 19)',
      cementSqueezeSecondColor: 'rgb(139, 103, 19)',
      screenScalingFactor: 4,
      tubingScalingFactor: 1,
      screenLineColor: 0x63666a,
      firstCementPlugColor: 'rgb(199,185,171)',
      secondCementPlugColor: 'rgb(199,185,171)',
      ...options,
    };
  }

  preRender(): void {
    if (!this.data || !this.rescaleEvent || !this.referenceSystem) {
      return;
    }

    const { holeSizes, casings, cements, completion, symbols, pAndA } = this.data;

    // eslint-disable-next-line max-len
    holeSizes.sort((a: HoleSize, b: HoleSize) => b.diameter - a.diameter); // draw smaller casings and holes inside bigger ones if overlapping
    this.maxDiameter = holeSizes.length > 0 ? max(holeSizes, (d) => d.diameter) : EXAGGERATED_DIAMETER;
    holeSizes.forEach((hole: HoleSize) => this.drawHoleSize(hole));

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

    const cementSqueezes = pAndA.filter(isCementSqueeze);
    const remainingPAndA = pAndA.filter((item: PAndA): boolean => !isCementSqueeze(item)) as Exclude<PAndA, CementSqueeze>[];
    const cementSqueezesShape: CementSqueezeShape[] = cementSqueezes.map((squeeze) => ({
      segments: this.createCementSqueezeShape(squeeze, sortedCasings, holeSizes),
      casingIds: squeeze.casingIds,
    }));

    this.groupCementAndCasingRenderObjects(casingRenderObjects, cementShapes, cementSqueezesShape).forEach(
      ([cementShape, casingRenderObject, squeezes]: [CementShape | undefined, CasingRenderObject, CementSqueezeShape[]]) => {
        if (cementShape) {
          this.cementVisibility && this.drawComplexRope(cementShape.segments, this.createCementTexture());
        }

        squeezes.forEach((squeeze) => {
          this.drawComplexRope(squeeze.segments, this.createCementSqueezeTexture());
        });

        this.casingVisibility && this.drawCasing(casingRenderObject);

        if (casingRenderObject.hasShoe) {
          this.casingVisibility && this.drawShoe(casingRenderObject.bottom, casingRenderObject.radius);
        }
      },
    );

    this.textureSymbolCacheArray = Object.entries(symbols).reduce((list: { [key: string]: Texture }, [key, symbol]: [string, string]) => {
      list[key] = Texture.from(symbol);
      return list;
    }, {});

    completion.forEach(
      foldCompletion(
        (obj: Screen) => this.drawScreen(obj),
        (obj: Tubing) => this.drawTubing(obj),
        (obj: CompletionSymbol) => {
          const symbolRenderObject = this.prepareSymbolRenderObject(obj);
          this.drawSymbolComponent(symbolRenderObject);
        },
      ),
    );

    remainingPAndA.forEach((obj) => {
      if (obj.kind === 'pAndA-symbol') {
        const symbolRenderObject = this.prepareSymbolRenderObject(obj);
        this.drawSymbolComponent(symbolRenderObject);
      }
      if (obj.kind === 'cementPlug') {
        const cementPlugSegments = this.createCementPlugShape(obj, casings, holeSizes);
        this.drawComplexRope(cementPlugSegments, this.createCementPlugTexture());

        const { rightPath, leftPath } = cementPlugSegments.reduce(
          (acc, current) => {
            const pathPoints = current.points.map((p) => [p.x, p.y]);
            const normals = createNormals(pathPoints);
            const rightPath = offsetPoints(pathPoints, normals, current.diameter / 2);
            const leftPath = offsetPoints(pathPoints, normals, -current.diameter / 2);

            return {
              rightPath: [...acc.rightPath, ...rightPath],
              leftPath: [...acc.leftPath, ...leftPath],
            };
          },
          { rightPath: [], leftPath: [] },
        );
        // eslint-disable-next-line no-magic-numbers
        this.drawOutline(leftPath, rightPath, convertColor('black'), 0.25, true);
      }
    });
  }

  private createCementPlugTexture(): Texture {
    if (this.cementPlugTextureCache) {
      return this.cementPlugTextureCache;
    }

    const { firstCementPlugColor, secondCementPlugColor, cementTextureScalingFactor } = this.options as SchematicLayerOptions<T>;

    const canvas = document.createElement('canvas');

    const size = DEFAULT_TEXTURE_SIZE * cementTextureScalingFactor;
    const lineWidth = cementTextureScalingFactor;
    canvas.width = size;
    canvas.height = size;
    const canvasCtx = canvas.getContext('2d');

    canvasCtx.fillStyle = firstCementPlugColor;
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    canvasCtx.lineWidth = lineWidth;
    canvasCtx.fillStyle = secondCementPlugColor;
    canvasCtx.beginPath();

    canvasCtx.setLineDash([20, 10]); // eslint-disable-line no-magic-numbers
    const distanceBetweenLines = size / 12; // eslint-disable-line no-magic-numbers
    for (let i = -canvas.width; i < canvas.width; i++) {
      canvasCtx.moveTo(-canvas.width + distanceBetweenLines * i, -canvas.height);
      canvasCtx.lineTo(canvas.width + distanceBetweenLines * i, canvas.height * 2);
    }
    canvasCtx.stroke();

    this.cementPlugTextureCache = Texture.from(canvas);

    return this.cementPlugTextureCache;
  }

  private createCementPlugShape(plug: CementPlug, casings: Casing[], holes: HoleSize[]): ComplexRopeSegment[] {
    const { exaggerationFactor } = this.options as SchematicLayerOptions<T>;
    return createComplexRopeSegmentsForCementPlug(plug, casings, holes, exaggerationFactor, this.getZFactorScaledPathForPoints);
  }

  private prepareSymbolRenderObject = (component: CompletionSymbol | PAndASymbol): SymbolRenderObject => {
    if (component == null) {
      return;
    }
    const { exaggerationFactor } = this.options as WellComponentBaseOptions<T>;

    const diameter = component.diameter * exaggerationFactor;

    const pathPoints = this.getZFactorScaledPathForPoints(component.start, component.end, [component.start, component.end]);

    return {
      pathPoints: pathPoints.map((d) => d.point),
      diameter,
      symbolKey: component.symbolKey,
    };
  };

  private drawSymbolComponent = (renderObject: SymbolRenderObject): void => {
    const { pathPoints, diameter, symbolKey } = renderObject;

    // Pixi.js-legacy with Canvas render type handles advanced render methods poorly
    if (this.renderType() === RENDERER_TYPE.CANVAS) {
      // TODO implement this
      // this.drawBigPolygon(polygon, solidColor);
    } else {
      const texture = this.createSymbolTexture(symbolKey, diameter);
      this.drawSVGRope(
        pathPoints.map((p) => new Point(p[0], p[1])),
        texture,
      );
    }
  };

  private drawSVGRope(path: Point[], texture: Texture): void {
    if (path.length === 0) {
      return null;
    }

    const rope: UniformTextureStretchRope = new UniformTextureStretchRope(texture, path);

    this.addChild(rope);
  }

  private createSymbolTexture(symbolKey: string, diameter: number): Texture {
    return new Texture(this.textureSymbolCacheArray[symbolKey].baseTexture, null, new Rectangle(0, 0, 0, diameter), null, 2);
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

  private groupCementAndCasingRenderObjects(
    casingRenderObjects: CasingRenderObject[],
    cementShapes: CementShape[],
    cementSqueezes: CementSqueezeShape[],
  ): [CementShape | undefined, CasingRenderObject, CementSqueezeShape[]][] {
    // TODO check if we can type it better here!
    const { tuples } = casingRenderObjects.reduce(
      (acc, casingRenderObject) => {
        const foundCementShape = acc.remainingCement.find((cement) => cement.casingIds.includes(casingRenderObject.casingId));
        const foundCementSqueezes = acc.remainingCementSqueezes.filter((squeeze) => squeeze.casingIds.includes(casingRenderObject.casingId));
        return {
          tuples: [...acc.tuples, [foundCementShape, casingRenderObject, foundCementSqueezes]],
          remainingCement: acc.remainingCement.filter((c) => c !== foundCementShape),
          remainingCementSqueezes: acc.remainingCementSqueezes.filter((squeeze) => !foundCementSqueezes.includes(squeeze)),
        };
      },
      { tuples: [], remainingCement: cementShapes, remainingCementSqueezes: cementSqueezes },
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

  createCementSqueezeShape = (squeeze: CementSqueeze, casings: Casing[], holes: HoleSize[]): ComplexRopeSegment[] => {
    const { exaggerationFactor } = this.options as SchematicLayerOptions<T>;
    return createComplexRopeSegmentsForCementSqueeze(squeeze, casings, holes, exaggerationFactor, this.getZFactorScaledPathForPoints);
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

  private createCementSqueezeTexture(): Texture {
    if (this.cementSqueezeTextureCache) {
      return this.cementSqueezeTextureCache;
    }

    const { cementSqueezeFirstColor, cementSqueezeSecondColor, cementTextureScalingFactor } = this.options as SchematicLayerOptions<T>;

    const canvas = document.createElement('canvas');

    const size = DEFAULT_TEXTURE_SIZE * cementTextureScalingFactor;
    const lineWidth = cementTextureScalingFactor;
    canvas.width = size;
    canvas.height = size;
    const canvasCtx = canvas.getContext('2d');

    canvasCtx.fillStyle = cementSqueezeFirstColor;
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    canvasCtx.lineWidth = lineWidth;
    canvasCtx.fillStyle = cementSqueezeSecondColor;
    canvasCtx.beginPath();

    canvasCtx.setLineDash([20, 10]); // eslint-disable-line no-magic-numbers
    const distanceBetweenLines = size / 12; // eslint-disable-line no-magic-numbers
    for (let i = -canvas.width; i < canvas.width; i++) {
      canvasCtx.moveTo(-canvas.width + distanceBetweenLines * i, -canvas.height);
      canvasCtx.lineTo(canvas.width + distanceBetweenLines * i, canvas.height * 2);
    }
    canvasCtx.stroke();

    this.cementSqueezeTextureCache = Texture.from(canvas);

    return this.cementSqueezeTextureCache;
  }

  private drawScreen(screen: Screen): void {
    const { exaggerationFactor, screenLineColor } = this.options as SchematicLayerOptions<T>;

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
    this.drawOutline(leftPath, rightPath, screenLineColor, SCREEN_OUTLINE * exaggerationFactor, false);
  }

  private drawTubing(tubing: Tubing): void {
    const texture = this.createTubingTexture();
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

    const { exaggerationFactor } = this.options as SchematicLayerOptions<T>;

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

  private createTubingTexture(): Texture {
    const { tubingScalingFactor } = this.options as SchematicLayerOptions<T>;
    const innerColor = '#EEEEFF';
    const outerColor = '#777788';

    if (!this.tubingTextureCache) {
      const size = DEFAULT_TEXTURE_SIZE * tubingScalingFactor;

      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const canvasCtx = canvas.getContext('2d');
      if (canvasCtx instanceof CanvasRenderingContext2D) {
        const gradient = canvasCtx.createLinearGradient(0, 0, 0, size);

        const innerColorStart = 0.3;
        const innerColorEnd = 0.7;
        gradient.addColorStop(0, outerColor);
        gradient.addColorStop(innerColorStart, innerColor);
        gradient.addColorStop(innerColorEnd, innerColor);
        gradient.addColorStop(1, outerColor);

        canvasCtx.fillStyle = gradient;
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        this.tubingTextureCache = Texture.from(canvas);
      }
    }
    return this.tubingTextureCache;
  }

  private createScreenTexture(): Texture {
    const { screenScalingFactor } = this.options as SchematicLayerOptions<T>;

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

    const { exaggerationFactor } = this.options as SchematicLayerOptions<T>;

    const rope: FixedWidthSimpleRope = new FixedWidthSimpleRope(texture, path, diameter, exaggerationFactor);
    this.addChild(rope);
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
