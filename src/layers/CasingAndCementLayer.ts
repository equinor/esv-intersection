import { Point, Rectangle, RENDERER_TYPE, Texture } from 'pixi.js';
import { CasingShoeSize, CementShape, PixiRenderApplication } from '.';
import { SHOE_LENGTH, SHOE_WIDTH } from '../constants';
import {
  calculateCementDiameter,
  cementDiameterChangeDepths,
  findIntersectingItems,
  makeTubularPolygon,
} from '../datautils/wellboreItemShapeGenerator';
import { Casing, Cement, HoleSize, MDPoint } from '../interfaces';
import { createNormals, offsetPoint, offsetPoints } from '../utils/vectorUtils';
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
}

export interface CasingAndCementLayerOptions<T extends CasingAndCementData> extends WellComponentBaseOptions<T> {
  casingSolidColor?: number;
  casingLineColor?: number;
  firstCementColor?: string;
  secondCementColor?: string;
  casingShoeSize?: CasingShoeSize;
  exaggerationFactor?: number;
  internalLayers?: {
    casingId: string;
    cementId: string;
  };
}

export class CasingAndCementLayer<T extends CasingAndCementData> extends WellboreBaseComponentLayer<T> {
  private casingVisibility = true;
  private cementVisibility = true;

  constructor(ctx: PixiRenderApplication, id?: string, options?: CasingAndCementLayerOptions<T>) {
    super(ctx, id, options);
    this.options = {
      ...this.options,
      casingSolidColor: 0xdcdcdc,
      casingLineColor: 0x575757,
      casingShoeSize: defaultCasingShoeSize,
      firstCementColor: '#c7b9ab',
      secondCementColor: '#5b5b5b',
      ...options,
    };
  }

  preRender(): void {
    if (!this.data || !this.rescaleEvent || !this.referenceSystem) {
      return;
    }

    const { holeSizes, casings, cements } = this.data;

    const sortedCasings = casings.sort((a: Casing, b: Casing) => b.diameter - a.diameter);
    const casingRenderObjects: CasingRenderObject[] = sortedCasings.map(this.prepareCasingRenderObject);
    const cementShapes = cements.map((cement: Cement) => this.createCementShape(cement, sortedCasings, holeSizes));

    this.pairCementAndCasingRenderObjects(casingRenderObjects, cementShapes).forEach(
      ([cementShape, casingRenderObject]: [CementShape | undefined, CasingRenderObject]) => {
        if (cementShape) {
          this.cementVisibility && this.drawCementShape(cementShape);
        }
        this.casingVisibility && this.drawCasing(casingRenderObject);

        if (casingRenderObject.hasShoe) {
          this.casingVisibility && this.drawShoe(casingRenderObject.bottom, casingRenderObject.radius);
        }
      },
    );
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

    const casingWallWidth = Math.abs(radius - innerRadius);

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

  private drawCementShape(cementShape: CementShape): void {
    const texture: Texture = this.createCementTexture();

    if (this.renderType() === RENDERER_TYPE.CANVAS) {
      this.drawBigTexturedPolygon(cementShape.leftPolygon, texture);
      this.drawBigTexturedPolygon(cementShape.rightPolygon, texture);
    } else {
      this.drawRopeWithMask(cementShape.path, cementShape.leftPolygon, texture);
      this.drawRopeWithMask(cementShape.path, cementShape.rightPolygon, texture);
    }
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

  private createCementShape(cement: Cement, casings: Casing[], holes: HoleSize[]): CementShape {
    const { exaggerationFactor } = this.options as CasingAndCementLayerOptions<T>;

    // Merge deprecated casingId and casingIds array
    const casingIds = [cement.casingId, ...(cement.casingIds || [])].filter((id) => id);

    const attachedCasings = casingIds.map((casingId) => casings.find((casing) => casing.casingId === casingId));
    if (attachedCasings.length === 0 || attachedCasings.includes(undefined)) {
      throw new Error('Invalid cement data, cement is missing attached casing');
    }

    attachedCasings.sort((a: Casing, b: Casing) => a.end - b.end); // ascending
    const bottomOfCement = attachedCasings[attachedCasings.length - 1].end;

    const { outerCasings, holes: overlappingHoles } = findIntersectingItems(cement, bottomOfCement, attachedCasings, casings, holes);

    const innerDiameterIntervals = attachedCasings;

    const outerDiameterIntervals = [...outerCasings, ...overlappingHoles].map((d) => ({
      start: d.start,
      end: d.end,
    }));

    const changeDepths = cementDiameterChangeDepths(cement, bottomOfCement, [...innerDiameterIntervals, ...outerDiameterIntervals]);

    const diameterAtChangeDepths = changeDepths.map(calculateCementDiameter(attachedCasings, outerCasings, overlappingHoles));

    const path = this.getZFactorScaledPathForPoints(
      cement.toc,
      bottomOfCement,
      diameterAtChangeDepths.map((d) => d.md),
    );
    const normals = createNormals(path.map((p) => p.point));
    const pathWithNormals: MDPoint[] = path.map((p, i) => ({
      ...p,
      normal: normals[i],
    }));

    const side1Left: Point[] = [];
    const side1Right: Point[] = [];
    const side2Left: Point[] = [];
    const side2Right: Point[] = [];

    let previousDepth = diameterAtChangeDepths.shift();
    for (const depth of diameterAtChangeDepths) {
      const intervalMdPoints = pathWithNormals.filter((x) => x.md >= previousDepth.md && x.md <= depth.md);

      const intervalPoints = intervalMdPoints.map((s) => s.point);
      const intervalPointNormals = intervalMdPoints.map((s) => s.normal);

      const outerRadius = (previousDepth.outerDiameter / 2) * exaggerationFactor;
      const innerRadius = (previousDepth.innerDiameter / 2) * exaggerationFactor;

      const intervalSide1Left = offsetPoints(intervalPoints, intervalPointNormals, outerRadius);
      const intervalSide1Right = offsetPoints(intervalPoints, intervalPointNormals, innerRadius);
      const intervalSide2Left = offsetPoints(intervalPoints, intervalPointNormals, -innerRadius);
      const intervalSide2Right = offsetPoints(intervalPoints, intervalPointNormals, -outerRadius);

      side1Left.push(...intervalSide1Left);
      side1Right.push(...intervalSide1Right);
      side2Left.push(...intervalSide2Left);
      side2Right.push(...intervalSide2Right);

      previousDepth = depth;
    }

    const pathPoints = pathWithNormals.map((p) => new Point(p.point[0], p.point[1]));
    const leftPolygon = makeTubularPolygon(side1Left, side1Right);
    const rightPolygon = makeTubularPolygon(side2Left, side2Right);

    return { leftPolygon, rightPolygon, path: pathPoints, casingIds: attachedCasings.map((c) => c.casingId) };
  }

  private createCementTexture(): Texture {
    if (this._textureCache) {
      return this._textureCache;
    }

    const { firstCementColor, secondCementColor } = this.options as CasingAndCementLayerOptions<T>;

    const canvas = document.createElement('canvas');
    canvas.width = 150;
    canvas.height = 150;
    const canvasCtx = canvas.getContext('2d');

    canvasCtx.fillStyle = firstCementColor;
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 1;
    canvasCtx.fillStyle = secondCementColor;

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
