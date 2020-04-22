import { WellboreBaseComponentLayer, StaticWellboreBaseComponentIncrement } from './WellboreBaseComponentLayer';
import { CementLayerOptions, OnMountEvent, OnUpdateEvent, OnRescaleEvent, Cement, Casing, HoleSize, CompiledCement, MDPoint } from '..';
import { isBetween, findCasing, findIntersectingItems } from '../datautils/wellboreItemShapeGenerator';
import { Point, Texture } from 'pixi.js';
import { createNormal, arrayToPoint } from '../utils/vectorUtils';

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
      const res: CompiledCement = {
        toc: cement.toc,
        boc: findCasing(cement.casingId, casings).end,
        intersectingItems: findIntersectingItems(cement, casings, holes),
      };
      return res;
    };

    const cementCompiled = cement.map((c: any) => parseCement(c, casings, holes));

    console.log('compiled', cementCompiled);
    // foreach cement
    // find bottom of cement based on connected casing

    // find all items in the cement range

    // find outer edge, based on closest item
    // order related items by diameter
    // for every staicincrement, find corresponding item.
    // find top of current item || cement stop
    // create shape.. use right edge

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

    const createSimplePolygonPath = (c: any, t: Texture): any => {
      const middle = createMiddlePath(c);
      const points: { left: any[]; right: any[] } = { left: [], right: [] };

      for (let md = c.toc; md < c.boc; md += StaticWellboreBaseComponentIncrement) {
        // create normal for sections
        const offsetItem = getClosestRelatedItem(c.intersectingItems, md);
        const start = md;
        md = Math.min(c.boc, offsetItem != null ? offsetItem.end : c.boc); // set next calc MD
        const offset = offsetItem != null ? offsetItem.diameter : 1;
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
        ...points.left,
        ...sideLeftMiddle.map((s) => s.clone()).reverse(),
        ...sideRightMiddle,
        ...points.right.map((s) => s.clone()).reverse(),
      ];
      // console.log(a);
      return a;
    };

    const t = this.createTex();
    const paths = cementCompiled.map((c) => createSimplePolygonPath(c, t));

    const masks = paths.map((p) => this.drawBigPolygon(p));
    const path = createMiddlePath({ toc: 0, boc: 3230, intersectingItems: [] }).map((s) => s.point);

    masks.map((m) => this.createRopeTextureBackground(path, t, m)); // null mask
  }

  createTex = (): Texture => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 100; //maxWidth > 0 ? maxWidth : canvas.width; // TODO needs to grow with scale
    const canvasCtx = canvas.getContext('2d');

    canvasCtx.fillStyle = this.options.firstColor;
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 1;
    canvasCtx.fillStyle = this.options.secondColor;
    canvasCtx.beginPath();
    const nuim = 20;
    for (let i = 0; i < (canvas.width * 2) / nuim; i++) {
      canvasCtx.moveTo(-canvas.width + i * nuim, 0);
      canvasCtx.lineTo(nuim * i, canvas.height * 2);
      canvasCtx.stroke();
    }

    // translate context to center of canvas
    // canvasCtx.translate(canvas.width / 2, canvas.height / 2);

    // // rotate 45 degrees clockwise
    // canvasCtx.rotate(Math.PI / 4);

    const t = Texture.from(canvas);
    return t;
  };
}
