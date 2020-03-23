import { CurveInterpolator } from 'curve-interpolator';
import { Graphics, Texture, Point, SimpleRope } from 'pixi.js';
import { PixiLayer } from './PixiLayer';
import { calcDist, calcDistPoint, createNormal, arrayToPoint, pointToArray } from '../utils/vectorUtils';
import {
  HoleSizeLayerOptions,
  OnUpdateEvent,
  OnRescaleEvent,
  MDPoint,
  HoleObjectData,
  NormalCoordsObject,
  HoleSize,
  Casing,
  OnMountEvent,
} from '../interfaces';

export class WellboreBaseComponentLayer extends PixiLayer {
  options: HoleSizeLayerOptions;

  constructor(id: string, options: HoleSizeLayerOptions) {
    super(id, options);
    this.options = {
      ...options,
    };
    this.render = this.render.bind(this);
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
    this.ctx.stage.position.set(event.transform.x, event.transform.y);
    this.ctx.stage.scale.set(event.xRatio, event.yRatio);
  }

  render(event: OnRescaleEvent | OnUpdateEvent): void {
    const { maxTextureDiameterScale, firstColor, secondColor } = this.options;
    const { data, wellborePath } = event;
    if (data == null) {
      return;
    }

    const sizes: HoleObjectData[] = data.map((d: HoleSize | Casing) => this.generateHoleSizeData(wellborePath, d));

    const maxDiameter = Math.max(...sizes.map((s: HoleObjectData) => s.data.diameter));
    const texture = this.createTexure(maxDiameter * maxTextureDiameterScale, firstColor, secondColor);
    sizes
      .sort((a: any, b: any) => (a.data.diameter <= b.data.diameter ? 1 : -1)) // draw smaller casings and holes inside bigger ones if overlapping
      .map((s: any) => this.drawHoleSize(s, texture));
  }

  createNormalCoords = (s: HoleObjectData): NormalCoordsObject => {
    const wellBorePathCoords = this.actualPoints(s);
    const normalOffsetCoordsUpOrig = createNormal(wellBorePathCoords, s.data.diameter);
    const normalOffsetCoordsDownOrig = createNormal(wellBorePathCoords, -s.data.diameter);

    if (normalOffsetCoordsUpOrig.length <= 2) {
      return { wellBorePathCoords, normalOffsetCoordsDown: wellBorePathCoords, normalOffsetCoordsUp: wellBorePathCoords };
    }

    const tension = 0.2;
    const numPoints = 999;
    const normalOffsetCoordsUpInterpolator = new CurveInterpolator(normalOffsetCoordsUpOrig.map(pointToArray), tension);
    const normalOffsetCoordsDownInterpolator = new CurveInterpolator(normalOffsetCoordsDownOrig.map(pointToArray), tension);
    const normalOffsetCoordsUp = normalOffsetCoordsUpInterpolator.getPoints(numPoints).map(arrayToPoint);
    const normalOffsetCoordsDown = normalOffsetCoordsDownInterpolator.getPoints(numPoints).map(arrayToPoint);

    return { wellBorePathCoords, normalOffsetCoordsDown, normalOffsetCoordsUp };
  };

  drawHoleSize = (holeObject: HoleObjectData, defaultTexture: Texture): void => {
    const { maxTextureDiameterScale, firstColor, secondColor, lineColor, topBottomLineColor } = this.options;
    const { wellBorePathCoords, normalOffsetCoordsDown, normalOffsetCoordsUp } = this.createNormalCoords(holeObject);

    const polygonCoords = [...normalOffsetCoordsUp, ...normalOffsetCoordsDown.map((d: Point) => d.clone()).reverse()];
    const casingTopLineCoords = [normalOffsetCoordsUp[0], normalOffsetCoordsDown[0]];
    const casingBottomLineCoords = [normalOffsetCoordsUp[normalOffsetCoordsUp.length - 1], normalOffsetCoordsDown[normalOffsetCoordsDown.length - 1]];
    const mask = this.drawBigPolygon(polygonCoords);
    let texture = defaultTexture;
    let casingWallWidth = 1;

    if (holeObject.hasShoe != null) {
      const pctOffset = 0.35;
      texture = this.createTexure(holeObject.data.diameter * maxTextureDiameterScale, firstColor, secondColor, pctOffset);
      casingWallWidth = Math.abs(holeObject.data.diameter - holeObject.innerDiameter);
    }
    this.createRopeTextureBackground(wellBorePathCoords, texture, mask);
    this.drawLine(polygonCoords, lineColor, casingWallWidth);
    this.drawLine(casingTopLineCoords, topBottomLineColor, 1);
    this.drawLine(casingBottomLineCoords, topBottomLineColor, 1);

    const takeMeters = (points: Point[], meters: number): Point[] => {
      let tot = 0;
      const lastMeterPoint = 2;
      const newPoints: Point[] = [];

      for (let i = 0; tot < meters && i > points.length - lastMeterPoint; i++) {
        tot += calcDistPoint(points[points.length - 1 - i], points[points.length - lastMeterPoint - i]);
        newPoints.push(points[points.length - 1 - i].clone());
      }

      return newPoints.reverse();
    };

    if (holeObject.hasShoe === true) {
      const shoeWidth = 5;
      const meters = 10;
      const shoeHeightCoords = takeMeters(normalOffsetCoordsDown, meters);
      const shoeCoords = this.generateShoe(shoeHeightCoords, -shoeWidth);
      this.drawBigPolygon(shoeCoords);

      const shoeHeightCoords2 = takeMeters(normalOffsetCoordsUp, meters);
      const shoeCoords2 = this.generateShoe(shoeHeightCoords2, shoeWidth);
      this.drawBigPolygon(shoeCoords2);
    }
  };

