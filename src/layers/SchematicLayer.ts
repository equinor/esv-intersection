import { max } from 'd3-array';
import { scaleLinear, ScaleLinear } from 'd3-scale';
import { Graphics, groupD8, IPoint, Point, Rectangle, RENDERER_TYPE, SimpleRope, Texture } from 'pixi.js';
import { DashLine } from 'pixi-dashed-line';
import { LayerOptions, PixiLayer, PixiRenderApplication } from '.';
import { DEFAULT_TEXTURE_SIZE, EXAGGERATED_DIAMETER, HOLE_OUTLINE, SCREEN_OUTLINE } from '../constants';
import {
  assertNever,
  Casing,
  CasingOptions,
  Cement,
  CementOptions,
  CementPlugOptions,
  CementSqueeze,
  CementSqueezeOptions,
  foldCompletion,
  HoleOptions,
  HoleSize,
  isCementSqueeze,
  PAndA,
  SchematicData,
  ScreenOptions,
  TubingOptions,
  Screen,
  Tubing,
  CompletionSymbol,
  isPAndASymbol,
  isCementPlug,
  CementPlug,
  PAndASymbol,
  InternalLayerOptions,
  defaultHoleOptions,
  defaultCasingOptions,
  defaultCementOptions,
  defaultCementSqueezeOptions,
  defaultCementPlugOptions,
  defaultScreenOptions,
  defaultTubingOptions,
  defaultInternalLayerOptions,
  Perforation,
  shouldPerforationStartAtHoleDiameter,
  shouldPerforationStartAtCasingDiameter,
  PerforationOptions,
  defaultPerforationOptions,
  Completion,
  OutlineClosure,
} from './schematicInterfaces';
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
  createComplexRopeSegmentsForPerforation,
  createPerforationTexture,
  PerforationShape,
  createCementSqueezeTexture,
} from '../datautils/schematicShapeGenerator';
import { OnUpdateEvent, OnRescaleEvent, OnUnmountEvent } from '../interfaces';
import { convertColor } from '../utils/color';
import { createNormals, offsetPoint, offsetPoints } from '../utils/vectorUtils';
import { ComplexRope, ComplexRopeSegment } from './CustomDisplayObjects/ComplexRope';
import { FixedWidthSimpleRope } from './CustomDisplayObjects/FixedWidthSimpleRope';
import { UniformTextureStretchRope } from './CustomDisplayObjects/UniformTextureStretchRope';

interface ScalingFactors {
  height: number;
  zFactor: number;
  yScale: ScaleLinear<number, number, never>;
}

interface SymbolRenderObject {
  pathPoints: Point[];
  referenceDiameter: number;
  symbolKey: string;
}

interface CementRenderObject {
  kind: 'cement';
  segments: ComplexRopeSegment[];
  casingIds: string[];
  zIndex?: number;
}

interface CementSqueezeRenderObject {
  kind: 'cementSqueeze';
  segments: ComplexRopeSegment[];
  casingIds: string[];
  zIndex?: number;
}

type InterlacedRenderObjects = CasingRenderObject | CementRenderObject | CementSqueezeRenderObject;

const foldInterlacedRenderObjects =
  <T>(fCasing: (obj: CasingRenderObject) => T, fCement: (obj: CementRenderObject) => T, fCementSqueeze: (obj: CementSqueezeRenderObject) => T) =>
  (renderObject: InterlacedRenderObjects): T => {
    switch (renderObject.kind) {
      case 'casing':
        return fCasing(renderObject);
      case 'cement':
        return fCement(renderObject);
      case 'cementSqueeze':
        return fCementSqueeze(renderObject);
      default:
        return assertNever(renderObject);
    }
  };

export interface SchematicLayerOptions<T extends SchematicData> extends LayerOptions<T> {
  exaggerationFactor?: number;
  internalLayerOptions?: InternalLayerOptions;
  holeOptions?: HoleOptions;
  casingOptions?: CasingOptions;
  cementOptions?: CementOptions;
  cementSqueezeOptions?: CementSqueezeOptions;
  screenOptions?: ScreenOptions;
  tubingOptions?: TubingOptions;
  cementPlugOptions?: CementPlugOptions;
  perforationOptions?: PerforationOptions;
}

