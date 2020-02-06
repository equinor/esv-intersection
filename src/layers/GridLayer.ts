import CanvasLayer from './CanvasLayer';
import { GridLayerOptions, OnUpdateEvent, OnRescaleEvent } from '../interfaces';

// constants
const MINORCOLOR: string = 'lightgray';
const MAJORCOLOR: string = 'gray';
const MINORWIDTH: number = 0.25;
const MAJORWIDTH: number = 0.75;

class GridLayer extends CanvasLayer {
  options: GridLayerOptions;

  constructor(id: String, options: GridLayerOptions = { order: 1 }) {
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
    const {
      ctx,
      options,
    } = this;

    if (!ctx) { return; }

    const {
      xscale,
      yscale,
    } = event;

    const [rx1, rx2] = xscale.range();
    const [ry1, ry2] = yscale.range();

    ctx.save();
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

    ctx.lineWidth = options.minorWidth || MINORWIDTH;
    ctx.strokeStyle = options.minorColor || MINORCOLOR;


    // minor grid lines
    let xminticks = this.mapMinorTicks(xscale.ticks());
    let yminticks = this.mapMinorTicks(yscale.ticks());
    this.renderTicksX(xscale, xminticks, ry1, ry2);
    this.renderTicksY(yscale, yminticks, rx1, rx2);

    ctx.lineWidth = options.majorWidth || MAJORWIDTH;
    ctx.strokeStyle = options.majorColor || MAJORCOLOR;

    // major grid lines
    this.renderTicksX(xscale, xscale.ticks(), ry1, ry2);
    this.renderTicksY(yscale, yscale.ticks(), rx1, rx2);
    ctx.restore();
  }

  private renderTicksX(xscale : any, xticks : any, ry1 : any, ry2 : any) {
    xticks.forEach((tx : any) => {
      const x = xscale(tx);
      this.ctx.beginPath();
      this.ctx.moveTo(x, ry1);
      this.ctx.lineTo(x, ry2);
      this.ctx.stroke();
    });
  }

  private renderTicksY(yscale : any, yticks : any, rx1 : any, rx2 : any) {
    yticks.forEach((ty : any) => {
      const y = yscale(ty);
      this.ctx.beginPath();
      this.ctx.moveTo(rx1, y);
      this.ctx.lineTo(rx2, y);
      this.ctx.stroke();
    });
  }

  private mapMinorTicks(ticks: any) {
    let xminticks = [];
    if (ticks.length >= 2) {
      xminticks = ticks.map((v : any) => v + (ticks[1] - ticks[0]) / 2);
      xminticks.pop();
    }
    return xminticks;
  }
}

export default GridLayer;
