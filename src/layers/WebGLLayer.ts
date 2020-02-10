import { Layer } from './Layer';
import { OnMountEvent, OnUpdateEvent } from '../interfaces';
import { Application, utils } from 'pixi.js';

abstract class WebGLLayer extends Layer {
  elm: HTMLElement;
  ctx: PIXI.Application;

  onMount(event: OnMountEvent) {
    super.onMount(event);
    const { elm, height, width } = event;
    this.elm = elm;
    const pixiOptions = {
      width,
      height,
      antialias: true,
    };

    this.ctx = new Application(pixiOptions);

    this.elm.appendChild(this.ctx.view);
  }

  onUpdate(event: OnUpdateEvent) {
    super.onUpdate(event);
    const [, height] = event.yscale.range();
    const [, width] = event.xscale.range();
    this.ctx.view.style.height = height;
    this.ctx.view.style.width = width;
  }
}

export default WebGLLayer;
