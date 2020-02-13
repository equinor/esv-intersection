
import { CanvasLayer } from './';
import { OnUpdateEvent, OnMountEvent } from '../interfaces';

export class ImageLayer extends CanvasLayer {
  img: HTMLImageElement;

  onMount(event: OnMountEvent) {
    super.onMount(event);
    const img = document.createElement('img');
    img.src = event.url;
    this.img = img;
    this.isLoading = true;
  }

  onUpdate(event: OnUpdateEvent) {
    super.onUpdate(event);
    this.render(event);
  }

  render(event : OnUpdateEvent) {
    const width = parseInt(this.elm.getAttribute('width'));
    const height = parseInt(this.elm.getAttribute('height'));
    const {
      xScale,
      yScale,
      xRatio,
      yRatio,
      x,
      y,
    } = event;
    const calcWidth = width * (xRatio || 1);
    const calcHeight = height * (yRatio || 1);
    if (this.isLoading) {
      this.img.onload = () => {
        this.isLoading = false;
        this.ctx.drawImage(this.img, xScale(x || 0), yScale(y || 0), calcWidth, calcHeight);
      }
    } else {
      this.ctx.drawImage(this.img, xScale(x || 0), yScale(y || 0), calcWidth, calcHeight);
    }
  }
}
