import { Point, Texture } from 'pixi.js';
import { WellboreBaseComponentLayer } from './WellboreBaseComponentLayer';
import { CementLayerOptions, OnUpdateEvent, OnRescaleEvent, Cement, Casing, HoleSize, CompiledCement, MDPoint } from '..';
import { findCasing, findIntersectingItems } from '../datautils/wellboreItemShapeGenerator';
import { createNormals, offsetPoints } from '../utils/vectorUtils';

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

    const getMdPoint = (md: number) => {
      const p = this.referenceSystem.project(md);
      const point = { point: new Point(p[0], p[1]), md: md };
      return point;
    };

    const createMiddlePath = (c: CompiledCement): MDPoint[] => {
      const points = [];
      let prevAngle = 10000;
      const allowedAngleDiff = 0.0005;
      const morePointsForStartAndEndMeters = 10;

      // Take more points for the start and end (default 10 meters, or if not enough cement. Use 1/3 of the cement length)
      const lastMeters = c.boc - morePointsForStartAndEndMeters > c.toc ? c.boc - morePointsForStartAndEndMeters : c.boc - (c.boc - c.toc) / 3;
      const firstMeters = c.toc + morePointsForStartAndEndMeters < c.boc ? c.toc + morePointsForStartAndEndMeters : c.toc + (c.boc - c.toc) / 3;

      // Always add first points
      for (let i = c.toc; i < firstMeters; i += this.options.wellboreBaseComponentIncrement) {
        points.push(getMdPoint(i));
      }

      // Add distance to points
      for (let i = firstMeters; i < lastMeters; i += this.options.wellboreBaseComponentIncrement) {
        const point = getMdPoint(i);
        const angle = Math.atan2(point.point.y, point.point.x);

        // Reduce number of points on a straight line by angle since last point
        if (Math.abs(angle - prevAngle) > allowedAngleDiff) {
          points.push(point);
          prevAngle = angle;
        }
      }

      // Always add last points
      for (let i = lastMeters; i < c.boc; i += this.options.wellboreBaseComponentIncrement) {
        points.push(getMdPoint(i));
      }
      points.push(getMdPoint(c.boc));

      return points;
    };

    const getOffset = (offsetItem: any): number => {
      const offsetDefaultDim = 0.1;
      const defaultCementWidth = 100; // Default to flow cement outside to seabed to show error in data

      const offsetDimDiff =
        offsetItem != null && offsetItem.diameter != null && offsetItem.innerDiameter != null
          ? offsetItem.diameter - offsetItem.innerDiameter
          : offsetDefaultDim;
      const offset = offsetItem != null ? offsetItem.diameter - offsetDimDiff : defaultCementWidth;

      return offset;
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
        const stop = md;
        const partPoints = middle.filter((x) => x.md >= start && x.md <= stop).map((s) => s.point);
        const partPointNormals = createNormals(partPoints);

        const offset = getOffset(offsetItem);

        const sideLeft = offsetPoints(partPoints, partPointNormals, -offset);
        const sideRight = offsetPoints(partPoints, partPointNormals, offset);
        points.left.push(...sideLeft);
        points.right.push(...sideRight);
      }

      const wholeMiddlePoints = middle.map((s) => s.point);
      const wholeMiddlePointNormals = createNormals(wholeMiddlePoints);

      const centerPieceDim = findCasing(c.casingId, this.data.casings).diameter;

      const sideLeftMiddle = offsetPoints(wholeMiddlePoints, wholeMiddlePointNormals, -centerPieceDim);
      const sideRightMiddle = offsetPoints(wholeMiddlePoints, wholeMiddlePointNormals, +centerPieceDim);

      const sideLeftMiddleR = sideLeftMiddle.map((s) => s.clone()).reverse();
      const rightR = points.right.map((s) => s.clone()).reverse();
      const cementRectCoords = [...sideLeftMiddleR, ...points.left, ...rightR, ...sideRightMiddle];

      // const line = [sideLeftMiddleR[0], sideLeftMiddleR[sideLeftMiddleR.length - 1]];
      // this.drawLine(line, 0xff0000);

      return cementRectCoords;
    };

    const texture: Texture = this.createTexture();
    const paths = cementCompiled.map(createSimplePolygonPath);

    // const bigSquareBackgroundTest = new Graphics();
    // bigSquareBackgroundTest.beginTextureFill({ texture });
    // bigSquareBackgroundTest.drawRect(-1000, -1000, 2000, 2000);
    // bigSquareBackgroundTest.endFill();
    // this.ctx.stage.addChild(bigSquareBackgroundTest);

    paths.map((polygon) => this.drawBigPolygon(polygon, texture));
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
