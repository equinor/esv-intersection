import { Graphics, Texture, Point } from 'pixi.js-legacy';
import { WebGLLayer } from './WebGLLayer';
import {
  GeoModelData,
  GeomodelLayerOptions,
  OnUpdateEvent,
  OnRescaleEvent,
  WellborepathLayerOptions,
} from '../interfaces';

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
      { diameter: 10, start: 0, length: 50 },
      { diameter: 15, start: 70, length: 150 },
    ];
    const wbp = [50, 50, 100, 800];
    console.log('df');
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

    const texture = this.createTexture();
    console.log('sdfsdf', texture);

    const sizes = data.map((d) => this.generateHoleSizeData(wbp, d));
    console.log(sizes);
    sizes.map((s) => this.drawHoleSize(s, texture));
  }

  createTexture = (): Texture => {
    var canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 100;
    var ctx = canvas.getContext('2d');
    var gradient = ctx.createLinearGradient(0, 0, 0, 500);
    gradient.addColorStop(0, '#D3872A');
    gradient.addColorStop(1, '#CFB732');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 200, 600);
    return Texture.from(canvas);
  };

  generateHoleSizeData = (s: any, data: any) => {
    return { color: 'black', data };
  };

  drawHoleSize = (s: any, texture: any): void => {
    const area = new Graphics();
    area.lineStyle(1, s.color, 1);
    //area.beginFill(texture);
    area.transform = this.transform;
    const coords: Point[] = this.createCurvedRect(s.data);
    console.log(coords);
    area.drawPolygon(coords);
    area.endFill();
    this.ctx.stage.addChild(area);
  };
  createCurvedRect = (s: any): Point[] => {
    const squiggly = (index: number) => {
      const squigglyOffset = [5, 6, 5, 7, 7, 5, 3, 2, 6, 3, 2, 1, 4];
      return squigglyOffset[(index - (index % 3)) % squigglyOffset.length];
    };
    console.log(s);
    const { length, start, diameter: diameterInInches } = s;
    const diameter = diameterInInches * 10;
    const points: Point[] = [];
    let p: Point = new Point(100, start);

    for (let a = 0; a < length; a += 4) {
      p = p.clone();
      p.x = 100 + squiggly(a) - diameter / 2;
      p.y = a + start;
      a == 0 ? console.log('tl', p) : '';
      points.push(p);
    }
    console.log('bl', points[points.length - 1]);

    // points.push(
    //   new Point(
    //     points[points.length - 1].x + diameter / 2,
    //     points[points.length - 1].y,
    //   ),
    // );
    // console.log('br', points[points.length - 1]);
    let upPoints: Point[] = [];
    upPoints = points.map(
      (p): Point => {
        const a = p.clone();
        a.x += diameter / 2;
        return a;
      },
    );
    points.push(...upPoints.reverse());
    console.log('tr', points[points.length - 1]);

    points.push(new Point(points[0].x, points[0].y));
    console.log('tl', points[points.length - 1]);

    return points;
  };
}
