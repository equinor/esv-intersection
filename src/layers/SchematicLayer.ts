import { max } from 'd3-array';
import { scaleLinear, ScaleLinear } from 'd3-scale';
import { Graphics, IPoint, Point, Rectangle, RENDERER_TYPE, SimpleRope, Texture, WRAP_MODES } from 'pixi.js';
import { LayerOptions, PixiLayer, PixiRenderApplication } from '.';
import * as R from 'ramda';
import { DEFAULT_TEXTURE_SIZE, EXAGGERATED_DIAMETER, HOLE_OUTLINE, SCREEN_OUTLINE, SHOE_LENGTH, SHOE_WIDTH } from '../constants';
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
  createComplexRopeSegmentsForPerforation
} from '../datautils/schematicShapeGenerator';
import { OnUpdateEvent, OnRescaleEvent, OnUnmountEvent, Completion, Perforation, } from '../interfaces';
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
  pathPoints: number[][];
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
});

type InternalLayerVisibility = { [K in keyof InternalLayerOptions]: boolean };

export class SchematicLayer<T extends SchematicData> extends PixiLayer<T> {
  private internalLayerVisibility: InternalLayerVisibility = {
    holeLayerId: true,
    casingLayerId: true,
    completionLayerId: true,
    cementLayerId: true,
    pAndALayerId: true,
  };

  private cementTextureCache: Texture;
  private cementSqueezeTextureCache: Texture;
  private cementPlugTextureCache: Texture;
  private holeTextureCache: Texture;
  private screenTextureCache: Texture;
  private tubingTextureCache: Texture;
  private perforationTextureCache: Texture;
  private textureSymbolCacheArray: { [key: string]: Texture };

  private maxHoleDiameter: number;

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

  protected getZFactorScaledPathForPoints = (start: number, end: number): [number, number][] => {
    const y = (y: number): number => y * this.scalingFactors.zFactor;

    const path = this.referenceSystem.getCurtainPath(start, end, true);
    return path.map((p) => [p.point[0], y(p.point[1])]);
  };

