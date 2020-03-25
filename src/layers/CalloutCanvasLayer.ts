import { round } from '@equinor/videx-math';
import { CanvasLayer } from './CanvasLayer';
import { OnUpdateEvent, Annotation, OnRescaleEvent } from '../interfaces';

import { calcTextSize, positionCallout } from '../utils';

type BoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
};

const OFFSET = -20;
const MAX_FONT_SIZE = 12;
const MIN_FONT_SIZE = 7;

export class CalloutCanvasLayer extends CanvasLayer {
  data: Annotation[] = [];
  isPanning: boolean;
  xRatio: number;
  overlapped: any[];

  onUpdate(event: OnUpdateEvent): void {
    super.onUpdate(event);
    this.data = event.data;
  }

  onRescale(event: OnRescaleEvent): void {
    super.onRescale(event);
    const { xScale, yScale, scale, isLeftToRight } = event;
    this.isPanning = this.xRatio && this.xRatio === event.xRatio;
    this.xRatio = event.xRatio;

    this.overlapped = positionCallout(this.data, isLeftToRight, xScale, yScale, scale, this.isPanning, this.overlapped, this.ctx);

    this.render({ ...event, isLeftToRight });
  }

  render(event: OnRescaleEvent): void {
    this.clearCanvas();

    const { xScale, yScale, isLeftToRight } = event;

    for (let i = 0; i < this.data.length; i++) {
      const { data, title } = this.data[i];
      const x = xScale(data[0]);
      const y = yScale(data[1]);

      const anno = this.overlapped && this.overlapped[i];

      const offsetX = anno ? anno.dx : OFFSET;
      const offsetY = anno ? anno.dy : -OFFSET;

      const label =
        event.scale === 0 ? `${round(anno.md)} ${anno.mdUnit} MD ${anno.depthReferencePoint}` : `${round(anno.tvd)} ${anno.mdUnit} TVD MSL`;

      const width = this.ctx.measureText(title).width;
      const height = calcTextSize(12, MIN_FONT_SIZE, MAX_FONT_SIZE, xScale);

      const color = anno.group === 'strat-picks' ? '#227' : 'rgba(0,0,0,0.8)';

      const alignment = isLeftToRight ? 'topleft' : 'topright';

      const pos = {
        x,
        y,
        width,
        height,
        offsetX,
        offsetY,
      };

      this.renderCallout(title, label, pos, color, alignment);
    }
  }

  private renderAnnotation = (title: string, label: string, x: number, y: number, height: number, color: string): void => {
    this.renderText(title, x, y - height, height, color);
    this.renderText(label, x, y, height, color);
  };

  private renderText(title: string, x: number, y: number, height: number, color: string): void {
    this.ctx.font = `${height}px Arial`;
    this.ctx.fillStyle = color;
    this.ctx.fillText(title, x, y);
  }

  private renderPoint(x: number, y: number): void {
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  private renderCallout(title: string, label: string, bb: BoundingBox, color: string, position: string): void {
    const pos: any = this.getPosition(bb, position);
    const { x, y, dotX, dotY, height } = pos;

    const placeLeft = position === 'topright' || position === 'bottomright';
    this.renderAnnotation(title, label, x, y, height, color);
    this.renderPoint(dotX, dotY);
    this.renderLine(pos, dotX, dotY, color, placeLeft);
  }

  private renderLine = (bb: BoundingBox, dotX: number, dotY: number, color: string, placeLeft: boolean = true): void => {
    const { x, y, width } = bb;
    const { ctx } = this;
    const textX = placeLeft ? x : x + width;
    const inverseTextX = placeLeft ? x + width : x;
    const textY = y + 2;

    ctx.beginPath();
    ctx.moveTo(dotX, dotY);

    ctx.lineTo(textX, textY);
    ctx.moveTo(textX, textY);
    ctx.lineTo(inverseTextX, textY);
    ctx.moveTo(inverseTextX, textY);

    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  private getPosition = (bb: BoundingBox, pos: string): void => {
    const { x, y, offsetX, offsetY, width, height } = bb;
    const positions: any = {
      topright: {
        x: x - offsetX,
        y: y + offsetY - height,
      },
      topleft: {
        x: x - width + offsetX,
        y: y + offsetY - height,
      },
      bottomleft: {
        x: x + offsetX,
        y: y - offsetY - height,
      },
      bottomright: {
        x: x - offsetX,
        y: y - offsetY - height,
      },
    };
    return {
      ...positions[pos],
      width,
      height,
      dotX: x,
      dotY: y,
    };
  };
}