const defaultSchematicLayerOptions = (layerId: string): SchematicLayerOptions<SchematicData> => ({
  exaggerationFactor: 2,
  internalLayerOptions: defaultInternalLayerOptions(layerId),
  holeOptions: defaultHoleOptions,
  casingOptions: defaultCasingOptions,
  cementOptions: defaultCementOptions,
  cementSqueezeOptions: defaultCementSqueezeOptions,
  screenOptions: defaultScreenOptions,
  tubingOptions: defaultTubingOptions,
  cementPlugOptions: defaultCementPlugOptions,
  perforationOptions: defaultPerforationOptions,
});

type InternalLayerVisibility = { [K in keyof InternalLayerOptions]: boolean };

export class SchematicLayer<T extends SchematicData> extends PixiLayer<T> {
  private internalLayerVisibility: InternalLayerVisibility = {
    holeLayerId: true,
    casingLayerId: true,
    completionLayerId: true,
    cementLayerId: true,
    pAndALayerId: true,
    perforationLayerId: true,
  };

  private cementTextureCache: Texture;
  private cementSqueezeTextureCache: Texture;
  private cementPlugTextureCache: Texture;
  private holeTextureCache: Texture;
  private screenTextureCache: Texture;
  private tubingTextureCache: Texture;
  private textureSymbolCacheArray: { [key: string]: Texture };

  protected scalingFactors: ScalingFactors = {
    height: 600,
    zFactor: 1,
    yScale: scaleLinear(),
  };

  constructor(ctx: PixiRenderApplication, id?: string, options?: SchematicLayerOptions<T>) {
    super(ctx, id, options);
    this.options = <SchematicLayerOptions<T>>{
      ...this.options,
      ...defaultSchematicLayerOptions(this.id),
      ...options,
    };
  }

  public onUnmount(event?: OnUnmountEvent): void {
    super.onUnmount(event);
    this.scalingFactors = null;
    this.cementTextureCache = null;
    this.cementSqueezeTextureCache = null;
    this.holeTextureCache = null;
    this.screenTextureCache = null;
    this.tubingTextureCache = null;
    this.textureSymbolCacheArray = null;
    this.internalLayerVisibility = null;
  }

  public onUpdate(event: OnUpdateEvent<T>): void {
    super.onUpdate(event);
    this.clearLayer();
    this.preRender();
    this.render();
  }

  public override onRescale(event: OnRescaleEvent): void {
    const shouldRecalculate = this.scalingFactors.zFactor !== event.zFactor;

    this.scalingFactors = { height: event.height, zFactor: event.zFactor, yScale: event.yScale };
    super.optionsRescale(event);
    const yRatio = this.yRatio();
    const flippedX = event.xBounds[0] > event.xBounds[1];
    const flippedY = event.yBounds[0] > event.yBounds[1];
    this.setContainerPosition(event.xScale(0), event.yScale(0));
    this.setContainerScale(event.xRatio * (flippedX ? -1 : 1), yRatio * (flippedY ? -1 : 1));
    if (shouldRecalculate) {
      this.clearLayer();
      this.preRender();
    }

    this.render();
  }

  public override setVisibility(isVisible: boolean, layerId: string) {
    if (layerId === this.id) {
      super.setVisibility(isVisible, layerId);
      return;
    }

    const { internalLayerOptions } = this.options as SchematicLayerOptions<T>;

    const [keyFound] = Object.entries(internalLayerOptions).find(([_key, id]: [string, string]) => id === layerId);
    if (keyFound) {
      this.internalLayerVisibility[keyFound as keyof InternalLayerVisibility] = isVisible;
      this.clearLayer();
      this.preRender();
      this.render();
    }
  }

  public override getInternalLayerIds(): string[] {
    const { internalLayerOptions } = this.options as SchematicLayerOptions<T>;
    return Object.values(internalLayerOptions);
  }

