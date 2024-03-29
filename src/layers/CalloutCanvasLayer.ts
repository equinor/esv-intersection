import { ScaleLinear } from 'd3-scale';

import { CanvasLayer } from './base/CanvasLayer';
import { OnUpdateEvent, Annotation, OnRescaleEvent, BoundingBox } from '../interfaces';
import { calcSize, isOverlapping, getOverlapOffset } from '../utils';
import { LayerOptions } from './base/Layer';

const DEFAULT_MIN_FONT_SIZE = 7;
const DEFAULT_MAX_FONT_SIZE = 11;
const DEFAULT_FONT_SIZE_FACTOR = 7;

const DEFAULT_OFFSET_MIN = 20;
const DEFAULT_OFFSET_MAX = 120;
const DEFAULT_OFFSET_FACTOR = 19;

const DEFAULT_BACKGROUND_COLOR = 'rgba(0, 0, 0, 0.5)';
const DEFAULT_BACKGROUND_PADDING = 5;
const DEFAULT_BACKGROUND_BORDER_RADIUS = 5;

/** Input returned if present, defaultValue used as fallback. */
function getValueOrDefault<T>(input: T | null | undefined, defaultValue: T): T {
  return input === null || input === undefined ? defaultValue : input;
}

const Location = {
  topleft: 'topleft',
  topright: 'topright',
  bottomleft: 'bottomleft',
  bottomright: 'bottomright',
};

export type Point = {
  x: number;
  y: number;
};

export type Callout = {
  title: string;
  label: string;
  color: string;
  pos: Point;
  group: string;
  alignment: string;
  boundingBox: BoundingBox;
  dx: number;
  dy: number;
};

export interface CalloutOptions<T extends Annotation[]> extends LayerOptions<T> {
  minFontSize?: number;
  maxFontSize?: number;
  fontSizeFactor?: number;
  offsetMin?: number;
  offsetMax?: number;
  offsetFactor?: number;
  fontColor?: string;
  backgroundColor?: string;
  backgroundPadding?: number;
  backgroundBorderRadius?: number;
}

export class CalloutCanvasLayer<T extends Annotation[]> extends CanvasLayer<T> {
  rescaleEvent: OnRescaleEvent | undefined;
  xRatio: number | undefined;
  callouts: Callout[] = [];
  groupFilter: string[] = [];
  minFontSize: number;
  maxFontSize: number;
  fontSizeFactor: number;
  offsetMin: number;
  offsetMax: number;
  offsetFactor: number;

  fontColor: string | undefined;

  backgroundActive: boolean;
  backgroundColor: string;
  backgroundPadding: number;
  backgroundBorderRadius: number;

  constructor(id?: string, options?: CalloutOptions<T>) {
    super(id, options);
    this.minFontSize = options?.minFontSize || DEFAULT_MIN_FONT_SIZE;
    this.maxFontSize = options?.maxFontSize || DEFAULT_MAX_FONT_SIZE;
    this.fontSizeFactor = options?.fontSizeFactor || DEFAULT_FONT_SIZE_FACTOR;
    this.offsetMin = options?.offsetMin || DEFAULT_OFFSET_MIN;
    this.offsetMax = options?.offsetMax || DEFAULT_OFFSET_MAX;
    this.offsetFactor = options?.offsetFactor || DEFAULT_OFFSET_FACTOR;

    this.fontColor = options?.fontColor;

    // Set background as active if 'backgroundColor' is defined
    if (options?.backgroundColor) {
      this.backgroundActive = true;
      this.backgroundColor = options.backgroundColor;
    } else {
      this.backgroundActive = false;
      this.backgroundColor = DEFAULT_BACKGROUND_COLOR;
    }

    this.backgroundPadding = options?.backgroundPadding || DEFAULT_BACKGROUND_PADDING;
    this.backgroundBorderRadius = getValueOrDefault(options?.backgroundBorderRadius, DEFAULT_BACKGROUND_BORDER_RADIUS);
  }

  setGroupFilter(filter: string[]): void {
    this.groupFilter = filter;
    this.callouts = [];
    this.render();
  }

  override onUpdate(event: OnUpdateEvent<T>): void {
    super.onUpdate(event);
    this.callouts = [];
    this.render();
  }

  override onRescale(event: OnRescaleEvent): void {
    super.onRescale(event);
    const isPanning = this.rescaleEvent && this.rescaleEvent.xRatio === event.xRatio;
    this.rescaleEvent = event;

    this.render(isPanning);
  }

