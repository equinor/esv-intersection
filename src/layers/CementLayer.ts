import { WellboreBaseComponentLayer, StaticWellboreBaseComponentIncrement } from './WellboreBaseComponentLayer';
import { CementLayerOptions, OnMountEvent, OnUpdateEvent, OnRescaleEvent, Cement, Casing, HoleSize, CompiledCement, MDPoint } from '..';
import { isBetween, findCasing, findIntersectingItems } from '../datautils/wellboreItemShapeGenerator';
import { Point } from 'pixi.js';
import { createNormal, arrayToPoint } from '../utils/vectorUtils';

export class CementLayer extends WellboreBaseComponentLayer {
  options: CementLayerOptions;
  data: Cement[];
  casings: Casing[];
  holes: HoleSize[];

  constructor(id?: string, options?: CementLayerOptions) {
    super(id, options);
    this.options = {
      firstColor: '#777788',
      secondColor: '#EEEEFF',
      lineColor: 0x575757,
      percentFirstColor: 1,
      rotation: 45,
      topBottomLineColor: 0x575757,
      maxTextureDiameterScale: 2,
      ...options,
    };
    this.render = this.render.bind(this);
  }

  onMount(event: OnMountEvent): void {
    super.onMount(event);
  }

  onUpdate(event: OnUpdateEvent): void {
    const { cement, casings, holes } = event.data;
    this.createCementShapes(cement, casings, holes);

    super.onUpdate(event);
    this.render(event);
  }

  onRescale(event: OnRescaleEvent): void {
    super.onRescale(event);
  }

  render(event: OnRescaleEvent | OnUpdateEvent): void {
    super.render(event);
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

    const a: any = (c: any) => parseCement(c, casings, holes);

    const cementCompiled = cement.map(a);
    console.log(cementCompiled);
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
      console.log('getc', related, md, between, sorted);
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

    const createSimplePolygonPath = (c: any) => {
      const middle = createMiddlePath(c);

      // create normal for sections
      const offsetItem = getClosestRelatedItem(c.intersectingItems, c.toc);
      console.log('offsetItem', offsetItem);
      const sideLeft = createNormal(
        middle.map((s) => s.point),
        -offsetItem.diameter,
      );
      const sideRight = createNormal(
        middle.map((s) => s.point),
        offsetItem.diameter,
      );
      return [...sideLeft, ...sideRight.map((s) => s.clone()).reverse()];
    };

    const paths = cementCompiled.map(createSimplePolygonPath);

    console.log(paths);

    paths.map((p) => this.drawBigPolygon(p));
  }
}
