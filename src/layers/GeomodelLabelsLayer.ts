import Vector2 from '@equinor/videx-vector2';
import { clamp } from '@equinor/videx-math';

import { CanvasLayer } from './base/CanvasLayer';
import { OnUpdateEvent, OnRescaleEvent, OnMountEvent } from '../interfaces';
import { SurfaceArea, SurfaceLine, findSampleAtPos, SurfaceData } from '../datautils';
import { SURFACE_LINE_WIDTH } from '../constants';
import { LayerOptions } from './base/Layer';

const DEFAULT_MARGINS = 18;
const DEFAULT_MIN_FONT_SIZE = 8;
const DEFAULT_MAX_FONT_SIZE = 13;
const DEFAULT_TEXT_COLOR = 'black';
const DEFAULT_FONT = 'Arial';
const MAX_FONT_SIZE_IN_WORLD_COORDINATES = 70;

export interface GeomodelLayerLabelsOptions<T extends SurfaceData> extends LayerOptions<T> {
  margins?: number;
  minFontSize?: number;
  maxFontSize?: number;
  textColor?: string;
  font?: string;
}

interface SurfaceAreaWithAvgTopDepth extends SurfaceArea {
  avgTopDepth: number;
}

export class GeomodelLabelsLayer<T extends SurfaceData> extends CanvasLayer<T> {
  defaultMargins: number = DEFAULT_MARGINS;
  defaultMinFontSize: number = DEFAULT_MIN_FONT_SIZE;
  defaultMaxFontSize: number = DEFAULT_MAX_FONT_SIZE;
  defaultTextColor: string = DEFAULT_TEXT_COLOR;
  defaultFont: string = DEFAULT_FONT;

  rescaleEvent: OnRescaleEvent | undefined;
  isLabelsOnLeftSide = true;
  maxFontSizeInWorldCoordinates: number = MAX_FONT_SIZE_IN_WORLD_COORDINATES;
  isXFlipped = false;
  areasWithAvgTopDepth: SurfaceAreaWithAvgTopDepth[] = [];

  constructor(id?: string, options?: GeomodelLayerLabelsOptions<T>) {
    super(id, options);
    this.render = this.render.bind(this);
    this.getMarginsInWorldCoordinates = this.getMarginsInWorldCoordinates.bind(this);
    this.getSurfacesAreaEdges = this.getSurfacesAreaEdges.bind(this);
    this.updateXFlipped = this.updateXFlipped.bind(this);
    this.generateSurfacesWithAvgDepth = this.generateSurfacesWithAvgDepth.bind(this);
  }

  override get options(): GeomodelLayerLabelsOptions<T> {
    return this._options;
  }

  override setData(data: T): void {
    super.setData(data);
    this.areasWithAvgTopDepth = [];
  }

