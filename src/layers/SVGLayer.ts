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
      this.elm.attr('id', `${this.id}`);
      this.elm.attr('class', 'svg-layer');
    }
    this.elm.attr('height', height || parseInt(elm.getAttribute('height'), 10)).attr('width', width || parseInt(elm.getAttribute('width'), 10));
    this.elm.attr('style', `position:absolute; opacity: ${this.opacity};z-index:${this.order}`);
  }

  onUnmount(): void {
    super.onUnmount();
    this.elm.remove();
    this.elm = null;
  }

  onResize(event: OnResizeEvent): void {
    super.onResize(event);
    this.elm.attr('height', event.height).attr('width', event.width);
  }

  onUpdate(event: OnUpdateEvent): void {
    if (!this.elm) {
      return;
    }
    super.onUpdate(event);
    const { elm } = this;
  }


  onOpacitChanged(opacity: number): void {
    this._opacity = opacity;
    if (this.elm) {
      this.elm.attr('style', `position:absolute; opacity: ${opacity};z-index:${this.order}`);
    }
  }

  onOrderChanged(order: number): void {
    this._order = order;
    if (this.elm) {
      this.elm.attr('style', `position:absolute; opacity: ${this.opacity};z-index:${order}`);
    }
  }

}
