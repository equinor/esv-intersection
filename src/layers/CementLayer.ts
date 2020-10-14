import { Point, Texture } from 'pixi.js';
import { WellboreBaseComponentLayer } from './WellboreBaseComponentLayer';
import { CementLayerOptions, OnUpdateEvent, OnRescaleEvent, Cement, Casing, HoleSize } from '../interfaces';
import {
  calculateCementDiameter,
  cementDiameterChangeDepths,
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
    if (this.data == null || !this.rescaleEvent) {
      return;
    }

    this.clear();

    const { maxTextureDiameterScale, maxDiameter } = this.options;

    const { cement, casings, holes } = this.data;
    const cementShapes = cement.map((cement: Cement) => this.createCementShape(cement, casings, holes));

    const texture: Texture = this.createTexture(this.dxScale(maxDiameter * maxTextureDiameterScale));

    cementShapes.forEach((cementShape: CementShape) => {
      this.drawRopeWithMask(cementShape.path, cementShape.leftPolygon, texture);
      this.drawRopeWithMask(cementShape.path, cementShape.rightPolygon, texture);
    });
  }

  createCementShape = (cement: Cement, casings: Casing[], holes: HoleSize[]): CementShape => {
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

    const path = this.getScalePathForPointsWithNormals(
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

      const intervalSide1Left = offsetPoints(intervalPoints, intervalPointNormals, this.dxScale(previousDepth.outerDiameter));
      const intervalSide1Right = offsetPoints(intervalPoints, intervalPointNormals, this.dxScale(previousDepth.innerDiameter));
      const intervalSide2Left = offsetPoints(intervalPoints, intervalPointNormals, this.dxScale(-previousDepth.innerDiameter));
      const intervalSide2Right = offsetPoints(intervalPoints, intervalPointNormals, this.dxScale(-previousDepth.outerDiameter));

      side1Left.push(...intervalSide1Left);
      side1Right.push(...intervalSide1Right);
      side2Left.push(...intervalSide2Left);
      side2Right.push(...intervalSide2Right);

      previousDepth = depth;
    }

    const pathPoints = path.map((p) => new Point(p.point[0], p.point[1]));
    const leftPolygon = makeTubularPolygon(side1Left, side1Right);
    const rightPolygon = makeTubularPolygon(side2Left, side2Right);

    return { leftPolygon, rightPolygon, path: pathPoints };
  };

  createTexture(maxWidth: number): Texture {
    // TODO cache texture in stepped increases or avoid recreating texture on zoom
    const textureSize = Math.min(maxWidth, 550);

    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = textureSize;
    const canvasCtx = canvas.getContext('2d');

    canvasCtx.fillStyle = this.options.firstColor;
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 1;
    canvasCtx.fillStyle = this.options.secondColor;

    canvasCtx.beginPath();
    canvasCtx.lineWidth = 1;

    const distanceBetweenLines = 30;
    for (let i = -canvas.width; i < canvas.width; i++) {
      canvasCtx.moveTo(-canvas.width + distanceBetweenLines * i, -canvas.height);
      canvasCtx.lineTo(canvas.width + distanceBetweenLines * i, canvas.height);
    }
    canvasCtx.stroke();

    const t = Texture.from(canvas);

    return t;
  }
}
