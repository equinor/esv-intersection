import { Layer } from './Layer';
import { OnMountEvent, OnUpdateEvent } from '../interfaces';
import { Application, utils, Transform } from 'pixi.js';

export abstract class WebGLLayer extends Layer {
  elm: HTMLElement;
  ctx: Application;
  transform: Transform;

  onMount(event: OnMountEvent) {
    super.onMount(event);
    const { elm, height, width, xScale, yScale } = event;
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
    const [, height] = event.yScale.range();
    const [, width] = event.xScale.range();
    this.ctx.view.style.height = `height`;
    this.ctx.view.style.width = `width`;

    this.transform = new Transform();
    this.transform.scale.x =
      width / (event.xScale.domain()[1] - event.xScale.domain()[0]);
    this.transform.scale.y =
      height / (event.yScale.domain()[1] - event.yScale.domain()[0]);

    console.log(
      'transform',
      this.transform.scale.x,
      (event.xScale.domain()[1] - event.xScale.domain()[0]) / width,
    );
  }
}
