import { ScaleLinear } from 'd3-scale';
import { round } from '@equinor/videx-math';
import { CanvasLayer } from './CanvasLayer';
import { OnUpdateEvent, OnMountEvent, Annotation } from '../interfaces';

import { calcTextSize, positionCallout } from '../utils';

const OFFSET : number = -20;
const MAX_FONT_SIZE = 12;
const MIN_FONT_SIZE = 7;

export class CalloutCanvasLayer extends CanvasLayer {
  data : Annotation[] = [];
  isPanning: boolean;
  xRatio: number;
  overlapped: any[];

  onMount(event : OnMountEvent) {
    super.onMount(event);
    this.data = event.annotations;
  }

  onUpdate(event : OnUpdateEvent) {
    super.onUpdate(event);
    const {
      xScale,
      yScale,
      scale,
    } = event;
    const isLeftToRight = false;

    this.isPanning = this.xRatio && this.xRatio === event.xRatio;
    this.xRatio = event.xRatio;

    this.overlapped = positionCallout(this.data, isLeftToRight, xScale, yScale, scale, this.isPanning, this.overlapped, this.ctx);

    this.render({ ...event, isLeftToRight });
  }
  render(event: OnUpdateEvent) {
    const {
      xScale,
      yScale,
    } = event;

    for (var i = 0; i < this.data.length; i++) {
      const {
        data,
        title,
      } = this.data[i];
      const x = xScale(data[0]);
      const y = yScale(data[1]);

      const anno = this.overlapped && this.overlapped[i];
      const offsetX = anno ? anno.dx : OFFSET;
      const offsetY = anno ? anno.dy : -OFFSET;

      const label = (event.scale === 0 ?
        `${round(anno.md)} ${anno.mdUnit} MD ${anno.depthReferencePoint}` :
        `${round(anno.tvd)} ${anno.mdUnit} TVD MSL`);

      const width =  Math.max(this.ctx.measureText(title).width, this.ctx.measureText(label).width);
      const height = calcTextSize(12, MIN_FONT_SIZE, MAX_FONT_SIZE, xScale);

      const color = anno.group === 'strat-picks' ?
      '#227' :
      'rgba(0,0,0,0.8)';

      this.renderText(title, x - offsetX, y + offsetY - height, height, color);
      this.renderText(label, x - offsetX, y + offsetY, height, color);
      this.renderPoint(x, y);
      this.renderLines(x, y, width, offsetX, offsetY, color, event.isLeftToRight);
    }
  }

  private renderText(title : string, x : number, y : number, height: number, color : string) {
    this.ctx.font =  `${height}px Arial`;
    this.ctx.fillStyle = color;
    this.ctx.fillText(title, x, y);
  }

  private renderPoint(x : number, y : number) {
    this.ctx.moveTo(x, y);
    this.ctx.arc(x, y, 2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private renderLines(x : number, y : number, width : number, offsetX : number, offsetY : number, color : string, isLeftToRight : boolean) {
    const { ctx } = this;
    const textX = x - offsetX;
    const textY = y + offsetY + 2;

    const newX = x;
    const newY = y;
    ctx.moveTo(newX, newY);

    ctx.lineTo(textX, textY);
    ctx.moveTo(textX, textY);
    ctx.lineTo(textX + width, textY);
    ctx.moveTo(textX + width, textY);

    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
};
