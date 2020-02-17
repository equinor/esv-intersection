import { SVGLayer } from './SVGLayer';
import {
  WellborepathLayerOptions,
  OnUpdateEvent,
  OnRescaleEvent,
} from '../interfaces';
import { ScaleLinear } from 'd3-scale';
import { line, curveCatmullRom } from 'd3-shape';

export class WellborepathLayer extends SVGLayer {
  options: WellborepathLayerOptions;

  constructor(id: String, options: WellborepathLayerOptions) {
    super(id, options);
    this.options = {
      ...options,
    };
    this.render = this.render.bind(this);
  }

  onUpdate(event: OnUpdateEvent) {
    super.onUpdate(event);
    this.render(event);
  }

  onRescale(event: OnRescaleEvent) {
    super.onRescale(event);
    this.elm.select('g').attr('transform', `translate(${event.transform.x} ${event.transform.y}) scale(${event.xRatio}, ${event.yRatio})`);
  }

  render(event: OnRescaleEvent | OnUpdateEvent) {
    if (!this.elm) {
      return;
    }
    this.elm.select('g').remove();

    const { data } = event;

    this.elm.select('g').remove();

    this.elm
      .append('g')
      .attr('class', 'well-path')
      .append('path')
      .attr('d', this.renderWellborePath(data))
      .attr('stroke-width', this.options.strokeWidth)
      .attr('stroke', this.options.stroke)
      .attr('fill', 'none');
  }

  private renderWellborePath = (data: [number, number][]): string =>
    line().curve(curveCatmullRom)(data);
}
