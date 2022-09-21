import { Point, Texture, RENDERER_TYPE } from 'pixi.js';
import { WellboreBaseComponentLayer } from './WellboreBaseComponentLayer';
import { Cement, Casing, HoleSize, MDPoint, WellComponentBaseOptions } from '../interfaces';
import {
  calculateCementDiameter,
  cementDiameterChangeDepths,
  findIntersectingItems,
  makeTubularPolygon,
} from '../datautils/wellboreItemShapeGenerator';
import { createNormals, offsetPoints } from '../utils/vectorUtils';

export interface CementShape {
  rightPolygon: Point[];
  leftPolygon: Point[];
  path: Point[];
}

export type CementData = { cement: Cement[]; casings: Casing[]; holes: HoleSize[] };

export interface CementLayerOptions<T extends CementData> extends WellComponentBaseOptions<T> {
  firstColor?: string;
  secondColor?: string;
}

export class CementLayer<T extends CementData> extends WellboreBaseComponentLayer<T> {
  constructor(id?: string, options?: CementLayerOptions<T>) {
    super(id, options);
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
    const cementShapes = cement.map((cement: Cement) => this.createCementShape(cement, casings, holes));

    const texture: Texture = this.createTexture();

    cementShapes.forEach((cementShape: CementShape) => {
      if (this.renderType() === RENDERER_TYPE.CANVAS) {
        this.drawBigTexturedPolygon(cementShape.leftPolygon, texture);
        this.drawBigTexturedPolygon(cementShape.rightPolygon, texture);
      } else {
        this.drawRopeWithMask(cementShape.path, cementShape.leftPolygon, texture);
        this.drawRopeWithMask(cementShape.path, cementShape.rightPolygon, texture);
      }
    });
  }

  createCementShape = (cement: Cement, casings: Casing[], holes: HoleSize[]): CementShape => {
    const { exaggerationFactor } = this.options as CementLayerOptions<T>;

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

    return { leftPolygon, rightPolygon, path: pathPoints };
  };

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
}
