import { select } from 'd3-selection';
import { Layer } from './Layer';
import { OnMountEvent, OnUpdateEvent } from '../interfaces';

export abstract class SVGLayer extends Layer {
  elm: d3.Selection<SVGElement, any, null, undefined>;

  onMount(event: OnMountEvent) {
    super.onMount(event);
    if (!this.elm) {
      this.elm = select(event.elm).append('svg');
    }
  }

  onUnmount() {
    super.onUnmount();
    this.elm.remove();
  }

  onUpdate(event: OnUpdateEvent) {
    super.onUpdate(event);
    const { elm } = this;
    const { xscale, yscale } = event;
    const [, width] = xscale.range();
    const [, height] = yscale.range();

    elm.attr('height', height).attr('width', width).attr('style', 'position:absolute');
  }
}
