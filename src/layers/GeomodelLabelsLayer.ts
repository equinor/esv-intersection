/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-magic-numbers */
import Vector2 from '@equinor/videx-vector2';
import { clamp } from '@equinor/videx-math';

import { CanvasLayer } from './base/CanvasLayer';
import { GeomodelLayerLabelsOptions, OnUpdateEvent, OnRescaleEvent, OnMountEvent } from '../interfaces';
import { SurfaceArea, SurfaceLine, findSampleAtPos, SurfaceData } from '../datautils';
import { SURFACE_LINE_WIDTH } from '../constants';

const DEFAULT_MARGINS = 18;
const DEFAULT_MIN_FONT_SIZE = 8;
const DEFAULT_MAX_FONT_SIZE = 13;
const DEFAULT_TEXT_COLOR = 'black';
const DEFAULT_FONT = 'Arial';

export class GeomodelLabelsLayer extends CanvasLayer {
  defaultMargins: number = DEFAULT_MARGINS;
  defaultMinFontSize: number = DEFAULT_MIN_FONT_SIZE;
  defaultMaxFontSize: number = DEFAULT_MAX_FONT_SIZE;
  defaultTextColor: string = DEFAULT_TEXT_COLOR;
  defaultFont: string = DEFAULT_FONT;

  rescaleEvent: OnRescaleEvent;
  isLabelsOnLeftSide: boolean = true;
  maxFontSizeInWorldCoordinates: number = 70;
  isXFlipped: boolean = false;
  areasWithAvgTopDepth: any[] = null;

  constructor(id?: string, options?: GeomodelLayerLabelsOptions) {
    super(id, options);
    this.render = this.render.bind(this);
    this.getMarginsInWorldCoordinates = this.getMarginsInWorldCoordinates.bind(this);
    this.getSurfacesAreaEdges = this.getSurfacesAreaEdges.bind(this);
    this.updateXFlipped = this.updateXFlipped.bind(this);
    this.generateSurfacesWithAvgDepth = this.generateSurfacesWithAvgDepth.bind(this);
  }

  get options(): GeomodelLayerLabelsOptions {
    return this._options;
  }

  setData(data: SurfaceData): void {
    super.setData(data);
    this.areasWithAvgTopDepth = null;
  }

  generateSurfacesWithAvgDepth(): any {
    const { areas } = this.data;
    this.areasWithAvgTopDepth = areas.reduce((acc: any, area: any) => {
      // Filter surfaces without label
      if (!area.label) {
        return acc;
      }
      const sumAndCount = area.data.reduce(
        (a: any, d: any) => {
          if (d[1] != null) {
            a.sum += d[1];
            a.count++;
          }
          return a;
        },
        {
          sum: 0,
          count: 0,
        },
      );
      if (sumAndCount.count === 0) {
        return acc;
      }
      const avgTopDepth = sumAndCount.sum / sumAndCount.count;

      acc.push({
        ...area,
        avgTopDepth,
      });
      return acc;
    }, []);
  }

  onMount(event: OnMountEvent): void {
    super.onMount(event);
  }

  onUpdate(event: OnUpdateEvent): void {
    super.onUpdate(event);
    this.render();
  }

  onRescale(event: OnRescaleEvent): void {
    this.rescaleEvent = event;
    this.updateXFlipped();
    this.resetTransform();
    this.render();
  }

  render(): void {
    if (!this.rescaleEvent) {
      return;
    }

    requestAnimationFrame(() => {
      this.clearCanvas();

      if (!this.data) {
        return;
      }

      if (!this.areasWithAvgTopDepth) {
        this.generateSurfacesWithAvgDepth();
      }

      this.drawAreaLabels();
      this.drawLineLabels();
    });
  }

  drawAreaLabels(): void {
    this.areasWithAvgTopDepth.forEach((s: any, i: number, array: any[]) => {
      const topmostSurfaceNotDrawnYet = array.reduce((acc, v, index) => {
        if (index > i) {
          if (acc == null) {
            acc = v;
          } else {
            if (v.avgTopDepth < acc.avgTopDepth) {
              acc = v;
            }
          }
        }
        return acc;
      }, null);
      this.drawAreaLabel(s, topmostSurfaceNotDrawnYet, array, i);
    });
  }

  drawLineLabels(): void {
    this.data.lines.filter((surfaceLine: SurfaceLine) => surfaceLine.label).forEach((surfaceLine: SurfaceLine) => this.drawLineLabel(surfaceLine));
  }

