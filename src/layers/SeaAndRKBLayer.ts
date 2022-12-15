import { calcSize } from '../utils';
import { CanvasLayer } from './base';
import { assertNever } from './schematicInterfaces';
import { OnUpdateEvent, OnRescaleEvent, OnMountEvent } from '../interfaces';

export type SeaAndRKBLineType = 'wavy' | 'dashed' | 'solid';

export type SeaAndRKBReferenceLine = {
  kind: 'RKB' | 'MSL' | 'Seabed';
  lineType: SeaAndRKBLineType;
  color: string;
  depth: number;
  lineWidth?: number;
};

export type SeaAndRKBLayerOptions = {
  referenceLines: SeaAndRKBReferenceLine[];
};

export const defaultSeaAndRKBLayerOptions: SeaAndRKBLayerOptions = {
  referenceLines: [
    { kind: 'MSL', lineType: 'wavy', color: 'blue', depth: 0 },
    { kind: 'RKB', lineType: 'dashed', color: 'black', depth: 30 },
    { kind: 'Seabed', lineType: 'solid', color: 'slategray', depth: 100, lineWidth: 2 },
  ],
};

const foldReferenceLineKind = <T>(
  options: {
    Seabed: (seabed: SeaAndRKBReferenceLine) => T;
    RKB: (rkb: SeaAndRKBReferenceLine) => T;
    MSL: (msl: SeaAndRKBReferenceLine) => T;
  },
  ref: SeaAndRKBReferenceLine,
): T => {
  switch (ref.kind) {
    case 'Seabed':
      return options.Seabed(ref);

    case 'RKB':
      return options.RKB(ref);

    case 'MSL':
      return options.MSL(ref);

    default:
      return assertNever(ref.kind);
  }
};

const foldLineType = <T>(
  options: {
    wavy: () => T;
    dashed: () => T;
    solid: () => T;
  },
  lineType: SeaAndRKBLineType,
): T => {
  switch (lineType) {
    case 'wavy':
      return options.wavy();

    case 'dashed':
      return options.dashed();

    case 'solid':
      return options.solid();

    default:
      return assertNever(lineType);
  }
};

export class SeaAndRKBLayer<T> extends CanvasLayer<T> {
  rescaleEvent: OnRescaleEvent | null = null;

  private referenceLines: SeaAndRKBReferenceLine[];

  constructor(id: string, { referenceLines }: SeaAndRKBLayerOptions = defaultSeaAndRKBLayerOptions) {
    super(id);
    this.referenceLines = referenceLines;
  }

  setReferenceLines(referenceLines: SeaAndRKBReferenceLine[]) {
    this.referenceLines = referenceLines;
    this.render();
  }

  onMount(event: OnMountEvent) {
    super.onMount(event);
  }

  onUpdate(event: OnUpdateEvent<T>) {
    super.onUpdate(event);
    this.clearCanvas();
    this.render();
  }

  onRescale(event: OnRescaleEvent) {
    super.onRescale(event);
    this.rescaleEvent = event;
    this.resetTransform();
    this.render();
  }

  private drawRKB(rkb: SeaAndRKBReferenceLine) {
    const { ctx } = this;
    const { yScale } = this.rescaleEvent;
    const { canvas } = this;
    const y = yScale(-rkb.depth);
    ctx.save();
    ctx.strokeStyle = rkb.color;
    this.setCtxLineStyle(ctx, rkb.lineType);
    this.setCtxLineWidth(ctx, rkb);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
    ctx.restore();
  }

  private drawSeabed(seabed: SeaAndRKBReferenceLine) {
    const { ctx } = this;
    const { yScale } = this.rescaleEvent;
    const { canvas } = this;
    const y = yScale(seabed.depth);
    ctx.save();
    ctx.strokeStyle = seabed.color;
    this.setCtxLineStyle(ctx, seabed.lineType);
    this.setCtxLineWidth(ctx, seabed);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
    ctx.restore();
  }

  private drawMeanSeaLevel(msl: SeaAndRKBReferenceLine): void {
    const a = 4;
    const b = 2.5;
    const c = 500;
    const { ctx } = this;
    const { xScale, yScale } = this.rescaleEvent;
    const { canvas } = this;
    const waveHeight = calcSize(a, b, c, yScale);
    const wavePeriod = waveHeight * 2;
    const y = yScale(0) - waveHeight;
    const steps = Math.ceil(canvas.width / wavePeriod) + 1;
    const xOffset = xScale(0) % wavePeriod;
    ctx.save();
    ctx.strokeStyle = msl.color;
    this.setCtxLineStyle(ctx, msl.lineType);
    this.setCtxLineWidth(ctx, msl);
    for (let i = -1; i < steps; i++) {
      ctx.beginPath();
      ctx.arc(i * wavePeriod + xOffset + waveHeight, y, waveHeight, 0, Math.PI);
      ctx.stroke();
    }
    ctx.restore();
  }

  private setCtxLineStyle(ctx: CanvasRenderingContext2D, lineType: SeaAndRKBLineType): void {
    const a = 8;
    const b = 10;
    foldLineType(
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
      lineType,
    );
  }

  private setCtxLineWidth(ctx: CanvasRenderingContext2D, refLine: SeaAndRKBReferenceLine) {
    const defaultLineWidth = 1;
    ctx.lineWidth = refLine.lineWidth || defaultLineWidth;
  }

  private render() {
    if (!this.ctx || !this.rescaleEvent) {
      return;
    }

    requestAnimationFrame(() => {
      this.clearCanvas();

      this.referenceLines.forEach((refLine) => {
        foldReferenceLineKind(
          {
            Seabed: (seabed) => this.drawSeabed(seabed),
            RKB: (rkb) => this.drawRKB(rkb),
            MSL: (msl) => this.drawMeanSeaLevel(msl),
          },
          refLine,
        );
      });
    });
  }
}
