import { ScaleLinear } from 'd3-scale';
import { CanvasLayer } from './CanvasLayer';
import { OnUpdateEvent, OnMountEvent, Annotation } from '../interfaces';

import { calcTextSize } from '../utils';

const OFFSET: number = -20;

export class CalloutCanvasLayer extends CanvasLayer {
  data: Annotation[] = [];
  onMount(event: OnMountEvent) {
    super.onMount(event);
    this.data = event.annotations;
  }

  onUpdate(event: OnUpdateEvent) {
    super.onUpdate(event);
    this.render(event);
  }
  render(event: OnUpdateEvent) {
    for (var i = 0; i < this.data.length; i++) {
      const { data, title } = this.data[i];
      const { xScale, yScale } = event;
      const x = xScale(data[0]);
      const y = yScale(data[1]);

      this.renderText(xScale, x, y, title);
      this.renderPoint(x, y);
      this.renderLines(x, y, title);
    }
  }

  private renderText(
    xScale: ScaleLinear<number, number>,
    x: number,
    y: number,
    title: string,
  ) {
    this.ctx.font = `${calcTextSize(12, 7, 12, xScale)}px Arial`;
    this.ctx.fillText(title, x - OFFSET, y + OFFSET);
  }

  private renderPoint(x: number, y: number) {
    this.ctx.moveTo(x, y);
    this.ctx.arc(x, y, 4, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private renderLines(x: number, y: number, title: string) {
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x - OFFSET, y + OFFSET + 2);
    this.ctx.moveTo(x - OFFSET, y + OFFSET + 2);
    this.ctx.lineTo(
      x - OFFSET + this.ctx.measureText(title).width,
      y + OFFSET + 2,
    );
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }
}
