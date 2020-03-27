import { clamp, round } from '@equinor/videx-math';
import { ScaleLinear } from 'd3-scale';

import { Annotation } from '../interfaces';

export const pixelsPerUnit = (x: any) => {
  const [min] = x.domain();
  return Math.abs(x(min + 1));
};

export const calcTextSize = (factor: any, min: any, max: any, x: any) => {
  return clamp(pixelsPerUnit(x) * factor, min, max);
};

const getBoundingBox = (
  ctx: any,
  anno: Annotation,
  xScale: ScaleLinear<number, number>,
  yScale: ScaleLinear<number, number>,
  height: number,
  scale: number,
) => {
  const ax1 = xScale(anno.data[0]);
  const ay1 = yScale(anno.data[1]);

  const titleWidth = ctx.measureText(anno.title).width;
  const label = scale === 0 ? `${round(anno.md)} ${anno.mdUnit} MD ${anno.depthReferencePoint}` : `${round(anno.tvd)} ${anno.mdUnit} TVD MSL`;
  const labelWidth = ctx.measureText(label).width;
  const width = Math.max(labelWidth, titleWidth);

  const annotation = {
    x: ax1,
    y: ay1,
    width,
    height: height * 2 + 4,
  };
  return annotation;
};

const isOverlapping = (r1: any, r2: any) => {
  const r1x2 = r1.x + r1.width;
  const r2x2 = r2.x + r2.width;
  const r1y2 = r1.y + r1.height;
  const r2y2 = r2.y + r2.height;

  if (r2.x > r1x2 || r2.y > r1y2 || r2x2 < r1.x || r2y2 < r1.y) {
    return null;
  }

  const dx = Math.max(0, Math.min(r1.x + r1.width, r2.x + r2.width) - Math.max(r1.x, r2.x));
  const dy = Math.max(0, Math.min(r1.y + r1.height, r2.y + r2.height) - Math.max(r1.y, r2.y));

  const newPoints = {
    dx,
    dy,
  };
  return newPoints;
};

const testTop = (p: any, n: any, isLeftToRight: boolean = false) => {
  return isLeftToRight ? n.x + n.width > p.x : p.x + p.width > n.x;
};

const testBottom = (p: any, n: any, isLeftToRight: boolean = false) => {
  return isLeftToRight ? n.x < p.x + p.width : p.x < n.x + n.width;
};

// calculates position of a list of annotations
export const positionCallout = (
  annotations: Annotation[],
  isLeftToRight: boolean,
  xScale: ScaleLinear<number, number>,
  yScale: ScaleLinear<number, number>,
  scale: number,
  isPanning: boolean = false,
  overlapped: any,
  ctx: any,
) => {
  if (isPanning) {
    return overlapped;
  }
  const offsetX = -20;
  const offsetY = -20;

  if (annotations.length < 2) {
    return;
  }
  let nodes = annotations.map((a) => {
    return {
      ...a,
      ...getBoundingBox(ctx, a, xScale, yScale, calcTextSize(12, 7, 12, xScale), scale),
      dx: offsetX,
      dy: offsetY,
    };
  });

  const top = [nodes[nodes.length - 1]];
  const bottom: any[] = [];
  // initial best effort
  initialPosition(nodes, bottom, top, offsetX, offsetY);

  // adjust top
  if (top.length > 1) {
    positionTop(top);
  }
  // adjust bottom
  if (bottom.length > 1) {
    positionBottom(bottom);
  }
  return nodes;
};

const initialPosition = (nodes: any[], bottom: any[], top: any[], offsetX: number, offsetY: number) => {
  for (let i = nodes.length - 2; i >= 0; i -= 1) {
    const prevNode = nodes[i + 1];
    const node = nodes[i];
    const overlap = isOverlapping(node, prevNode);

    if (overlap) {
      // flip to bottom
      node.dy = -offsetY;
      node.dx = offsetX;
      node.x += -2 * offsetX;
      node.y += -2 * offsetY;
      bottom.push(node);
      i -= 1; // skip next
      if (i >= 0) {
        top.push(nodes[i]);
      }
    } else {
      top.push(node);
    }
  }
};

const positionBottom = (bottom: any[]) => {
  for (let i = bottom.length - 2; i >= 0; i -= 1) {
    const node = bottom[i];
    for (let j = bottom.length - 1; j > i; j -= 1) {
      const prevNode = bottom[j];
      if (testBottom(prevNode, node)) {
        const overlap = isOverlapping(prevNode, node);
        if (overlap) {
          node.dy += overlap.dy;
          node.y += overlap.dy;
        }
      }
    }
  }
};

const positionTop = (top: any[]) => {
  for (let i = 1; i < top.length; i += 1) {
    const node = top[i];
    for (let j = 0; j < i; j += 1) {
      const prevNode = top[j];
      if (testTop(prevNode, node)) {
        const overlap = isOverlapping(node, prevNode);
        if (overlap) {
          node.dy -= overlap.dy;
          node.y -= overlap.dy;
        }
      }
    }
  }
};