  /**
   * Calculate yRatio without zFactor
   * TODO consider to move this into ZoomPanHandler
   */
  protected yRatio(): number {
    const domain = this.scalingFactors.yScale.domain();
    const ySpan = domain[1] - domain[0];
    const baseYSpan = ySpan * this.scalingFactors.zFactor;
    const baseDomain = [domain[0], domain[0] + baseYSpan];
    return Math.abs(this.scalingFactors.height / (baseDomain[1] - baseDomain[0]));
  }

  protected getZFactorScaledPathForPoints = (start: number, end: number): Point[] => {
    const y = (y: number): number => y * this.scalingFactors.zFactor;

    const path = this.referenceSystem.getCurtainPath(start, end, true);
    return path.map((p) => new Point(p.point[0], y(p.point[1])));
  };

  protected drawBigPolygon = (coords: IPoint[], color = 0x000000) => {
    const polygon = new Graphics();
    polygon.beginFill(color);
    polygon.drawPolygon(coords);
    polygon.endFill();

    this.addChild(polygon);
  };

  protected drawBigTexturedPolygon = (coords: Point[], t: Texture): Graphics => {
    const polygon = new Graphics().beginTextureFill({ texture: t }).drawPolygon(coords).endFill();
    this.addChild(polygon);
    return polygon;
  };

  protected drawRope(path: Point[], texture: Texture, tint?: number): void {
    if (path.length === 0) {
      return null;
    }

    const rope: SimpleRope = new SimpleRope(texture, path, 1);

    rope.tint = tint || rope.tint;

    this.addChild(rope);
  }

  /**
   *
   * @param leftPath Points for line on left side
   * @param rightPath Points for line on right side
   * @param lineColor Color of line
   * @param lineWidth Width of line
   * @param outlineClosure If line should be drawn at top and/or bottom of the paths
   * @param lineAlignment alignment of the line to draw, (0 = inner, 0.5 = middle, 1 = outer).
   */
  protected drawOutline(
    leftPath: Point[],
    rightPath: Point[],
    lineColor: number,
    lineWidth = 1,
    outlineClosure: OutlineClosure = 'None',
    lineAlignment = 1,
  ): void {
    const leftPathReverse = leftPath.map<Point>((d) => d.clone()).reverse();

    const startPointRight = rightPath[0];
    const startPointLeft = leftPathReverse[0];

    const line = new Graphics();
    line.lineStyle(lineWidth, lineColor, undefined, lineAlignment);
    line.moveTo(startPointRight.x, startPointRight.y);
    rightPath.forEach((p: Point) => line.lineTo(p.x, p.y));

    if (outlineClosure === 'None' || outlineClosure === 'Top') {
      line.moveTo(startPointLeft.x, startPointLeft.y);
    }

    leftPathReverse.forEach((p: Point) => line.lineTo(p.x, p.y));

    if (outlineClosure === 'TopAndBottom' || outlineClosure === 'Top') {
      line.lineTo(startPointRight.x, startPointRight.y);
    }

    this.addChild(line);
  }

  /**
   * Uses a dashed outline on one side to represent casing window
   * The casing window should be visualized at the upper side of the wellbore path
   * @param leftPath Points for line on left side
   * @param pointPath Points for line on right side
   * @param lineColor Color of line
   * @param lineWidth Width of line
   * @param lineAlignment alignment of the line to draw, (0 = inner, 0.5 = middle, 1 = outer).
   */
  protected drawCasingWindowOutline(leftPath: Point[], rightPath: Point[], { lineColor, windowOptions }: CasingOptions, lineWidth = 1): void {
    // Correct the dashed path. Should always be displayed on the upper side of the wellbore path.
    const flippedPaths = !!this.referenceSystem?.options?.calculateDisplacementFromBottom;
    const [linePath, dashedPath] = flippedPaths ? [leftPath, rightPath] : [rightPath, leftPath];
    const [dashedAlignment, solidAlignment] = flippedPaths ? [1, 0] : [0, 1];

    const graphics = new Graphics();
    graphics.lineStyle(lineWidth, convertColor(lineColor), undefined, solidAlignment);

    const startPointLinePath = linePath[0];
    graphics.moveTo(startPointLinePath.x, startPointLinePath.y);
    linePath.forEach((p: Point) => graphics.lineTo(p.x, p.y));

    const dashedLine = new DashLine(graphics, {
      dash: [windowOptions.dashLength, windowOptions.spaceLength],
      color: convertColor(windowOptions.dashColor),
      width: lineWidth,
      alignment: dashedAlignment,
    });

    const startPointDashedPath = dashedPath[0];
    dashedLine.moveTo(startPointDashedPath.x, startPointDashedPath.y);
    dashedPath.forEach((currentPoint: Point) => {
      dashedLine.lineTo(currentPoint.x, currentPoint.y);
    });

    this.addChild(graphics);
  }

