import { max } from 'd3-array';
import { IPoint, Point, Rectangle, RENDERER_TYPE, SimpleRope, Texture } from 'pixi.js';
import { PixiRenderApplication } from '.';
import { DEFAULT_TEXTURE_SIZE, EXAGGERATED_DIAMETER, HOLE_OUTLINE, SCREEN_OUTLINE, SHOE_LENGTH, SHOE_WIDTH } from '../constants';
import {
  CasingRenderObject,
  createCementTexture,
  createComplexRopeSegmentsForCement,
  createComplexRopeSegmentsForCementSqueeze,
  createComplexRopeSegmentsForCementPlug,
  createHoleBaseTexture,
  createScreenTexture,
  createTubingTexture,
  createTubularRenderingObject,
  makeTubularPolygon,
  prepareCasingRenderObject,
  createCementPlugTexture,
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
  isCementSqueeze,
  CementPlug,
  CementSqueeze,
  OnUnmountEvent,
  isPAndASymbol,
  isCementPlug,
} from '../interfaces';
import { convertColor } from '../utils/color';
import { createNormals, offsetPoint, offsetPoints } from '../utils/vectorUtils';
import { ComplexRope, ComplexRopeSegment } from './CustomDisplayObjects/ComplexRope';
import { FixedWidthSimpleRope } from './CustomDisplayObjects/FixedWidthSimpleRope';
import { UniformTextureStretchRope } from './CustomDisplayObjects/UniformTextureStretchRope';
import { WellboreBaseComponentLayer, WellComponentBaseOptions } from './WellboreBaseComponentLayer';

interface SymbolRenderObject {
  pathPoints: number[][];
  referenceDiameter: number;
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
export interface CasingShoeSize {
  width: number;
  length: number;
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
  tubingInnerColor?: string;
  tubingOuterColor?: string;
  screenLineColor?: number;
  internalLayers?: {
    casingId: string;
    cementId: string;
  };
  cementPlugFirstColor?: string;
  cementPlugCecondColor?: string;
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

