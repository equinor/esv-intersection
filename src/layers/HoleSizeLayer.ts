import {
  Graphics,
  Texture,
  Point,
  SimpleRope,
  Rectangle,
  BaseTexture,
  Polygon,
  Sprite,
  TilingSprite,
} from 'pixi.js';
import { WebGLLayer } from './WebGLLayer';
import {
  GeoModelData,
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
      { diameter: 30, start: 0, length: 50 },
      { diameter: 20, start: 50, length: 70 },
      { diameter: 30, start: 120, length: 150 },
      { diameter: 55, start: 270, length: 130 },
      { diameter: 25, start: 400, length: 150 },
      { diameter: 15, start: 550, length: 50 },
      { diameter: 10, start: 600, length: 50 },
      { diameter: 8, start: 650, length: 50 },
      { diameter: 6.5, start: 700, length: 50 },
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
    // // IF NOT SINGLE POINT
    // const line = new WellboreMesh(interp, 0.15);
    // const { vertices, triangles, vertexData, extraData } = line.generate(
    //   intervals,
    // );
    // // Create geometry
    // const geometry = new PIXI.Geometry();
    // geometry.addAttribute('verts', vertices, 2);
    // geometry.addAttribute('vertCol', vertexData, 4);
    // geometry.addAttribute('typeData', extraData, 1);
    // geometry.addIndex(triangles);

    // const uniforms: Uniforms = {
    //   wellboreColor: [0.2, 0.2, 0.2],
    //   visible: true,
    //   enabled: true,
    // };

    // // Shader
    // const lineShader: PIXI.Shader = PIXI.Shader.from(
    //   WellboreLayer.vertexShader,
    //   WellboreLayer.fragmentShader,
    //   uniforms,
    // );

    const texture = this.createTexture(30);

    const sizes = data.map((d) => this.generateHoleSizeData(wbp, d));
    // this.drawHoleSizeRope(sizes[0], this.createTexture);
    sizes
      .sort((a: any, b: any) => (a.data.diameter <= b.data.diameter ? 1 : -1))
      .map((s: any) => this.drawHoleSizeRope(s, this.createTexture));

    // sizes.map((s) => this.drawHoleSize(s));
    this.drawHoleSize(sizes[0]);
  }

  createTexture = (height: number): Texture => {
    var canvas = document.createElement('canvas');
    canvas.width = 150;
    height = 100; // full width
    canvas.height = height;
    var canvasCtx = canvas.getContext('2d');
    var gradient = canvasCtx.createLinearGradient(0, 0, 0, 150);
    gradient.addColorStop(0, 'rgb(163, 102, 42)');
    gradient.addColorStop(0.5, 'rgb(255, 255, 255)');
    gradient.addColorStop(1, 'rgb(163, 102, 42)');
    canvasCtx.fillStyle = gradient;
    canvasCtx.fillRect(0, 0, 150, 150);
    return Texture.from(canvas);
  };

  calcDist = (prev: number[], point: number[]) => {
    var a = prev[0] - point[0];
    var b = prev[1] - point[1];

    return Math.sqrt(a * a + b * b);
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

  drawHoleSizeRope = (s: any, texture: any): void => {
    const actualPoints: Point[] = this.actualPoints(s);
    const tex: Texture = texture(s.data.diameter);

    const actualPointss = this.createCurvedRect(
      actualPoints,
      s.data.diameter * 2,
    );
    const area = new Graphics();
    area.lineStyle(1, s.color, 1);
    area.beginFill(0);
    area.transform = this.transform;
    area.drawPolygon(actualPointss);
    area.endFill();
    this.ctx.stage.addChild(area);

    const rope = new SimpleRope(tex, actualPoints);
    rope.transform = this.transform;
    this.ctx.stage.addChild(rope);
    rope.mask = area;

    // rope.anchor.set(0.5);
  };

  drawHoleSize = (s: any): void => {
    const actualPointsPath = this.actualPoints(s).filter(
      (d: any, i: number) => i % 9,
    );
    const a: Point[] = [];
    for (let i = 0; i < actualPointsPath.length; i++) {
      a.push(actualPointsPath[i].clone());
    }

    const actualPoints = this.createCurvedRect(a, s.data.diameter);
    const area = new Graphics();
    area.lineStyle(1, s.color, 1);
    // area.beginFill(0x232390);
    // area.beginTextureFill(texture);
    area.transform = this.transform;
    // const coords: Point[] = this.createCurvedRect(s.data);
    area.drawPolygon(actualPoints);
    // area.endFill();
    this.ctx.stage.addChild(area);
  };

  normal = (p1: Point, p2: Point) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return new Point(-dy, dx);
  };

  createCurvedRect = (pathPoints: Point[], diameter: number): Point[] => {
    const squiggly = (index: number) => {
      const squigglyOffset = [5, 6, 5, 7, 7, 5, 3, 2, 6, 3, 2, 1, 4];
      return squigglyOffset[(index - (index % 3)) % squigglyOffset.length];
    };

    const points: Point[] = [];
    let p: Point = pathPoints[0];
    for (let a = 0; a < pathPoints.length; a += 4) {
      const normal = this.normal(pathPoints[a], pathPoints[a + 1]);
      p = pathPoints[a].clone();
      p.x += normal.x + squiggly(a) - diameter / 2;
      p.y += normal.y;
      points.push(p);
    }

    // points.push(
    //   new Point(
    //     points[points.length - 1].x + diameter / 2,
    //     points[points.length - 1].y,
    //   ),
    // );
    let upPoints: Point[] = [];
    upPoints = points.map(
      (p: Point, i: number): Point => {
        // const normal = this.normal(pathPoints[i], pathPoints[i + 1]);
        const a = p.clone();
        p.x += squiggly(i) + diameter / 2;
        return a;
      },
    );
    points.push(...upPoints.reverse());

    points.push(new Point(points[0].x, points[0].y));

    return points;
  };
}