  public preRender(): void {
    if (!this.data || !this.referenceSystem) {
      return;
    }

    const { exaggerationFactor } = this.options as SchematicLayerOptions<T>;
    const { holeSizes, casings, cements, completion, symbols, pAndA, perforations } = this.data;

    this.updateSymbolCache(symbols);

    holeSizes.sort((a: HoleSize, b: HoleSize) => b.diameter - a.diameter);
    const maxHoleDiameter = holeSizes.length > 0 ? max(holeSizes, (d) => d.diameter) * exaggerationFactor : EXAGGERATED_DIAMETER * exaggerationFactor;
    if (this.internalLayerVisibility.holeLayerId) {
      holeSizes.forEach((hole: HoleSize) => this.drawHoleSize(maxHoleDiameter, hole));
    }

    casings.sort((a: Casing, b: Casing) => b.diameter - a.diameter);
    const casingRenderObjects: CasingRenderObject[] = casings.map((casing: Casing) => this.createCasingRenderObject(casing));

    const cementShapes: CementRenderObject[] = cements.map(
      (cement: Cement): CementRenderObject => ({
        kind: 'cement',
        segments: createComplexRopeSegmentsForCement(cement, casings, completion, holeSizes, exaggerationFactor, this.getZFactorScaledPathForPoints),
        casingIds: (cement.referenceIds || []).filter((id) => id),
      }),
    );

    const [cementSqueezes, remainingPAndA] = pAndA.reduce<[CementSqueeze[], Exclude<PAndA, CementSqueeze>[]]>(
      ([squeezes, remaining], current: PAndA) =>
        isCementSqueeze(current) ? [[current, ...squeezes], remaining] : [squeezes, [current, ...remaining]],
      [[], []],
    );

    const cementSqueezesShape: CementSqueezeRenderObject[] = cementSqueezes.map((squeeze) => ({
      kind: 'cementSqueeze',
      segments: this.createCementSqueezeShape(squeeze, casings, completion, holeSizes),
      casingIds: squeeze.referenceIds,
    }));

    this.sortCementAndCasingRenderObjects(casingRenderObjects, cementShapes, cementSqueezesShape).forEach(
      foldInterlacedRenderObjects(
        (casingRO: CasingRenderObject) => {
          if (this.internalLayerVisibility.casingLayerId) {
            this.drawCasing(casingRO);

            if (casingRO.hasShoe) {
              this.drawShoe(casingRO.bottom, casingRO.referenceRadius);
            }
          }
        },
        (cementRO: CementRenderObject) => {
          if (this.internalLayerVisibility.cementLayerId) {
            this.drawComplexRope(cementRO.segments, this.getCementTexture());
          }
        },
        (cementSqueezesRO: CementSqueezeRenderObject) => {
          if (this.internalLayerVisibility.pAndALayerId) {
            this.drawComplexRope(cementSqueezesRO.segments, this.getCementSqueezeTexture());
          }
        },
      ),
    );

    if (this.internalLayerVisibility.completionLayerId) {
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
    }

    if (this.internalLayerVisibility.pAndALayerId) {
      remainingPAndA.forEach((obj) => {
        if (isPAndASymbol(obj)) {
          const symbolRenderObject = this.prepareSymbolRenderObject(obj);
          this.drawSymbolComponent(symbolRenderObject);
        }
        if (isCementPlug(obj)) {
          this.drawCementPlug(obj, casings, completion, holeSizes);
        }
      });
    }

    if (this.internalLayerVisibility.perforationLayerId) {
      perforations.filter(shouldPerforationStartAtHoleDiameter).forEach((perforation: Perforation) => {
        const perfShapes = this.createPerforationShape(perforation, casings, holeSizes);
        const otherPerforations = perforations.filter((p) => p.id !== perforation.id);
        const widestPerfShapeDiameter = perfShapes.reduce((widest, perfShape) => (perfShape.diameter > widest ? perfShape.diameter : widest), 0);
        this.drawComplexRope(perfShapes, this.createPerforationTexture(perforation, widestPerfShapeDiameter, otherPerforations));
      });
    }

    if (this.internalLayerVisibility.perforationLayerId) {
      perforations.filter(shouldPerforationStartAtCasingDiameter).forEach((perforation: Perforation) => {
        const perfShapes = this.createPerforationShape(perforation, casings, holeSizes);
        const otherPerforations = perforations.filter((p) => p.id !== perforation.id);
        const widestPerfShapeDiameter = perfShapes.reduce((widest, perfShape) => (perfShape.diameter > widest ? perfShape.diameter : widest), 0);

        this.drawComplexRope(perfShapes, this.createPerforationTexture(perforation, widestPerfShapeDiameter, otherPerforations));
      });
    }
  }