  render(isPanning = false): void {
    requestAnimationFrame(() => {
      this.clearCanvas();

      if (!this.data || !this.rescaleEvent || !this.referenceSystem) {
        return;
      }

      const { xScale, yScale, xBounds } = this.rescaleEvent;

      const fontSize = calcSize(this.fontSizeFactor, this.minFontSize, this.maxFontSize, xScale);

      if (!isPanning || this.callouts.length <= 0) {
        const { data, ctx, groupFilter } = this;
        const { calculateDisplacementFromBottom } = this.referenceSystem.options;
        const isLeftToRight = calculateDisplacementFromBottom ? xBounds[0] < xBounds[1] : xBounds[0] > xBounds[1];
        const scale = 0;

        ctx != null && (ctx.font = `bold ${fontSize}px arial`);
        const filtered = data.filter((d: Annotation) => groupFilter.length <= 0 || groupFilter.includes(d.group));
        const offset = calcSize(this.offsetFactor, this.offsetMin, this.offsetMax, xScale);
        this.callouts = this.positionCallouts(filtered, isLeftToRight, xScale, yScale, scale, fontSize, offset);
      }

      this.callouts.forEach((callout) => {
        const { pos, title, color } = callout;
        const x = xScale(pos.x);
        const y = yScale(pos.y);

        const calloutBB = {
          x,
          y,
          width: callout.boundingBox.width,
          height: fontSize,
          offsetX: callout.dx,
          offsetY: callout.dy,
        };

        this.renderCallout(title, callout.label, calloutBB, color, callout.alignment);
      });
    });
  }

  private renderBackground(title: string, label: string, x: number, y: number, fontSize: number): void {
    const { ctx } = this;

    if (ctx == null) {
      return;
    }

    const padding = this.backgroundPadding;
    const borderRadius = this.backgroundBorderRadius;

    const titleWidth = this.measureTextWidth(title, fontSize, 'arial', 'bold');
    const labelWidth = this.measureTextWidth(label, fontSize);

    // Determine width and height of annotation
    const width = Math.max(titleWidth, labelWidth) + padding * 2;
    const height = (fontSize + padding) * 2;

    const xMin = x - padding;
    const yMin = y - 2 * fontSize - padding;

    ctx.fillStyle = this.backgroundColor;

    if (borderRadius > 0) {
      const xMax = xMin + width;
      const yMax = yMin + height;

      // Draw rounded rect
      ctx.beginPath();
      ctx.moveTo(xMin + borderRadius, yMin); // Top left
      ctx.lineTo(xMax - borderRadius, yMin);
      ctx.quadraticCurveTo(xMax, yMin, xMax, yMin + borderRadius); // Top right corner
      ctx.lineTo(xMax, yMax - borderRadius);
      ctx.quadraticCurveTo(xMax, yMax, xMax - borderRadius, yMax); // Bottom right corner
      ctx.lineTo(xMin + borderRadius, yMax);
      ctx.quadraticCurveTo(xMin, yMax, xMin, yMax - borderRadius); // Bottom left corner
      ctx.lineTo(xMin, yMin + borderRadius);
      ctx.quadraticCurveTo(xMin, yMin, xMin + borderRadius, yMin); // Top left corner
      ctx.fill();
    } else {
      // Draw rect if no border radius
      ctx.fillRect(xMin, yMin, width, height);
    }
  }

  private renderAnnotation = (title: string, label: string, x: number, y: number, fontSize: number, color: string): void => {
    this.renderText(title, x, y - fontSize, fontSize, color, 'arial', 'bold');
    this.renderText(label, x, y, fontSize, color);
  };

  private renderText(title: string, x: number, y: number, fontSize: number, color: string, font = 'arial', fontStyle = 'normal'): void {
    const { ctx } = this;
    if (ctx != null) {
      ctx.font = `${fontStyle} ${fontSize}px ${font}`;
      ctx.fillStyle = this.fontColor || color;
      ctx.fillText(title, x, y);
    }
  }

  private measureTextWidth(title: string, fontSize: number, font = 'arial', fontStyle = 'normal'): number {
    const { ctx } = this;

    if (ctx == null) {
      return 0;
    }

    ctx.font = `${fontStyle} ${fontSize}px ${font}`;
    return ctx.measureText(title).width;
  }

  private renderPoint(x: number, y: number, color: string, radius = 3): void {
    const { ctx } = this;

    if (ctx != null) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private renderCallout(title: string, label: string, boundingBox: BoundingBox, color: string, location: string): void {
    const pos = this.getPosition(boundingBox, location);
    const { x, y } = pos;
    const { height, width, x: dotX, y: dotY } = boundingBox;

    const placeLeft = location === Location.topright || location === Location.bottomright;

    if (this.backgroundActive) {
      this.renderBackground(title, label, x, y, height);
    }

    this.renderAnnotation(title, label, x, y, height, color);
    this.renderPoint(dotX, dotY, color);
    this.renderLine(x, y, width, dotX, dotY, color, placeLeft);
  }

  private renderLine = (x: number, y: number, width: number, dotX: number, dotY: number, color: string, placeLeft = true): void => {
    const { ctx } = this;
    const textX = placeLeft ? x : x + width;
    const inverseTextX = placeLeft ? x + width : x;
    const textY = y + 2;

    if (ctx != null) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(dotX, dotY);
      ctx.lineTo(textX, textY);
      ctx.lineTo(inverseTextX, textY);

      ctx.stroke();
    }
  };

