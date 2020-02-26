import { Graphics } from 'pixi.js';
import { WebGLLayer } from './WebGLLayer';
import {
  GeoModelData,
  GeomodelLayerOptions,
  OnUpdateEvent,
  OnRescaleEvent,
} from '../interfaces';

export class GeomodelLayer extends WebGLLayer {
  options: GeomodelLayerOptions;

  constructor(id: string, options: GeomodelLayerOptions) {
    super(id, options);
    this.options = {
      ...options,
    };
    this.render = this.render.bind(this);
  }

  onUpdate(event: OnUpdateEvent): void {
    super.onUpdate(event);
    this.render(event);
  }

  onRescale(event: OnRescaleEvent): void {
    super.onRescale(event);
    this.render(event);
  }

  render(event: OnRescaleEvent | OnUpdateEvent): void {
    const { data } = event;

    // for each layer
    // paint from top down, with color
    // if missing bottom data is null, use next area top line as bottom

    data.forEach((s: GeoModelData) => this.drawAreaPolygon(s));
  }

  createPolygon = (data: number[][]): number[] => {
    const fixed = [];
    for (let i = 0; i < data[0].length; i++) {
      fixed.push(data[0][i]);
      fixed.push(data[1][i]);
    }
    for (let i = 0; i < data[0].length; i++) {
      fixed.push(data[0][data[0].length - i - 1]);
      fixed.push(data[2][data[2].length - i - 1]);
    }

    return fixed;
  };

  drawAreaPolygon = (s: GeoModelData): void => {
    const area = new Graphics();
    area.lineStyle(4, s.color, 1);
    area.beginFill(s.color);
    area.transform = this.transform;
    area.drawPolygon(this.createPolygon(s.data));
    area.endFill();
    this.ctx.stage.addChild(area);
  };
}
