import { CanvasLayer } from './base/CanvasLayer';
import { OnUpdateEvent, OnMountEvent, OnRescaleEvent } from '../interfaces';
import { ScaleLinear } from 'd3-scale';

export interface OnImageLayerUpdateEvent extends OnUpdateEvent<unknown> {
  url: string;
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
  xRatio?: number;
  yRatio?: number;
  x?: number;
  y?: number;
}

export type OnImageLayerRescaleEvent = OnImageLayerUpdateEvent & OnRescaleEvent;

export class ImageLayer extends CanvasLayer<unknown> {
  img: HTMLImageElement;

  onMount(event: OnMountEvent): void {
    super.onMount(event);
    const img = document.createElement('img');
    this.img = img;
    this.isLoading = true;
  }

  onUpdate(event: OnImageLayerUpdateEvent): void {
    super.onUpdate(event);
    this.img.src = event.url;
    this.render(event);
  }

  onRescale(event: OnImageLayerRescaleEvent): void {
    super.onRescale(event);
    this.setTransform(event);
    this.render(event);
  }

  render(event: OnImageLayerUpdateEvent): void {
    const width = parseInt(this.elm.getAttribute('width'), 10);
    const height = parseInt(this.elm.getAttribute('height'), 10);
    const { xScale, yScale, xRatio, yRatio, x, y } = event;
    const calcWidth = width * (xRatio || 1);
    const calcHeight = height * (yRatio || 1);
    this.clearCanvas();
    if (this.isLoading) {
      this.img.onload = (): void => {
        this.isLoading = false;
        this.ctx.drawImage(this.img, xScale(x || 0), yScale(y || 0), calcWidth, calcHeight);
      };
    } else {
      this.ctx.drawImage(this.img, xScale(x || 0), yScale(y || 0), calcWidth, calcHeight);
    }
  }
}
