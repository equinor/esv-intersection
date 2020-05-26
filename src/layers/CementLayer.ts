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
      let prevAngle = 10000;
      const allowedAngleDiff = 0.0005;

      // Add distance to points
      for (let i = c.toc; i < c.boc; i += this.options.wellboreBaseComponentIncrement) {
        const p = this.referenceSystem.project(i);
        const angle = Math.atan2(p[1], p[0]);
        // Reduce number of points on a straight line by angle since last point
        if (Math.abs(angle - prevAngle) > allowedAngleDiff) {
          points.push({ point: new Point(p[0], p[1]), md: i });
          prevAngle = angle;
        }
      }

      // Always add last point
      const p = this.referenceSystem.project(c.boc);
      points.push({ point: new Point(p[0], p[1]), md: c.boc });
      return points;
    };

    const createSimplePolygonPath = (c: CompiledCement): Point[] => {
      const middle = createMiddlePath(c);
      const points: { left: Point[]; right: Point[] } = { left: [], right: [] };

      for (let md = c.toc; md <= c.boc; md += this.options.wellboreBaseComponentIncrement) {
        // Create normal for sections
        const offsetItem = getClosestRelatedItem(c.intersectingItems, md);
        const start = md;
        md = Math.min(c.boc, offsetItem != null ? offsetItem.end : c.boc); // set next calc MD

        // Subtract casing thickness / holesize edge
        const getOffset = (offsetItem: any) => {
          const offsetDimDiff =
            offsetItem != null && offsetItem.diameter != null && offsetItem.innerDiameter != null
              ? offsetItem.diameter - offsetItem.innerDiameter
              : 0.1;
          const defaultCementWidth = 100; // Default to flow cement outside to seabed to show error in data
          const offset = offsetItem != null ? offsetItem.diameter - offsetDimDiff : defaultCementWidth;

          return offset;
        };
        const stop = md;
        const partPoints = middle.filter((x) => x.md >= start && x.md <= stop).map((s) => s.point);
        const offset = getOffset(offsetItem);
        const sideLeft = createNormal(partPoints, -offset).filter((p) => !isNaN(p.x));
        const sideRight = createNormal(partPoints, offset).filter((p) => !isNaN(p.x));
        points.left.push(...sideLeft);
        points.right.push(...sideRight);
      }

      const centerPieceDim = findCasing(c.casingId, this.data.casings).diameter;
      const wholeMiddlePoints = middle.map((s) => s.point);

      const sideLeftMiddle = createNormal(wholeMiddlePoints, -centerPieceDim);
      const sideRightMiddle = createNormal(wholeMiddlePoints, +centerPieceDim);

      const sideLeftMiddleR = sideLeftMiddle.map((s) => s.clone()).reverse();
      const rightR = points.right.map((s) => s.clone()).reverse();
      const cementRectCoords = [...sideLeftMiddleR, ...points.left, ...rightR, ...sideRightMiddle];

      // const line = [...sideLeftMiddleR, ...points.left];
      // this.drawLine(line, 0xff0000);
      return cementRectCoords;
    };

    const t: any = this.createTexture();
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