  private updateSymbolCache(symbols: { [key: string]: string }) {
    if (!this.textureSymbolCacheArray) {
      this.textureSymbolCacheArray = {};
    }
    if (!symbols) {
      return;
    }

    const existingKeys = Object.keys(this.textureSymbolCacheArray);
    Object.entries(symbols).forEach(([key, symbol]: [string, string]) => {
      if (!existingKeys.includes(key)) {
        this.textureSymbolCacheArray[key] = Texture.from(symbol);
      }
    });
  }

  private drawCementPlug(cementPlug: CementPlug, casings: Casing[], completion: Completion[], holes: HoleSize[]) {
    const { exaggerationFactor, cementPlugOptions } = this.options as SchematicLayerOptions<T>;

    const cementPlugSegments = createComplexRopeSegmentsForCementPlug(
      cementPlug,
      casings,
      completion,
      holes,
      exaggerationFactor,
      this.getZFactorScaledPathForPoints,
    );
    this.drawComplexRope(cementPlugSegments, this.getCementPlugTexture(cementPlugOptions));

    const { rightPath, leftPath } = cementPlugSegments.reduce<{ rightPath: Point[]; leftPath: Point[] }>(
      (acc, current) => {
        const { leftPath, rightPath } = createTubularRenderingObject(current.diameter / 2, current.points);

        return {
          rightPath: [...acc.rightPath, ...rightPath],
          leftPath: [...acc.leftPath, ...leftPath],
        };
      },
      { rightPath: [], leftPath: [] },
    );
    // eslint-disable-next-line no-magic-numbers
    this.drawOutline(leftPath, rightPath, convertColor('black'), 0.25, 'TopAndBottom');
  }

  private createCasingRenderObject(casing: Casing): CasingRenderObject {
    const { exaggerationFactor } = this.options as SchematicLayerOptions<T>;
    return prepareCasingRenderObject(exaggerationFactor, casing, this.getZFactorScaledPathForPoints);
  }

  private getCementPlugTexture(cementPlugOptions: CementPlugOptions): Texture {
    if (!this.cementPlugTextureCache) {
      this.cementPlugTextureCache = createCementPlugTexture(cementPlugOptions);
    }
    return this.cementPlugTextureCache;
  }

  private createPerforationTexture(perforation: Perforation, widestPerfShapeDiameter: number, otherPerforations: Perforation[]): Texture {
    const { perforationOptions } = this.options as SchematicLayerOptions<T>;
    return createPerforationTexture(perforation, widestPerfShapeDiameter, otherPerforations, perforationOptions);
  }

