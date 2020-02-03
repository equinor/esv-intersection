import { select } from 'd3-selection';
import Layer from './Layer';
import { OnMountEvent, OnUpdateEvent } from '../interfaces';

abstract class SVGLayer extends Layer {
  elm: d3.Selection<SVGElement, any, null, undefined>;

  onMount(event: OnMountEvent) {
    super.onMount(event);
    this.elm = select(event.elm).append('svg');
  }

  onUpdate(event: OnUpdateEvent) {
    super.onUpdate(event);
    const { elm } = this;
    const { xscale, yscale } = event;
    const [, width] = xscale.range();
    const [, height] = yscale.range();

    elm.attr('height', height).attr('width', width);
  }
}

export default SVGLayer;
