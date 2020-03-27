import { select, Selection } from 'd3-selection';
import { Layer } from './Layer';
import { OnMountEvent, OnUpdateEvent, OnResizeEvent } from '../interfaces';

export abstract class SVGLayer extends Layer {
  elm: Selection<SVGElement, any, null, undefined>;

  onMount(event: OnMountEvent): void {
    super.onMount(event);
    const { elm } = event;
    const width = event.width || parseInt(elm.getAttribute('width'), 10) || 200;
    const height = event.height || parseInt(elm.getAttribute('height'), 10) || 300;
    if (!this.elm) {
      this.elm = select(elm).append('svg');
      this.elm.attr('id', `${this.id}`);
      this.elm.attr('class', 'svg-layer');
    }
    this.elm.attr('height', height).attr('width', width);
    this.elm.attr('style', `position:absolute; opacity: ${this.opacity};z-index:${this.order}`);
  }

  onUnmount(): void {
    super.onUnmount();
    this.elm.remove();
    this.elm = null;
  }

  onResize(event: OnResizeEvent): void {
    if (!this.elm) {
      return;
    }
    super.onResize(event);
    this.elm.attr('height', event.height).attr('width', event.width);
  }

  setVisibility(visible: boolean): void {
    super.setVisibility(visible);
    if (this.elm) {
      this.elm.attr('visibility', visible ? 'visible' : 'hidden');
    }
  }

  onOpacitChanged(opacity: number): void {
    this.opacity = opacity;
    if (this.elm) {
      this.elm.attr('style', `position:absolute; opacity: ${opacity};z-index:${this.order}`);
    }
  }

  onOrderChanged(order: number): void {
    this.order = order;
    if (this.elm) {
      this.elm.attr('style', `position:absolute; opacity: ${this.opacity};z-index:${order}`);
    }
  }
}
