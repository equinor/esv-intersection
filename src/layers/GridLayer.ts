import CanvasLayer from './CanvasLayer';
import { GridLayerOptions, OnUpdateEvent, OnRescaleEvent } from '../interfaces';

class GridLayer extends CanvasLayer {
  options: GridLayerOptions;

  constructor(id: String, options: GridLayerOptions = {}) {
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

    if (!ctx) return;

    const {
      xscale,
      yscale,
    } = event;


    const [rx1, rx2] = xscale.range();
    const [ry1, ry2] = yscale.range();

    const xticks = xscale.ticks();

    let xminticks = [];
    if (xticks.length >= 2) {
      xminticks = xticks.map((v : any) => v + (xticks[1] - xticks[0]) / 2);
      xminticks.pop();
    }

    const yticks = yscale.ticks();

    let yminticks = [];
    if (yticks.length >= 2) {
      yminticks = yticks.map((v : any) => v + (yticks[1] - yticks[0]) / 2);
      yminticks.pop();
    }

    ctx.save();
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

    ctx.lineWidth = options.minorWidth || 0.25;
    ctx.strokeStyle = options.minorColor || 'lightgray';

    // x minor grid lines
    xminticks.forEach((tx : any) => {
      const x = xscale(tx);
      ctx.beginPath();
      ctx.moveTo(x, ry1);
      ctx.lineTo(x, ry2);
      ctx.stroke();
    });

    // y minor grid lines
    yminticks.forEach((ty : any) => {
      const y = yscale(ty);
      ctx.beginPath();
      ctx.moveTo(rx1, y);
      ctx.lineTo(rx2, y);
      ctx.stroke();
    });

    ctx.lineWidth = options.majorWidth || 0.75;
    ctx.strokeStyle = options.majorColor || 'gray';

    // x major grid lines
    xticks.forEach((tx : any) => {
      const x = xscale(tx);
      ctx.beginPath();
      ctx.moveTo(x, ry1);
      ctx.lineTo(x, ry2);
      ctx.stroke();
    });

    // y major grid lines
    yticks.forEach((ty : any) => {
      const y = yscale(ty);
      ctx.beginPath();
      ctx.moveTo(rx1, y);
      ctx.lineTo(rx2, y);
      ctx.stroke();
    });
    ctx.restore();
  }
}

export default GridLayer;
