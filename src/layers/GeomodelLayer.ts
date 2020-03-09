import { Graphics } from 'pixi.js';
import { WebGLLayer } from './WebGLLayer';
import { GeoModelData, GeomodelLayerOptions, OnUpdateEvent, OnRescaleEvent, OnMountEvent } from '../interfaces';

export class GeomodelLayer extends WebGLLayer {
  options: GeomodelLayerOptions;
  graphics: Graphics;
  // TODO: create proper interface
  data: any;

  constructor(id: string, options: GeomodelLayerOptions) {
    super(id, options);
    this.options = {
      ...options,
    };
    this.render = this.render.bind(this);
  }

  onMount(event: OnMountEvent): void {
    super.onMount(event);
    this.graphics = new Graphics();
    this.ctx.stage.addChild(this.graphics);
  }

  onUpdate(event: OnUpdateEvent): void {
    super.onUpdate(event);
    this.data = event.data;
    this.render();
  }

  onRescale(event: OnRescaleEvent): void {
    super.onRescale(event);
    this.graphics.position.set(event.transform.x, event.transform.y);
    this.graphics.scale.set(event.xRatio, event.yRatio);
  }

  render(): void {
    if (!this.ctx) {
      return;
    }
    const { data } = this;

    this.graphics.clear();

    // for each layer
    // paint from top down, with color
    // if missing bottom data is null, use next area top line as bottom
    data.areas.forEach((s: GeoModelData) => this.drawAreaPolygon(s));

    // for each layer
    // paint from top down, with color
    // if missing bottom data is null, use next area top line as bottom
    data.lines.forEach((s: any) => this.drawSurfaceLine(s));
  }

  createPolygon = (data: any): number[][] => {
    let polygons: number[][] = [];
    let polygon: number[] = null;

    //Start generating polygons
    for (let i: number = 0; i < data.length; i++) {
      //Generate top of polygon as long as we have valid values
      if (data[i][1]) {
        if (polygon === null) {
          polygon = [];
        }
        polygon.push(data[i][0]);
        polygon.push(data[i][1]);
      }

      //If invalid top value or end is reached
      if (!data[i][1] || i === data.length - 1) {
        if (polygon) {
          //Generate bottom of polygon
          for (let j: number = i - 1; j >= 0; j--) {
            if (!data[j][1]) break;
            polygon.push(data[j][0]);
            polygon.push(data[j][2] || 10000);
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
    g.lineStyle(1, s.color, 1);
    g.beginFill(s.color);
    const polygons = this.createPolygon(s.data);
    polygons.forEach(polygon => g.drawPolygon(polygon));
    g.endFill();
  };

  drawSurfaceLine = (s: any): void => {
    const { graphics: g } = this;
    const { data: d } = s;
    g.lineStyle(s.width, s.color, 1);
    let penDown: boolean = false;
    for (let i: number = 0; i < d.length; i++) {
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