  private maxHoleDiameter: number;

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
      tubingInnerColor: '#EEEEFF',
      tubingOuterColor: '#777788',
      screenLineColor: 0x63666a,
      cementPlugFirstColor: 'rgb(199,185,171)',
      cementPlugCecondColor: 'rgb(199,185,171)',
      ...options,
    };
  }

  onUnmount(event?: OnUnmountEvent): void {
    super.onUnmount(event);
    this.cementTextureCache = null;
    this.cementSqueezeTextureCache = null;
    this.holeTextureCache = null;
    this.screenTextureCache = null;
    this.tubingTextureCache = null;
    this.textureSymbolCacheArray = null;
  }

  preRender(): void {
    if (!this.data || !this.referenceSystem) {
      return;
    }

    const { exaggerationFactor } = this.options as SchematicLayerOptions<T>;
    const { holeSizes, casings, cements, completion, symbols, pAndA } = this.data;

    this.textureSymbolCacheArray = Object.entries(symbols).reduce((list: { [key: string]: Texture }, [key, symbol]: [string, string]) => {
      list[key] = Texture.from(symbol);
      return list;
    }, {});

    holeSizes.sort((a: HoleSize, b: HoleSize) => b.diameter - a.diameter);
    this.maxHoleDiameter = holeSizes.length > 0 ? max(holeSizes, (d) => d.diameter) * exaggerationFactor : EXAGGERATED_DIAMETER * exaggerationFactor;
    holeSizes.forEach((hole: HoleSize) => this.drawHoleSize(hole));

    const sortedCasings = casings.sort((a: Casing, b: Casing) => b.diameter - a.diameter);
    const casingRenderObjects: CasingRenderObject[] = sortedCasings.map((casing: Casing) =>
      prepareCasingRenderObject(exaggerationFactor, casing, this.getZFactorScaledPathForPoints(casing.start, casing.end)),
    );

    const cementShapes: CementShape[] = cements.map(
      (cement: Cement): CementShape => ({
        segments: this.createCementShape(cement, sortedCasings, holeSizes),
        casingIds: [cement.casingId, ...(cement.casingIds || [])].filter((id) => id),
      }),
    );

    const [cementSqueezes, remainingPAndA] = pAndA.reduce(
      ([squeezes, remaining], current: PAndA) =>
        isCementSqueeze(current) ? [[current, ...squeezes], remaining] : [squeezes, [current, ...remaining]],
      <[CementSqueeze[], Exclude<PAndA, CementSqueeze>[]]>[[], []],
    );

    const cementSqueezesShape: CementSqueezeShape[] = cementSqueezes.map((squeeze) => ({
      segments: this.createCementSqueezeShape(squeeze, sortedCasings, holeSizes),
      casingIds: squeeze.casingIds,
    }));

    this.groupCementAndCasingRenderObjects(casingRenderObjects, cementShapes, cementSqueezesShape).forEach(
      ([cementShape, casingRenderObject, squeezes]: [CementShape | undefined, CasingRenderObject, CementSqueezeShape[]]) => {
        if (cementShape) {
          this.cementVisibility && this.drawComplexRope(cementShape.segments, this.getCementTexture());
        }

        squeezes.forEach((squeeze) => {
          this.drawComplexRope(squeeze.segments, this.createCementSqueezeTexture());
        });

        this.casingVisibility && this.drawCasing(casingRenderObject);

        if (casingRenderObject.hasShoe) {
          this.casingVisibility && this.drawShoe(casingRenderObject.bottom, casingRenderObject.referenceRadius);
        }
      },
    );

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
      if (isPAndASymbol(obj)) {
        const symbolRenderObject = this.prepareSymbolRenderObject(obj);
        this.drawSymbolComponent(symbolRenderObject);
      }
      if (isCementPlug(obj)) {
        const cementPlugSegments = this.createCementPlugShape(obj, casings, holeSizes);
        this.drawComplexRope(cementPlugSegments, this.getCementPlugTexture());

        const { rightPath, leftPath } = cementPlugSegments.reduce(
          (acc, current) => {
            const pathPoints = current.points.map<[number, number]>((p: IPoint) => [p.x, p.y]);
            const { leftPath, rightPath } = createTubularRenderingObject(current.diameter, pathPoints);

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

  private getCementPlugTexture(): Texture {
    if (!this.cementPlugTextureCache) {
      const { cementPlugFirstColor, cementPlugCecondColor, cementTextureScalingFactor } = this.options as SchematicLayerOptions<T>;
      this.cementPlugTextureCache = createCementPlugTexture(cementPlugFirstColor, cementPlugCecondColor, cementTextureScalingFactor);
    }

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

    const exaggeratedDiameter = component.diameter * exaggerationFactor;

    const pathPoints = this.getZFactorScaledPathForPoints(component.start, component.end);

    return {
      pathPoints,
      referenceDiameter: exaggeratedDiameter,
      symbolKey: component.symbolKey,
    };
  };

  private drawSymbolComponent = (renderObject: SymbolRenderObject): void => {
    const { pathPoints, referenceDiameter: diameter, symbolKey } = renderObject;

    // Pixi.js-legacy with Canvas render type handles advanced render methods poorly
    if (this.renderType() === RENDERER_TYPE.CANVAS) {
      // TODO implement this
      // this.drawBigPolygon(polygon, solidColor);
    } else {
      const texture = this.getSymbolTexture(symbolKey, diameter);
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

  private getSymbolTexture(symbolKey: string, diameter: number): Texture {
    return new Texture(this.textureSymbolCacheArray[symbolKey].baseTexture, null, new Rectangle(0, 0, 0, diameter), null, 2);
  }

  private drawHoleSize = (holeObject: HoleSize): void => {
    if (holeObject == null) {
      return;
    }

    const pathPoints = this.getZFactorScaledPathForPoints(holeObject.start, holeObject.end);
    if (pathPoints.length === 0) {
      return;
    }

    const { exaggerationFactor, holeFirstColor, holeLineColor } = this.options as SchematicLayerOptions<T>;
    const diameter = holeObject.diameter * exaggerationFactor;
    const { rightPath, leftPath, referenceDiameter } = createTubularRenderingObject(diameter, pathPoints);

    if (this.renderType() === RENDERER_TYPE.CANVAS) {
      const polygonCoords = makeTubularPolygon(leftPath, rightPath);
      this.drawBigPolygon(polygonCoords, convertColor(holeFirstColor));
    } else {
      const texture = this.getHoleTexture(referenceDiameter);
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

    const rope: SimpleRope = new SimpleRope(texture, path, this.maxHoleDiameter / DEFAULT_TEXTURE_SIZE);

    rope.tint = tint || rope.tint;

    this.addChild(rope);
  }

  private getHoleTexture(diameter: number): Texture {
    const { holeFirstColor, holeSecondColor } = this.options as SchematicLayerOptions<T>;   

    const size = DEFAULT_TEXTURE_SIZE
    const height = size
    const width = size;

    const textureDiameter = (diameter / this.maxHoleDiameter) * size

    if (!this.holeTextureCache) {
      this.holeTextureCache = createHoleBaseTexture(holeFirstColor, holeSecondColor, width, height);
    }

    const baseTexture = this.holeTextureCache.baseTexture;
    const sidePadding = (height - textureDiameter) / 2;
    const frame = new Rectangle(0, sidePadding, width, textureDiameter);
    const texture = new Texture(baseTexture, frame);

    return texture;
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

  private drawComplexRope(intervals: ComplexRopeSegment[], texture: Texture): void {
    if (intervals.length === 0) {
      return null;
    }
    const { exaggerationFactor } = this.options as SchematicLayerOptions<T>;

    const rope = new ComplexRope(texture, intervals, exaggerationFactor);

    this.addChild(rope);
  }

  private drawCasing = (casingRenderObject: CasingRenderObject): void => {
    const { casingLineColor, casingSolidColor } = this.options as SchematicLayerOptions<T>;
    const { pathPoints, polygon, leftPath, rightPath, referenceDiameter, casingWallWidth } = casingRenderObject;

    // Pixi.js-legacy handles SimpleRope and advanced render methods poorly
    if (this.renderType() === RENDERER_TYPE.CANVAS) {
      this.drawBigPolygon(polygon, casingSolidColor);
    } else {
      const texture = this.createCasingTexture(referenceDiameter);
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

    const points = this.getZFactorScaledPathForPoints(start, end);

    const normal = createNormals(points);
    const shoeEdge: Point[] = offsetPoints(points, normal, casingRadius * (width < 0 ? -1 : 1));

    const shoeTipPoint = points[points.length - 1];
    const shoeTipNormal = normal[normal.length - 1];
    const shoeTip: Point = offsetPoint(shoeTipPoint, shoeTipNormal, width + casingRadius * (width < 0 ? -1 : 1));

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

  private getCementTexture(): Texture {
    if (!this.cementTextureCache) {
      const { cementFirstColor, cementSecondColor, cementTextureScalingFactor } = this.options as SchematicLayerOptions<T>;
      this.cementTextureCache = createCementTexture(cementFirstColor, cementSecondColor, cementTextureScalingFactor);
    }

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

  private drawScreen({ start, end, diameter }: Screen): void {
    const { exaggerationFactor, screenLineColor } = this.options as SchematicLayerOptions<T>;
    const exaggeratedDiameter = exaggerationFactor * diameter;

    const pathPoints = this.getZFactorScaledPathForPoints(start, end);
    const { leftPath, rightPath, referenceDiameter } = createTubularRenderingObject(exaggeratedDiameter, pathPoints);
    const polygon = makeTubularPolygon(leftPath, rightPath);

    const texture = this.getScreenTexture();
    if (this.renderType() === RENDERER_TYPE.CANVAS) {
      this.drawBigTexturedPolygon(polygon, texture);
    } else {
      this.drawCompletionRope(
        pathPoints.map((p) => new Point(p[0], p[1])),
        texture,
        referenceDiameter,
      );
    }
    this.drawOutline(leftPath, rightPath, screenLineColor, SCREEN_OUTLINE * exaggerationFactor, false);
  }

  private drawTubing({ diameter, start, end }: Tubing): void {
    const { exaggerationFactor } = this.options as SchematicLayerOptions<T>;
    const exaggeratedDiameter = exaggerationFactor * diameter;

    const pathPoints = this.getZFactorScaledPathForPoints(start, end);
    const { leftPath, rightPath, referenceDiameter } = createTubularRenderingObject(exaggeratedDiameter, pathPoints);
    const polygon = makeTubularPolygon(leftPath, rightPath);

    const texture = this.getTubingTexture();
    if (this.renderType() === RENDERER_TYPE.CANVAS) {
      this.drawBigTexturedPolygon(polygon, texture);
    } else {
      this.drawCompletionRope(
        pathPoints.map((p) => new Point(p[0], p[1])),
        texture,
        referenceDiameter,
      );
    }
  }

  private getTubingTexture(): Texture {
    if (!this.tubingTextureCache) {
      const { tubingScalingFactor, tubingInnerColor, tubingOuterColor } = this.options as SchematicLayerOptions<T>;
      this.tubingTextureCache = createTubingTexture(tubingInnerColor, tubingOuterColor, tubingScalingFactor);
    }
    return this.tubingTextureCache;
  }

  private getScreenTexture(): Texture {
    if (!this.screenTextureCache) {
      const { screenScalingFactor } = this.options as SchematicLayerOptions<T>;
      this.screenTextureCache = createScreenTexture(screenScalingFactor);
    }
    return this.screenTextureCache;
  }

  private drawCompletionRope(path: Point[], texture: Texture, diameter: number): void {
    if (path.length === 0) {
      return;
    }

    const rope: FixedWidthSimpleRope = new FixedWidthSimpleRope(texture, path, diameter);
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
