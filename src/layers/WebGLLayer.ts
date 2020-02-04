import Layer from './Layer';
import { OnMountEvent, OnUpdateEvent } from '../interfaces';
import { Application, utils } from 'pixi.js';

abstract class WebGLLayer extends Layer {
  elm: HTMLElement;
  ctx: PIXI.Application;

  onMount(event: OnMountEvent) {
    super.onMount(event);
    this.elm = event.elm;
    this.ctx = new Application({ width: 500, height: 500, antialias: true });

    let type = 'WebGL';
    if (!utils.isWebGLSupported()) {
      type = 'canvas';
    }

    this.elm.appendChild(this.ctx.view);
  }

  onUpdate(event: OnUpdateEvent) {
    super.onUpdate(event);
    const { elm, ctx } = this;
    const [, height] = event.yscale.range();
    const [, width] = event.xscale.range();
    this.ctx.view.style.height = height;
    this.ctx.view.style.width = width;
  }
}

export default WebGLLayer;
