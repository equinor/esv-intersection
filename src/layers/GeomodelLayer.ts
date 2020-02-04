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

    console.log(xscale.domain());

    const data: GeoModelData[] = [
      {
        name: 'strat 1',
        color: 0xff000,
        md: [70, 90, 100, 110, 100, 100],
        pos: [
          [0, 99],
          [100, 99],
          [200, 99],
          [450, 99],
          [600, 99],
          [1000, 99],
        ],
      },
      {
        name: 'strat 2',
        color: 0xffff0,
        md: [100 + 50, 120 + 50, 100 + 50, 140 + 50, 100 + 50, 120 + 50],
        pos: [
          [0, 99],
          [140, 99],
          [200, 99],
          [400, 99],
          [750, 99],
          [1000, 99],
        ],
      },
      {
        name: 'strat 3',
        color: 0xff00ff,
        md: [100 + 150, 120 + 120, 100 + 170, 140 + 150, 100 + 150, 177 + 150],
        pos: [
          [0, 99],
          [190, 99],
          [200, 99],
          [520, 99],
          [850, 99],
          [1000, 99],
        ],
      },
      {
        name: 'strat 4',
        color: 0x0330ff,
        md: [100 + 250, 120 + 220, 100 + 270, 100 + 250, 140 + 250, 177 + 250],
        pos: [
          [0, 99],
          [200, 99],
          [210, 99],
          [300, 99],
          [750, 99],
          [1000, 99],
        ],
      },
    ];

    const scaledData = this.generateScaledData(data, xscale, yscale);

    // for each layer
    // paint from top down, with color
    // missing data is 0, dont color

    data.forEach((s, index) => {
      const area = new Graphics();
      area.lineStyle(4, s.color, 1);
      area.beginFill(s.color);
      this.renderAreaTopLine(area, scaledData[index], xscale, yscale);
      area.endFill();
      this.ctx.stage.addChild(area);
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

  private renderAreaTopLine = (
    area: Graphics,
    data: [number, number][],
    xscale: ScaleLinear<number, number>,
    yscale: ScaleLinear<number, number>,
  ): void => {
    const points = data;
    const options = { samples: 50, knot: 0.5 };

    const interpolatedPoints = curveCatmullRom(points, options);
    // .filter(
    //   (x: [number, number]) => !isNaN(x[0]) && !isNaN(x[1]),
    // );

    const [leftMostX, rightMostX] = xscale.range();
    const [, bottom] = yscale.range();

    console.log('interpolatedPoints', points);
    area.drawPolygon([
      leftMostX,
      bottom,
      leftMostX,
      points[0][1], // top left point
      ...interpolatedPoints.flat(), // actual points
      rightMostX,
      points[points.length - 1][1], // top right point
      rightMostX,
      bottom,
    ]);
  };
}

export default GeomodelLayer;
