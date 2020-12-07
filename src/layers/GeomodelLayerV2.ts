import { Graphics } from 'pixi.js';
import { PixiLayer } from './base/PixiLayer';
import { OnUpdateEvent } from '../interfaces';
import { SurfaceArea, SurfaceLine } from '../datautils';
import { SURFACE_LINE_WIDTH } from '../constants';

export class GeomodelLayerV2 extends PixiLayer {
  onUpdate(event: OnUpdateEvent): void {
    super.onUpdate(event);
    this.cleanUpStage();
    if (!this.data) {
      return;
    }

    this.data.areas.forEach((p: any) => this.generateAreaPolygon(p));
    this.data.lines.forEach((l: any) => this.generateSurfaceLine(l));
  }

  cleanUpStage(): void {
    this.ctx.stage.children.forEach((g: Graphics) => g.destroy());
    this.ctx.stage.removeChildren();
  }

  createPolygons = (data: any): number[][] => {
    const polygons: number[][] = [];
    let polygon: number[] = null;

    // Start generating polygons
    for (let i = 0; i < data.length; i++) {
      // Generate top of polygon as long as we have valid values
      const topIsValid = !!data[i][1];
      if (topIsValid) {
        if (polygon === null) {
          polygon = [];
        }
        polygon.push(data[i][0], data[i][1]);
      }

      const endIsReached = i === data.length - 1;
      if (!topIsValid || endIsReached) {
        if (polygon) {
          // Generate bottom of polygon
          for (let j: number = !topIsValid ? i - 1 : i; j >= 0; j--) {
            if (!data[j][1]) break;
            polygon.push(data[j][0], data[j][2] || 10000);
          }
          polygons.push(polygon);
          polygon = null;
        }
      }
    }
    return polygons;
  };

  generateAreaPolygon = (s: SurfaceArea): void => {
    const g = new Graphics();
    g.lineStyle(1, s.color as number, 1);
    g.beginFill(s.color as number);
    const polygons = this.createPolygons(s.data);
    polygons.forEach((polygon: any) => g.drawPolygon(polygon));
    g.endFill();
    this.ctx.stage.addChild(g);
  };

  generateSurfaceLine = (s: SurfaceLine): void => {
    const g = new Graphics();
    const { data: d } = s;

    const alignment = 0.5;
    g.lineStyle(SURFACE_LINE_WIDTH, s.color as number, 1, alignment, true);

    let penDown = false;
    for (let i = 0; i < d.length; i++) {
      if (d[i][1]) {
        if (penDown) {
          g.lineTo(d[i][0], d[i][1]);
        } else {
          g.moveTo(d[i][0], d[i][1]);
          penDown = true;
        }
      } else {
        penDown = false;
      }
    }
    this.ctx.stage.addChild(g);
  };
}
