import { line, curveCatmullRom } from 'd3-shape';
import { ScaleLinear } from 'd3-scale';
import { SVGLayer } from './SVGLayer';
import { WellborepathLayerOptions, OnUpdateEvent, OnRescaleEvent } from '../interfaces';

export class WellborepathLayer extends SVGLayer {
  options: WellborepathLayerOptions;

  constructor(id: string, options: WellborepathLayerOptions) {
    super(id, options);
    this.options = {
      ...options,
    };
    this.render = this.render.bind(this);
  }

  onUpdate(event: OnUpdateEvent): void {
    super.onUpdate(event);
    this.render();
  }

  onRescale(event: OnRescaleEvent): void {
    super.onRescale(event);
    if (!this.elm) {
      return;
    }
    this.elm.select('g').attr('transform', `translate(${event.transform.x} ${event.transform.y}) scale(${event.xRatio}, ${event.yRatio})`);
  }

  render(): void {
    if (!this.elm) {
      return;
    }
    this.elm.select('g').remove();

    if (!this.data) {
      return;
    }
    const { data } = this;

    this.elm
      .append('g')
      .attr('class', 'well-path')
      .append('path')
      .attr('d', this.renderWellborePath(data))
      .attr('stroke-width', this.options.strokeWidth)
      .attr('stroke', this.options.stroke)
      .attr('fill', 'none');
  }

  private renderWellborePath = (data: [number, number][]): string => line().curve(curveCatmullRom)(data);
}
