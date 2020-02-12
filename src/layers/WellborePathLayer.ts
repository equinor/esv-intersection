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
    this.render(event);
  }

  render(event: OnRescaleEvent | OnUpdateEvent) {
    if (!this.elm) {
      return;
    }
    this.elm.select('g').remove();

    const { xScale, yScale, data } = event;
    const [, width] = xScale.range();
    const [, height] = yScale.range();

    const scaledData = this.generateScaledData(data, xScale, yScale);

    this.elm
      .append('g')
      .attr('class', 'well-path')
      .append('path')
      .attr('d', this.renderWellborePath(scaledData))
      .attr('stroke-width', this.options.strokeWidth)
      .attr('stroke', this.options.stroke)
      .attr('fill', 'none');
  }

  generateScaledData = (
    data: number[][],
    xscale: ScaleLinear<number, number>,
    yscale: ScaleLinear<number, number>,
  ): [number, number][] =>
    data.map((point: number[]) => [xscale(point[0]), yscale(point[1])]);

  private renderWellborePath = (data: [number, number][]): string =>
    line().curve(curveCatmullRom)(data);
}