  drawAreaLabel = (surfaceArea: SurfaceArea, nextSurfaceArea: SurfaceArea, surfaces: any[], i: number): void => {
    const { data } = surfaceArea;
    const { ctx, maxFontSizeInWorldCoordinates, isXFlipped } = this;
    const { xScale, yScale, xRatio, yRatio, zFactor } = this.rescaleEvent;
    let isLabelsOnLeftSide = this.checkDrawLabelsOnLeftSide();
    const margins = (this.options.margins || this.defaultMargins) * (isXFlipped ? -1 : 1);
    const marginsInWorldCoords = margins / xRatio;
    const minFontSize = this.options.minFontSize || this.defaultMinFontSize;
    const maxFontSize = this.options.maxFontSize || this.defaultMaxFontSize;

    let fontSizeInWorldCoords = maxFontSize / yRatio;
    if (fontSizeInWorldCoords > maxFontSizeInWorldCoordinates) {
      fontSizeInWorldCoords = maxFontSizeInWorldCoordinates;
      if (fontSizeInWorldCoords * yRatio < minFontSize) {
        fontSizeInWorldCoords = minFontSize / yRatio;
      }
    }

    const leftEdge = xScale.invert(xScale.range()[0]) + marginsInWorldCoords;
    const rightEdge = xScale.invert(xScale.range()[1]) - marginsInWorldCoords;
    const [surfaceAreaLeftEdge, surfaceAreaRightEdge] = this.getSurfacesAreaEdges();

    // Get label metrics
    ctx.save();
    ctx.font = `${fontSizeInWorldCoords * yRatio}px ${this.options.font || this.defaultFont}`;
    let labelMetrics = ctx.measureText(surfaceArea.label);
    let labelLengthInWorldCoords = labelMetrics.width / xRatio;

    // Check if label will fit horizontally
    if (isLabelsOnLeftSide) {
      const labelRightEdge = leftEdge + (isXFlipped ? -labelLengthInWorldCoords : labelLengthInWorldCoords);
      if ((!isXFlipped && labelRightEdge > surfaceAreaRightEdge) || (isXFlipped && labelRightEdge < surfaceAreaRightEdge)) {
        isLabelsOnLeftSide = false;
      }
    } else {
      const labelLeftEdge = rightEdge + (isXFlipped ? labelLengthInWorldCoords : -labelLengthInWorldCoords);
      if ((!isXFlipped && labelLeftEdge < surfaceAreaLeftEdge) || (isXFlipped && labelLeftEdge > surfaceAreaLeftEdge)) {
        isLabelsOnLeftSide = true;
      }
    }

    // Find edge where to draw
    let startPos;
    const portionOfLabelLengthUsedForPosCalc = 0.07;
    if (isLabelsOnLeftSide) {
      startPos = isXFlipped ? Math.min(surfaceAreaLeftEdge, leftEdge) : Math.max(surfaceAreaLeftEdge, leftEdge);
    } else {
      startPos = isXFlipped ? Math.max(surfaceAreaRightEdge, rightEdge) : Math.min(surfaceAreaRightEdge, rightEdge);
    }

    const topEdge = yScale.invert(yScale.range()[0]);
    const bottomEdge = yScale.invert(yScale.range()[1]);

    // Calculate where to sample points
    const dirSteps = 5;
    const posSteps = 3;
    const posStep =
      portionOfLabelLengthUsedForPosCalc * (labelLengthInWorldCoords / posSteps) * (isLabelsOnLeftSide ? 1 : -1) * (isXFlipped ? -1 : 1);
    const dirStep = (labelLengthInWorldCoords / dirSteps) * (isLabelsOnLeftSide ? 1 : -1) * (isXFlipped ? -1 : 1);

    // Sample points from top and calculate position
    const topData = data.map((d) => [d[0], d[1]]);
    const topPos = this.calcPos(topData, startPos, posSteps, posStep, topEdge, bottomEdge);
    if (!topPos) {
      return;
    }

    // Sample points from bottom and calculate position
    const bottomData = data.map((d) => [d[0], d[2]]);
    let bottomPos = this.calcPos(
      bottomData,
      startPos,
      posSteps,
      posStep,
      topEdge,
      bottomEdge,
      nextSurfaceArea ? nextSurfaceArea.data.map((d) => [d[0], d[1]]) : null,
      surfaces,
      i,
    );
    if (!bottomPos) {
      bottomPos = new Vector2(topPos.x, bottomEdge);
    }

    // Check if there is enough height for label
    const thickness = bottomPos.y - topPos.y;
    if (thickness < fontSizeInWorldCoords) {
      // Check minimum fontsize
      if (thickness * yRatio < minFontSize) {
        return;
      }
      // Use reduced fontsize
      fontSizeInWorldCoords = thickness;
      ctx.font = `${fontSizeInWorldCoords * yRatio}px ${this.options.font || this.defaultFont}`;
      labelMetrics = ctx.measureText(surfaceArea.label);
      labelLengthInWorldCoords = labelMetrics.width / xRatio;
    }
    // Sample points from top and bottom and calculate direction vector
    const initialDirVec = isLabelsOnLeftSide !== isXFlipped ? Vector2.right : Vector2.left;
    const areaDir = this.calcAreaDir(
      topData,
      bottomData,
      startPos,
      dirSteps,
      dirStep,
      initialDirVec,
      topEdge,
      bottomEdge,
      0,
      Math.PI / 4,
      4,
      nextSurfaceArea ? nextSurfaceArea.data.map((d) => [d[0], d[1]]) : null,
      surfaces,
      i,
    );
    const scaledAngle = Math.atan(Math.tan(areaDir) * zFactor);

    // Draw label
    const textX = startPos;
    const textY = (topPos.y + bottomPos.y) / 2;
    const textAngle = isXFlipped ? -scaledAngle : scaledAngle;
    ctx.textAlign = isLabelsOnLeftSide ? 'left' : 'right';
    ctx.translate(xScale(textX), yScale(textY));
    ctx.rotate(textAngle);
    ctx.fillStyle = this.options.textColor || this.defaultTextColor;
    ctx.font = `${fontSizeInWorldCoords * yRatio}px ${this.options.font || this.defaultFont}`;
    ctx.textBaseline = 'middle';
    ctx.fillText(surfaceArea.label, 0, 0);

    ctx.restore();
  };

