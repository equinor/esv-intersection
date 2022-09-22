import { select, Selection } from 'd3-selection';
import { Layer } from './Layer';
import { OnMountEvent, OnResizeEvent } from '../../interfaces';
import { DEFAULT_LAYER_HEIGHT, DEFAULT_LAYER_WIDTH } from '../../constants';

export abstract class SVGLayer<T> extends Layer<T> {
  elm: Selection<SVGElement, unknown, null, undefined>;

  onMount(event: OnMountEvent): void {
    super.onMount(event);
    const { elm } = event;
    const width = event.width || parseInt(elm.getAttribute('width'), 10) || DEFAULT_LAYER_WIDTH;
    const height = event.height || parseInt(elm.getAttribute('height'), 10) || DEFAULT_LAYER_HEIGHT;
    if (!this.elm) {
      this.elm = select(elm).append('svg');
      this.elm.attr('id', `${this.id}`);
      this.elm.attr('class', 'svg-layer');
    }
    this.elm.attr('height', height).attr('width', width);
    const interactive = this.interactive ? 'auto' : 'none';
    this.elm.style('position', 'absolute').style('pointer-events', interactive).style('opacity', this.opacity).style('z-index', this.order);
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

  onOpacityChanged(opacity: number): void {
    if (this.elm) {
      this.elm.style('opacity', opacity);
    }
  }

  onOrderChanged(order: number): void {
    if (this.elm) {
      this.elm.style('z-index', order);
    }
  }

  onInteractivityChanged(shouldBeInteractive: boolean): void {
    if (this.elm) {
      const interactive = shouldBeInteractive ? 'auto' : 'none';
      this.elm.style('pointer-events', interactive);
    }
  }
}
