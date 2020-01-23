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
    const canvas = d3.select(event.elm).append('canvas').style('position', 'absolute');
    this.ctx = canvas.node().getContext('2d');
  }

  onUpdate(event: OnUpdateEvent) {
    super.onUpdate(event);
    const {
      ctx,
      elm,
    } = this;

    d3.select(ctx.canvas)
      .style('width', `${elm.clientWidth}px`)
      .style('height', `${elm.clientHeight}px`)
      .attr('width', ctx.canvas.clientWidth)
      .attr('height', ctx.canvas.clientHeight);
  }
}

export default CanvasLayer;
