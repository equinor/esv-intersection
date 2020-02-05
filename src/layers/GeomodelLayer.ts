import curveCatmullRom from 'cat-rom-spline';
import { ScaleLinear } from 'd3-scale';
import { Graphics } from 'pixi.js';
import WebGLLayer from './WebGLLayer';
import {
  GeoModelData,
  GeomodelLayerOptions,
  OnUpdateEvent,
  OnRescaleEvent,
} from '../interfaces';

class GeomodelLayer extends WebGLLayer {
  options: GeomodelLayerOptions;

  curveOptions = { samples: 50, knot: 0.5 };

  constructor(id: string, options: GeomodelLayerOptions) {
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
    const scaledData = this.generateScaledData(data, xscale, yscale);

    // for each layer
    // paint from top down, with color
    // missing data is 0, dont color

    data.forEach((s: GeoModelData, index: number) =>
      this.drawArea(s, index, scaledData, xscale, yscale),
    );
  }

  drawArea = (
    s: GeoModelData,
    index: number,
    scaledData: [number, number][][],
    xscale: ScaleLinear<number, number>,
    yscale: ScaleLinear<number, number>,
  ) => {
    const area = new Graphics();
    area.lineStyle(4, s.color, 1);
    area.beginFill(s.color);
    this.renderAreaTopLine(area, scaledData[index], xscale, yscale);
    area.endFill();
    this.ctx.stage.addChild(area);
  };

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
    const interpolatedPoints = curveCatmullRom(data, this.curveOptions);
    const [leftMostX, rightMostX] = xscale.range();
    const [, bottom] = yscale.range();
    const topRightPoint = data[data.length - 1][1];
    const topLeftPoint = data[0][1];
    const points = [
      leftMostX,
      bottom,
      leftMostX,
      topLeftPoint,
      ...interpolatedPoints.flat(),
      rightMostX,
      topRightPoint,
      rightMostX,
      bottom,
    ];
    area.drawPolygon(points);
  };
}

export default GeomodelLayer;