  generateShoe = (triangleSideShoe: Point[], offset: number): Point[] => {
    if (triangleSideShoe.length < 1) {
      return [];
    }
    const normalOffset = createNormal(
      [triangleSideShoe[0], triangleSideShoe[1], triangleSideShoe[triangleSideShoe.length - 1], triangleSideShoe[triangleSideShoe.length - 1]],
      offset,
    );

    const a = [triangleSideShoe[0], triangleSideShoe[triangleSideShoe.length - 1], normalOffset[normalOffset.length - 1], triangleSideShoe[0]];
    return a;
  };

  drawBigPolygon = (coords: Point[]): Graphics => {
    const polygon = new Graphics();
    polygon.beginFill(0);
    polygon.drawPolygon(coords);
    polygon.endFill();
    this.ctx.stage.addChild(polygon);

    return polygon;
  };

  createRopeTextureBackground = (coods: Point[], texture: Texture, mask: Graphics): SimpleRope => {
    const rope: SimpleRope = new SimpleRope(texture, coods);
    rope.mask = mask;
    this.ctx.stage.addChild(rope);

    return rope;
  };

  drawLine = (coords: Point[], lineColor: number, lineWidth = 1): void => {
    const DRAW_ALIGNMENT_INSIDE = 1;
    const startPoint = coords[0];
    const line = new Graphics();
    line.lineStyle(lineWidth, lineColor, undefined, DRAW_ALIGNMENT_INSIDE).moveTo(startPoint.x, startPoint.y);
    coords.map((p: Point) => line.lineTo(p.x, p.y));

    this.ctx.stage.addChild(line);
  };

  createTexure = (maxWidth: number, firstColor: string, secondColor: string, startPctOffset = 0): Texture => {
    const halfWayPct = 0.5;
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = maxWidth > 0 ? maxWidth : canvas.width; // TODO needs to grow with scale
    const canvasCtx = canvas.getContext('2d');

    const gradient = canvasCtx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, firstColor);
    gradient.addColorStop(halfWayPct - startPctOffset, secondColor);
    gradient.addColorStop(halfWayPct + startPctOffset, secondColor);
    gradient.addColorStop(1, firstColor);

    canvasCtx.fillStyle = gradient;
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    return Texture.from(canvas);
  };

  generateHoleSizeData = (wbp: number[][], data: HoleSize | Casing): HoleObjectData => {
    let points: any = wbp;
    let md = 0;
    let prev = points[0];

    // Add distance to points
    points = points.map((p: number[]) => {
      md += calcDist(prev, p);
      prev = p;
      return {
        point: new Point(p[0], p[1]),
        md,
      };
    });

    return { data: { ...data, diameter: data.diameter }, points, hasShoe: data.hasShoe, innerDiameter: data.innerDiameter };
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
      if (s.data.start + s.data.length >= p.md) {
        stopIndex = index;
      }
      return p.md > s.data.start && p.md < s.data.start + s.data.length;
    });
    startIndex -= 0;
    stopIndex += 0;
    start = s.points[startIndex >= 0 ? startIndex : 0].point;
    stop = s.points[stopIndex <= s.points.length ? stopIndex : s.points.length - 1].point;
    return [start, ...a.map((b: MDPoint) => b.point), stop];
  };
}
