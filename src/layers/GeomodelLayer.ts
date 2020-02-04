import WebGLLayer from './WebGLLayer';
import {
  GeoModelData,
  GeomodelLayerOptions,
  OnUpdateEvent,
  OnRescaleEvent,
} from '../interfaces';
import { ScaleLinear } from 'd3-scale';
import { Graphics } from 'pixi.js';
import { default as curveCatmullRom } from 'cat-rom-spline';

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
          [0 * 4, 99],
          [50 * 4, 99],
          [100 * 4, 99],
          [200 * 4, 99],
          [250 * 4, 99],
          [300 * 4, 99],
          [500 * 4, 99],
        ],
      },
      {
        name: 'strat 2',
        color: 0xffff0,
        md: [100 + 50, 120 + 50, 100 + 50, 140 + 50, 100 + 50, 120 + 50],
        pos: [
          [0 * 4, 99],
          [70 * 4, 99],
          [140 * 4, 99],
          [200 * 4, 99],
          [300 * 4, 99],
          [350 * 4, 99],
          [500 * 4, 99],
        ],
      },
      {
        name: 'strat 3',
        color: 0xffffff,
        md: [100 + 150, 120 + 120, 100 + 170, 140 + 150, 100 + 150, 177 + 150],
        pos: [
          [0 * 4, 99],
          [70 * 4, 99],
          [190 * 4, 99],
          [200 * 4, 99],
          [320 * 4, 99],
          [350 * 4, 99],
          [500 * 4, 99],
        ],
      },
    ];

    const scaledData = this.generateScaledData(data, xscale, yscale);

    // for each layer
    // paint from bottom up, with color
    // missing data is 0, dont color

    data.forEach((s, index) => {
      let line = new Graphics();
      line.lineStyle(4, s.color, 1);
      line.beginFill(s.color);
      line.moveTo(scaledData[index][0][0], scaledData[index][0][1]);
      this.renderAreaTopLine(line, [
        [xscale.range()[0], yscale.range()[1]],
        ...scaledData[index],
        [xscale.range()[1], yscale.range()[1]],
      ]);
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
    const points = data;
    const options = { samples: 50, knot: 0.5 };

    const interpolatedPOints = curveCatmullRom(points, options).filter(
      (x: [number, number]) => !isNaN(x[0]) && !isNaN(x[1]),
    );
    console.log('interpolatedPOints', data, interpolatedPOints);
    line.drawPolygon([500, 500, ...interpolatedPOints.flat(), 500, 500]);
  };
}

export default GeomodelLayer;
