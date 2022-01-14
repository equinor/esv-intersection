import { axisRight, axisBottom } from 'd3-axis';
import { BaseType, Selection } from 'd3-selection';
import { ScaleLinear, scaleLinear } from 'd3-scale';
import { OnResizeEvent, OnRescaleEvent } from '../interfaces';

type Options = {
  offsetX: number;
  offsetY: number;
  visible: boolean;
};

export class Axis {
  private mainGroup: Selection<SVGElement, any, null, undefined>;
  private _scaleX: ScaleLinear<number, number>;
  private _scaleY: ScaleLinear<number, number>;
  private _showLabels = true;
  private _labelXDesc: string;
  private _labelYDesc: string;
  private _unitOfMeasure: string;
  private _offsetX: number = 0;
  private _offsetY: number = 0;
  private _flipX = false;
  private _flipY = false;
  private visible: boolean = true;

  constructor(
    mainGroup: Selection<SVGElement, any, null, undefined>,
    showLabels = true,
    labelXDesc: string,
    labelYDesc: string,
    unitOfMeasure: string,
    options?: Options,
  ) {
    this.mainGroup = mainGroup;
    this._showLabels = showLabels;
    this._labelXDesc = labelXDesc;
    this._labelYDesc = labelYDesc;
    this._unitOfMeasure = unitOfMeasure;
    if (options && options.offsetX) {
      this._offsetX = options.offsetX;
    }
    if (options && options.offsetX) {
      this._offsetY = options.offsetY;
    }
    if (options && options.visible) {
      this.visible = options.visible;
    }
    this.mainGroup.style('pointer-events', 'none');

    this._scaleX = scaleLinear().domain([0, 1]).range([0, 1]);
    this._scaleY = scaleLinear().domain([0, 1]).range([0, 1]);
  }

  private renderLabelx(): Selection<BaseType, any, null, undefined> {
    const { _labelXDesc: labelXDesc, _unitOfMeasure: unitOfMeasure, _showLabels, _scaleX: scaleX } = this;
    const [, width] = scaleX.range();
    const gx = this.renderGx();

    let labelx = gx.select('text.axis-labelx');
    if (_showLabels) {
      if (labelx.empty()) {
        labelx = gx
          .append('text')
          .attr('class', 'axis-labelx')
          .attr('fill', 'rgba(0,0,0,0.3)')
          .style('text-anchor', 'middle')
          .style('font-weight', '800')
          .style('font-size', '10px')
          .text(`${labelXDesc} (${unitOfMeasure})`);
      }
    } else {
      labelx.remove();
    }
    labelx.attr('transform', `translate(${width / 2},-4)`);
    return labelx;
  }

  private renderLabely(): Selection<BaseType, any, null, undefined> {
    const { _labelYDesc: labelYDesc, _unitOfMeasure: unitOfMeasure, _showLabels, _scaleY } = this;
    const [, height] = _scaleY.range();
    const gy = this.renderGy();

    let labely = gy.select('text.axis-labely');
    if (_showLabels) {
      if (labely.empty()) {
        labely = gy
          .append('text')
          .attr('class', 'axis-labely')
          .attr('fill', 'rgba(0,0,0,0.3)')
          .style('text-anchor', 'middle')
          .style('font-weight', '800')
          .style('font-size', '10px')
          .text(`${labelYDesc} (${unitOfMeasure})`);
      }
      labely.attr('transform', `translate(-10,${height / 2})rotate(90)`);
    } else {
      labely.remove();
    }
    return labely;
  }

  private renderGy(): Selection<BaseType, any, null, undefined> {
    const { _scaleX, _scaleY } = this;
    const yAxis = axisRight(_scaleY) as (selection: Selection<SVGSVGElement, any, any, any>) => void;
    const [, width] = _scaleX.range();
    const gy = this.createOrGet('y-axis');
    gy.call(yAxis);
    gy.attr('transform', `translate(${width},0)`);

    return gy;
  }

  private renderGx(): Selection<BaseType, any, null, undefined> {
    const { _scaleX, _scaleY } = this;
    const xAxis = axisBottom(_scaleX) as (selection: Selection<SVGSVGElement, any, any, any>) => void;
    const [, height] = _scaleY.range();

    const gx = this.createOrGet('x-axis');
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
    const { _scaleX, _scaleY, offsetX, offsetY } = this;
    const { xScale, yScale } = event;
    const xBounds = xScale.domain();
    const yBounds = yScale.domain();

    const xRange = xScale.range();
    const yRange = yScale.range();

    _scaleX.domain([xBounds[0] - offsetX, xBounds[1] - offsetX]).range(xRange);
    _scaleY.domain([yBounds[0] - offsetY, yBounds[1] - offsetY]).range(yRange);
    this.flipX(this._flipX);
    this.flipY(this._flipY);

    if (this.visible) {
      this.render();
    }
  }

  show(): Axis {
    this.visible = true;
    this.mainGroup.attr('visibility', 'visible');
    this.render();
    return this;
  }

  hide(): Axis {
    this.visible = false;
    this.mainGroup.attr('visibility', 'hidden');
    return this;
  }

  flipX(flipX: boolean): Axis {
    this._flipX = flipX;
    const domain = this._scaleX.domain();
    const flip = flipX ? -1 : 1;
    this._scaleX.domain([flip * domain[0], flip * domain[1]]);
    return this;
  }

  flipY(flipY: boolean): Axis {
    this._flipY = flipY;
    const domain = this._scaleY.domain();
    const flip = flipY ? -1 : 1;
    this._scaleY.domain([flip * domain[0], flip * domain[1]]);
    return this;
  }

  showLabels(): Axis {
    this._showLabels = true;
    this.render();
    return this;
  }

  hideLabels(): Axis {
    this._showLabels = false;
    this.render();
    return this;
  }

  setLabelX(label: string): Axis {
    this._labelXDesc = label;
    return this;
  }

  setLabelY(label: string): Axis {
    this._labelYDesc = label;
    return this;
  }

  setUnitOfMeasure(uom: string): Axis {
    this._unitOfMeasure = uom;
    return this;
  }

  setLabels(labelX: string, labelY: string, unitOfMeasure: string): Axis {
    this._labelXDesc = labelX;
    this._labelYDesc = labelY;
    this._unitOfMeasure = unitOfMeasure;
    return this;
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
