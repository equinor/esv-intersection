import { Graphics } from 'pixi.js';
import { PixiLayer } from './base/PixiLayer';
import { OnUpdateEvent, OnRescaleEvent } from '../interfaces';
import { SurfaceArea, SurfaceData, SurfaceLine } from '../datautils';
import { SURFACE_LINE_WIDTH } from '../constants';

const DEFAULT_Y_BOTTOM = 10000;

export class GeomodelLayerV2<T extends SurfaceData> extends PixiLayer<T> {
  private isPreRendered = false;

  override onRescale(event: OnRescaleEvent): void {
    super.onRescale(event);

    if (!this.isPreRendered) {
      this.clearLayer();
      this.preRender();
    }

    this.render();
  }

  override onUpdate(event: OnUpdateEvent<T>): void {
    super.onUpdate(event);

    this.isPreRendered = false;
    this.clearLayer();
    this.preRender();
    this.render();
  }

  preRender(): void {
    const { data } = this;

    if (!data) {
      return;
    }

    data.areas.forEach((a) => this.generateAreaPolygon(a));
    data.lines.forEach((l) => this.generateSurfaceLine(l));

    this.isPreRendered = true;
  }

  createPolygons = (data: number[][]): number[][] => {
    const polygons: number[][] = [];
    let polygon: number[] | undefined;

    // Start generating polygons
    for (let i = 0; i < data.length; i++) {
      // Generate top of polygon as long as we have valid values
      const topIsValid = !!data[i]?.[1];
      if (topIsValid) {
        if (polygon == null) {
          polygon = [];
        }
        polygon.push(data[i]?.[0]!, data[i]?.[1]!);
      }

      const endIsReached = i === data.length - 1;
      if (!topIsValid || endIsReached) {
        if (polygon) {
          // Generate bottom of polygon
          for (let j: number = !topIsValid ? i - 1 : i; j >= 0; j--) {
            if (!data[j]?.[1]) {
              break;
            }
            polygon.push(data[j]?.[0]!, data[j]?.[2] || DEFAULT_Y_BOTTOM);
          }
          polygons.push(polygon);
          polygon = undefined;
        }
      }
    }
    return polygons;
  };

  generateAreaPolygon = (s: SurfaceArea): void => {
    const g = new Graphics();
    const polygons = this.createPolygons(s.data);
    polygons.forEach((polygon: number[]) => g.poly(polygon));
    g.setStrokeStyle({ width: 1, color: s.color as number, alpha: 1 });
    g.fill({ color: s.color as number });
    this.addChild(g);
  };

  generateSurfaceLine = (s: SurfaceLine): void => {
    const g = new Graphics();
    const { data: d } = s;

    const alignment = 0.5;
    g.setStrokeStyle({ width: SURFACE_LINE_WIDTH, color: s.color as number, alpha: 1, alignment });

    let penDown = false;
    for (let i = 0; i < d.length; i++) {
      const lineData = d[i];
      if (lineData && lineData[1] && lineData[0]) {
        if (penDown) {
          g.lineTo(lineData[0], lineData[1]);
        } else {
          g.moveTo(lineData[0], lineData[1]);
          penDown = true;
        }
      } else {
        penDown = false;
      }
    }
    this.addChild(g);
  };
}
