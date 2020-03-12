import Vector2 from '@equinor/videx-vector2';

import { CanvasLayer } from './CanvasLayer';
import { GeomodelLayerLabelsOptions, OnUpdateEvent, OnRescaleEvent, OnMountEvent } from '../interfaces';
import { SurfaceData, SurfaceArea, SurfaceLine } from '../datautils';

export class GeomodelLabelsLayer extends CanvasLayer {
  options: GeomodelLayerLabelsOptions;
  rescaleEvent: OnRescaleEvent;
  defaultMargins: number = 18;
  defaultMinFontSize: number = 8;
  defaultMaxFontSize: number = 13;
  defaultTextColor: string = 'black';
  defaultFont: string = 'Arial';
  data: SurfaceData = null;
  leftSide: boolean = true;
  wellborePath: any = null;

  constructor(id: string, options: GeomodelLayerLabelsOptions) {
    super(id, options);
    this.render = this.render.bind(this);
    this.calcPos = this.calcPos.bind(this);
    this.calcDir = this.calcDir.bind(this);
  }

  onMount(event: OnMountEvent): void {
    super.onMount(event);
  }

  onUpdate(event: OnUpdateEvent): void {
    super.onUpdate(event);
    this.render(event);
  }

  onRescale(event: OnRescaleEvent): void {
    super.onRescale(event);
    this.ctx.resetTransform();
    this.ctx.translate(event.transform.x, event.transform.y);
    this.ctx.scale(event.xRatio, event.yRatio);
    this.rescaleEvent = event;
    this.render(event);
  }

  render(event: OnRescaleEvent | OnUpdateEvent): void {
    if (event.data) {
      this.data = event.data;
    }
    if (event.wellborePath) {
      this.wellborePath = event.wellborePath;
    }
    if (!this.rescaleEvent) {
      return;
    }

    this.clearScreen();

    const { data } = this;
    if (!data) {
      return;
    }

    if (this.wellborePath) {
      this.leftSide = this.checkDrawLabelsOnLeftSide();
    }

    this.drawAreaLabels();
    this.drawLineLabels();
  }

  clearScreen(): void {
    const { xScale, yScale } = this.rescaleEvent;
    this.ctx.save();
    this.ctx.resetTransform();
    this.ctx.clearRect(0, 0, xScale.range()[1], yScale.range()[1]);
    this.ctx.restore();
  }

  drawAreaLabels(): void {
    this.data.areas.filter(d => d.label).forEach((s: SurfaceArea) => this.drawAreaLabel(s));
  }

  drawLineLabels(): void {
    this.data.lines.filter(d => d.label).forEach((s: SurfaceLine) => this.drawLineLabel(s));
  }

