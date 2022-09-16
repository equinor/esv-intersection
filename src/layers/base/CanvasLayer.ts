/* eslint-disable @typescript-eslint/no-unused-vars */
import { Layer } from './Layer';
import { OnMountEvent, OnUpdateEvent, OnResizeEvent, OnRescaleEvent } from '../../interfaces';
import { DEFAULT_LAYER_HEIGHT, DEFAULT_LAYER_WIDTH } from '../../constants';

export abstract class CanvasLayer<T> extends Layer<T> {
  ctx: CanvasRenderingContext2D;
  elm: HTMLElement;
  canvas: HTMLCanvasElement;

  onOpacityChanged(opacity: number): void {
    if (this.canvas) {
      this.updateStyle();
    }
  }

  onOrderChanged(order: number): void {
    if (this.canvas) {
      this.updateStyle();
    }
  }

  onInteractivityChanged(interactive: boolean): void {
    if (this.canvas) {
      this.updateStyle();
    }
  }

  setVisibility(visible: boolean): void {
    super.setVisibility(visible);
    if (this.canvas) {
      this.updateStyle(visible);
    }
  }

  updateStyle(visible?: boolean): void {
    const isVisible = visible || this.isVisible;
    const visibility = isVisible ? 'visible' : 'hidden';
    const interactive = this.interactive ? 'auto' : 'none';
    this.canvas.setAttribute(
      'style',
      `position:absolute;pointer-events:${interactive};z-index:${this.order};opacity:${this.opacity};visibility:${visibility}`,
    );
  }

  onMount(event: OnMountEvent): void {
    super.onMount(event);
    const { elm } = event;
    const width = event.width || parseInt(elm.getAttribute('width'), 10) || DEFAULT_LAYER_WIDTH;
    const height = event.height || parseInt(elm.getAttribute('height'), 10) || DEFAULT_LAYER_HEIGHT;
    this.elm = elm;
    let canvas;
    if (!this.canvas) {
      canvas = document.createElement('canvas');
      this.canvas = canvas;
      event.elm.appendChild(canvas);
    }
    this.canvas.setAttribute('id', `${this.id}`);
    this.canvas.setAttribute('width', `${width}px`);
    this.canvas.setAttribute('height', `${height}px`);
    this.canvas.setAttribute('class', 'canvas-layer');
    this.updateStyle();
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
  }

  resetTransform(): void {
    this.ctx.resetTransform();
  }

  setTransform(event: OnRescaleEvent): void {
    this.resetTransform();
    const flippedX = event.xBounds[0] > event.xBounds[1];
    const flippedY = event.yBounds[0] > event.yBounds[1];
    this.ctx.translate(event.xScale(0), event.yScale(0));
    this.ctx.scale(event.xRatio * (flippedX ? -1 : 1), event.yRatio * (flippedY ? -1 : 1));
  }

  clearCanvas(): void {
    const { ctx, canvas } = this;
    ctx.save();
    ctx.resetTransform();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
}
