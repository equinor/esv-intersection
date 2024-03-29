import { CanvasLayer } from './base/CanvasLayer';
import { OnUpdateEvent, OnMountEvent, OnRescaleEvent } from '../interfaces';
import { ScaleLinear } from 'd3-scale';

export interface OnImageLayerUpdateEvent<T> extends OnUpdateEvent<T> {
  url: string;
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
  xRatio?: number;
  yRatio?: number;
  x?: number;
  y?: number;
}

export type OnImageLayerRescaleEvent<T> = OnImageLayerUpdateEvent<T> & OnRescaleEvent;

export class ImageLayer<T> extends CanvasLayer<T> {
  img: HTMLImageElement | undefined;

  override onMount(event: OnMountEvent): void {
    super.onMount(event);
    const img = document.createElement('img');
    this.img = img;
    this.isLoading = true;
  }

  override onUpdate(event: OnImageLayerUpdateEvent<T>): void {
    super.onUpdate(event);
    if (this.img != null) {
      this.img.src = event.url;
    }
    this.render(event);
  }

  override onRescale(event: OnImageLayerRescaleEvent<T>): void {
    super.onRescale(event);
    this.setTransform(event);
    this.render(event);
  }

  render(event: OnImageLayerUpdateEvent<T>): void {
    const width = parseInt(this.elm?.getAttribute('width') ?? '0', 10);
    const height = parseInt(this.elm?.getAttribute('height') ?? '0', 10);
    const { xScale, yScale, xRatio, yRatio, x, y } = event;
    const calcWidth = width * (xRatio || 1);
    const calcHeight = height * (yRatio || 1);
    this.clearCanvas();

    if (this.img != null) {
      if (this.isLoading) {
        this.img.onload = (): void => {
          this.isLoading = false;
          // An extra undefined check should happen here as the execution doesn't happen synchronously
          this.img != null && this.ctx?.drawImage(this.img, xScale(x || 0), yScale(y || 0), calcWidth, calcHeight);
        };
      } else {
        this.ctx?.drawImage(this.img, xScale(x || 0), yScale(y || 0), calcWidth, calcHeight);
      }
    }
  }
}
