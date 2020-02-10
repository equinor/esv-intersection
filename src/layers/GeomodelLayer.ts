import curveCatmullRom from 'cat-rom-spline';
import { ScaleLinear } from 'd3-scale';
import { Graphics } from 'pixi.js';
import { WebGLLayer } from './WebGLLayer';
import {
  GeoModelData,
  GeomodelLayerOptions,
  OnUpdateEvent,
  OnRescaleEvent,
} from '../interfaces';

export class GeomodelLayer extends WebGLLayer {
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
    const { xScale, yScale, data } = event;
    const scaledData = this.generateScaledData(data, xScale, yScale);

    // for each layer
    // paint from top down, with color
    // if missing bottom data is null, use next area top line as bottom

    data.forEach((s: GeoModelData, index: number) =>
      this.drawArea(s, index, scaledData[index]),
    );
  }

  drawArea = (
    s: GeoModelData,
    index: number,
    scaledData: { top: [number, number][]; bottom: [number, number][] },
  ): void => {
    const area = new Graphics();
    area.lineStyle(4, s.color, 1);
    area.beginFill(s.color);
    this.renderAreaTopLine(area, scaledData.top, scaledData.bottom);
    area.endFill();
    this.ctx.stage.addChild(area);
  };

  generateScaledData = (
    data: GeoModelData[],
    xScale: ScaleLinear<number, number>,
    yScale: ScaleLinear<number, number>,
  ): { top: [number, number][]; bottom: [number, number][] }[] => {
    return data.map((stratLayer: GeoModelData, index: number) => {
      const top = this.generateScaledLayer(
        stratLayer.pos,
        stratLayer.md,
        xScale,
        yScale,
      );
      let bottom: [number, number][] = null;
      if (stratLayer.bottomPos == null || stratLayer.bottomMd == null) {
        // last layer, draw to yScale bottom
        if (index >= data.length - 1) {
          bottom = [
            [xScale.range()[0], yScale.range()[1]],
            [xScale.range()[0], yScale.range()[1]],
            [xScale.range()[1], yScale.range()[1]],
            [xScale.range()[1], yScale.range()[1]],
          ];
        } else {
          // use next area top line as bottom
          bottom = this.generateScaledLayer(
            data[index + 1].pos,
            data[index + 1].md,
            xScale,
            yScale,
          );
        }
      } else {
        // use provided bottom data
        bottom = this.generateScaledLayer(
          stratLayer.bottomPos,
          stratLayer.bottomMd,
          xScale,
          yScale,
        );
      }
      return { top, bottom };
    });
  };

  generateScaledLayer = (
    pos: [number, number][],
    md: number[],
    xScale: ScaleLinear<number, number>,
    yScale: ScaleLinear<number, number>,
  ): [number, number][] => {
    return pos.map((posPoint: [number, number], index) => [
      xScale(posPoint[0]),
      yScale(md[index]),
    ]);
  };

  private renderAreaTopLine = (
    area: Graphics,
    dataTop: [number, number][],
    dataBottom: [number, number][],
  ): void => {
    const interpolatedPointsTop = curveCatmullRom(dataTop, this.curveOptions);
    const interpolatedPointsBottom = curveCatmullRom(
      dataBottom,
      this.curveOptions,
    );

    const topRightPoint = dataTop[dataTop.length - 1];
    const topLeftPoint = dataTop[0];
    const bottomLeftPoint = dataBottom[0];
    const bottomRightPoint = dataBottom[dataBottom.length - 1];

    const points = [
      topLeftPoint,
      interpolatedPointsTop.flat(),
      topRightPoint,
      bottomRightPoint,
      interpolatedPointsBottom.reverse().flat(),
      bottomLeftPoint,
    ];

    area.drawPolygon([].concat(...points));
  };
}
