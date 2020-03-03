import { Layer } from './Layer';
import { OnMountEvent, OnRescaleEvent } from '../interfaces';
import { Application, Transform } from 'pixi.js';

export abstract class WebGLLayer extends Layer {
  elm: HTMLElement;
  container: HTMLElement;
  ctx: Application;
  transform: Transform;

  onMount(event: OnMountEvent) {
    super.onMount(event);
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.setAttribute('id', `${this.id}`);
      this.container.setAttribute('style', `position:absolute;z-index:${this.order};opacity:${this.opacity}`);

      const { elm, height, width } = event;
      this.elm = elm;

      const pixiOptions = {
        width,
        height,
        antialias: true,
        transparent: true,
        clearBeforeRender: true,
        forceCanvas: true,
        // failIfMajorPerformanceCaveat: false,
      };
      this.ctx = new Application(pixiOptions);
      this.container.appendChild(this.ctx.view);
      this.elm.appendChild(this.container);
    }
  }

  onUnmount() {
    super.onUnmount();
    this.ctx.stop();
    this.ctx.destroy(true);
    this.container.remove();
    this.container = null;
    this.ctx = null;
  }

  onRescale(event: OnRescaleEvent) {
    super.onRescale(event);
    if (!this.ctx) {
      return;
    }
    const [, height] = event.yScale.range();
    const [, width] = event.xScale.range();
    this.ctx.view.style.height = `${height}px`;
    this.ctx.view.style.width = `${width}px`;

    this.transform = new Transform();
    this.transform.scale.x = width / (event.xScale.domain()[1] - event.xScale.domain()[0]);
    this.transform.scale.y = height / (event.yScale.domain()[1] - event.yScale.domain()[0]);
  }
}
