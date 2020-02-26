import { line, curveCatmullRom } from 'd3-shape';
import { ScaleLinear } from 'd3-scale';
import { SVGLayer } from './SVGLayer';
import {
  WellborepathLayerOptions,
  OnUpdateEvent,
  OnRescaleEvent,
} from '../interfaces';

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
    this.render(event);
  }

  onRescale(event: OnRescaleEvent): void {
    super.onRescale(event);
    this.render(event);
  }

  render(event: OnRescaleEvent | OnUpdateEvent): void {
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
  ): [number, number][] => {
    return data.map((point: number[]) => [xscale(point[0]), yscale(point[1])]);
  };

  private renderWellborePath = (data: [number, number][]): string =>
    line().curve(curveCatmullRom)(data);
}