  drawLineLabel = (s: SurfaceLine): void => {
    const { ctx, isXFlipped } = this;
    const { xScale, yScale, xRatio, yRatio, zFactor } = this.rescaleEvent;
    const isLabelsOnLeftSide = this.checkDrawLabelsOnLeftSide();
    const marginsInWorldCoords = this.getMarginsInWorldCoordinates();
    const maxFontSize = this.options.maxFontSize || this.defaultMaxFontSize;

    const fontSizeInWorldCoords = maxFontSize / yRatio;

    ctx.save();
    ctx.font = `${fontSizeInWorldCoords * yRatio}px ${this.options.font || this.defaultFont}`;
    const labelMetrics = ctx.measureText(s.label);
    const labelLengthInWorldCoords = labelMetrics.width / xRatio;

    const leftEdge = xScale.invert(xScale.range()[0]) + marginsInWorldCoords;
    const rightEdge = xScale.invert(xScale.range()[1]) - marginsInWorldCoords;
    const [surfaceAreaLeftEdge, surfaceAreaRightEdge] = this.getSurfacesAreaEdges();

    // Find edge where to draw
    let startPos;
    const steps = 5;
    if (isLabelsOnLeftSide) {
      startPos = isXFlipped ? Math.max(surfaceAreaRightEdge, rightEdge) : Math.min(surfaceAreaRightEdge, rightEdge);
    } else {
      startPos = isXFlipped ? Math.min(surfaceAreaLeftEdge, leftEdge) : Math.max(surfaceAreaLeftEdge, leftEdge);
    }

    // Calculate where to sample points
    const step = (labelLengthInWorldCoords / steps) * (isLabelsOnLeftSide ? -1 : 1);

    // Sample points and calculate position and direction vector
    const { data } = s;
    const pos = this.calcPos(data, startPos, steps, step);
    const dir = this.calcLineDir(data, startPos, steps, step, zFactor, isLabelsOnLeftSide ? Vector2.left : Vector2.right);
    if (!pos || !dir) {
      return;
    }

    // Calculate position and direction for label
    const textX = startPos;
    const textY = pos.y - SURFACE_LINE_WIDTH - fontSizeInWorldCoords / 2;
    const textDir = Vector2.angleRight(dir) - (isLabelsOnLeftSide ? Math.PI : 0);

    // Draw label
    ctx.textAlign = isLabelsOnLeftSide ? 'right' : 'left';
    ctx.translate(xScale(textX), yScale(textY));
    ctx.rotate(textDir);
    ctx.fillStyle = this.colorToCSSColor(s.color);
    ctx.textBaseline = 'middle';
    ctx.fillText(s.label, 0, 0);

    ctx.restore();
  };

