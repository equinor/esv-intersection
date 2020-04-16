import { axisRight, axisBottom } from 'd3-axis';
import { Selection } from 'd3-selection';
import { ScaleLinear, scaleLinear } from 'd3-scale';
import { BaseType } from 'd3';
import { OnResizeEvent, OnRescaleEvent } from '../interfaces';

type Options = {
  offsetX: number;
  offsetY: number;
};

export class Axis {
  private mainGroup: Selection<SVGElement, any, null, undefined>;
  private _scaleX: ScaleLinear<number, number>;
  private _scaleY: ScaleLinear<number, number>;
  showLabels = true;
  labelXDesc: string;
  labelYDesc: string;
  measurement: string;
  private _offsetX: number = 0;
  private _offsetY: number = 0;

  constructor(
    mainGroup: Selection<SVGElement, any, null, undefined>,
    showLabels = true,
    labelXDesc: string,
    labelYDesc: string,
    measurement: string,
    options?: Options,
  ) {
    this.mainGroup = mainGroup;
    this.showLabels = showLabels;
    this.labelXDesc = labelXDesc;
    this.labelYDesc = labelYDesc;
    this.measurement = measurement;
    if (options && options.offsetX) {
      this._offsetX = options.offsetX;
    }
    if (options && options.offsetX) {
      this._offsetY = options.offsetY;
    }
    this._scaleX = scaleLinear().domain([0, 1]).range([0, 1]);
    this._scaleY = scaleLinear().domain([0, 1]).range([0, 1]);
  }

  private renderLabelx(): Selection<BaseType, any, null, undefined> {
    const { labelXDesc, measurement, showLabels, _scaleX: scaleX, renderGx } = this;
    const [, width] = scaleX.range();
    const gx = renderGx();

    let labelx = gx.select('text.axis-labelx');
    if (showLabels) {
      if (labelx.empty()) {
        labelx = gx
          .append('text')
          .attr('class', 'axis-labelx')
          .attr('fill', 'rgba(0,0,0,0.3)')
          .style('text-anchor', 'middle')
          .style('font-weight', '800')
          .style('font-size', '10px')
          .text(`${labelXDesc} (${measurement})`);
      }
    } else {
      labelx.remove();
    }
    labelx.attr('transform', `translate(${width / 2},-4)`);
    return labelx;
  }

  private renderLabely(): Selection<BaseType, any, null, undefined> {
    const { labelYDesc, measurement, showLabels, _scaleY: scaleY, renderGy } = this;
    const [, height] = scaleY.range();
    const gy = renderGy();

    let labely = gy.select('text.axis-labely');
    if (showLabels) {
      if (labely.empty()) {
        labely = gy
          .append('text')
          .attr('class', 'axis-labely')
          .attr('fill', 'rgba(0,0,0,0.3)')
          .style('text-anchor', 'middle')
          .style('font-weight', '800')
          .style('font-size', '10px')
          .text(`${labelYDesc} (${measurement})`);
      }
      labely.attr('transform', `translate(-10,${height / 2})rotate(90)`);
    } else {
      labely.remove();
    }
    return labely;
  }

  private renderGy(): Selection<BaseType, any, null, undefined> {
    const { _scaleX: scaleX, _scaleY: scaleY, createOrGet } = this;
    const yAxis = axisRight(scaleY);
    const [, width] = scaleX.range();

    const gy = createOrGet('y-axis');
    gy.call(yAxis);
    gy.attr('transform', `translate(${width},0)`);

    return gy;
  }

  private renderGx(): Selection<BaseType, any, null, undefined> {
    const { _scaleX: scaleX, _scaleY: scaleY, createOrGet } = this;
    const xAxis = axisBottom(scaleX);
    const [, height] = scaleY.range();

    const gx = createOrGet('x-axis');
    gx.attr('transform', `translate(0 ${height})`);
    gx.call(xAxis);
    return gx;
  }

  private createOrGet = (name: string): Selection<BaseType, any, null, undefined> => {
    const { mainGroup } = this;
    let res = mainGroup.select(`g.${name}`);
    if (res.empty()) {
      res = mainGroup.append('g').attr('class', name);
    }
    return res;
  };

  render(): void {
    this.renderLabelx();
    this.renderLabely();
  }

  onResize(event: OnResizeEvent): void {
    this.mainGroup.attr('height', `${event.height}px`).attr('width', `${event.width}px`);
  }

  onRescale(event: OnRescaleEvent): void {
    const { _scaleX: scaleX, _scaleY: scaleY, offsetX, offsetY, render } = this;

    const xBounds = event.scaleX.domain();
    const yBounds = event.scaleY.domain();

    const xRange = event.scaleX.range();
    const yRange = event.scaleX.range();

    scaleX.domain([xBounds[0] - offsetX, xBounds[1] - offsetX]).range(xRange);
    scaleY.domain([yBounds[0] - offsetY, yBounds[1] - offsetY]).range(yRange);

    render();
  }

  get offsetX(): number {
    return this._offsetX;
  }

  set offsetX(offset: number) {
    this._offsetX = offset;
  }

  get offsetY(): number {
    return this._offsetY;
  }

  set offsetY(offset: number) {
    this._offsetY = offset;
  }

  get scaleX(): ScaleLinear<number, number> {
    return this._scaleX.copy();
  }

  get scaleY(): ScaleLinear<number, number> {
    return this._scaleY.copy();
  }
}