  private prepareSymbolRenderObject = (component: CompletionSymbol | PAndASymbol): SymbolRenderObject => {
    const { exaggerationFactor } = this.options as SchematicLayerOptions<T>;

    const exaggeratedDiameter = component.diameter * exaggerationFactor;

    const pathPoints = this.getZFactorScaledPathForPoints(component.start, component.end);

    return {
      pathPoints,
      referenceDiameter: exaggeratedDiameter,
      symbolKey: component.symbolKey,
    };
  };

  private drawSymbolComponent = ({ pathPoints, referenceDiameter, symbolKey }: SymbolRenderObject): void => {
    const texture = this.getSymbolTexture(symbolKey, referenceDiameter);
    // The rope renders fine in CANVAS/fallback mode
    this.drawSVGRope(pathPoints, texture);
  };

  private drawSVGRope(path: Point[], texture: Texture): void {
    if (path.length === 0) {
      return null;
    }

    const rope: UniformTextureStretchRope = new UniformTextureStretchRope(texture, path);

    this.addChild(rope);
  }

  private getSymbolTexture(symbolKey: string, diameter: number): Texture {
    return new Texture(this.textureSymbolCacheArray[symbolKey].baseTexture, null, new Rectangle(0, 0, 0, diameter), null, groupD8.MAIN_DIAGONAL);
  }

  private drawHoleSize = (maxHoleDiameter: number, holeObject: HoleSize): void => {
    if (holeObject == null) {
      return;
    }

    const pathPoints = this.getZFactorScaledPathForPoints(holeObject.start, holeObject.end);
    if (pathPoints.length === 0) {
      return;
    }

    const { exaggerationFactor, holeOptions } = this.options as SchematicLayerOptions<T>;
    const exaggeratedDiameter = holeObject.diameter * exaggerationFactor;
    const { rightPath, leftPath } = createTubularRenderingObject(exaggeratedDiameter / 2, pathPoints);

    if (this.renderType() === RENDERER_TYPE.CANVAS) {
      const polygonCoords = makeTubularPolygon(leftPath, rightPath);
      this.drawBigPolygon(polygonCoords, convertColor(holeOptions.firstColor));
    } else {
      const texture = this.getHoleTexture(holeOptions, exaggeratedDiameter, maxHoleDiameter);
      this.drawHoleRope(pathPoints, texture, maxHoleDiameter);
    }

    this.drawOutline(leftPath, rightPath, convertColor(holeOptions.lineColor), HOLE_OUTLINE * exaggerationFactor, 'TopAndBottom', 0);
  };

  private drawHoleRope(path: Point[], texture: Texture, maxHoleDiameter: number): void {
    if (path.length === 0) {
      return null;
    }

    const rope: SimpleRope = new SimpleRope(texture, path, maxHoleDiameter / DEFAULT_TEXTURE_SIZE);

    this.addChild(rope);
  }

  private getHoleTexture(holeOptions: HoleOptions, diameter: number, maxHoleDiameter: number): Texture {
    const size = DEFAULT_TEXTURE_SIZE;
    const height = size;
    const width = size;

    const textureDiameter = (diameter / maxHoleDiameter) * size;

    if (!this.holeTextureCache) {
      this.holeTextureCache = createHoleBaseTexture(holeOptions, width, height);
    }

    const baseTexture = this.holeTextureCache.baseTexture;
    const sidePadding = (height - textureDiameter) / 2;
    const frame = new Rectangle(0, sidePadding, width, textureDiameter);
    const texture = new Texture(baseTexture, frame);

    return texture;
  }

