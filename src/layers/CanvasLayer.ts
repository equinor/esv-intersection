import Layer from './Layer';
import {
  OnMountEvent,
  OnUpdateEvent,
} from '../interfaces';

abstract class CanvasLayer extends Layer {
  ctx: CanvasRenderingContext2D;
  elm: HTMLElement;
  canvas: HTMLCanvasElement;

  onMount(event: OnMountEvent) {
    super.onMount(event);
    this.elm = event.elm;
    const canvas = document.createElement('canvas');
    this.canvas = canvas;
    event.elm.appendChild(canvas).setAttribute('position', 'absolute');
    this.ctx = canvas.getContext('2d');
  }

  onUnmount() {
    super.onUnmount(event);
    this.canvas.setAttribute('style', 'display:none;')
  }

  onUpdate(event: OnUpdateEvent) {
    super.onUpdate(event);
    const {
      ctx,
      elm,
    } = this;

    ctx.canvas.setAttribute('width', `${elm.getAttribute('width')}px`)
    ctx.canvas.setAttribute('height', `${elm.getAttribute('height')}px`);
  }
}

export default CanvasLayer;
