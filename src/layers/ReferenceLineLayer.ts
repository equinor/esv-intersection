import { calcSize } from '../utils';
import { CanvasLayer, LayerOptions } from './base';
import { assertNever } from './schematicInterfaces';
import { OnUpdateEvent, OnRescaleEvent, OnMountEvent } from '../interfaces';
import { ScaleLinear } from 'd3-scale';

export type ReferenceLineType = 'wavy' | 'dashed' | 'solid';

export type ReferenceLine = {
  text?: string;
  lineType: ReferenceLineType;
  color: string;
  depth: number;
  lineWidth?: number;
  textColor?: string;
  fontSize?: string;
};

export interface ReferenceLineLayerOptions extends LayerOptions<ReferenceLine[]> {}

const foldReferenceLine = <T>(
  options: {
    wavy: (wavy: ReferenceLine) => T;
    dashed: (dashed: ReferenceLine) => T;
    solid: (solid: ReferenceLine) => T;
  },
  refLine: ReferenceLine,
): T => {
  switch (refLine.lineType) {
    case 'wavy':
      return options.wavy(refLine);

    case 'dashed':
      return options.dashed(refLine);

    case 'solid':
      return options.solid(refLine);

    default:
      return assertNever(refLine.lineType);
  }
};

export class ReferenceLineLayer extends CanvasLayer<ReferenceLine[]> {
  yScale: ScaleLinear<number, number, never> | null = null;
  xScale: ScaleLinear<number, number, never> | null = null;

  override onMount(event: OnMountEvent) {
    super.onMount(event);
  }

  override onUpdate(event: OnUpdateEvent<ReferenceLine[]>) {
    super.onUpdate(event);
    this.clearCanvas();
    this.render();
  }

  override onRescale(event: OnRescaleEvent) {
    super.onRescale(event);
    this.yScale = event.yScale;
    this.xScale = event.xScale;
    this.resetTransform();
    this.render();
  }

  private drawDashed(dashed: ReferenceLine) {
    const { ctx } = this;
    const { canvas } = this;

    if (ctx != null && canvas != null) {
      const y = this.yScale?.(dashed.depth)!;
      ctx.save();
      ctx.strokeStyle = dashed.color;
      this.setCtxLineStyle(ctx, dashed);
      this.setCtxLineWidth(ctx, dashed);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
      ctx.restore();
      if (dashed.text) {
        this.drawText(ctx, dashed, ctx.canvas.width, y);
      }
    }
  }

  private drawSolid(solid: ReferenceLine) {
    const { ctx } = this;
    const { canvas } = this;
    const y = this.yScale!(solid.depth);
    if (ctx != null && canvas != null) {
      ctx.save();
      ctx.strokeStyle = solid.color;
      this.setCtxLineStyle(ctx, solid);
      this.setCtxLineWidth(ctx, solid);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
      ctx.restore();
      if (solid.text) {
        this.drawText(ctx, solid, ctx.canvas.width, y);
      }
    }
  }

  private drawWavy(wavy: ReferenceLine): void {
    const factor = 4;
    const min = 2.5;
    const max = 500;
    const { ctx, canvas } = this;

    if (this.xScale != null && this.yScale != null && canvas != null && ctx != null) {
      const waveHeight = calcSize(factor, min, max, this.yScale);
      const wavePeriod = waveHeight * 2;
      const y = this.yScale(wavy.depth) - waveHeight;
      const steps = Math.ceil(canvas.width / wavePeriod) + 1;
      const xOffset = this.xScale(0) % wavePeriod;
      ctx.save();
      ctx.strokeStyle = wavy.color;
      this.setCtxLineStyle(ctx, wavy);
      this.setCtxLineWidth(ctx, wavy);
      for (let i = -1; i < steps; i++) {
        ctx.beginPath();
        ctx.arc(i * wavePeriod + xOffset + waveHeight, y, waveHeight, 0, Math.PI);
        ctx.stroke();
      }
      ctx.restore();
      if (wavy.text) {
        this.drawText(ctx, wavy, ctx.canvas.width, y);
      }
    }
  }

  private drawText(ctx: CanvasRenderingContext2D, refLine: ReferenceLine, x: number, y: number) {
    const textColor = refLine.textColor || '#000';
    const fontSize = refLine.fontSize || '10px sans-serif';
    const textOffsetX = 10;

    ctx.save();
    ctx.strokeStyle = textColor;
    ctx.font = fontSize;
    ctx.textAlign = 'end';
    ctx.textBaseline = 'bottom';
    ctx.fillText(refLine.text ?? '', x - textOffsetX, y);
    ctx.restore();
  }

  private setCtxLineStyle(ctx: CanvasRenderingContext2D, refLine: ReferenceLine): void {
    const a = 8;
    const b = 10;
    foldReferenceLine(
      {
        solid: () => {
          ctx.setLineDash([]);
        },
        dashed: () => {
          ctx.setLineDash([a, b]);
        },
        wavy: () => {
          ctx.setLineDash([]);
        },
      },
      refLine,
    );
  }

  private setCtxLineWidth(ctx: CanvasRenderingContext2D, refLine: ReferenceLine) {
    const defaultLineWidth = 1;
    ctx.lineWidth = refLine.lineWidth || defaultLineWidth;
  }

  private render() {
    if (!this.ctx || !this.yScale || !this.xScale) {
      return;
    }

    requestAnimationFrame(() => {
      this.clearCanvas();

      this.data?.forEach((refLine) => {
        foldReferenceLine(
          {
            solid: (solid) => this.drawSolid(solid),
            dashed: (dashed) => this.drawDashed(dashed),
            wavy: (wavy) => this.drawWavy(wavy),
          },
          refLine,
        );
      });
    });
  }
}