  protected drawBigPolygon = (coords: Point[], color = 0x000000) => {
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
   * @param close If line should close in top and bottom to form a loop
   * @param lineAlignment alignment of the line to draw, (0 = inner, 0.5 = middle, 1 = outer).
   */
  protected drawOutline(leftPath: Point[], rightPath: Point[], lineColor: number, lineWidth = 1, close: boolean = false, lineAlignment = 1): void {
    const leftPathReverse = leftPath.map<Point>((d) => d.clone()).reverse();

    const startPointRight = rightPath[0];
    const startPointLeft = leftPathReverse[0];

    const line = new Graphics();
    line.lineStyle(lineWidth, lineColor, undefined, lineAlignment);
    line.moveTo(startPointRight.x, startPointRight.y);
    rightPath.forEach((p: Point) => line.lineTo(p.x, p.y));

    if (!close) {
      line.moveTo(startPointLeft.x, startPointLeft.y);
    }

    leftPathReverse.forEach((p: Point) => line.lineTo(p.x, p.y));

    if (close) {
      line.lineTo(startPointRight.x, startPointRight.y);
    }

    this.addChild(line);
  }

  public preRender(): void {
    if (!this.data || !this.referenceSystem) {
      return;
    }

    const { exaggerationFactor } = this.options as SchematicLayerOptions<T>;
    const { holeSizes, casings, cements, completion, symbols, pAndA, perforations } = this.data;
    

    // WIP
    // TODO
    // The perf spikes should not always start behind a hole
    // if there is a casing they should start there
    // will fix
    perforations
      .filter((perf) => perf.subKind === 'Perforation')
      .forEach((perforation) => {
        const perfShape = this.createPerforationShape(perforation, casings, holeSizes).map((p) => ({ ...p, diameter: p.diameter * 4 }));
        if (perforation.subKind === 'Perforation') {
          const otherPerforations = perforations.filter((p) => p.id !== perforation.id);
          console.log({ perforations, otherPerforations });
          this.drawComplexRope(perfShape, this.createPerforationTexture(perforation, perfShape, otherPerforations));
        }
      });

    this.updateSymbolCache(symbols);

    holeSizes.sort((a: HoleSize, b: HoleSize) => b.diameter - a.diameter);
    this.maxHoleDiameter = holeSizes.length > 0 ? max(holeSizes, (d) => d.diameter) * exaggerationFactor : EXAGGERATED_DIAMETER * exaggerationFactor;
    this.internalLayerVisibility.holeLayerId && holeSizes.forEach((hole: HoleSize) => this.drawHoleSize(hole));

    casings.sort((a: Casing, b: Casing) => b.diameter - a.diameter);
    const casingRenderObjects: CasingRenderObject[] = casings.map((casing: Casing) =>
      prepareCasingRenderObject(exaggerationFactor, casing, this.getZFactorScaledPathForPoints(casing.start, casing.end)),
    );

    const cementShapes: CementRenderObject[] = cements.map(
      (cement: Cement): CementRenderObject => ({
        kind: 'cement',
        segments: createComplexRopeSegmentsForCement(cement, casings, holeSizes, exaggerationFactor, this.getZFactorScaledPathForPoints),
        casingIds: (cement.casingIds || []).filter((id) => id),
      }),
    );

    const [cementSqueezes, remainingPAndA] = pAndA.reduce(
      ([squeezes, remaining], current: PAndA) =>
        isCementSqueeze(current) ? [[current, ...squeezes], remaining] : [squeezes, [current, ...remaining]],
      <[CementSqueeze[], Exclude<PAndA, CementSqueeze>[]]>[[], []],
    );

    const cementSqueezesShape: CementSqueezeRenderObject[] = cementSqueezes.map((squeeze) => ({
      kind: 'cementSqueeze',
      segments: this.createCementSqueezeShape(squeeze, casings, holeSizes),
      casingIds: squeeze.casingIds,
    }));

    this.sortCementAndCasingRenderObjects(casingRenderObjects, cementShapes, cementSqueezesShape).forEach(
      foldInterlacedRenderObjects(
        (casingRO: CasingRenderObject) => {
          if (this.internalLayerVisibility.casingLayerId) {
            this.drawCasing(casingRO);
            casingRO.hasShoe && this.drawShoe(casingRO.bottom, casingRO.referenceRadius);
          }
        },
        (cementRO: CementRenderObject) =>
          this.internalLayerVisibility.cementLayerId && this.drawComplexRope(cementRO.segments, this.getCementTexture()),
        (cementSqueezesRO: CementSqueezeRenderObject) =>
          this.internalLayerVisibility.pAndALayerId && this.drawComplexRope(cementSqueezesRO.segments, this.createCementSqueezeTexture()),
      ),
    );

    this.internalLayerVisibility.completionLayerId &&
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
      if (obj.kind === 'pAndASymbol') {
        const symbolRenderObject = this.prepareSymbolRenderObject(obj);
        this.drawSymbolComponent(symbolRenderObject);
      }
      if (obj.kind === 'cementPlug') {
        const cementPlugSegments = this.createCementPlugShape(obj, casings, holeSizes);
        this.drawComplexRope(cementPlugSegments, this.createCementPlugTexture());

        const { rightPath, leftPath } = cementPlugSegments.reduce(
          (acc, current) => {
            const diameter = current.diameter;
            const pathPoints = current.points.map((p) => [p.x, p.y]);
            const normals = createNormals(pathPoints);
            const rightPath = offsetPoints(pathPoints, normals, diameter / 2);
            const leftPath = offsetPoints(pathPoints, normals, -diameter / 2);

            return {
              rightPath: [...acc.rightPath, ...rightPath],
              leftPath: [...acc.leftPath, ...leftPath],
            };
          },
        ),
      }
    });

    this.internalLayerVisibility.pAndALayerId &&
      remainingPAndA.forEach((obj) => {
        if (isPAndASymbol(obj)) {
          const symbolRenderObject = this.prepareSymbolRenderObject(obj);
          this.drawSymbolComponent(symbolRenderObject);
        }
        if (isCementPlug(obj)) {
          this.drawCementPlug(obj, casings, holeSizes);
        }
      });

