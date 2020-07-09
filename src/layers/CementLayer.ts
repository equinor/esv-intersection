import { merge } from 'd3-array';
import { Point, Texture } from 'pixi.js';
import { WellboreBaseComponentLayer } from './WellboreBaseComponentLayer';
import { CementLayerOptions, OnUpdateEvent, OnRescaleEvent, Cement, Casing, HoleSize, CompiledCement } from '../interfaces';
import { cementDiameterChangeDepths, compileCement, calculateCementDiameter } from '../datautils/wellboreItemShapeGenerator';
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
    const polygons = this.createCementShapes(compiledCements);

    const texture: Texture = this.createTexture();

    polygons.forEach((polygon) => this.drawRope(polygon, texture, true));
  }

  createSimplePolygonPath = (cement: CompiledCement): Point[][] => {
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

    let previousDepth = diameterAtChangeDepths.shift();
    const cementPolygonCoords = diameterAtChangeDepths.map((depth) => {
      const partMdPoints = path.filter((x) => x.md >= previousDepth.md && x.md <= depth.md);

      const partPoints = partMdPoints.map((s) => s.point);
      const partPointNormals = partMdPoints.map((s) => s.normal);

      const side1Left = offsetPoints(partPoints, partPointNormals, previousDepth.outerDiameter);
      const side1Right = offsetPoints(partPoints, partPointNormals, previousDepth.innerDiameter);
      const side2Left = offsetPoints(partPoints, partPointNormals, -previousDepth.innerDiameter);
      const side2Right = offsetPoints(partPoints, partPointNormals, -previousDepth.outerDiameter);

      previousDepth = depth;

      return [
        [...side1Right, ...side1Left.reverse()],
        [...side2Right, ...side2Left.reverse()],
      ];
    });

    return merge(cementPolygonCoords);
  };

  createCementShapes(compiledCements: CompiledCement[]): Point[][] {
    const polygons: Point[][] = merge(compiledCements.map(this.createSimplePolygonPath));

    return polygons;
  }

  createTexture(): Texture {
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

    return t;
  }
}
