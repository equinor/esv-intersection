import WebGLLayer from './WebGLLayer';
import {
  GeoModelData,
  GeomodelLayerOptions,
  OnUpdateEvent,
  OnRescaleEvent,
} from '../interfaces';
import { ScaleLinear } from 'd3-scale';
import { Graphics } from 'pixi.js';
import { default as c } from 'cat-rom-spline';

class GeomodelLayer extends WebGLLayer {
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
    const { xscale, yscale } = event;
    const [, width] = xscale.range();
    const [, height] = yscale.range();

    const data: GeoModelData[] = [
      {
        name: 'strat 1',
        color: 0xff000,
        md: [70, 90, 100, 110, 100, 100],
        pos: [
          [0 * 2, 99],
          [50 * 2, 99],
          [100 * 2, 99],
          [200 * 2, 99],
          [250 * 2, 99],
          [300 * 2, 99],
          [500 * 2, 99],
        ],
      },
      {
        name: 'strat 2',
        color: 0xffff0,
        md: [100 + 50, 120 + 50, 100 + 50, 140 + 50, 100 + 50, 120 + 50],
        pos: [
          [0 * 2, 99],
          [70 * 2, 99],
          [140 * 2, 99],
          [200 * 2, 99],
          [300 * 2, 99],
          [350 * 2, 99],
          [500 * 2, 99],
        ],
      },
      {
        name: 'strat 3',
        color: 0xffffff,
        md: [100 + 150, 120 + 120, 100 + 170, 140 + 150, 100 + 150, 177 + 150],
        pos: [
          [0 * 2, 99],
          [70 * 2, 99],
          [190 * 2, 99],
          [200 * 2, 99],
          [320 * 2, 99],
          [350 * 2, 99],
          [500 * 2, 99],
        ],
      },
    ];

    const scaledData = this.generateScaledData(data, xscale, yscale);

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

    //     const stratElm = this.elm
    //       .append('g')
    //       .attr('class', 'stratigraphy')

    // data.forEach ( (s, index) =>
    //   stratElm
    //       .append('path')
    //       .attr('d', this.renderAreaTopLine(scaledData[index]))
    //       .attr('stroke-width', '5px')
    //       .attr('stroke', s.color)
    //       .attr('fill', s.color)

    data.forEach((s, index) => {
      let line = new Graphics();
      line.lineStyle(4, s.color, 1);
      line.moveTo(scaledData[0][0][0], scaledData[0][0][1]);
      this.renderAreaTopLine(line, scaledData[index]);
      this.ctx.stage.addChild(line);
    });
  }

  generateScaledData = (
    data: GeoModelData[],
    xscale: ScaleLinear<number, number>,
    yscale: ScaleLinear<number, number>,
  ): [number, number][][] =>
    data.map((stratLayer) =>
      this.generateScaledLayer(stratLayer, xscale, yscale),
    );

  generateScaledLayer = (
    stratLayer: GeoModelData,
    xscale: ScaleLinear<number, number>,
    yscale: ScaleLinear<number, number>,
  ): [number, number][] =>
    stratLayer.pos.map((posPoint: [number, number], index) => [
      xscale(posPoint[0]),
      yscale(stratLayer.md[index]),
    ]);

  private renderAreaTopLine = (line: any, data: [number, number][]): void => {
    //line().curve(curveCatmullRom)(data); // pixi line
    const points = data;
    const options = { samples: 50, knot: 0.5 };

    const interpolatedPOints = c(points, options);

    console.log(interpolatedPOints);

    interpolatedPOints.forEach((p: any) => line.lineTo(p[0], p[1]));
  };
}

export default GeomodelLayer;
