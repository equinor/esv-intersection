import { CurveInterpolator } from 'curve-interpolator';
import { Graphics, Texture, Point, SimpleRope } from 'pixi.js';
import { WebGLLayer } from './WebGLLayer';
import {
  GeomodelLayerOptions,
  OnUpdateEvent,
  OnRescaleEvent,
  MDPoint,
  HoleObjectData,
  NormalCoordsObject,
  HoleSize,
} from '../interfaces';

export class HoleSizeLayer extends WebGLLayer {
  options: GeomodelLayerOptions;

  constructor(id: string, options: GeomodelLayerOptions) {
    super(id, options);
    this.options = {
      ...options,
    };
    this.render = this.render.bind(this);
  }

  onUpdate(event: OnUpdateEvent): void {
    super.onUpdate(event);
    this.render(event);
  }

  onRescale(event: OnRescaleEvent): void {
    super.onRescale(event);
    this.render(event);
  }

  render(event: OnRescaleEvent | OnUpdateEvent): void {
    const { data, wellborePath } = event;
    const sizes: HoleObjectData[] = data.map((d: HoleSize) =>
      this.generateHoleSizeData(wellborePath, d),
    );
    const maxDiameter = Math.max(
      ...sizes.map((s: HoleObjectData) => s.data.diameter),
    );
    const texture = this.createTexure(maxDiameter * 1.5);
    sizes
      // .sort((a: any, b: any) => (a.data.diameter <= b.data.diameter ? 1 : -1))
      .map((s: any) => this.drawHoleSize(s, texture));
  }

  createNormalCoords = (s: HoleObjectData): NormalCoordsObject => {
    const wellBorePathCoords = this.actualPoints(s);
    const normalOffsetCoordsUpOrig = this.createNormal(
      wellBorePathCoords,
      s.data.diameter,
    );
    const normalOffsetCoordsDownOrig = this.createNormal(
      wellBorePathCoords,
      -s.data.diameter,
    );

    const tension = 0.2;
    const numPoints = 999;
    const normalOffsetCoordsUpInterpolator = new CurveInterpolator(
      normalOffsetCoordsUpOrig.map(this.pointToArray),
      tension,
    );
    const normalOffsetCoordsDownInterpolator = new CurveInterpolator(
      normalOffsetCoordsDownOrig.map(this.pointToArray),
      tension,
    );
    const normalOffsetCoordsUp = normalOffsetCoordsUpInterpolator
      .getPoints(numPoints)
      .map(this.arrayToPoint);
    const normalOffsetCoordsDown = normalOffsetCoordsDownInterpolator
      .getPoints(numPoints)
      .map(this.arrayToPoint);

    return { wellBorePathCoords, normalOffsetCoordsDown, normalOffsetCoordsUp };
  };

  drawHoleSize = (holeObject: HoleObjectData, texture: Texture): void => {
    const {
      wellBorePathCoords,
      normalOffsetCoordsDown,
      normalOffsetCoordsUp,
    } = this.createNormalCoords(holeObject);
    // this.drawLine(wellBorePathCoords);
    // this.drawLine(normalOffsetCoordsUp;
    // this.drawLine(normalOffsetCoordsDown);

    const polygonCoords = [
      ...normalOffsetCoordsUp,
      ...normalOffsetCoordsDown.reverse(),
    ];
    const mask = this.drawBigPolygon(polygonCoords);
    this.createRopeTextureBackground(wellBorePathCoords, texture, mask);
    this.drawLine(polygonCoords);
  };

  drawBigPolygon = (coords: Point[]): Graphics => {
    const polygon = new Graphics();
    polygon.beginFill(0);
    polygon.drawPolygon(coords);
    polygon.endFill();
    this.ctx.stage.addChild(polygon);

    return polygon;
  };

  createRopeTextureBackground = (
    coods: Point[],
    texture: Texture,
    mask: Graphics,
  ): SimpleRope => {
    const rope: SimpleRope = new SimpleRope(texture, coods);
    rope.mask = mask;
    this.ctx.stage.addChild(rope);

    return rope;
  };

  createNormal = (coords: Point[], offset: number): Point[] => {
    const newPoints: Point[] = [];
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

  drawLine = (coords: Point[]): void => {
    const startPoint = coords[0];
    const line = new Graphics();
    line
      .lineStyle(1, 0x8b4513) // 0x7b7575
      .moveTo(startPoint.x, startPoint.y);
    coords.map((p) => line.lineTo(p.x, p.y));

    this.ctx.stage.addChild(line);
  };

  createTexure = (maxWidth = 150): Texture => {
    const firstColor = 'rgb(163, 102, 42)';
    const secondColor = 'rgb(255, 255, 255)';
    const canvas = document.createElement('canvas');

    canvas.width = 150;
    canvas.height = maxWidth;
    const canvasCtx = canvas.getContext('2d');

    const gradient = canvasCtx.createLinearGradient(0, 0, 0, maxWidth);
    gradient.addColorStop(0, firstColor);
    gradient.addColorStop(0.5, secondColor);
    gradient.addColorStop(1, firstColor);

    canvasCtx.fillStyle = gradient;
    canvasCtx.fillRect(0, 0, 150, maxWidth);

    return Texture.from(canvas);
  };

  generateHoleSizeData = (wbp: number[][], data: HoleSize): HoleObjectData => {
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

    return { data, points };
  };

  actualPoints = (s: HoleObjectData): Point[] => {
    let start = new Point();
    let stop = new Point();
    let startIndex = 0;
    let stopIndex = 0;
    const a = s.points.filter((p: MDPoint, index: number) => {
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
  calcDistPoint = (prev: Point, point: Point): number => {
    return this.calcDist([prev.x, prev.y], [point.x, point.y]);
  };

  calcDist = (prev: number[], point: number[]): number => {
    const a = prev[0] - point[0];
    const b = prev[1] - point[1];

    return Math.sqrt(a * a + b * b);
  };

  normal = (p1: Point, p2: Point): Point => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return new Point(-dy, dx);
  };

  pointToArray = (p: any) => [p.x, p.y];

  arrayToPoint = (p: any) => new Point(p[0], p[1]);
}