  /**
   * The rendering order of these components needs to be aligned
   * @param casingRenderObjects
   * @param cementRenderObject
   * @param cementSqueezes
   * @returns ordered rendering list
   */
  private sortCementAndCasingRenderObjects(
    casingRenderObjects: CasingRenderObject[],
    cementRenderObject: CementRenderObject[],
    cementSqueezes: CementSqueezeRenderObject[],
  ): InterlacedRenderObjects[] {
    type InterlaceReducerAcc = {
      result: InterlacedRenderObjects[];
      remainingCement: CementRenderObject[];
      remainingCementSqueezes: CementSqueezeRenderObject[];
    };

    let zIndex = 0;

    const { result } = casingRenderObjects.reduce(
      (acc: InterlaceReducerAcc, casingRenderObject: CasingRenderObject): InterlaceReducerAcc => {
        const foundCementShape = acc.remainingCement.find((cement) => cement.casingIds.includes(casingRenderObject.id));
        const foundCementSqueezes = acc.remainingCementSqueezes.filter((squeeze) => squeeze.casingIds.includes(casingRenderObject.id));

        if (foundCementShape) {
          foundCementShape.zIndex = zIndex++;
        }
        foundCementSqueezes.forEach((item) => (item.zIndex = zIndex++));
        casingRenderObject.zIndex = zIndex++;

        return {
          result: [...acc.result, foundCementShape, casingRenderObject, ...foundCementSqueezes],
          remainingCement: acc.remainingCement.filter((c) => c !== foundCementShape),
          remainingCementSqueezes: acc.remainingCementSqueezes.filter((squeeze) => !foundCementSqueezes.includes(squeeze)),
        };
      },
      { result: [], remainingCement: cementRenderObject, remainingCementSqueezes: cementSqueezes },
    );

    return result.filter((item) => item !== undefined).sort((a, b) => a.zIndex - b.zIndex);
  }

  /**
   *
   * @param intervals
   * @param texture
   * optionally fetch the exaggerationFactor from a different options prop
   * options.perforationOptions for example
   * @param getExaggerationFactor
   * @returns
   */
  private drawComplexRope(
    intervals: ComplexRopeSegment[],
    texture: Texture,
    getExaggerationFactor = (options: SchematicLayerOptions<T>) => options.exaggerationFactor,
  ): void {
    if (intervals.length === 0) {
      return null;
    }
    const exaggerationFactor = getExaggerationFactor(this.options as SchematicLayerOptions<T>);

    const rope = new ComplexRope(texture, intervals, exaggerationFactor);

    this.addChild(rope);
  }

  private static getOutlineClosureType = (index: number, maxIndex: number): OutlineClosure => {
    if (index === 0) {
      if (index === maxIndex) {
        return 'TopAndBottom';
      }
      return 'Top';
    }
    if (index === maxIndex) {
      return 'Bottom';
    }

    return 'None';
  };

  private drawCasing = (casingRenderObject: CasingRenderObject): void => {
    const { casingOptions } = this.options as SchematicLayerOptions<T>;
    const casingSolidColorNumber = convertColor(casingOptions.solidColor);
    const casingLineColorNumber = convertColor(casingOptions.lineColor);

    casingRenderObject.sections.forEach((section, index, list) => {
      const outlineClosureType = SchematicLayer.getOutlineClosureType(index, list.length - 1);
      // Pixi.js-legacy handles SimpleRope and advanced render methods poorly
      if (this.renderType() === RENDERER_TYPE.CANVAS) {
        this.drawBigPolygon(section.polygon, casingSolidColorNumber);
      } else {
        const texture = this.createCasingTexture(casingRenderObject.referenceDiameter);
        this.drawRope(section.pathPoints, texture, casingSolidColorNumber);
      }
      if (section.kind === 'casing-window') {
        this.drawCasingWindowOutline(section.leftPath, section.rightPath, casingOptions, casingRenderObject.casingWallWidth);
      } else {
        this.drawOutline(section.leftPath, section.rightPath, casingLineColorNumber, casingRenderObject.casingWallWidth, outlineClosureType);
      }
    });
  };

  private createCasingTexture(diameter: number): Texture {
    const textureWidthPO2 = 16;
    return new Texture(Texture.WHITE.baseTexture, null, new Rectangle(0, 0, textureWidthPO2, diameter));
  }

