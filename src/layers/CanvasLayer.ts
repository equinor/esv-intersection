import { Layer } from './Layer';
import { OnMountEvent, OnUpdateEvent, OnResizeEvent, OnRescaleEvent } from '../interfaces';

export abstract class CanvasLayer extends Layer {
  ctx: CanvasRenderingContext2D;
  elm: HTMLElement;
  canvas: HTMLCanvasElement;

  onOpacityChanged(opacity: number) {
    if (this.canvas) {
      this.canvas.setAttribute('style', `position:absolute;z-index:${this.order};opacity:${this.opacity}`);
    }
  }

  onOrderChanged(order: number) {
    if (this.canvas) {
      this.canvas.setAttribute('style', `position:absolute;z-index:${this.order};opacity:${this.opacity}`);
    }
  }

  onMount(event: OnMountEvent): void {
    super.onMount(event);
    const { elm, width, height } = event;
    this.elm = elm;
    let canvas;
    if (!this.canvas) {
      canvas = document.createElement('canvas');
      this.canvas = canvas;
      event.elm.appendChild(canvas);
    }
    this.canvas.setAttribute('id', `${this.id}`);
    this.canvas.setAttribute('style', `position:absolute;z-index:${this.order};opacity:${this.opacity}`);
    this.canvas.setAttribute('width', `${width || (this.elm && this.elm.getAttribute('width')) || 300}px`);
    this.canvas.setAttribute('height', `${height || (this.elm && this.elm.getAttribute('height')) || 150}px`);
    this.canvas.setAttribute('class', 'canvas-layer');
    this.ctx = this.canvas.getContext('2d');
  }

  onUnmount(): void {
    super.onUnmount();
    this.canvas.remove();
    this.canvas = null;
  }

  onResize(event: OnResizeEvent): void {
    const { ctx } = this;
    const { width, height } = event;

    ctx.canvas.setAttribute('width', `${width}px`);
    ctx.canvas.setAttribute('height', `${height}px`);
  }

  onUpdate(event: OnUpdateEvent): void {
    super.onUpdate(event);
    const { ctx } = this;
    if (!ctx) {
      return;
    }
  }

  resetTransform(): void {
    this.ctx.resetTransform();
  }

  setTransform(event: OnRescaleEvent): void {
    this.resetTransform();
    this.ctx.translate(event.transform.x, event.transform.y);
    this.ctx.scale(event.xRatio, event.yRatio);
  }

  clearCanvas(): void {
    const { ctx, canvas } = this;
    ctx.save();
    ctx.resetTransform();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
}
