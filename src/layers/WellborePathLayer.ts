import { line, curveCatmullRom } from 'd3-shape';
import { SVGLayer } from './SVGLayer';
import { WellborepathLayerOptions, OnUpdateEvent, OnRescaleEvent } from '../interfaces';

export class WellborepathLayer extends SVGLayer {
  options: WellborepathLayerOptions;

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
    this.elm.select('g').attr('transform', `translate(${event.transform.x} ${event.transform.y}) scale(${event.xRatio}, ${event.yRatio})`);
  }

  render(): void {
    if (!this.elm) {
      return;
    }
    this.elm.select('g').remove();

    const data = this.referenceSystem.projectedPath as [number, number][];

    if (!data) {
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

  private renderWellborePath = (data: [number, number][]): string => line().curve(curveCatmullRom)(data);
}
