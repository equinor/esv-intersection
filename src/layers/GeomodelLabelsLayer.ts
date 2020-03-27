import Vector2 from '@equinor/videx-vector2';

import { CanvasLayer } from './CanvasLayer';
import { GeomodelLayerLabelsOptions, OnUpdateEvent, OnRescaleEvent, OnMountEvent } from '../interfaces';
import { SurfaceData, SurfaceArea, SurfaceLine, findSampleAtPos } from '../datautils';

export class GeomodelLabelsLayer extends CanvasLayer {
  options: GeomodelLayerLabelsOptions;
  rescaleEvent: OnRescaleEvent;
  defaultMargins: number = 18;
  defaultMinFontSize: number = 8;
  defaultMaxFontSize: number = 13;
  defaultTextColor: string = 'black';
  defaultFont: string = 'Arial';
  leftSide: boolean = true;
  wellborePath: any = null;
  wellborePathBoundingBox: any = null;

  constructor(id?: string, options?: GeomodelLayerLabelsOptions) {
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
    if (event.wellborePath !== this.wellborePath) {
      this.wellborePath = event.wellborePath;
      this.wellborePathBoundingBox = this.getWellborePathBBox(this.wellborePath);
    }
    this.render();
  }

  onRescale(event: OnRescaleEvent): void {
    this.rescaleEvent = event;
    this.setTransform(event);
    this.render();
  }

  render(): void {
    if (!this.rescaleEvent) {
      return;
    }

    this.clearCanvas();

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

  drawAreaLabels(): void {
    this.data.areas.filter((d: any) => d.label).forEach((s: SurfaceArea) => this.drawAreaLabel(s));
  }

  drawLineLabels(): void {
    this.data.lines.filter((d: any) => d.label).forEach((s: SurfaceLine) => this.drawLineLabel(s));
  }

  drawAreaLabel = (s: SurfaceArea, flip = true): void => {
    const { data } = s;
    const { ctx } = this;
    const { xScale, yScale, xRatio, yRatio } = this.rescaleEvent;
    const maxX = flip ? data[data.length - 1][0] : data[0][0];
    const minX = flip ? data[0][0] : data[data.length - 1][0];
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
    const dirSteps = 7;
    const posSteps = 5;
    const posStep = 0.3 * (labelLength / posSteps) * (leftSide ? 1 : -1);
    const dirStep = (labelLength / dirSteps) * (leftSide ? 1 : -1);

    // Sample points from top and calculate position and direction vector
    const topData = data.map((d) => [d[0], d[1]]);
    const topPos: Vector2 = this.calcPos(topData, startPos, posSteps, posStep, topEdge);
    const topDir: Vector2 = this.calcDir(topData, startPos, dirSteps, dirStep, leftSide ? Vector2.right : Vector2.left, topEdge);
    if (!topPos || !topDir) {
      return;
    }

    // Sample points from bottom and calculate position and direction vector
    const bottomData = data.map((d) => [d[0], d[2]]);
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
    let samples = 0;
    for (let i = 0; i < count; i++) {
      const x = offset + i * step;

      const y = findSampleAtPos(data, x, topLimit, bottomLimit);
      if (y) {
        pos.add(x, y);
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

    const by = findSampleAtPos(data, offset, topLimit, bottomLimit);
    if (by == null) return null;
    const vecAtEnd: Vector2 = new Vector2(offset, by);
    const tmpVec: Vector2 = Vector2.zero.mutable;
    for (let i = 0; i < count; i++) {
      const x = offset + i * step;
      const y = findSampleAtPos(data, x, topLimit, bottomLimit);
      if (y === null) continue;
      tmpVec.set(x, y);
      tmpVec.sub(vecAtEnd);
      dir.add(tmpVec);
    }

    return dir;
  }

  checkDrawLabelsOnLeftSide(): boolean {
    const { wellborePathBoundingBox } = this;
    const { xScale } = this.rescaleEvent;
    const t = 200;

    const [dx1, dx2] = xScale.domain();
    const [rx1] = xScale.range();

    const wbBBox = {
      left: xScale(wellborePathBoundingBox.left),
      right: xScale(wellborePathBoundingBox.right),
    };

    return Math.abs(dx1 - wbBBox.left) > Math.abs(wbBBox.right - dx2) || Math.abs(rx1 - xScale(wbBBox.left)) > t;
  }

  getWellborePathBBox(wellborePath: any): any {
    if (!wellborePath || wellborePath.length <= 0) {
      return null;
    }
    const left = wellborePath[wellborePath.length - 1][0];
    const right = wellborePath[0][0];
    const top = wellborePath[0][1];
    const bottom = wellborePath.reduce((acc: number, v: number[]) => (acc > v[1] ? acc : v[1]), -Infinity);

    return {
      left,
      right,
      top,
      bottom,
    };
  }
}
