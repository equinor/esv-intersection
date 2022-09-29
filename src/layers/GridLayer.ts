import { CanvasLayer } from './base/CanvasLayer';
import { OnUpdateEvent, OnRescaleEvent } from '../interfaces';
import { ScaleLinear } from 'd3-scale';
import { LayerOptions } from './base/Layer';

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

export interface GridLayerOptions<T> extends LayerOptions<T> {
  majorWidth?: number;
  majorColor?: string;
  minorWidth?: number;
  minorColor?: string;
}

export interface OnGridLayerUpdateEvent<T> extends OnUpdateEvent<T> {
  xScale?: ScaleLinear<number, number, never>;
  yScale?: ScaleLinear<number, number, never>;
}

export class GridLayer<T> extends CanvasLayer<T> {
  private _offsetX: number = 0;
  private _offsetY: number = 0;

  constructor(id?: string, options?: GridLayerOptions<T>) {
    super(id, options);
    this.options = {
      ...this.options,
      ...(options || defaultOptions),
    };
    this.render = this.render.bind(this);
  }

  onUpdate(event: OnGridLayerUpdateEvent<T>): void {
    super.onUpdate(event);
    this.render(event);
  }

  onRescale(event: OnRescaleEvent): void {
    super.onRescale(event);
    this.render(event);
  }

  render(event: OnRescaleEvent | OnGridLayerUpdateEvent<T>): void {
    const { ctx } = this;
    const { minorWidth, minorColor, majorWidth, majorColor } = this.options as GridLayerOptions<T>;

    if (!ctx) {
      return;
    }

    this.clearCanvas();

    if (!(event.xScale || event.yScale)) {
      return;
    }

    const xScale = event.xScale.copy();
    const yScale = event.yScale.copy();

    const xDomain = xScale.domain();
    const yDomain = yScale.domain();

    const offsetX = this.offsetX;
    const offsetY = this.offsetY;

    xScale.domain([xDomain[0] - offsetX, xDomain[1] - offsetX]);
    yScale.domain([yDomain[0] - offsetY, yDomain[1] - offsetY]);

    const [rx1, rx2] = xScale.range();
    const [ry1, ry2] = yScale.range();

    ctx.lineWidth = minorWidth || MINORWIDTH;
    ctx.strokeStyle = minorColor || MINORCOLOR;

    // minor grid lines
    const xminticks = this.mapMinorTicks(xScale.ticks());
    const yminticks = this.mapMinorTicks(yScale.ticks());
    this.renderTicksX(xScale, xminticks, ry1, ry2);
    this.renderTicksY(yScale, yminticks, rx1, rx2);

    ctx.lineWidth = majorWidth || MAJORWIDTH;
    ctx.strokeStyle = majorColor || MAJORCOLOR;

    // major grid lines
    this.renderTicksX(xScale, xScale.ticks(), ry1, ry2);
    this.renderTicksY(yScale, yScale.ticks(), rx1, rx2);
    ctx.restore();
  }

  private renderTicksX(xscale: ScaleLinear<number, number, never>, xticks: number[], ry1: number, ry2: number): void {
    xticks.forEach((tx: number) => {
      const x = xscale(tx);
      this.ctx.beginPath();
      this.ctx.moveTo(x, ry1);
      this.ctx.lineTo(x, ry2);
      this.ctx.stroke();
    });
  }

  private renderTicksY(yscale: ScaleLinear<number, number, never>, yticks: number[], rx1: number, rx2: number): void {
    yticks.forEach((ty: number) => {
      const y = yscale(ty);
      this.ctx.beginPath();
      this.ctx.moveTo(rx1, y);
      this.ctx.lineTo(rx2, y);
      this.ctx.stroke();
    });
  }

  private mapMinorTicks(ticks: number[]): number[] {
    let xminticks: number[] = [];
    if (ticks.length >= 2) {
      xminticks = ticks.map((v: number) => v + (ticks[1] - ticks[0]) / 2);
      xminticks.pop();
    }
    return xminticks;
  }

  get offsetX(): number {
    return this._offsetX;
  }

  set offsetX(offset: number) {
    this._offsetX = offset;
  }

  get offsetY(): number {
    return this._offsetY;
  }

  set offsetY(offset: number) {
    this._offsetY = offset;
  }

  getInternalLayerIds(): string[] {
    return [];
  }
}
