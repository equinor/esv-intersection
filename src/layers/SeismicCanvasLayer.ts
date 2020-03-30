import { CanvasLayer } from './CanvasLayer';
import { OnUpdateEvent, OnMountEvent, OnRescaleEvent } from '../interfaces';

export class SeismicCanvasLayer extends CanvasLayer {
  onMount(event: OnMountEvent): void {
    super.onMount(event);
  }

  onUpdate(event: OnUpdateEvent): void {
    super.onUpdate(event);

    this.clearCanvas();

    this.render();
  }

  onRescale(event: OnRescaleEvent): void {
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
