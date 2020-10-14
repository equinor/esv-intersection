import { Point, Texture } from 'pixi.js';
import { WellboreBaseComponentLayer } from './WellboreBaseComponentLayer';
import { CementLayerOptions, OnUpdateEvent, OnRescaleEvent, Cement, Casing, HoleSize } from '../interfaces';
import {
  calculateCementDiameter,
  cementDiameterChangeDepths,
  findCasing,
  findIntersectingItems,
  makeTubularPolygon,
} from '../datautils/wellboreItemShapeGenerator';
import { offsetPoints } from '../utils/vectorUtils';

interface CementShape {
  rightPolygon: Point[];
  leftPolygon: Point[];
  path: Point[];
}

export class CementLayer extends WellboreBaseComponentLayer {
  constructor(id?: string, options?: CementLayerOptions) {
    super(id, options);
    this.options = {
      ...this.options,
      firstColor: '#c7b9ab',
      secondColor: '#5b5b5b',
      lineColor: 0x5b5b5b,
      percentFirstColor: 0.05,
      rotation: 45,
      topBottomLineColor: 0x575757,
      maxTextureDiameterScale: 2,
      ...options,
    };
    this.render = this.render.bind(this);
  }

  onUpdate(event: OnUpdateEvent): void {
    super.onUpdate(event);
    this.render(event);
  }

  render(event: OnRescaleEvent | OnUpdateEvent): void {
    if (this.data == null) {
      return;
    }

    const { cement, casings, holes } = this.data;
    const cementShapes = cement.map((cement: Cement) => this.createCementShape(cement, casings, holes));

    const texture: Texture = this.createTexture();

    cementShapes.forEach((cementShape: CementShape) => {
      this.drawRopeWithMask(cementShape.path, cementShape.leftPolygon, texture);
      this.drawRopeWithMask(cementShape.path, cementShape.rightPolygon, texture);
    });
  }

  createCementShape = (cement: Cement, casings: Casing[], holes: HoleSize[]): CementShape => {
    const attachedCasing = findCasing(cement.casingId, casings);
    const bottomOfCement = attachedCasing.end;

    const { outerCasings, holes: overlappingHoles } = findIntersectingItems(cement, attachedCasing, casings, holes);

    const innerDiameterInterval = {
      start: attachedCasing.start,
      end: attachedCasing.end,
    };

    const outerDiameterIntervals = [...outerCasings, ...overlappingHoles].map((d) => ({
      start: d.start,
      end: d.end,
    }));

    const changeDepths = cementDiameterChangeDepths(cement, bottomOfCement, [innerDiameterInterval, ...outerDiameterIntervals]);

    const diameterAtChangeDepths = changeDepths.map(calculateCementDiameter(attachedCasing, outerCasings, overlappingHoles));

    const path = this.getPathWithNormals(
      cement.toc,
      bottomOfCement,
      diameterAtChangeDepths.map((d) => d.md),
    );

    const side1Left: Point[] = [];
    const side1Right: Point[] = [];
    const side2Left: Point[] = [];
    const side2Right: Point[] = [];

    let previousDepth = diameterAtChangeDepths.shift();
    for (const depth of diameterAtChangeDepths) {
      const intervalMdPoints = path.filter((x) => x.md >= previousDepth.md && x.md <= depth.md);

      const intervalPoints = intervalMdPoints.map((s) => s.point);
      const intervalPointNormals = intervalMdPoints.map((s) => s.normal);

      const intervalSide1Left = offsetPoints(intervalPoints, intervalPointNormals, previousDepth.outerDiameter);
      const intervalSide1Right = offsetPoints(intervalPoints, intervalPointNormals, previousDepth.innerDiameter);
      const intervalSide2Left = offsetPoints(intervalPoints, intervalPointNormals, -previousDepth.innerDiameter);
      const intervalSide2Right = offsetPoints(intervalPoints, intervalPointNormals, -previousDepth.outerDiameter);

      side1Left.push(...intervalSide1Left);
      side1Right.push(...intervalSide1Right);
      side2Left.push(...intervalSide2Left);
      side2Right.push(...intervalSide2Right);

      previousDepth = depth;
    }

    const pathPoints = path.map((s) => s.point);
    const leftPolygon = makeTubularPolygon(side1Left, side1Right);
    const rightPolygon = makeTubularPolygon(side2Left, side2Right);

    return { leftPolygon, rightPolygon, path: pathPoints };
  };

  createTexture(): Texture {
    const cacheKey = 'cement';
    if (this._textureCache.hasOwnProperty(cacheKey)) {
      return this._textureCache[cacheKey];
    }

    const { firstColor, secondColor } = this.options as CementLayerOptions;

    const canvas = document.createElement('canvas');
    canvas.width = 150;
    canvas.height = 150;
    const canvasCtx = canvas.getContext('2d');

    canvasCtx.fillStyle = firstColor;
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 1;
    canvasCtx.fillStyle = secondColor;

    canvasCtx.beginPath();

    const distanceBetweenLines = 10;
    for (let i = -canvas.width; i < canvas.width; i++) {
      canvasCtx.moveTo(-canvas.width + distanceBetweenLines * i, -canvas.height);
      canvasCtx.lineTo(canvas.width + distanceBetweenLines * i, canvas.height);
    }
    canvasCtx.stroke();

    const t = Texture.from(canvas);
    this._textureCache[cacheKey] = t;

    return t;
  }
}
