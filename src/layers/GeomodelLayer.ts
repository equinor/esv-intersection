import { Graphics } from 'pixi.js-legacy';
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

  onUpdate(event: OnUpdateEvent) {
    super.onUpdate(event);
    this.render(event);
  }

  onRescale(event: OnRescaleEvent) {
    super.onRescale(event);
    this.render(event);
  }

  render(event: OnRescaleEvent | OnUpdateEvent) {
    let total = 0;
    const times = 1;
    for (let i = 0; i < times; i++) {
      const start = performance.now();
      const { data } = event;

      // for each layer
      // paint from top down, with color
      // if missing bottom data is null, use next area top line as bottom

      data.forEach((s: GeoModelData, index: number) => this.drawAreaPolygon(s));
      const end = performance.now();
      total += end - start;
    }
    console.log('Performance avg ms', total / times);
  }

  createPolygon = (data: any): number[] => {
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
