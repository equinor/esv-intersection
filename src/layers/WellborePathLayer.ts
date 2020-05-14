import { line, curveCatmullRom } from 'd3-shape';
import { SVGLayer } from './base/SVGLayer';
import { WellborepathLayerOptions, OnUpdateEvent, OnRescaleEvent } from '../interfaces';

export class WellborepathLayer extends SVGLayer {
  options: WellborepathLayerOptions;

  rescaleEvent: OnRescaleEvent;

  constructor(id?: string, options?: WellborepathLayerOptions) {
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
    this.rescaleEvent = event;
    this.render();
  }

  render(): void {
    if (!this.elm) {
      return;
    }
    this.elm.select('g').remove();

    const data = this.data || (this.referenceSystem && (this.referenceSystem.projectedPath as [number, number][]));
    if (!data || !this.rescaleEvent) {
      return;
    }

    this.elm
      .append('g')
      .attr('class', 'well-path')
      .append('path')
      .attr('d', this.renderWellborePath(data))
      .attr('stroke-width', this.options.strokeWidth || '2px')
      .attr('stroke', this.options.stroke || 'red')
      .attr('fill', 'none');
  }

  private renderWellborePath(data: [number, number][]): string {
    const { xScale, yScale } = this.rescaleEvent;
    const transformedData: [number, number][] = data.map((d) => [xScale(d[0]), yScale(d[1])]);
    return line().curve(curveCatmullRom)(transformedData);
  }
}
