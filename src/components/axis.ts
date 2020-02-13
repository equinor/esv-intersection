import { axisRight, axisBottom } from 'd3-axis';
import { Selection } from 'd3-selection';
import { ScaleLinear } from 'd3-scale';
import { BaseType } from 'd3';

export class Axis {
  mainGroup: Selection<SVGElement, any, null, undefined>;
  scaleX: ScaleLinear<number, number>;
  scaleY: ScaleLinear<number, number>;
  showLabels = true;
  labelYDesc: string;
  labelXDesc: string;
  measurement: string;

  constructor(
    mainGroup: Selection<SVGElement, any, null, undefined>,
    scaleX: ScaleLinear<number, number>,
    scaleY: ScaleLinear<number, number>,
    showLabels = true,
    labelYDesc: string,
    labelXDesc: string,
    measurement: string,
  ) {
    this.mainGroup = mainGroup;
    this.scaleX = scaleX;
    this.scaleY = scaleY;
    this.showLabels = showLabels;
    this.labelYDesc = labelYDesc;
    this.labelXDesc = labelXDesc;
    this.measurement = measurement;
  }

  renderLabelx(
    gx: Selection<BaseType, any, null, undefined>,
    showLabels: any,
    width: any,
    label: string,
  ): Selection<BaseType, any, null, undefined> {
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

  renderGy(
    mainGroup: Selection<BaseType, any, null, undefined>,
    yAxis: any,
    width: any,
  ): Selection<BaseType, any, null, undefined> {
    const gy = this.createOrGet(mainGroup, 'y-axis');
    gy.call(yAxis);
    gy.attr('transform', `translate(${width},0)`);

    return gy;
  }

  renderGx(
    mainGroup: Selection<BaseType, any, null, undefined>,
    xAxis: any,
    height: any,
  ): Selection<BaseType, any, null, undefined> {
    const gx = this.createOrGet(mainGroup, 'x-axis');
    gx.attr('transform', `translate(0 ${height})`);
    gx.call(xAxis);
    return gx;
  }

  createOrGet = (
    mainGroup: Selection<BaseType, any, null, undefined>,
    name: string,
  ) => {
    let res = mainGroup.select(`g.${name}`);
    if (res.empty()) {
      res = mainGroup.append('g').attr('class', name);
    }
    return res;
  };

  render() {
    const xAxis = axisBottom(this.scaleX);
    const yAxis = axisRight(this.scaleY);

    const [, height] = this.scaleY.range();
    const [, width] = this.scaleX.range();

    const gx = this.renderGx(this.mainGroup, xAxis, height);
    const gy = this.renderGy(this.mainGroup, yAxis, width);

    this.renderLabely(
      gy,
      this.showLabels,
      height,
      `${this.labelYDesc} (${this.measurement})`,
    );
    this.renderLabelx(
      gx,
      this.showLabels,
      width,
      `${this.labelXDesc} (${this.measurement})`,
    );
  }

  onRescale(event: any) {
    this.scaleX = event.xScale;
    this.scaleY = event.yScale;
    this.render();
  }
}
