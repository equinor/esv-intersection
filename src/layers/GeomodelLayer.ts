import SVGLayer from './SVGLayer';
import {
  GeomodelLayerOptions,
  OnUpdateEvent,
  OnRescaleEvent,
} from '../interfaces';
import { ScaleLinear } from 'd3-scale';
import { line, curveCatmullRom } from 'd3-shape';

class WellborepathLayer extends SVGLayer {
  options: GeomodelLayerOptions;

  constructor(id: String, options: GeomodelLayerOptions) {
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
    const { xscale, yscale, data } = event;
    const [, width] = xscale.range();
    const [, height] = yscale.range();

    const scaledData = this.generateScaledData(data, xscale, yscale);

    const strat = this.elm
      .append('g')
      .attr('class', 'stratigraphy')

// input
// fields[] {
  // name
  // md[]
  // xy[]
  // color
// }
// for each layer
// paint from bottom up, with color
    // missing data is 0, dont color

data.strats.forEach ( s =>
  strat
      .append('path')
      .attr('d', this.renderAreaTopLine(s.data))
      .attr('stroke-width', '5px')
      .attr('stroke', s.color)
      .attr('fill', s.color);
  }

  generateScaledData = (
    depthData: [number],
    posData: [number,number][],
    xscale: ScaleLinear<number, number>,
    yscale: ScaleLinear<number, number>,
  ): [number, number][] =>
    posData.map((posPoint: number[], index) => [xscale(posPoint[0]), yscale(depthData[index])]);

  private renderAreaTopLine = (data: [number, number][]): string =>
    line().curve(curveCatmullRom)(data); // pixi line
}

export default WellborepathLayer;