  private getPosition(boundingBox: BoundingBox, location: string): Point {
    const { x, y, offsetX = 0, offsetY = 0, width } = boundingBox;
    switch (location) {
      case Location.topleft:
        return {
          x: x - width - offsetX,
          y: y - offsetY,
        };
      case Location.topright:
        return {
          x: x + offsetX,
          y: y - offsetY,
        };
      case Location.bottomleft:
        return {
          x: x - width - offsetX,
          y: y + offsetY,
        };
      case Location.bottomright:
        return {
          x: x + offsetX,
          y: y + offsetY,
        };
      default:
        return {
          x,
          y,
        };
    }
  }

  // Calculates position of a list of annotations
  positionCallouts(
    annotations: Annotation[],
    isLeftToRight: boolean,
    xScale: ScaleLinear<number, number>,
    yScale: ScaleLinear<number, number>,
    _scale: number,
    fontSize: number,
    offset = 20,
  ): Callout[] {
    if (annotations.length === 0) {
      return [];
    }
    const alignment = isLeftToRight ? Location.topleft : Location.topright;

    const nodes = annotations.map((a) => {
      const pos = a.pos ? a.pos : this.referenceSystem?.project(a.md!)!;
      return {
        title: a.title,
        label: a.label,
        color: a.color,
        pos: { x: pos?.[0]!, y: pos?.[1]! },
        group: a.group,
        alignment,
        boundingBox: this.getAnnotationBoundingBox(a.title, a.label, pos, xScale, yScale, fontSize),
        dx: offset,
        dy: offset,
      };
    });

    const top = [nodes[nodes.length - 1]!];
    const bottom: Callout[] = [];

    // Initial best effort
    this.chooseTopOrBottomPosition(nodes, bottom, top);

    // Adjust position for top set
    this.adjustTopPositions(top);

    // Adjust position for bottom set
    this.adjustBottomPositions(bottom);

    return nodes;
  }

  getAnnotationBoundingBox(
    title: string,
    label: string,
    pos: number[],
    xScale: ScaleLinear<number, number>,
    yScale: ScaleLinear<number, number>,
    height: number,
  ): { x: number; y: number; width: number; height: number } {
    const { ctx } = this;
    const ax1 = xScale(pos[0]!);
    const ay1 = yScale(pos[1]!);

    const labelWidth = ctx?.measureText(label).width ?? 0;
    const titleWidth = ctx?.measureText(title).width ?? 0;
    const width = Math.max(labelWidth, titleWidth);

    const bbox = {
      x: ax1,
      y: ay1,
      width,
      height: height * 2 + 4,
    };
    return bbox;
  }

  chooseTopOrBottomPosition(nodes: Callout[], bottom: Callout[], top: Callout[]): void {
    for (let i = nodes.length - 2; i >= 0; --i) {
      const node = nodes[i]!;
      const prevNode = top[0]!;

      const overlap = isOverlapping(node.boundingBox, prevNode.boundingBox);
      if (overlap) {
        node.alignment = node.alignment === Location.topleft ? Location.bottomright : Location.bottomleft;
        bottom.push(node);
        if (i > 0) {
          top.unshift(nodes[--i]!);
        }
      } else {
        top.unshift(node);
      }
    }
  }

  adjustTopPositions(top: Callout[]): void {
    for (let i = top.length - 2; i >= 0; --i) {
      const currentNode = top[i]!;
      for (let j = top.length - 1; j > i; --j) {
        const prevNode = top[j]!;
        const overlap = getOverlapOffset(currentNode.boundingBox, prevNode.boundingBox);
        if (overlap) {
          currentNode.dy += overlap.dy;
          currentNode.boundingBox.y -= overlap.dy;
        }
      }
    }
  }

  adjustBottomPositions(bottom: Callout[]): void {
    for (let i = bottom.length - 2; i >= 0; --i) {
      const currentNode = bottom[i]!;
      for (let j = bottom.length - 1; j > i; --j) {
        const prevNode = bottom[j]!;
        const overlap = getOverlapOffset(prevNode.boundingBox, currentNode.boundingBox);
        if (overlap) {
          currentNode.dy += overlap.dy;
          currentNode.boundingBox.y += overlap.dy;
        }
      }
    }
  }
}
