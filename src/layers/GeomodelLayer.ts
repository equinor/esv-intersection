import { Graphics } from 'pixi.js';
import { PixiLayer } from './base/PixiLayer';
import { GeoModelData, GeomodelLayerOptions, OnUpdateEvent, OnRescaleEvent, OnMountEvent } from '../interfaces';

export class GeomodelLayer extends PixiLayer {
  options: GeomodelLayerOptions;

  graphics: Graphics;

  constructor(id?: string, options?: GeomodelLayerOptions) {
    super(id, options);
    this.render = this.render.bind(this);
  }

  onMount(event: OnMountEvent): void {
    super.onMount(event);
    this.graphics = new Graphics();
    this.ctx.stage.addChild(this.graphics);
  }

  onUpdate(event: OnUpdateEvent): void {
    super.onUpdate(event);
    this.render();
  }

  onRescale(event: OnRescaleEvent): void {
    this.graphics.position.set(event.transform.x, event.transform.y);
    this.graphics.scale.set(event.xRatio, event.yRatio);
    this.render();
  }

  render(): void {
    if (!this.ctx) {
      return;
    }
    const { data } = this;
    if (!data) {
      return;
    }

    this.graphics.clear();
    data.areas.forEach((s: GeoModelData) => this.drawAreaPolygon(s));
    data.lines.forEach((s: any) => this.drawSurfaceLine(s));
  }

  createPolygon = (data: any): number[][] => {
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

  drawAreaPolygon = (s: GeoModelData): void => {
    const { graphics: g } = this;
    const polygons = this.createPolygon(s.data);
    polygons.forEach((polygon: any) => {
      g.beginFill(s.color);
      g.drawPolygon(polygon);
      g.endFill();
    });
  };

  drawSurfaceLine = (s: any): void => {
    const { graphics: g } = this;
    const { data: d } = s;

    const alignment = 0.5;

    g.lineStyle(s.width, s.color, 1, alignment, true);
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
  };
}