  generateSurfacesWithAvgDepth(): void {
    const areas = this.data?.areas ?? [];
    this.areasWithAvgTopDepth = areas.reduce((acc: SurfaceAreaWithAvgTopDepth[], area: SurfaceArea) => {
      // Filter surfaces without label
      if (!area.label) {
        return acc;
      }
      const sumAndCount = area.data.reduce(
        (a: { sum: number; count: number }, d: number[]) => {
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

  override onMount(event: OnMountEvent): void {
    super.onMount(event);
  }

  override onUpdate(event: OnUpdateEvent<T>): void {
    super.onUpdate(event);
    this.render();
  }

  override onRescale(event: OnRescaleEvent): void {
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

      if (this.areasWithAvgTopDepth.length <= 0) {
        this.generateSurfacesWithAvgDepth();
      }

      this.drawAreaLabels();
      this.drawLineLabels();
    });
  }

  drawAreaLabels(): void {
    this.areasWithAvgTopDepth.forEach((s: SurfaceAreaWithAvgTopDepth, i: number, array: SurfaceAreaWithAvgTopDepth[]) => {
      const topmostSurfaceNotDrawnYet = array.reduce((acc: SurfaceAreaWithAvgTopDepth | null, v, index): SurfaceAreaWithAvgTopDepth | null => {
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
    this.data?.lines.filter((surfaceLine: SurfaceLine) => surfaceLine.label).forEach((surfaceLine: SurfaceLine) => this.drawLineLabel(surfaceLine));
  }

  drawAreaLabel = (surfaceArea: SurfaceArea, nextSurfaceArea: SurfaceArea | null, surfaces: SurfaceArea[], i: number): void => {
    const { data } = surfaceArea;
    const { ctx, maxFontSizeInWorldCoordinates, isXFlipped } = this;
    const { xScale, yScale, xRatio, yRatio, zFactor } = this.rescaleEvent!;
    if (ctx == null) return;

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

    const leftEdge = xScale.invert(xScale.range()[0]!) + marginsInWorldCoords;
    const rightEdge = xScale.invert(xScale.range()[1]!) - marginsInWorldCoords;
    const [surfaceAreaLeftEdge, surfaceAreaRightEdge] = this.getSurfacesAreaEdges() as [number, number];

    // Get label metrics
    ctx.save();
    ctx.font = `${fontSizeInWorldCoords * yRatio}px ${this.options.font || this.defaultFont}`;
    let labelMetrics = ctx.measureText(surfaceArea.label ?? '');
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
    let startPos: number;
    const portionOfLabelLengthUsedForPosCalc = 0.07;
    if (isLabelsOnLeftSide) {
      startPos = isXFlipped ? Math.min(surfaceAreaLeftEdge, leftEdge) : Math.max(surfaceAreaLeftEdge, leftEdge);
    } else {
      startPos = isXFlipped ? Math.max(surfaceAreaRightEdge, rightEdge) : Math.min(surfaceAreaRightEdge, rightEdge);
    }

    const topEdge = yScale.invert(yScale.range()[0]!);
    const bottomEdge = yScale.invert(yScale.range()[1]!);

    // Calculate where to sample points
    const dirSteps = 5;
    const posSteps = 3;
    const posStep =
      portionOfLabelLengthUsedForPosCalc * (labelLengthInWorldCoords / posSteps) * (isLabelsOnLeftSide ? 1 : -1) * (isXFlipped ? -1 : 1);
    const dirStep = (labelLengthInWorldCoords / dirSteps) * (isLabelsOnLeftSide ? 1 : -1) * (isXFlipped ? -1 : 1);

    // Sample points from top and calculate position
    const topData = data.map((d) => [d[0]!, d[1]!]);
    const topPos = this.calcPos(topData, startPos, posSteps, posStep, topEdge, bottomEdge);
    if (!topPos) {
      return;
    }

    // Sample points from bottom and calculate position
    const bottomData = data.map((d) => [d[0]!, d[2]!]);
    let bottomPos = this.calcPos(
      bottomData,
      startPos,
      posSteps,
      posStep,
      topEdge,
      bottomEdge,
      nextSurfaceArea?.data.map((d) => [d[0]!, d[1]!]) ?? [],
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
      labelMetrics = ctx.measureText(surfaceArea.label ?? '');
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
      nextSurfaceArea?.data.map((d) => [d[0]!, d[1]!]) ?? [],
      surfaces,
      i,
    );
    const scaledAngle = Math.atan(Math.tan(areaDir) * zFactor);

    // Draw label
    const textX = startPos;
    const textY = (topPos.y + bottomPos.y) / 2;
    const textAngle = isXFlipped ? -scaledAngle : scaledAngle;

    if (ctx) {
      ctx.textAlign = isLabelsOnLeftSide ? 'left' : 'right';
      ctx.translate(xScale(textX), yScale(textY));
      ctx.rotate(textAngle);
      ctx.fillStyle = this.options.textColor || this.defaultTextColor;
      ctx.font = `${fontSizeInWorldCoords * yRatio}px ${this.options.font || this.defaultFont}`;
      ctx.textBaseline = 'middle';
      ctx.fillText(surfaceArea.label ?? '', 0, 0);

      ctx.restore();
    }
  };

  drawLineLabel = (s: SurfaceLine): void => {
    const { ctx, isXFlipped } = this;
    const { xScale, yScale, xRatio, yRatio, zFactor } = this.rescaleEvent!;
    if (ctx == null) return;
    const isLabelsOnLeftSide = this.checkDrawLabelsOnLeftSide();
    const marginsInWorldCoords = this.getMarginsInWorldCoordinates();
    const maxFontSize = this.options.maxFontSize || this.defaultMaxFontSize;

    const fontSizeInWorldCoords = maxFontSize / yRatio;

    ctx.save();
    ctx.font = `${fontSizeInWorldCoords * yRatio}px ${this.options.font || this.defaultFont}`;
    const labelMetrics = ctx.measureText(s.label);
    const labelLengthInWorldCoords = labelMetrics.width / xRatio;

    const leftEdge = xScale.invert(xScale.range()[0]!) + marginsInWorldCoords;
    const rightEdge = xScale.invert(xScale.range()[1]!) - marginsInWorldCoords;
    const [surfaceAreaLeftEdge, surfaceAreaRightEdge] = this.getSurfacesAreaEdges() as [number, number];

    // Find edge where to draw
    let startPos: number;
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
    if (ctx) {
      ctx.textAlign = isLabelsOnLeftSide ? 'right' : 'left';
      ctx.translate(xScale(textX), yScale(textY));
      ctx.rotate(textDir);
      ctx.fillStyle = this.colorToCSSColor(s.color);
      ctx.textBaseline = 'middle';
      ctx.fillText(s.label, 0, 0);

      ctx.restore();
    }
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
    topLimit?: number,
    bottomLimit?: number,
    alternativeSurfaceData?: number[][],
    surfaces: SurfaceArea[] | null = null,
    currentSurfaceIndex?: number,
  ): Vector2 | null {
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
    topLimit?: number,
    bottomLimit?: number,
    alternativeSurfaceData?: number[][],
    surfaces: SurfaceArea[] | null = null,
    currentSurfaceIndex?: number,
  ): number | null {
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
        altY = findSampleAtPos(altSurface?.data.map((d: number[]) => [d[0]!, d[1]!]) ?? [], x, topLimit, bottomLimit);
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
    topLimit?: number,
    bottomLimit?: number,
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
    topLimit: number,
    bottomLimit: number,
    minReductionAngle = 0,
    maxReductionAngle: number = Math.PI / 4,
    angleReductionExponent = 4,
    alternativeSurfaceBottomData: number[][],
    surfaces: SurfaceArea[] | null = null,
    currentSurfaceIndex: number,
  ): number {
    const angles: number[] = [];
    const tmpVec = Vector2.zero.mutable;
    let vecAtEnd: Vector2;
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
          tmpVec.sub(vecAtEnd!);

          angles.push(Vector2.angleRight(tmpVec));
        } else {
          angles.push(Vector2.angleRight(initalVector));
        }
      }
    }

    const refAngle = angles[0]!;
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
    const { xBounds } = this.rescaleEvent!;
    this.isXFlipped = xBounds[0] > xBounds[1];
  }

  getMarginsInWorldCoordinates(): number {
    const { xRatio } = this.rescaleEvent!;
    const margins = (this.options.margins || this.defaultMargins) * (this.isXFlipped ? -1 : 1);
    const marginsInWorldCoords = margins / xRatio;
    return marginsInWorldCoords;
  }

  getSurfacesAreaEdges(): number[] {
    const endPoints =
      this.data?.areas.reduce((acc, area) => {
        const { data } = area;
        const firstValidPoint = data.find((d: number[]) => d[1] != null);
        if (firstValidPoint) {
          acc.push(firstValidPoint[0]!);
        }
        // TODO: Use findLast() when TypeScript stops complaining about it
        for (let i = data.length - 1; i >= 0; i--) {
          if (data[i]?.[1] != null) {
            acc.push(data[i]?.[0]!);
            break;
          }
        }

        return acc;
      }, [] as number[]) ?? [];
    endPoints.push(
      ...(this.data?.lines.reduce((acc, line) => {
        const { data } = line;
        const firstValidPoint = data.find((d: number[]) => d[1] != null);
        if (firstValidPoint) {
          acc.push(firstValidPoint[0]!);
        }
        // TODO: Use findLast() when TypeScript stops complaining about it
        for (let i = data.length - 1; i >= 0; i--) {
          if (data[i]?.[1] != null) {
            acc.push(data[i]?.[0]!);
            break;
          }
        }
        return acc;
      }, [] as number[]) ?? []),
    );

    const minX = Math.min(...endPoints);
    const maxX = Math.max(...endPoints);
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

    const { xScale, yScale, xRatio } = this.rescaleEvent!;
    const t = 200; // TODO: Use actual size of largest label or average size of all

    const [dx1, dx2] = xScale.domain() as [number, number];
    const [dy1, dy2] = yScale.domain() as [number, number];

    let top = referenceSystem.interpolators.curtain.getIntersects(dy1, 1, 0) as number[][];
    if (top.length === 0) {
      top = [referenceSystem.interpolators.curtain.getPointAt(0.0) as number[]];
    }
    let bottom = referenceSystem.interpolators.curtain.getIntersects(dy2, 1, 0) as number[][];
    if (bottom.length === 0) {
      bottom = [referenceSystem.interpolators.curtain.getPointAt(1.0) as number[]];
    }

    const maxX = Math.max(top[0]?.[0]!, bottom[0]?.[0]!);
    const minX = Math.min(top[0]?.[0]!, bottom[0]?.[0]!);

    const wbBBox = {
      left: isXFlipped ? maxX : minX,
      right: isXFlipped ? minX : maxX,
    };

    const margin = this.getMarginsInWorldCoordinates();
    const screenLeftEdge = dx1 + margin;
    const screenRightEdge = dx2 - margin;

    const [surfaceAreaLeftEdge, surfaceAreaRightEdge] = this.getSurfacesAreaEdges() as [number, number];

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
      bottom[0]?.[1]! < dy1;

    return isLabelsOnLeftSide;
  }
}
