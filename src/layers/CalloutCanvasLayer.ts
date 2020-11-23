/* eslint-disable no-magic-numbers */
import { ScaleLinear } from 'd3-scale';

import { CanvasLayer } from './base/CanvasLayer';
import { OnUpdateEvent, Annotation, OnRescaleEvent, BoundingBox, CalloutOptions } from '../interfaces';
import { calcSize, isOverlapping, getOverlapOffset } from '../utils';

const DEFAULT_MIN_FONT_SIZE = 7;
const DEFAULT_MAX_FONT_SIZE = 11;
const DEFAULT_FONT_SIZE_FACTOR = 7;

const DEFAULT_OFFSET_MIN = 20;
const DEFAULT_OFFSET_MAX = 120;
const DEFAULT_OFFSET_FACTOR = 19;

const Location = {
  topleft: 'topleft',
  topright: 'topright',
  bottomleft: 'bottomleft',
  bottomright: 'bottomright',
};

type Point = {
  x: number;
  y: number;
};

type Callout = {
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

export class CalloutCanvasLayer extends CanvasLayer {
  rescaleEvent: OnRescaleEvent;
  xRatio: number;
  callouts: Callout[];
  groupFilter: string[] = null;
  minFontSize: number;
  maxFontSize: number;
  fontSizeFactor: number;
  offsetMin: number;
  offsetMax: number;
  offsetFactor: number;

  constructor(id?: string, options?: CalloutOptions) {
    super(id, options);
    this.minFontSize = options.minFontSize || DEFAULT_MIN_FONT_SIZE;
    this.maxFontSize = options.maxFontSize || DEFAULT_MAX_FONT_SIZE;
    this.fontSizeFactor = options.fontSizeFactor || DEFAULT_FONT_SIZE_FACTOR;
    this.offsetMin = options.offsetMin || DEFAULT_OFFSET_MIN;
    this.offsetMax = options.offsetMax || DEFAULT_OFFSET_MAX;
    this.offsetFactor = options.offsetFactor || DEFAULT_OFFSET_FACTOR;
  }

  setGroupFilter(filter: string[]): void {
    this.groupFilter = filter;
    this.callouts = undefined;
    this.render();
  }

  onUpdate(event: OnUpdateEvent): void {
    super.onUpdate(event);

    this.callouts = undefined;

    this.render();
  }

  onRescale(event: OnRescaleEvent): void {
    super.onRescale(event);
    const isPanning = this.rescaleEvent && this.rescaleEvent.xRatio === event.xRatio;
    this.rescaleEvent = event;

    this.render(isPanning);
  }

  render(isPanning = false): void {
    this.clearCanvas();

    if (!this.data || !this.rescaleEvent) {
      return;
    }

    const { xScale, yScale, xBounds } = this.rescaleEvent;
    const { data, ctx, groupFilter } = this;
    const { calculateDisplacementFromBottom } = this.options.referenceSystem.options;
    const isLeftToRight = calculateDisplacementFromBottom ? xBounds[0] < xBounds[1] : xBounds[0] > xBounds[1];
    const scale = 0;

    const fontSize = calcSize(this.fontSizeFactor, this.minFontSize, this.maxFontSize, xScale);

    if (!isPanning || !this.callouts) {
      ctx.font = `bold ${fontSize}px arial`;
      const filtered = data.filter((d: Annotation) => !groupFilter || groupFilter.includes(d.group));
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
  }

  private renderAnnotation = (title: string, label: string, x: number, y: number, fontSize: number, color: string): void => {
    this.renderText(title, x, y - fontSize, fontSize, color, 'arial', 'bold');
    this.renderText(label, x, y, fontSize, color);
  };

  private renderText(
    title: string,
    x: number,
    y: number,
    fontSize: number,
    color: string,
    font: string = 'arial',
    fontStyle: string = 'normal',
  ): void {
    const { ctx } = this;
    ctx.font = `${fontStyle} ${fontSize}px ${font}`;
    ctx.fillStyle = color;
    ctx.fillText(title, x, y);
  }

  private renderPoint(x: number, y: number, radius: number = 3): void {
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  private renderCallout(title: string, label: string, boundingBox: BoundingBox, color: string, location: string): void {
    const pos = this.getPosition(boundingBox, location);
    const { x, y } = pos;
    const { height, width, x: dotX, y: dotY } = boundingBox;

    const placeLeft = location === Location.topright || location === Location.bottomright;
    this.renderAnnotation(title, label, x, y, height, color);
    this.renderPoint(dotX, dotY);
    this.renderLine(x, y, width, dotX, dotY, color, placeLeft);
  }

  private renderLine = (x: number, y: number, width: number, dotX: number, dotY: number, color: string, placeLeft: boolean = true): void => {
    const { ctx } = this;
    const textX = placeLeft ? x : x + width;
    const inverseTextX = placeLeft ? x + width : x;
    const textY = y + 2;

    ctx.strokeStyle = color;
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(dotX, dotY);
    ctx.lineTo(textX, textY);
    ctx.lineTo(inverseTextX, textY);

    ctx.stroke();
  };

  private getPosition(boundingBox: BoundingBox, location: string): Point {
    const { x, y, offsetX, offsetY, width } = boundingBox;
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
    scale: number,
    fontSize: number,
    offset: number = 20,
  ): Callout[] {
    if (annotations.length === 0) {
      return [];
    }
    const alignment = isLeftToRight ? Location.topleft : Location.topright;

    const nodes = annotations.map((a) => {
      const pos = a.pos ? a.pos : this.referenceSystem.project(a.md);
      return {
        title: a.title,
        label: a.label,
        color: a.color,
        pos: { x: pos[0], y: pos[1] },
        group: a.group,
        alignment,
        boundingBox: this.getAnnotationBoundingBox(a.title, a.label, pos, xScale, yScale, fontSize),
        dx: offset,
        dy: offset,
      };
    });

    const top = [nodes[nodes.length - 1]];
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
    const ax1 = xScale(pos[0]);
    const ay1 = yScale(pos[1]);

    const labelWidth = ctx.measureText(label).width;
    const titleWidth = ctx.measureText(title).width;
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
      const node = nodes[i];
      const prevNode = top[0];

      const overlap = isOverlapping(node.boundingBox, prevNode.boundingBox);
      if (overlap) {
        node.alignment = node.alignment === Location.topleft ? Location.bottomright : Location.bottomleft;
        bottom.push(node);
        if (i > 0) {
          top.unshift(nodes[--i]);
        }
      } else {
        top.unshift(node);
      }
    }
  }

  adjustTopPositions(top: Callout[]): void {
    for (let i = top.length - 2; i >= 0; --i) {
      const currentNode = top[i];
      for (let j = top.length - 1; j > i; --j) {
        const prevNode = top[j];
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
      const currentNode = bottom[i];
      for (let j = bottom.length - 1; j > i; --j) {
        const prevNode = bottom[j];
        const overlap = getOverlapOffset(prevNode.boundingBox, currentNode.boundingBox);
        if (overlap) {
          currentNode.dy += overlap.dy;
          currentNode.boundingBox.y += overlap.dy;
        }
      }
    }
  }
}
