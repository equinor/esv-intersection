import { WellboreBaseComponentLayer, StaticWellboreBaseComponentIncrement } from './WellboreBaseComponentLayer';
import { CementLayerOptions, OnMountEvent, OnUpdateEvent, OnRescaleEvent, Cement, Casing, HoleSize, CompiledCement, MDPoint } from '..';
import { findCasing, findIntersectingItems } from '../datautils/wellboreItemShapeGenerator';
import { Point, Texture } from 'pixi.js';
import { createNormal } from '../utils/vectorUtils';

export class CementLayer extends WellboreBaseComponentLayer {
  options: CementLayerOptions;
  cement: Cement[];
  casings: Casing[];
  holes: HoleSize[];

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
    this.cement = options.data.cement;
    this.casings = options.data.casings;
    this.holes = options.data.holes;
    this.render = this.render.bind(this);
  }

  onMount(event: OnMountEvent): void {
    super.onMount(event);
  }

  onUpdate(event: OnUpdateEvent): void {
    super.onUpdate(event);
    this.render(event);
  }

  onRescale(event: OnRescaleEvent): void {
    super.onRescale(event);
  }

  render(event: OnRescaleEvent | OnUpdateEvent): void {
    super.render(event);

    const { cement, casings, holes } = this;
    this.createCementShapes(cement, casings, holes);
  }

  createCementShapes(cement: Cement[], casings: any, holes: any): any {
    const parseCement = (cement: Cement, casings: any, holes: any) => {
      const attachedCasing = findCasing(cement.casingId, casings);
      const res: CompiledCement = {
        ...cement,
        boc: attachedCasing.end,
        intersectingItems: findIntersectingItems(cement, attachedCasing.end, casings, holes),
      };
      return res;
    };

    const cementCompiled = cement.map((c: any) => parseCement(c, casings, holes));

    const getClosestRelatedItem = (related: any[], md: number): HoleSize | Casing => {
      const between = related.filter((r) => r.start <= md && r.end >= md);
      const sorted = between.sort((r) => r.diameter);
      const result = sorted[0];
      return result;
    };

    const createMiddlePath = (c: CompiledCement): MDPoint[] => {
      const points = [];
      // Add distance to points
      for (let i = c.toc; i < c.boc; i += StaticWellboreBaseComponentIncrement) {
        const p = this.referenceSystem.project(i);
        points.push({ point: new Point(p[0], p[1]), md: i });
      }
      return points;
    };

    const createSimplePolygonPath = (c: CompiledCement): Point[] => {
      const middle = createMiddlePath(c);
      const points: { left: Point[]; right: Point[] } = { left: [], right: [] };

      for (let md = c.toc; md < c.boc; md += StaticWellboreBaseComponentIncrement) {
        // create normal for sections
        const offsetItem = getClosestRelatedItem(c.intersectingItems, md);
        const start = md;
        md = Math.min(c.boc, offsetItem != null ? offsetItem.end : c.boc); // set next calc MD
        const offset = offsetItem != null ? offsetItem.diameter : 100; // Default to flow cement outside to seabed to show error in data
        const stop = md;
        const partPoints = middle.filter((x) => x.md >= start && x.md <= stop).map((s) => s.point);
        const sideLeft = createNormal(partPoints, -offset);
        const sideRight = createNormal(partPoints, offset);
        // subtract center piece with diameter from c.casingId
        points.left.push(...sideLeft);
        points.right.push(...sideRight);
      }

      const centerPiece = findCasing(c.casingId, this.casings);
      const wholeMiddlePoints = middle.map((s) => s.point);
      const sideLeftMiddle = createNormal(wholeMiddlePoints, -centerPiece.diameter);
      const sideRightMiddle = createNormal(wholeMiddlePoints, +centerPiece.diameter);

      const a = [
        ...sideLeftMiddle.map((s) => s.clone()).reverse(),
        ...points.left,
        points.left[points.left.length - 1], // Start drawing next rect from the previouis bottom
        ...points.right.map((s) => s.clone()).reverse(),
        ...sideRightMiddle,
      ];
      return a;
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

    const num = 10;
    for (let i = -canvas.width; i < canvas.width; i++) {
      canvasCtx.moveTo(-canvas.width + num * i, -canvas.height);
      canvasCtx.lineTo(canvas.width + num * i, canvas.height);
    }
    canvasCtx.stroke();

    const t = Texture.from(canvas);

    return t;
  };
}
