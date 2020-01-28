import * as d3 from 'd3';
import Layer from './Layer';
import {
  OnMountEvent,
  OnUpdateEvent,
} from '../interfaces';

abstract class CanvasLayer extends Layer {
  ctx: CanvasRenderingContext2D;
  elm: HTMLElement;

  onMount(event: OnMountEvent) {
    super.onMount(event);
    this.elm = event.elm;

    const canvas = d3.select(event.elm).append('canvas')
      .style('position', 'absolute');
    this.ctx = canvas.node().getContext('2d');
    // hack to avoid blurry canvas
    this.ctx.translate(0.5, 0.5);
  }

  onUpdate(event: OnUpdateEvent) {
    super.onUpdate(event);
    const {
      ctx,
      elm,
    } = this;

    d3.select(ctx.canvas)
      .style('width', `${elm.getAttribute('width')}px`)
      .style('height', `${elm.getAttribute('height')}px`);
  }
}

export default CanvasLayer;