  colorToCSSColor(color: number | string): string {
    if (typeof color === 'string') {
      return color;
    }

    let hexString = color.toString(16);
    hexString = '000000'.substr(0, 6 - hexString.length) + hexString;
    return `#${hexString}`;
  }

  calcPos(
    data: number[][],
    offset: number,
    count: number,
    step: number,
    topLimit: number = null,
    bottomLimit: number = null,
    alternativeSurfaceData: number[][] = null,
    surfaces: any[] = null,
    currentSurfaceIndex: number = null,
  ): Vector2 {
    const pos = Vector2.zero.mutable;
    let samples = 0;
    for (let i = 0; i < count; i++) {
      const x = offset + i * step;
      const y = findSampleAtPos(data, x, topLimit, bottomLimit);
      if (y) {
        const alternativeY = this.getAlternativeYValueIfAvailable(x, topLimit, bottomLimit, alternativeSurfaceData, surfaces, currentSurfaceIndex);
        // Use topmost of value from current surface and alternative surface
        const usedY = alternativeY ? Math.min(y, alternativeY) : y;
        pos.add(x, usedY);
        samples++;
      }
    }

    if (samples === 0) {
      return null;
    }

    return Vector2.divide(pos, samples);
  }

  getAlternativeYValueIfAvailable(
    x: number,
    topLimit: number,
    bottomLimit: number,
    alternativeSurfaceData: number[][],
    surfaces: any[],
    currentSurfaceIndex: number,
  ): number {
    if (!alternativeSurfaceData) {
      return null;
    }
    // Find sample from passed in surface data
    let altY = findSampleAtPos(alternativeSurfaceData, x, topLimit, bottomLimit);
    if (altY == null && surfaces && currentSurfaceIndex != null) {
      //Find topmost surface after current which gives us data
      let si = currentSurfaceIndex + 1;
      while (altY == null && si < surfaces.length) {
        const altSurface = surfaces[si++];
        altY = findSampleAtPos(
          altSurface.data.map((d: any) => [d[0], d[1]]),
          x,
          topLimit,
          bottomLimit,
        );
      }
    }
    return altY;
  }

  calcLineDir(
    data: number[][],
    offset: number,
    count: number,
    step: number,
    zFactor: number,
    initalVector: Vector2 = Vector2.left,
    topLimit: number = null,
    bottomLimit: number = null,
  ): Vector2 {
    const dir = initalVector.mutable;

    const startY = findSampleAtPos(data, offset, topLimit, bottomLimit);
    if (startY === null) {
      return dir;
    }

    const vecAtEnd = new Vector2(offset, startY * zFactor);
    const tmpVec = Vector2.zero.mutable;
    for (let i = 1; i <= count; i++) {
      const x = offset + i * step;
      const y = findSampleAtPos(data, offset, topLimit, bottomLimit);
      if (y !== null) {
        tmpVec.set(x, y * zFactor);
        tmpVec.sub(vecAtEnd);
        dir.add(tmpVec);
      }
    }

    return dir;
  }

  calcAreaDir(
    top: number[][],
    bottom: number[][],
    offset: number,
    count: number,
    step: number,
    initalVector: Vector2 = Vector2.left,
    topLimit: number = null,
    bottomLimit: number = null,
    minReductionAngle: number = 0,
    maxReductionAngle: number = Math.PI / 4,
    angleReductionExponent: number = 4,
    alternativeSurfaceBottomData: number[][] = null,
    surfaces: any[] = null,
    currentSurfaceIndex: number = null,
  ): number {
    const angles: number[] = [];
    const tmpVec = Vector2.zero.mutable;
    let vecAtEnd;
    for (let i = 0; i <= count; i++) {
      const x = offset + i * step;
      const topY = findSampleAtPos(top, x, topLimit, bottomLimit);
      const bottomY = findSampleAtPos(bottom, x, topLimit, bottomLimit) || bottomLimit;
      // Find position of next surface in case it's higher than current base
      const alternativeBottomY = this.getAlternativeYValueIfAvailable(
        x,
        topLimit,
        bottomLimit,
        alternativeSurfaceBottomData,
        surfaces,
        currentSurfaceIndex,
      );
      // Use topmost of value from current surface and alternative surface
      const usedBottomY = alternativeBottomY ? Math.min(bottomY, alternativeBottomY) : bottomY;
      if (i === 0) {
        if (topY === null) {
          return Vector2.angleRight(initalVector);
        }
        const startY = (topY + usedBottomY) / 2;
        vecAtEnd = new Vector2(offset, startY);
      } else {
        if (topY !== null) {
          tmpVec.set(x, (topY + usedBottomY) / 2);
          tmpVec.sub(vecAtEnd);

          angles.push(Vector2.angleRight(tmpVec));
        } else {
          angles.push(Vector2.angleRight(initalVector));
        }
      }
    }

    const refAngle = angles[0];
    const offsetAngles = angles.map((d: number) => d - refAngle);
    let factors = 0;
    const offsetSum = offsetAngles.reduce((acc: number, v: number) => {
      const ratio = (Math.abs(v) - minReductionAngle) / maxReductionAngle;
      const factor = Math.pow(1 - clamp(ratio, 0, 1), angleReductionExponent);
      factors += factor;
      return acc + v * factor;
    }, 0);
    const angle = offsetSum / factors + refAngle;
    return angle;
  }