  drawAreaLabel = (s: SurfaceArea): void => {
    const { data } = s;
    const { ctx } = this;
    const { xScale, yScale, xRatio, yRatio } = this.rescaleEvent;
    const maxX = data[0][0];
    const minX = data[data.length - 1][0];
    let { leftSide } = this;
    const margins = this.options.margins || this.defaultMargins;
    const minFontSize = this.options.minFontSize || this.defaultMinFontSize;
    const maxFontSize = this.options.maxFontSize || this.defaultMaxFontSize;

    let fontSize = maxFontSize / yRatio;
    if (fontSize > 70) {
      fontSize = 70;
      if (fontSize * yRatio < minFontSize) {
        fontSize = minFontSize / yRatio;
      }
    }

    const leftEdge = xScale.invert(xScale.range()[0]);
    const rightEdge = xScale.invert(xScale.range()[1]);

    // Check if label will fit
    ctx.save();
    ctx.font = `${fontSize}px Arial`;
    const labelMetrics = ctx.measureText(s.label);
    const labelLength = labelMetrics.width;
    if (leftSide) {
      const labelRightEdge = leftEdge + margins / xRatio + labelLength;
      if (labelRightEdge > maxX - margins / xRatio) {
        leftSide = false;
      }
    } else {
      const labelLeftEdge = rightEdge - margins / xRatio - labelLength;
      if (labelLeftEdge < minX + margins / xRatio) {
        leftSide = true;
      }
    }

    // Find edge where to draw
    let startPos: number;
    if (leftSide) {
      startPos = Math.max(minX, leftEdge) + margins / xRatio;
    } else {
      startPos = Math.min(maxX, rightEdge) - margins / xRatio;
    }

    const topEdge = yScale.invert(yScale.range()[0]);
    const bottomEdge = yScale.invert(yScale.range()[1]);

    // Calculate where to sample points
    const dirSteps = 17;
    const posSteps = 5;
    const posStep = 0.3 * (labelLength / posSteps) * (leftSide ? 1 : -1);
    const dirStep = (labelLength / dirSteps) * (leftSide ? 1 : -1);

    // Sample points from top and calculate position and direction vector
    const topData = data.map(d => [d[0], d[1]]);
    const topPos: Vector2 = this.calcPos(topData, startPos, posSteps, posStep, topEdge);
    const topDir: Vector2 = this.calcDir(topData, startPos, dirSteps, dirStep, leftSide ? Vector2.right : Vector2.left, topEdge);
    if (!topPos || !topDir) {
      return;
    }

    // Sample points from bottom and calculate position and direction vector
    const bottomData = data.map(d => [d[0], d[2]]);
    let bottomPos: Vector2 = this.calcPos(bottomData, startPos, posSteps, posStep, null, bottomEdge);
    let bottomDir: Vector2 = this.calcDir(bottomData, startPos, dirSteps, dirStep, leftSide ? Vector2.right : Vector2.left, null, bottomEdge);
    if (!bottomPos) {
      bottomPos = Vector2.add(topPos, new Vector2(0, fontSize * 1.5));
    }
    if (!bottomDir) {
      bottomDir = topDir;
    }

    // Check if there is room for label
    const thickness = bottomPos.y - topPos.y;
    if (thickness < fontSize) {
      // Check minimum fontsize
      if (thickness * yRatio < minFontSize) {
        return;
      }
      // Use reduced fontsize
      fontSize = thickness;
    }

    // Calculate position and direction for label
    const textX = startPos;
    const textY = (topPos.y + bottomPos.y) / 2;
    const textVec = Vector2.add(topDir, bottomDir);
    const textDir = Vector2.angleRight(textVec) - (leftSide ? 0 : Math.PI);

    // Draw label
    ctx.textAlign = leftSide ? 'left' : 'right';
    ctx.translate(textX, textY);
    ctx.rotate(textDir);
    ctx.fillStyle = this.options.textColor || this.defaultTextColor;
    ctx.font = `${fontSize}px ${this.options.font || this.defaultFont}`;
    ctx.textBaseline = 'middle';
    ctx.fillText(s.id, 0, 0);

    ctx.restore();
  };

  drawLineLabel = (s: SurfaceLine): void => {
    const { ctx } = this;
    const { xScale, xRatio, yRatio } = this.rescaleEvent;
    const maxX = s.data[0][0];
    const minX = s.data[s.data.length - 1][0];
    const { leftSide } = this;
    const margins = this.options.margins || this.defaultMargins;
    const maxFontSize = this.options.maxFontSize || this.defaultMaxFontSize;

    const fontSize = maxFontSize / yRatio;

    ctx.save();
    ctx.font = `${fontSize}px Arial`;
    const labelMetrics = ctx.measureText(s.label);
    const labelLength = labelMetrics.width;

    // Find edge where to draw
    let startPos: number;
    const steps = 5;

    if (leftSide) {
      const rightEdge = xScale.invert(xScale.range()[1]);
      startPos = Math.min(maxX, rightEdge) - margins / xRatio;
    } else {
      const leftEdge = xScale.invert(xScale.range()[0]);
      startPos = Math.max(minX, leftEdge) + margins / xRatio;
    }

    // Calculate where to sample points
    const step = (labelLength / steps) * (leftSide ? -1 : 1);

    // Sample points and calculate position and direction vector
    const { data } = s;
    const pos: Vector2 = this.calcPos(data, startPos, steps, step);
    const dir: Vector2 = this.calcDir(data, startPos, steps, step, leftSide ? Vector2.left : Vector2.right);
    if (!pos || !dir) {
      return;
    }

    // Calculate position and direction for label
    const textX = pos.x;
    const textY = pos.y - s.width - fontSize / 2;
    const textDir = Vector2.angleRight(dir) - (this.leftSide ? Math.PI : 0);

    // Draw label
    ctx.textAlign = 'center';
    ctx.translate(textX, textY);
    ctx.rotate(textDir);
    ctx.fillStyle = `#${s.color.toString(16).padStart(6, '0')}`;
    ctx.textBaseline = 'middle';
    ctx.fillText(s.id, 0, 0);

    ctx.restore();
  };

