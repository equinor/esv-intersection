import {
  Graphics,
  Texture,
  Point,
  SimpleRope,
  Rectangle,
  Geometry,
} from 'pixi.js';
import { WebGLLayer } from './WebGLLayer';
import {
  GeomodelLayerOptions,
  OnUpdateEvent,
  OnRescaleEvent,
} from '../interfaces';

import { CurveInterpolator } from 'curve-interpolator';

interface HoleSize {
  diameter: number;
  length: number;
  start: number;
}

export class HoleSizeLayer extends WebGLLayer {
  options: GeomodelLayerOptions;

  constructor(id: string, options: GeomodelLayerOptions) {
    super(id, options);
    this.options = {
      ...options,
    };
    this.render = this.render.bind(this);
  }

  onUpdate(event: OnUpdateEvent) {
    super.onUpdate(event);
    this.render(event);
  }

  onRescale(event: OnRescaleEvent) {
    super.onRescale(event);
    this.render(event);
  }

  render(event: OnRescaleEvent | OnUpdateEvent) {
    // const { data } = event;
    const data: HoleSize[] = [
      { diameter: 30 + 0, start: 0, length: 50 },
      { diameter: 20 + 0, start: 50, length: 70 },
      { diameter: 30 + 0, start: 120, length: 150 },
      { diameter: 55 + 0, start: 270, length: 130 },
      { diameter: 25 + 0, start: 400, length: 150 },
      { diameter: 15 + 0, start: 550, length: 50 },
      { diameter: 10 + 0, start: 600, length: 50 },
      { diameter: 8 + 0, start: 650, length: 50 },
      { diameter: 6.5 + 0, start: 700, length: 50 },
    ];

    const wbp = [
      [50, 50],
      [50, 100],
      [100, 150],
      [150, 190],
      [200, 160],
      [250, 150],
      [300, 350],
      [150, 450],
      [120, 450],
    ];

    const sizes = data.map((d) => this.generateHoleSizeData(wbp, d));
    sizes
      // .sort((a: any, b: any) => (a.data.diameter <= b.data.diameter ? 1 : -1))
      .map((s: any) => this.drawHoleSize(s));
  }

  drawHoleSize = (s: any) => {
    const oneWayTextureGradient = this.createTexture(10, false);
    const otherWayTextureGradient = this.createTexture(10, true);

    const lineCoords = this.actualPoints(s);
    const normalVertexes = this.createNormal(lineCoords, s.data.diameter);
    const normalVertexes2 = this.createNormal(lineCoords, -s.data.diameter);
    this.drawLine(lineCoords);
    this.drawLine(normalVertexes);
    this.drawLine(normalVertexes2);

    this.drawPolygon(lineCoords, normalVertexes, oneWayTextureGradient);
    this.drawPolygon(lineCoords, normalVertexes2, otherWayTextureGradient);
  };

  drawPolygon = (coordsMiddle: any, coordsOffset: any, texture: any) => {
    for (
      let i = 0;
      i < Math.min(coordsMiddle.length, coordsOffset.length) - 2;
      i++
    ) {
      const pts = [
        coordsMiddle[i],
        coordsOffset[i],
        coordsOffset[i + 1],
        coordsMiddle[i + 1],
        coordsMiddle[i],
      ];

      const graphic = new Graphics();

      graphic.beginTextureFill({ texture });

      graphic.drawPolygon(pts);

      graphic.endFill();

      this.ctx.stage.addChild(graphic);
    }
  };

  createNormal = (coords: Point[], offset: number) => {
    const newPoints: any = [];
    const lastPointIndex = 2;
    for (let i = 1; i < coords.length - lastPointIndex; i++) {
      const normal = this.normal(coords[i], coords[i + 1]);
      const newPoint = coords[i].clone();
      newPoint.x += normal.x * offset;
      newPoint.y += normal.y * offset;
      newPoints.push(newPoint);
    }
    // Last point
    const normal = this.normal(
      coords[coords.length - lastPointIndex - 1],
      coords[coords.length - lastPointIndex],
    );

    const newPoint = coords[coords.length - lastPointIndex].clone();
    newPoint.x += normal.x * offset;
    newPoint.y += normal.y * offset;
    newPoints.push(newPoint);

    return newPoints;
  };

  drawLine = (coords: Point[]) => {
    for (let i = 0; i < coords.length - 1; i++) {
      const startPoint = coords[i];
      const endPoint = coords[i + 1];

      const line = new Graphics();
      line
        .lineStyle(1, 0x0000ff)
        .moveTo(startPoint.x, startPoint.y)
        .lineTo(endPoint.x, endPoint.y);

      this.ctx.stage.addChild(line);
    }
  };

  createTexture = (height: number, reverse: boolean): Texture => {
    var canvas = document.createElement('canvas');
    canvas.width = 150;
    height = 150; // full width
    canvas.height = height;
    var canvasCtx = canvas.getContext('2d');
    var gradient = canvasCtx.createLinearGradient(0, 0, 0, 150);
    if (reverse) {
      gradient.addColorStop(0, 'rgb(255, 255, 255)');
      gradient.addColorStop(1, 'rgb(163, 102, 42)');
    } else {
      gradient.addColorStop(0, 'rgb(163, 102, 42)');
      gradient.addColorStop(1, 'rgb(255, 255, 255)');
    }
    canvasCtx.fillStyle = gradient;
    canvasCtx.fillRect(0, 0, 150, 150);
    return Texture.from(canvas);
  };

  generateHoleSizeData = (wbp: any, data: any) => {
    const tension = 0.2;
    const interp = new CurveInterpolator(wbp, tension);
    let points = interp.getPoints(999);

    let md = 0;
    let prev = points[0];

    // Add distance to points
    points = points.map((p: number[]) => {
      md += this.calcDist(prev, p);
      prev = p;
      return {
        point: new Point(p[0], p[1]),
        md,
      };
    });

    return { color: 'black', data, points };
  };

  actualPoints = (s: any) => {
    let start = new Point();
    let stop = new Point();
    let startIndex = 0;
    let stopIndex = 0;
    const a = s.points.filter((p: any, index: number) => {
      if (s.data.start > p.md) {
        startIndex = index;
      }
      if (s.data.start + s.data.length > p.md) {
        stopIndex = index;
      }
      return p.md > s.data.start && p.md < s.data.start + s.data.length;
    });
    startIndex -= 1;
    stopIndex += 0;
    start = s.points[startIndex >= 0 ? startIndex : 0].point;
    stop =
      s.points[stopIndex <= s.points.length ? stopIndex : s.points.length - 1]
        .point;
    return [start, ...a.map((b: any) => b.point), stop];
  };

  // utils
  calcDistPoint = (prev: Point, point: Point) => {
    return this.calcDist([prev.x, prev.y], [point.x, point.y]);
  };

  calcDist = (prev: number[], point: number[]) => {
    var a = prev[0] - point[0];
    var b = prev[1] - point[1];

    return Math.sqrt(a * a + b * b);
  };
  normal = (p1: Point, p2: Point) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return new Point(-dy, dx);
  };
}
