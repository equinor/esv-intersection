import { merge } from 'd3-array';
import { Point, Texture } from 'pixi.js';
import { WellboreBaseComponentLayer } from './WellboreBaseComponentLayer';
import { CementLayerOptions, OnUpdateEvent, OnRescaleEvent, Cement, Casing, HoleSize, CompiledCement, CementShape } from '../interfaces';
import { cementDiameterChangeDepths, compileCement, calculateCementDiameter, getRopePolygon } from '../datautils/wellboreItemShapeGenerator';
import { offsetPoints } from '../utils/vectorUtils';

export class CementLayer extends WellboreBaseComponentLayer {
  options: CementLayerOptions;
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
    const compiledCements = cement.map((c: Cement) => compileCement(c, casings, holes));
    const cementShapes = compiledCements.map(this.createCementShape);

    const texture: Texture = this.createTexture();

    cementShapes.forEach((cementShape: CementShape) => {
      this.drawRopeWithMask(cementShape.path, cementShape.leftPolygon, texture);
      this.drawRopeWithMask(cementShape.path, cementShape.rightPolygon, texture);
    });
  }

  createCementShape = (cement: CompiledCement): CementShape => {
    const { attachedCasing } = cement;
    const { outerCasings, holes } = cement.intersectingItems;

    const innerDiameterInterval = {
      start: attachedCasing.start,
      end: attachedCasing.end,
    };

    const outerDiameterIntervals = [...outerCasings, ...holes].map((d) => ({
      start: d.start,
      end: d.end,
    }));

    const changeDepths = cementDiameterChangeDepths(cement, [innerDiameterInterval, ...outerDiameterIntervals]);

    const diameterAtChangeDepths = changeDepths.map(calculateCementDiameter(attachedCasing, outerCasings, holes));

    const path = this.getPathWithNormals(
      cement.toc,
      cement.boc,
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
    const leftPolygon = getRopePolygon(side1Left, side1Right);
    const rightPolygon = getRopePolygon(side2Left, side2Right);

    return { leftPolygon, rightPolygon, path: pathPoints };
  };

  createTexture(): Texture {
    const cacheKey = 'cement';
    if (this._textureCache.hasOwnProperty(cacheKey)) {
      return this._textureCache[cacheKey];
    }

    const canvas = document.createElement('canvas');
    canvas.width = 150;
    canvas.height = 150;
    const canvasCtx = canvas.getContext('2d');

    canvasCtx.fillStyle = this.options.firstColor;
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 1;
    canvasCtx.fillStyle = this.options.secondColor;

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
