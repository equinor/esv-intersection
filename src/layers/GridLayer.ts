import { CanvasLayer } from './CanvasLayer';
import { GridLayerOptions, OnUpdateEvent, OnRescaleEvent } from '../interfaces';

// constants
const MINORCOLOR: string = 'lightgray';
const MAJORCOLOR: string = 'gray';
const MINORWIDTH: number = 0.25;
const MAJORWIDTH: number = 0.75;

const defaultOptions = {
  minorColor: MINORCOLOR,
  majorColor: MAJORCOLOR,
  minorWidth: MINORWIDTH,
  majorWidth: MAJORWIDTH,
};

export class GridLayer extends CanvasLayer {
  options: GridLayerOptions;

  constructor(id?: string, options?: GridLayerOptions) {
    super(id, options);
    this.options = {
      ...(options || defaultOptions),
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
    const { ctx, options } = this;

    if (!ctx) {
      return;
    }

    this.clearCanvas();

    const { xScale, yScale } = event;

    const [rx1, rx2] = xScale.range();
    const [ry1, ry2] = yScale.range();

    ctx.lineWidth = options.minorWidth || MINORWIDTH;
    ctx.strokeStyle = options.minorColor || MINORCOLOR;

    // minor grid lines
    const xminticks = this.mapMinorTicks(xScale.ticks());
    const yminticks = this.mapMinorTicks(yScale.ticks());
    this.renderTicksX(xScale, xminticks, ry1, ry2);
    this.renderTicksY(yScale, yminticks, rx1, rx2);

    ctx.lineWidth = options.majorWidth || MAJORWIDTH;
    ctx.strokeStyle = options.majorColor || MAJORCOLOR;

    // major grid lines
    this.renderTicksX(xScale, xScale.ticks(), ry1, ry2);
    this.renderTicksY(yScale, yScale.ticks(), rx1, rx2);
    ctx.restore();
  }

  private renderTicksX(xscale: any, xticks: any, ry1: any, ry2: any): void {
    xticks.forEach((tx: any) => {
      const x = xscale(tx);
      this.ctx.beginPath();
      this.ctx.moveTo(x, ry1);
      this.ctx.lineTo(x, ry2);
      this.ctx.stroke();
    });
  }

  private renderTicksY(yscale: any, yticks: any, rx1: any, rx2: any): void {
    yticks.forEach((ty: any) => {
      const y = yscale(ty);
      this.ctx.beginPath();
      this.ctx.moveTo(rx1, y);
      this.ctx.lineTo(rx2, y);
      this.ctx.stroke();
    });
  }

  private mapMinorTicks(ticks: any): void {
    let xminticks = [];
    if (ticks.length >= 2) {
      xminticks = ticks.map((v: any) => v + (ticks[1] - ticks[0]) / 2);
      xminticks.pop();
    }
    return xminticks;
  }
}