    // WIP
    // TODO
    // The perf spikes should not always start behind a hole
    // if there is a casing they should start there
    // will fix
    perforations
      .filter((perf) => perf.subKind !== 'Perforation')
      .forEach((perforation) => {
        const perfShape = this.createPerforationShape(perforation, casings, holeSizes).map((p) => {
          if (perforation.subKind === 'Open hole frac pack') {
            return { ...p, diameter: p.diameter * 4 };
          }
          return { ...p, diameter: p.diameter };
        });
        const otherPerforations = perforations.filter((p) => p.id !== perforation.id);
        this.drawComplexRope(
          perfShape,
          this.createPerforationTexture(perforation, perfShape, otherPerforations));
      });
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

  private drawCementPlug(cementPlug: CementPlug, casings: Casing[], holes: HoleSize[]) {
    const { exaggerationFactor, cementPlugOptions } = this.options as SchematicLayerOptions<T>;

    const cementPlugSegments = createComplexRopeSegmentsForCementPlug(
      cementPlug,
      casings,
      holes,
      exaggerationFactor,
      this.getZFactorScaledPathForPoints,
    );
    this.drawComplexRope(cementPlugSegments, this.getCementPlugTexture(cementPlugOptions));

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

  private getCementPlugTexture(cementPlugOptions: CementPlugOptions): Texture {
    if (!this.cementPlugTextureCache) {
      this.cementPlugTextureCache = createCementPlugTexture(cementPlugOptions);
    }
    return this.cementPlugTextureCache;
  }

  private createCementPlugShape(plug: CementPlug, casings: Casing[], holes: HoleSize[]): ComplexRopeSegment[] {
    const { exaggerationFactor } = this.options as SchematicLayerOptions<T>;
    return createComplexRopeSegmentsForCementPlug(plug, casings, holes, exaggerationFactor, this.getZFactorScaledPathForPoints);
  }

  private createPerforationTexture(perforation: any, perfShapes: any[], otherPerforations: Perforation[]): Texture {
    console.log({ perforation, perfShapes });
    if (this.perforationTextureCache) {
      return this.perforationTextureCache;
    }

    const { cementTextureScalingFactor } = this.options as SchematicLayerOptions<T>;
    const perforationColor = '#ff0000';
    const canvas = document.createElement('canvas');

    const size = DEFAULT_TEXTURE_SIZE * cementTextureScalingFactor;

    canvas.width = size / 2;
    canvas.height = size;
    const canvasCtx = canvas.getContext('2d');

    canvasCtx.fillStyle = perforationColor;

    const assertNever = (x: never): never => {
      throw new Error(`Unexpected object: ${x}`);
    };

    type PerforationSubKind =
      | 'Perforation'
      | 'Open hole gravel pack'
      | 'Open hole screen'
      | 'Open hole'
      | 'Open hole frac pack'
      | 'Cased hole frac pack'
      | 'Cased hole gravel pack'
      | 'Cased hole fracturation';

    const foldPerforationSubKind = <T>(
      options: {
        Perforation: (kind: 'Perforation') => T;
        OpenHole: (kind: 'Open hole') => T;
        OpenHoleGravelPack: (kind: 'Open hole gravel pack') => T;
        OpenHoleFracPack: (kind: 'Open hole frac pack') => T;
        OpenHoleScreen: (kind: 'Open hole screen') => T;
        CasedHoleGravelPack: (kind: 'Cased hole gravel pack') => T;
        CasedHoleFracPack: (kind: 'Cased hole frac pack') => T;
        CasedHoleFracturation: (kind: 'Cased hole fracturation') => T;
      },
      subKind: PerforationSubKind,
    ) => {
      switch (subKind) {
        case 'Perforation':
          return options.Perforation(subKind);

        case 'Open hole':
          return options.OpenHole(subKind);

        case 'Open hole gravel pack':
          return options.OpenHoleGravelPack(subKind);

        case 'Open hole frac pack':
          return options.OpenHoleFracPack(subKind);

        case 'Open hole screen':
          return options.OpenHoleScreen(subKind);

        case 'Cased hole fracturation':
          return options.CasedHoleFracturation(subKind);

        case 'Cased hole frac pack':
          return options.CasedHoleFracPack(subKind);

        case 'Cased hole gravel pack':
          return options.CasedHoleGravelPack(subKind);

        default:
          return assertNever(subKind);
      }
    };

    const spikeWidth = 25;
    const amountOfSpikes = canvas.width / spikeWidth;

    function hasGravelPack(perf: Perforation): boolean {
      return foldPerforationSubKind(
        {
          Perforation: () => false,
          OpenHole: () => false,
          OpenHoleGravelPack: () => true,
          OpenHoleFracPack: () => false,
          OpenHoleScreen: () => false,
          CasedHoleFracturation: () => false,
          CasedHoleGravelPack: () => true,
          CasedHoleFracPack: () => false,
        },
        perf.subKind,
      );
    }

    function isSubKindPerforation(perf: Perforation): boolean {
      return foldPerforationSubKind(
        {
          Perforation: () => true,
          OpenHole: () => false,
          OpenHoleGravelPack: () => false,
          OpenHoleFracPack: () => false,
          OpenHoleScreen: () => false,
          CasedHoleFracturation: () => false,
          CasedHoleGravelPack: () => false,
          CasedHoleFracPack: () => false,
        },
        perf.subKind,
      );
    }

    function isSubKindCasedHoleFracPack(perf: Perforation): boolean {
      return foldPerforationSubKind(
        {
          Perforation: () => false,
          OpenHole: () => false,
          OpenHoleGravelPack: () => false,
          OpenHoleFracPack: () => false,
          OpenHoleScreen: () => false,
          CasedHoleFracturation: () => false,
          CasedHoleGravelPack: () => false,
          CasedHoleFracPack: () => true,
        },
        perf.subKind,
      );
    }

    const colors = {
      stroke: 'rgba(0, 0, 0, 0.25)',
      yellow: '#FFFC00',
      grey: 'gray',
      red: '#FF5050',
      transparent: 'rgba(255, 255, 255, 0)',
    };

    const intersect = (a, b) => {
      return a.top < b.bottom && a.bottom > b.top;
    };

    console.log({ otherPerforations });

    // how to start the spike at the right diameter position if it has multiple perforationShapes with different diameters?
    // maybe good enough to just render it behind casings or holes?
    // I WILL FIX THIS LATER
    // First I have to draw all the parts, right color, overlap detection
    // Take a look at the wellx-wellog logic!

    // https://app.zenhub.com/workspaces/wellx-5f89a0db386bba0014989b28/issues/equinor/wellx-designer/222
    foldPerforationSubKind(
      {
        Perforation: () => {
          // If a perforation does not overlap with another perforations of type with gravel,
          // the perforation spikes are either red when open or grey when closed.
          // Open and closed refers to two fields on a perforation item referencing runs.

          // If a perforation overlaps with another perforation of type with gravel and the perforation is open,
          // the perforation spikes should be yellow.
          // If closed the perforation remains grey.
          const fracLineLenght = 25;
          const intersectionsWithGravel: Perforation[] = R.pipe(
            R.filter(hasGravelPack),
            R.map((gPack) => (intersect(perforation, gPack) ? gPack : null)),
            R.filter((gPack) => gPack !== null),
          )(otherPerforations);

          // Cased hole frac pack
          // Makes perforations of type "Perforation" yellow if overlapping and perforation are open.
          const intersectionsWithCasedHoleFracPack = R.pipe(
            R.filter(isSubKindCasedHoleFracPack),
            R.map((gPack) => (intersect(perforation, gPack) ? gPack : null)),
            R.filter((gPack) => gPack !== null),
          )(otherPerforations);

          console.log('I LOVE YOU DUA LIPA!', { intersectionsWithGravel, intersectionsWithCasedHoleFracPack });

          if (intersectionsWithGravel.length > 0 || intersectionsWithCasedHoleFracPack.length > 0) {
            if (perforation.isOpen) {
              canvasCtx.fillStyle = colors.yellow;
              canvasCtx.strokeStyle = colors.yellow;
            } else {
              canvasCtx.fillStyle = colors.grey;
              canvasCtx.strokeStyle = colors.grey;
            }
          } else {
            console.log({ isOpen: perforation.isOpen });
            if (perforation.isOpen) {
              canvasCtx.fillStyle = colors.red;
              canvasCtx.strokeStyle = colors.red;
            } else {
              canvasCtx.fillStyle = colors.grey;
              canvasCtx.strokeStyle = colors.grey;
            }
          }

          for (let i = 0; i < amountOfSpikes; i++) {
            const left: [number, number] = [i * spikeWidth, canvas.height / 2];
            const right: [number, number] = [i * spikeWidth + spikeWidth, canvas.height / 2];
            const top: [number, number] = [right[0] - spikeWidth / 2, fracLineLenght];

            canvasCtx.beginPath();
            canvasCtx.moveTo(...top);
            canvasCtx.lineTo(...left);
            canvasCtx.lineTo(...right);
            canvasCtx.closePath();
            canvasCtx.fill();
          }

          for (let i = 0; i < amountOfSpikes; i++) {
            const left: [number, number] = [i * spikeWidth, canvas.height / 2];
            const right: [number, number] = [i * spikeWidth + spikeWidth, canvas.height / 2];
            const bottom: [number, number] = [right[0] - spikeWidth / 2, canvas.height - fracLineLenght];

            canvasCtx.beginPath();
            canvasCtx.moveTo(...left);
            canvasCtx.lineTo(...bottom);
            canvasCtx.lineTo(...right);
            canvasCtx.closePath();
            canvasCtx.fill();
          }

          const hasFracLines = true;

          if (hasFracLines) {
            for (let i = 0; i < amountOfSpikes; i++) {
              const right: [number, number] = [i * spikeWidth + spikeWidth, canvas.height / 2];
              const top: [number, number] = [right[0] - spikeWidth / 2, fracLineLenght];

              canvasCtx.beginPath();

              const start: [number, number] = [...top];
              const controlPoint1: [number, number] = [top[0] - 10, fracLineLenght / 2];
              const middle: [number, number] = [top[0], fracLineLenght / 2];
              const controlPoint2: [number, number] = [top[0] + 10, fracLineLenght / 4];
              const end: [number, number] = [top[0], 0];

              canvasCtx.bezierCurveTo(...start, ...controlPoint1, ...middle);
              canvasCtx.bezierCurveTo(...middle, ...controlPoint2, ...end);
              canvasCtx.stroke();
            }

            for (let i = 0; i < amountOfSpikes; i++) {
              const right: [number, number] = [i * spikeWidth + spikeWidth, canvas.height / 2];
              const bottom: [number, number] = [right[0] - spikeWidth / 2, canvas.height - fracLineLenght];

              canvasCtx.beginPath();

              const start: [number, number] = [...bottom];
              const controlPoint1: [number, number] = [bottom[0] - 10, canvas.height - fracLineLenght / 2];
              const middle: [number, number] = [bottom[0], canvas.height - fracLineLenght / 2];
              const controlPoint2: [number, number] = [bottom[0] + 10, canvas.height - fracLineLenght / 4];
              const end: [number, number] = [bottom[0], canvas.height];

              canvasCtx.bezierCurveTo(...start, ...controlPoint1, ...middle);
              canvasCtx.bezierCurveTo(...middle, ...controlPoint2, ...end);
              canvasCtx.stroke();
            }
          }
        },
        // No visualization
        OpenHole: () => null,
        // Yellow gravel
        OpenHoleGravelPack: () => {
          const size = DEFAULT_TEXTURE_SIZE * cementTextureScalingFactor;
          canvas.width = size / 2;
          canvas.height = size;
          canvasCtx.fillStyle = colors.yellow;
          canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
        },
        // Yellow gravel. Yellow frac lines from hole OD into formation
        OpenHoleFracPack: () => {
          canvasCtx.fillStyle = colors.yellow;
          canvasCtx.strokeStyle = colors.yellow;
          const fracLineLenght = 25;
          const hasFracLines = true;

          console.log('OPEN HOLE FRAC PACK');

          const xy: [number, number] = [0, fracLineLenght + perfShapes[0].diameter];
          const wh: [number, number] = [canvas.width, perfShapes[0].diameter];
          canvasCtx.fillRect(...xy, ...wh);

          if (hasFracLines) {
            for (let i = 0; i < amountOfSpikes; i++) {
              const right: [number, number] = [i * spikeWidth + spikeWidth, canvas.height / 2];
              const top: [number, number] = [right[0] - spikeWidth / 2, fracLineLenght + perfShapes[0].diameter];

              canvasCtx.beginPath();

              // TODO
              // Is it OK to always use perfShape[0].diameter or do I need to change it up along the path?
              // Perhaps check per loop iteration?
              // How would I do that?
              const start: [number, number] = [...top];
              const controlPoint1: [number, number] = [top[0] - 10, fracLineLenght / 2 + perfShapes[0].diameter];
              const middle: [number, number] = [top[0], fracLineLenght / 2 + perfShapes[0].diameter];
              const controlPoint2: [number, number] = [top[0] + 10, fracLineLenght / 4 + perfShapes[0].diameter];
              const end: [number, number] = [top[0], perfShapes[0].diameter];

              canvasCtx.bezierCurveTo(...start, ...controlPoint1, ...middle);
              canvasCtx.bezierCurveTo(...middle, ...controlPoint2, ...end);
              canvasCtx.stroke();
            }

            for (let i = 0; i < amountOfSpikes; i++) {
              const right: [number, number] = [i * spikeWidth + spikeWidth, canvas.height / 2];
              const bottom: [number, number] = [right[0] - spikeWidth / 2, canvas.height - fracLineLenght - perfShapes[0].diameter];

              canvasCtx.beginPath();

              const start: [number, number] = [...bottom];
              const controlPoint1: [number, number] = [bottom[0] - 10, canvas.height - fracLineLenght / 2 - perfShapes[0].diameter];
              const middle: [number, number] = [bottom[0], canvas.height - fracLineLenght / 2 - perfShapes[0].diameter];
              const controlPoint2: [number, number] = [bottom[0] + 10, canvas.height - fracLineLenght / 4 - perfShapes[0].diameter];
              const end: [number, number] = [bottom[0], canvas.height - perfShapes[0].diameter];

              canvasCtx.bezierCurveTo(...start, ...controlPoint1, ...middle);
              canvasCtx.bezierCurveTo(...middle, ...controlPoint2, ...end);
              canvasCtx.stroke();
            }
          }
        },
        // No visualisation
        OpenHoleScreen: () => null,
        // Cased hole fracturation
        // Yellow fracturation lines from casing OD into formation
        CasedHoleFracturation: () => {
          const fracLineLenght = 25;
          for (let i = 0; i < amountOfSpikes; i++) {
            const right: [number, number] = [i * spikeWidth + spikeWidth, canvas.height / 2];
            const top: [number, number] = [right[0] - spikeWidth / 2, fracLineLenght + perfShapes[0].diameter];

            canvasCtx.beginPath();

            // TODO
            // Is it OK to always use perfShape[0].diameter or do I need to change it up along the path?
            // Perhaps check per loop iteration?
            // How would I do that?
            const start: [number, number] = [...top];
            const controlPoint1: [number, number] = [top[0] - 10, fracLineLenght / 2 + perfShapes[0].diameter];
            const middle: [number, number] = [top[0], fracLineLenght / 2 + perfShapes[0].diameter];
            const controlPoint2: [number, number] = [top[0] + 10, fracLineLenght / 4 + perfShapes[0].diameter];
            const end: [number, number] = [top[0], perfShapes[0].diameter];

            canvasCtx.bezierCurveTo(...start, ...controlPoint1, ...middle);
            canvasCtx.bezierCurveTo(...middle, ...controlPoint2, ...end);
            canvasCtx.stroke();
          }

          for (let i = 0; i < amountOfSpikes; i++) {
            const right: [number, number] = [i * spikeWidth + spikeWidth, canvas.height / 2];
            const bottom: [number, number] = [right[0] - spikeWidth / 2, canvas.height - fracLineLenght - perfShapes[0].diameter];

            canvasCtx.beginPath();

            const start: [number, number] = [...bottom];
            const controlPoint1: [number, number] = [bottom[0] - 10, canvas.height - fracLineLenght / 2 - perfShapes[0].diameter];
            const middle: [number, number] = [bottom[0], canvas.height - fracLineLenght / 2 - perfShapes[0].diameter];
            const controlPoint2: [number, number] = [bottom[0] + 10, canvas.height - fracLineLenght / 4 - perfShapes[0].diameter];
            const end: [number, number] = [bottom[0], canvas.height - perfShapes[0].diameter];

            canvasCtx.bezierCurveTo(...start, ...controlPoint1, ...middle);
            canvasCtx.bezierCurveTo(...middle, ...controlPoint2, ...end);
            canvasCtx.stroke();
          }
        },
        // Yellow gravel. Makes perforations of type "Perforation" yellow if overlapping and perforation are open.
        CasedHoleGravelPack: () => {
          const size = DEFAULT_TEXTURE_SIZE * cementTextureScalingFactor;
          canvas.width = size / 2;
          canvas.height = size;
          canvasCtx.fillStyle = colors.yellow;
          canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
        },
        // Yellow gravel and fracturation lines.
        // Makes perforations of type "Perforation" yellow if overlapping and perforation are open.
        // If no perforation of type "perforation" are overlapping, there are no fracturation lines and no spikes.
        // If a perforation of type "perforation" is overlapping,
        // the fracturation lines extends from the tip of the perforation spikes into formation.
        CasedHoleFracPack: () => {
          const size = DEFAULT_TEXTURE_SIZE * cementTextureScalingFactor;
          canvas.width = size / 2;
          canvas.height = size;
          canvasCtx.fillStyle = colors.yellow;
          canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
        },
      },
      perforation.subKind,
    );

    // this.perforationTextureCache = Texture.from(canvas, { wrapMode: WRAP_MODES.CLAMP });
    // return this.perforationTextureCache;

    const notGonnaCacheThePerforationTextureForNow = Texture.from(canvas, { wrapMode: WRAP_MODES.CLAMP });
    return notGonnaCacheThePerforationTextureForNow;
  }

  private prepareSymbolRenderObject = (component: CompletionSymbol | PAndASymbol): SymbolRenderObject => {
    if (component == null) {
      return;
    }
    const { exaggerationFactor } = this.options as SchematicLayerOptions<T>;

    const exaggeratedDiameter = component.diameter * exaggerationFactor;

    const pathPoints = this.getZFactorScaledPathForPoints(component.start, component.end);

    return {
      pathPoints,
      referenceDiameter: exaggeratedDiameter,
      symbolKey: component.symbolKey,
    };
  };

  private drawSymbolComponent = (renderObject: SymbolRenderObject): void => {
    const { pathPoints, referenceDiameter, symbolKey } = renderObject;

    const texture = this.getSymbolTexture(symbolKey, referenceDiameter);
    // The rope renders fine in CANVAS/fallback mode
    this.drawSVGRope(
      pathPoints.map((p) => new Point(p[0], p[1])),
      texture,
    );
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

    const { exaggerationFactor, holeOptions } = this.options as SchematicLayerOptions<T>;
    const diameter = holeObject.diameter * exaggerationFactor;
    const { rightPath, leftPath, referenceDiameter } = createTubularRenderingObject(diameter, pathPoints);

    if (this.renderType() === RENDERER_TYPE.CANVAS) {
      const polygonCoords = makeTubularPolygon(leftPath, rightPath);
      this.drawBigPolygon(polygonCoords, convertColor(holeOptions.firstColor));
    } else {
      const texture = this.getHoleTexture(holeOptions, referenceDiameter);
      this.drawHoleRope(
        pathPoints.map((p) => new Point(p[0], p[1])),
        texture,
      );
    }

    this.drawOutline(leftPath, rightPath, convertColor(holeOptions.lineColor), HOLE_OUTLINE * exaggerationFactor, false, 0);
  };

  private drawHoleRope(path: Point[], texture: Texture): void {
    if (path.length === 0) {
      return null;
    }

    const rope: SimpleRope = new SimpleRope(texture, path, this.maxHoleDiameter / DEFAULT_TEXTURE_SIZE);

    this.addChild(rope);
  }

  private getHoleTexture(holeOptions: HoleOptions, diameter: number): Texture {
    const size = DEFAULT_TEXTURE_SIZE;
    const height = size;
    const width = size;

    const textureDiameter = (diameter / this.maxHoleDiameter) * size;

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
      (acc: InterlaceReducerAcc, casingRenderObject): InterlaceReducerAcc => {
        const foundCementShape = acc.remainingCement.find((cement) => cement.casingIds.includes(casingRenderObject.casingId));
        const foundCementSqueezes = acc.remainingCementSqueezes.filter((squeeze) => squeeze.casingIds.includes(casingRenderObject.casingId));

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

  private drawComplexRope(intervals: ComplexRopeSegment[], texture: Texture): void {
    if (intervals.length === 0) {
      return null;
    }
    const { exaggerationFactor } = this.options as SchematicLayerOptions<T>;

    const rope = new ComplexRope(texture, intervals, exaggerationFactor);

    this.addChild(rope);
  }

  private drawCasing = (casingRenderObject: CasingRenderObject): void => {
    const { casingOptions } = this.options as SchematicLayerOptions<T>;
    const { pathPoints, polygon, leftPath, rightPath, referenceDiameter, casingWallWidth } = casingRenderObject;
    const casingSolidColorNumber = convertColor(casingOptions.solidColor);

    // Pixi.js-legacy handles SimpleRope and advanced render methods poorly
    if (this.renderType() === RENDERER_TYPE.CANVAS) {
      this.drawBigPolygon(polygon, casingSolidColorNumber);
    } else {
      const texture = this.createCasingTexture(referenceDiameter);
      this.drawRope(
        pathPoints.map((p) => new Point(p[0], p[1])),
        texture,
        casingSolidColorNumber,
      );
    }

    this.drawOutline(leftPath, rightPath, convertColor(casingOptions.lineColor), casingWallWidth, true);
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

  private createCementSqueezeShape = (squeeze: CementSqueeze, casings: Casing[], holes: HoleSize[]): ComplexRopeSegment[] => {
    const { exaggerationFactor } = this.options as SchematicLayerOptions<T>;
    return createComplexRopeSegmentsForCementSqueeze(squeeze, casings, holes, exaggerationFactor, this.getZFactorScaledPathForPoints);
  };

  private getCementTexture(): Texture {
    if (!this.cementTextureCache) {
      const { cementOptions } = this.options as SchematicLayerOptions<T>;
      this.cementTextureCache = createCementTexture(cementOptions);
    }
    return this.cementTextureCache;
  }

  createPerforationShape = (perforation: Perforation, casings: Casing[], holes: HoleSize[]): ComplexRopeSegment[] => {
    const { exaggerationFactor } = this.options as SchematicLayerOptions<T>;
    return createComplexRopeSegmentsForPerforation(perforation, casings, holes, exaggerationFactor, this.getZFactorScaledPathForPoints);
  };

  private createCementSqueezeTexture(): Texture {
    if (this.cementSqueezeTextureCache) {
      return this.cementSqueezeTextureCache;
    }

    const { cementSqueezeOptions } = this.options as SchematicLayerOptions<T>;

    const canvas = document.createElement('canvas');

    const size = DEFAULT_TEXTURE_SIZE * cementSqueezeOptions.scalingFactor;
    const lineWidth = cementSqueezeOptions.scalingFactor;
    canvas.width = size;
    canvas.height = size;
    const canvasCtx = canvas.getContext('2d');

    canvasCtx.fillStyle = cementSqueezeOptions.firstColor;
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    canvasCtx.lineWidth = lineWidth;
    canvasCtx.fillStyle = cementSqueezeOptions.secondColor;
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
    const { exaggerationFactor, screenOptions } = this.options as SchematicLayerOptions<T>;
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
    this.drawOutline(leftPath, rightPath, convertColor(screenOptions.lineColor), SCREEN_OUTLINE * exaggerationFactor, false);
  }

  private drawTubing({ diameter, start, end }: Tubing): void {
    const { exaggerationFactor, tubingOptions } = this.options as SchematicLayerOptions<T>;
    const exaggeratedDiameter = exaggerationFactor * diameter;

    const pathPoints = this.getZFactorScaledPathForPoints(start, end);
    const { leftPath, rightPath, referenceDiameter } = createTubularRenderingObject(exaggeratedDiameter, pathPoints);
    const polygon = makeTubularPolygon(leftPath, rightPath);

    const texture = this.getTubingTexture(tubingOptions);
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
