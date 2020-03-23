import { Application, Transform } from 'pixi.js';
import { Layer } from './Layer';
import { OnMountEvent, OnRescaleEvent, OnResizeEvent } from '../interfaces';

export abstract class WebGLLayer extends Layer {
  elm: HTMLElement;

  container: HTMLElement;

  ctx: Application;

  transform: Transform;

  onMount(event: OnMountEvent): void {
    super.onMount(event);

    if (!this.container) {
      this.container = document.createElement('div');
      this.container.setAttribute('id', `${this.id}`);
      this.container.setAttribute('style', `position:absolute;z-index:${this.order};opacity:${this.opacity}`);
      this.container.setAttribute('class', 'webgl-layer');

      const { elm, height, width } = event;
      this.elm = elm;

      const pixiOptions = {
        width: width || parseInt(this.elm.getAttribute('width'), 10) || 300,
        height: height || parseInt(this.elm.getAttribute('height'), 10) || 100,
        antialias: true,
        transparent: true,
        clearBeforeRender: true,
        forceCanvas: true,
        autoResize: true,
      };

      this.ctx = new Application(pixiOptions);
      this.container.appendChild(this.ctx.view);
      this.elm.appendChild(this.container);
    }
  }

  onUnmount(): void {
    super.onUnmount();
    this.ctx.stop();
    this.ctx.destroy(true);
    this.container.remove();
    this.container = null;
    this.ctx = null;
  }

  onResize(event: OnResizeEvent): void {
    super.onResize(event);
    this.ctx.renderer.resize(event.width, event.height);
  }

  onRescale(event: OnRescaleEvent): void {
    super.onRescale(event);
    if (!this.ctx) {
      return;
    }

    const [, height] = event.yScale.range();
    const [, width] = event.xScale.range();
    this.ctx.view.style.height = `${height}px`;
    this.ctx.view.style.width = `${width}px`;
  }

  setTransform = (width: number, height: number, xScale: any, yScale: any): any => {
    if (!(width !== 0 && height !== 0 && xScale != null && yScale != null)) {
      return null;
    }

    const [xmin, xmax] = xScale.domain();
    const [ymin, ymax] = yScale.domain();
    const xRatio = 1 / Math.abs((xmin - xmax) / width);
    const yRatio = 1 / Math.abs((ymin - ymax) / height);

    return { xRatio, yRatio };
  };

  onOpacityChanged(opacity: number): void {
    if (this.container) {
      this.container.setAttribute('style', `position:absolute;z-index:${this.order};opacity:${opacity}`);
    }
  }

  onOrderChanged(order: number): void {
    if (this.container) {
      this.container.setAttribute('style', `position:absolute;z-index:${order};opacity:${this.opacity}`);
    }
  }

}
