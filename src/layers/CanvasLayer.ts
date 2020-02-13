import { Layer } from './Layer';
import {
  OnMountEvent,
  OnUpdateEvent,
} from '../interfaces';

export abstract class CanvasLayer extends Layer {
  ctx: CanvasRenderingContext2D;
  elm: HTMLElement;
  canvas: HTMLCanvasElement;

  onMount(event: OnMountEvent) {
    super.onMount(event);
    this.elm = event.elm;
    let canvas;
    if (!this.canvas) {
      canvas = document.createElement('canvas');
      this.canvas = canvas;
      event.elm.appendChild(canvas)
    }
    this.canvas.setAttribute('id', `${this.id}`);
    this.canvas.setAttribute('style', `position:absolute;z-index:${this.order};opacity:${this.opacity}`);
    this.ctx = this.canvas.getContext('2d');
  }

  onUnmount() {
    super.onUnmount();
    this.canvas.remove();
    this.canvas = null;
  }

  onUpdate(event: OnUpdateEvent) {
    super.onUpdate(event);
    const {
      ctx,
    } = this;
    const {
      xScale,
      yScale,
    } = event;
    const [, width] = xScale.range();
    const [, height] = yScale.range();

    ctx.canvas.setAttribute('style', `position:absolute;z-index:${this.order};opacity:${this.opacity}`);
    ctx.canvas.setAttribute('width', `${width}px`)
    ctx.canvas.setAttribute('height', `${height}px`);
  }
}
