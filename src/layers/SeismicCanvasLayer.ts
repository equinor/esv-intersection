import { CanvasLayer } from './CanvasLayer';
import { OnUpdateEvent, OnMountEvent, OnRescaleEvent } from '../interfaces';

export class SeismicCanvasLayer extends CanvasLayer {
  seismicImage: ImageBitmap;
  imageOptions: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  };

  onMount(event: OnMountEvent): void {
    super.onMount(event);
  }

  onUpdate(event: OnUpdateEvent): void {
    super.onUpdate(event);
    if (event.image) {
      this.seismicImage = event.image;
    }
    if (event.options) {
      this.imageOptions = event.options;
    }
    this.render();
  }

  onRescale(event: OnRescaleEvent): void {
    super.onRescale(event);
    this.setTransform(event);
    this.render();
  }

  render(): void {
    const { ctx, imageOptions: options, seismicImage } = this;
    if (!ctx || !seismicImage) {
      return;
    }
    ctx.drawImage(
      seismicImage,
      options.x,
      options.y,
      options.width,
      options.height,
    );
  }
}
