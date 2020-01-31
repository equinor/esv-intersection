import CanvasLayer from './CanvasLayer';
import { GridLayerOptions, OnUpdateEvent, OnRescaleEvent } from '../interfaces';
import { ScaleLinear } from 'd3-scale';

class WellborepathLayer extends CanvasLayer {
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
    const { ctx, options } = this;

    if (!ctx) {
      return;
    }

    const { xscale, yscale } = event;

    ctx.save();
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    const data = [
      [50, 0],
      [50, 10],
      [50, 20],
      [50, 30],
      [50, 40],
      [50, 50],
    ];
    const renderData = this.generateScaleData(data, xscale, yscale);
    this.renderWellborePath(renderData);
    ctx.restore();
  }
  generateScaleData(
    data: number[][],
    xscale: ScaleLinear<number, number>,
    yscale: ScaleLinear<number, number>,
  ): number[][] {
    const translatedData: number[][] = [];
    data.forEach((point: number[]) => {
      translatedData.push([xscale.invert(point[0]), yscale.invert(point[1])]);
    });
    return translatedData;
  }

  private renderWellborePath(data: number[][]) {
    this.ctx.moveTo(data[0][0], data[0][1]);
    data.forEach((point: any) => {
      this.ctx.beginPath();
      this.ctx.lineTo(point[0], point[1]);
      this.ctx.stroke();
    });
  }
}

export default WellborepathLayer;
