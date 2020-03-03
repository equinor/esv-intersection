import { select, Selection } from 'd3-selection';
import { Layer } from './Layer';
import { OnMountEvent, OnUpdateEvent, OnResizeEvent } from '../interfaces';

export abstract class SVGLayer extends Layer {
  elm: Selection<SVGElement, any, null, undefined>;

  onMount(event: OnMountEvent): void {
    super.onMount(event);
    const { elm, width, height } = event;
    if (!this.elm) {
      this.elm = select(elm).append('svg');
    }
    this.elm.attr('height', height).attr('width', width);
  }

  onUnmount(): void {
    super.onUnmount();
    this.elm.remove();
    this.elm = null;
  }

  onResize(event: OnResizeEvent): void {
    super.onResize(event);
    const { elm } = this;
    const { xScale, yScale } = event;
    const [, width] = xScale.range();
    const [, height] = yScale.range();
    elm.attr('height', height).attr('width', width);
  }

  onUpdate(event: OnUpdateEvent): void {
    if (!this.elm) {
      return;
    }
    super.onUpdate(event);
    const { elm } = this;

    elm.attr('style', `position:absolute; opacity: ${this.opacity};z-index:${this.order}`);
  }
}
