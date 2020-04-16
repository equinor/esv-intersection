import { axisRight, axisBottom } from 'd3-axis';
import { Selection } from 'd3-selection';
import { ScaleLinear } from 'd3-scale';
import { BaseType } from 'd3';
import { OnResizeEvent, OnRescaleEvent } from '../interfaces';

type Options = {
  offsetX: number;
  offsetY: number;
};

export class Axis {
  mainGroup: Selection<SVGElement, any, null, undefined>;
  scaleX: ScaleLinear<number, number>;
  scaleY: ScaleLinear<number, number>;
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
  }

  renderLabelx(gx: Selection<BaseType, any, null, undefined>, showLabels: any, width: any, label: string): Selection<BaseType, any, null, undefined> {
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
          .text(label);
      }
    } else {
      labelx.remove();
    }
    labelx.attr('transform', `translate(${width / 2},-4)`);
    return labelx;
  }

  renderLabely(
    gy: Selection<BaseType, any, null, undefined>,
    showLabels: any,
    height: any,
    label: string,
  ): Selection<BaseType, any, null, undefined> {
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
          .text(label);
      }
      labely.attr('transform', `translate(-10,${height / 2})rotate(90)`);
    } else {
      labely.remove();
    }
    return labely;
  }

  renderGy(mainGroup: Selection<BaseType, any, null, undefined>, yAxis: any, width: any): Selection<BaseType, any, null, undefined> {
    const gy = this.createOrGet(mainGroup, 'y-axis');
    gy.call(yAxis);
    gy.attr('transform', `translate(${width},0)`);

    return gy;
  }

  renderGx(mainGroup: Selection<BaseType, any, null, undefined>, xAxis: any, height: any): Selection<BaseType, any, null, undefined> {
    const gx = this.createOrGet(mainGroup, 'x-axis');
    gx.attr('transform', `translate(0 ${height})`);
    gx.call(xAxis);
    return gx;
  }

  createOrGet = (mainGroup: Selection<BaseType, any, null, undefined>, name: string): Selection<BaseType, any, null, undefined> => {
    let res = mainGroup.select(`g.${name}`);
    if (res.empty()) {
      res = mainGroup.append('g').attr('class', name);
    }
    return res;
  };

  render(): void {
    const xAxis = axisBottom(this.scaleX);
    const yAxis = axisRight(this.scaleY);

    const [, width] = this.scaleX.range();
    const [, height] = this.scaleY.range();

    const gx = this.renderGx(this.mainGroup, xAxis, height);
    const gy = this.renderGy(this.mainGroup, yAxis, width);

    this.renderLabelx(gx, this.showLabels, width, `${this.labelXDesc} (${this.measurement})`);
    this.renderLabely(gy, this.showLabels, height, `${this.labelYDesc} (${this.measurement})`);
  }

  onResize(event: OnResizeEvent): void {
    this.mainGroup.attr('height', `${event.height}px`).attr('width', `${event.width}px`);
  }

  onRescale(event: OnRescaleEvent): void {
    this.scaleX = event.xScale;
    this.scaleY = event.yScale;

    this.render();
  }

  get offsetX(): number {
    return this._offsetX;
  }

  set offsetX(offset: number) {
    this._offsetX = offset;
    const xBounds = this.scaleX.domain();
    this.scaleX.domain([xBounds[0] + this._offsetX, xBounds[1] + this._offsetX]);
  }

  get offsetY(): number {
    return this._offsetY;
  }

  set offsetY(offset: number) {
    this._offsetY = offset;
    const yBounds = this.scaleY.domain();
    this.scaleY.domain([yBounds[0] + this._offsetY, yBounds[1] + this._offsetY]);
  }
}