  private drawShoe(casingEnd: number, casingRadius: number): void {
    const { exaggerationFactor, casingOptions } = this.options as SchematicLayerOptions<T>;
    const shoeWidth = casingOptions.shoeSize.width * exaggerationFactor;
    const shoeLength = casingOptions.shoeSize.length * exaggerationFactor;

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

  private createCementSqueezeShape = (
    squeeze: CementSqueeze,
    casings: Casing[],
    completion: Completion[],
    holes: HoleSize[],
  ): ComplexRopeSegment[] => {
    const { exaggerationFactor } = this.options as SchematicLayerOptions<T>;
    return createComplexRopeSegmentsForCementSqueeze(squeeze, casings, completion, holes, exaggerationFactor, this.getZFactorScaledPathForPoints);
  };

  private getCementTexture(): Texture {
    if (!this.cementTextureCache) {
      const { cementOptions } = this.options as SchematicLayerOptions<T>;
      this.cementTextureCache = createCementTexture(cementOptions);
    }
    return this.cementTextureCache;
  }

  private createPerforationShape = (perforation: Perforation, casings: Casing[], holes: HoleSize[]): PerforationShape[] => {
    const { exaggerationFactor, perforationOptions } = this.options as SchematicLayerOptions<T>;
    return createComplexRopeSegmentsForPerforation(
      perforation,
      casings,
      holes,
      exaggerationFactor,
      perforationOptions,
      this.getZFactorScaledPathForPoints,
    );
  };

  private getCementSqueezeTexture(): Texture {
    if (!this.cementSqueezeTextureCache) {
      const { cementSqueezeOptions } = this.options as SchematicLayerOptions<T>;
      this.cementSqueezeTextureCache = createCementSqueezeTexture(cementSqueezeOptions);
    }
    return this.cementSqueezeTextureCache;
  }

  private drawScreen({ start, end, diameter }: Screen): void {
    const { exaggerationFactor, screenOptions } = this.options as SchematicLayerOptions<T>;
    const exaggeratedDiameter = exaggerationFactor * diameter;

    const pathPoints = this.getZFactorScaledPathForPoints(start, end);
    const { leftPath, rightPath } = createTubularRenderingObject(exaggeratedDiameter / 2, pathPoints);
    const polygon = makeTubularPolygon(leftPath, rightPath);

    const texture = this.getScreenTexture();
    if (this.renderType() === RENDERER_TYPE.CANVAS) {
      this.drawBigTexturedPolygon(polygon, texture);
    } else {
      this.drawCompletionRope(pathPoints, texture, exaggeratedDiameter);
    }
    this.drawOutline(leftPath, rightPath, convertColor(screenOptions.lineColor), SCREEN_OUTLINE * exaggerationFactor, 'TopAndBottom');
  }

  private drawTubing({ diameter, start, end }: Tubing): void {
    const { exaggerationFactor, tubingOptions } = this.options as SchematicLayerOptions<T>;
    const exaggeratedDiameter = exaggerationFactor * diameter;

    const pathPoints = this.getZFactorScaledPathForPoints(start, end);
    const { leftPath, rightPath } = createTubularRenderingObject(exaggeratedDiameter / 2, pathPoints);
    const polygon = makeTubularPolygon(leftPath, rightPath);

    const texture = this.getTubingTexture(tubingOptions);
    if (this.renderType() === RENDERER_TYPE.CANVAS) {
      this.drawBigTexturedPolygon(polygon, texture);
    } else {
      this.drawCompletionRope(pathPoints, texture, exaggeratedDiameter);
    }
  }

  private getTubingTexture(tubingOptions: TubingOptions): Texture {
    if (!this.tubingTextureCache) {
      this.tubingTextureCache = createTubingTexture(tubingOptions);
    }
    return this.tubingTextureCache;
  }

  private getScreenTexture(): Texture {
    if (!this.screenTextureCache) {
      const { screenOptions } = this.options as SchematicLayerOptions<T>;
      this.screenTextureCache = createScreenTexture(screenOptions);
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
}