  updateXFlipped(): void {
    const { xBounds } = this.rescaleEvent;
    this.isXFlipped = xBounds[0] > xBounds[1];
  }

  getMarginsInWorldCoordinates(): number {
    const { xRatio } = this.rescaleEvent;
    const margins = (this.options.margins || this.defaultMargins) * (this.isXFlipped ? -1 : 1);
    const marginsInWorldCoords = margins / xRatio;
    return marginsInWorldCoords;
  }

  getSurfacesAreaEdges(): number[] {
    const data = this.data.areas[0].data;
    const maxX = Math.max(data[data.length - 1][0], data[0][0]);
    const minX = Math.min(data[0][0], data[data.length - 1][0]);
    const marginsInWorldCoords = this.getMarginsInWorldCoordinates();
    const { isXFlipped } = this;
    const surfaceAreaLeftEdge = isXFlipped ? maxX + marginsInWorldCoords : minX + marginsInWorldCoords;
    const surfaceAreaRightEdge = isXFlipped ? minX - marginsInWorldCoords : maxX - marginsInWorldCoords;
    return [surfaceAreaLeftEdge, surfaceAreaRightEdge];
  }

  checkDrawLabelsOnLeftSide(): boolean {
    const { referenceSystem, isXFlipped } = this;
    if (!referenceSystem) {
      return true;
    }

    const { xScale, yScale, xRatio } = this.rescaleEvent;
    const t = 200; // TODO: Use actual size of largest label or average size of all

    const [dx1, dx2] = xScale.domain();
    const [dy1, dy2] = yScale.domain();

    let top = referenceSystem.interpolators.curtain.lookup(dy1, 1, 0);
    if (top.length === 0) {
      top = [referenceSystem.interpolators.curtain.getPointAt(0.0)];
    }
    let bottom = referenceSystem.interpolators.curtain.lookup(dy2, 1, 0);
    if (bottom.length === 0) {
      bottom = [referenceSystem.interpolators.curtain.getPointAt(1.0)];
    }

    const maxX = Math.max(top[0][0], bottom[0][0]);
    const minX = Math.min(top[0][0], bottom[0][0]);

    const wbBBox = {
      left: isXFlipped ? maxX : minX,
      right: isXFlipped ? minX : maxX,
    };

    const margin = this.getMarginsInWorldCoordinates();
    const screenLeftEdge = dx1 + margin;
    const screenRightEdge = dx2 - margin;

    const [surfaceAreaLeftEdge, surfaceAreaRightEdge] = this.getSurfacesAreaEdges();

    const leftLimit = isXFlipped ? Math.min(screenLeftEdge, surfaceAreaLeftEdge) : Math.max(screenLeftEdge, surfaceAreaLeftEdge);
    const rightLimit = isXFlipped ? Math.max(screenRightEdge, surfaceAreaRightEdge) : Math.min(screenRightEdge, surfaceAreaRightEdge);

    const spaceOnLeftSide = Math.max(isXFlipped ? leftLimit - wbBBox.left : wbBBox.left - leftLimit, 0);
    const spaceOnRightSide = Math.max(isXFlipped ? wbBBox.right - rightLimit : rightLimit - wbBBox.right, 0);

    const spaceOnLeftSideInScreenCoordinates = spaceOnLeftSide * xRatio;
    const spaceOnRightSideInScreenCoordinates = spaceOnRightSide * xRatio;

    const isLabelsOnLeftSide =
      spaceOnLeftSide > spaceOnRightSide ||
      spaceOnLeftSideInScreenCoordinates > t ||
      (spaceOnLeftSideInScreenCoordinates < t && spaceOnRightSideInScreenCoordinates < t && isXFlipped) ||
      bottom[1] < dy1;

    return isLabelsOnLeftSide;
  }
}
