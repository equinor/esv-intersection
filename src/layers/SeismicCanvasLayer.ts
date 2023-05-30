import { CanvasLayer } from './base/CanvasLayer';
import { OnUpdateEvent, OnMountEvent, OnRescaleEvent } from '../interfaces';

export type SeismicCanvasDataOptions = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type SeismicCanvasData = {
  image: CanvasImageSource | OffscreenCanvas;
  options: SeismicCanvasDataOptions;
};

export class SeismicCanvasLayer extends CanvasLayer<SeismicCanvasData> {
  override onMount(event: OnMountEvent): void {
    super.onMount(event);
  }

  override onUpdate(event: OnUpdateEvent<SeismicCanvasData>): void {
    super.onUpdate(event);

    this.clearCanvas();

    this.render();
  }

  override onRescale(event: OnRescaleEvent): void {
    super.onRescale(event);
    this.setTransform(event);
    this.render();
  }

  render(): void {
    if (!this.data || !this.ctx || !this.data.image) {
      return;
    }
    const { ctx } = this;
    const { options, image } = this.data;

    this.clearCanvas();

    ctx.drawImage(image, options.x, options.y, options.width, options.height);
  }
}