  calcPos(data: number[][], offset: number, count: number, step: number, topLimit: number = null, bottomLimit: number = null): Vector2 {
    const pos: Vector2 = Vector2.zero.mutable;
    let samples: number = 0;
    for (let i: number = 0; i < count; i++) {
      const x = offset + i * step;

      const vec: Vector2 = this.findSampleAtPos(data, x, topLimit, bottomLimit);
      if (vec) {
        pos.add(vec);
        samples++;
      }
    }

    if (samples === 0) {
      return null;
    }

    return Vector2.divide(pos, samples);
  }

  calcDir(
    data: number[][],
    offset: number,
    count: number,
    step: number,
    initalVector: Vector2 = Vector2.left,
    topLimit: number = null,
    bottomLimit: number = null,
  ): Vector2 {
    const dir: Vector2 = initalVector.mutable;

    const b: Vector2 = this.findSampleAtPos(data, offset, topLimit, bottomLimit);
    if (b == null) return null;
    for (let i: number = 0; i < count; i++) {
      const x = offset + i * step;
      const a: Vector2 = this.findSampleAtPos(data, x, topLimit, bottomLimit);
      if (a === null) continue;
      const tmpVec: Vector2 = Vector2.sub(a, b);
      dir.add(tmpVec);
    }

    return dir;
  }

  findSampleAtPos(data: number[][], pos: number, topLimit: number = null, bottomLimit: number = null): Vector2 {
    let vec: Vector2 = null;
    const index = this.findIndexOfSample(data, pos);
    if (index != -1 && data[index][1] && data[index + 1][1]) {
      const x: number = pos;
      let y: number = (data[index][1] + data[index + 1][1]) / 2;
      if (topLimit && topLimit > y) {
        y = topLimit;
      }
      if (bottomLimit && bottomLimit < y) {
        y = bottomLimit;
      }
      vec = new Vector2(x, y);
    }
    return vec;
  }

  // eslint-disable-next-line class-methods-use-this
  findIndexOfSample(data: number[][], pos: number): number {
    let index = -1;
    let lowLim = 0;
    let highLim = data.length - 2;
    const linearSearchLimit = 20;

    while (highLim - lowLim > linearSearchLimit) {
      const mid = Math.floor((highLim + lowLim) / 2);
      const midX = data[mid][0];
      if (midX <= pos) {
        highLim = mid;
      } else {
        lowLim = mid;
      }
    }

    for (let i = lowLim; i < highLim; i++) {
      if (data[i][0] >= pos && data[i + 1][0] <= pos) {
        index = i;
        break;
      }
    }

    return index;
  }

  checkDrawLabelsOnLeftSide(): boolean {
    const { xScale } = this.rescaleEvent;
    const t = 200;

    const [dx1, dx2] = xScale.domain();
    const [rx1] = xScale.range();

    const wBBox = this.getWellborePathBBox(this.wellborePath);

    return wBBox === null || Math.abs(dx1 - wBBox.left) > Math.abs(wBBox.right - dx2) || Math.abs(rx1 - xScale(wBBox.left)) > t;
  }

  getWellborePathBBox(wellborePath: any): any {
    if (!wellborePath || wellborePath.length <= 0) {
      return null;
    }
    const { xScale, yScale } = this.rescaleEvent;
    const left = wellborePath[wellborePath.length - 1][0];
    const right = wellborePath[0][0];
    const top = wellborePath[0][1];
    const bottom = wellborePath.reduce((acc: number, v: number[]) => (acc > v[1] ? acc : v[1]), -Infinity);

    return {
      left: xScale(left),
      right: xScale(right),
      top: yScale(top),
      bottom: yScale(bottom),
    };
  }
}
