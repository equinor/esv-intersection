import { WellboreBaseComponentLayer } from './WellboreBaseComponentLayer';
import { CementLayerOptions, OnMountEvent, OnUpdateEvent, OnRescaleEvent, Cement, Casing, HoleSize, CompiledCement, MDPoint } from '..';
import { findCasing, findIntersectingItems } from '../datautils/wellboreItemShapeGenerator';
import { Point, Texture } from 'pixi.js';
import { createNormal } from '../utils/vectorUtils';

export class CementLayer extends WellboreBaseComponentLayer {
  options: CementLayerOptions;
  constructor(id?: string, options?: CementLayerOptions) {
    super(id, options);
    this.options = {
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
    this.createCementShapes(cement, casings, holes);
  }

  createCementShapes(cement: Cement[], casings: any, holes: any): any {
    const parseCement = (cement: Cement, casings: Casing[], holes: HoleSize[]) => {
      const attachedCasing = findCasing(cement.casingId, casings);
      const res: CompiledCement = {
        ...cement,
        boc: attachedCasing.end,
        intersectingItems: findIntersectingItems(cement, attachedCasing, casings, holes),
      };
      return res;
    };

    const cementCompiled = cement.map((c: Cement) => parseCement(c, casings, holes));

    const getClosestRelatedItem = (related: (Casing | HoleSize)[], md: number): HoleSize | Casing => {
      const between = related.filter((r) => r.start <= md && r.end >= md);
      const sorted = between.sort((a, b) => (a.diameter < b.diameter ? -1 : 1));
      const result = sorted[0];
      return result;
    };

    const createMiddlePath = (c: CompiledCement): MDPoint[] => {
      const points = [];
      // Add distance to points
      for (let i = c.toc; i < c.boc; i += this.options.wellboreBaseComponentIncrement) {
        const p = this.referenceSystem.project(i);
        points.push({ point: new Point(p[0], p[1]), md: i });
      }
      return points;
    };

    const createSimplePolygonPath = (c: CompiledCement): Point[] => {
      const middle = createMiddlePath(c);
      const points: { left: Point[]; right: Point[] } = { left: [], right: [] };
      let prevPoint = null;

      for (let md = c.toc; md < c.boc; md += this.options.wellboreBaseComponentIncrement) {
        // create normal for sections
        const offsetItem = getClosestRelatedItem(c.intersectingItems, md);
        const start = md;
        md = Math.min(c.boc, offsetItem != null ? offsetItem.end : c.boc); // set next calc MD

        // Subtract casing thickness / holesize edge
        const offsetDimDiff = offsetItem.diameter - offsetItem.innerDiameter || 1;
        const defaultCementWidth = 100; // Default to flow cement outside to seabed to show error in data
        const offset = offsetItem != null ? offsetItem.diameter - offsetDimDiff : defaultCementWidth;
        const stop = md;
        let partPoints = middle.filter((x) => x.md >= start && x.md <= stop).map((s) => s.point);

        if (prevPoint != null) {
          partPoints = [prevPoint, ...partPoints];
        }

        const sideLeft = createNormal(partPoints, -offset);
        const sideRight = createNormal(partPoints, offset);

        prevPoint = partPoints[partPoints.length - 2];

        points.left.push(...sideLeft);
        points.right.push(...sideRight);
      }

      const centerPiece = findCasing(c.casingId, this.data.casings);
      const wholeMiddlePoints = middle.map((s) => s.point);
      const sideLeftMiddle = createNormal(wholeMiddlePoints, -centerPiece.diameter);
      const sideRightMiddle = createNormal(wholeMiddlePoints, +centerPiece.diameter);

      const sideLeftMiddleR = sideLeftMiddle.map((s) => s.clone()).reverse();
      const rightR = points.right.map((s) => s.clone()).reverse();
      const cementRectCoords = [...sideLeftMiddleR, ...points.left, sideLeftMiddleR[0], ...rightR, ...sideRightMiddle];

      // const line = [...sideLeftMiddleR, ...points.left];
      // this.drawLine(line, 0xff0000);
      return cementRectCoords;
    };

    const t = this.createTexture();
    const paths = cementCompiled.map((c) => createSimplePolygonPath(c));

    // const bigSquareBackgroundTest = new Graphics();
    // bigSquareBackgroundTest.beginTextureFill({ texture: t });
    // bigSquareBackgroundTest.drawRect(-1000, -1000, 2000, 2000);
    // bigSquareBackgroundTest.endFill();
    // this.ctx.stage.addChild(bigSquareBackgroundTest);

    paths.map((p) => this.drawBigPolygon(p, t));
  }

  createTexture = (): Texture => {
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
  };
}
