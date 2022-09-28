import { Graphics } from 'pixi.js';
import { PixiLayer } from './base/PixiLayer';
import { OnUpdateEvent, OnRescaleEvent } from '../interfaces';
import { SurfaceArea, SurfaceData, SurfaceLine } from '../datautils';
import { SURFACE_LINE_WIDTH } from '../constants';

const DEFAULT_Y_BOTTOM = 10000;

export class GeomodelLayerV2<T extends SurfaceData> extends PixiLayer<T> {
  private isPreRendered: boolean = false;

  onRescale(event: OnRescaleEvent): void {
    super.onRescale(event);

    if (!this.isPreRendered) {
      this.clearLayer();
      this.preRender();
    }

    this.render();
  }

  onUpdate(event: OnUpdateEvent<T>): void {
    super.onUpdate(event);

    this.isPreRendered = false;
    this.clearLayer();
    this.preRender();
    this.render();
  }

  preRender(): void {
    const { data }: { data: SurfaceData } = this;

    if (!data) {
      return;
    }

    data.areas.forEach((a: SurfaceArea) => this.generateAreaPolygon(a));
    data.lines.forEach((l: SurfaceLine) => this.generateSurfaceLine(l));

    this.isPreRendered = true;
  }

  createPolygons = (data: number[][]): number[][] => {
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
            if (!data[j][1]) {
              break;
            }
            polygon.push(data[j][0], data[j][2] || DEFAULT_Y_BOTTOM);
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
    polygons.forEach((polygon: number[]) => g.drawPolygon(polygon));
    g.endFill();
    this.addChild(g);
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
    this.addChild(g);
  };

  getInternalLayerIds(): string[] {
    return [];
  }
}
