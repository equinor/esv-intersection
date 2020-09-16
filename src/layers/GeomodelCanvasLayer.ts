import { SurfaceArea, SurfaceData, SurfaceLine } from '../datautils';
import { GeomodelLayerOptions, OnUpdateEvent, OnRescaleEvent, OnMountEvent } from '../interfaces';
import { CanvasLayer } from './base/CanvasLayer';

const DEFAULT_MAX_DEPTH = 10000;

export class GeomodelCanvasLayer extends CanvasLayer {
  rescaleEvent: OnRescaleEvent;

  // TODO add types for surfaceAreasPaths and surfaceLinesPaths
  surfaceAreasPaths: any[] = [];

  surfaceLinesPaths: any[] = [];

  maxDepth: number = DEFAULT_MAX_DEPTH;

  constructor(id?: string, options?: GeomodelLayerOptions) {
    super(id, options);
    this.render = this.render.bind(this);
    this.generateSurfaceAreasPaths = this.generateSurfaceAreasPaths.bind(this);
    this.generateSurfaceLinesPaths = this.generateSurfaceLinesPaths.bind(this);
    this.drawPolygonPath = this.drawPolygonPath.bind(this);
    this.drawLinePath = this.drawLinePath.bind(this);
  }

  get data(): SurfaceData {
    return super.getData();
  }

  set data(data: SurfaceData) {
    this.setData(data);
  }

  getData(): SurfaceData {
    return super.getData();
  }

  setData(data: SurfaceData): void {
    super.setData(data);
  }

  onMount(event: OnMountEvent): void {
    super.onMount(event);
  }

  onUpdate(event: OnUpdateEvent): void {
    super.onUpdate(event);
    if (!this.data) {
      this.surfaceAreasPaths = [];
      this.surfaceLinesPaths = [];
    } else {
      this.generateSurfaceAreasPaths();
      this.generateSurfaceLinesPaths();
    }
    this.render();
  }

  onRescale(event: OnRescaleEvent): void {
    this.rescaleEvent = event;
    this.setTransform(this.rescaleEvent);
    this.render();
  }

  render(): void {
    if (!this.ctx || !this.rescaleEvent) {
      return;
    }

    this.clearCanvas();
    this.surfaceAreasPaths.forEach((p: any) => this.drawPolygonPath(p.color, p.path));
    this.surfaceLinesPaths.forEach((l: any) => this.drawLinePath(l.color, l.path));
  }

  colorToCSSColor(color: number | string): string {
    if (typeof color === 'string') {
      return color;
    }

    let hexString = color.toString(16);
    hexString = '000000'.substr(0, 6 - hexString.length) + hexString;
    return `#${hexString}`;
  }

  generateSurfaceAreasPaths(): void {
    this.surfaceAreasPaths = this.data.areas.reduce((acc: any, s: SurfaceArea) => {
      const polygons = this.createPolygons(s.data);
      const mapped = polygons.map((polygon: any) => ({
        color: this.colorToCSSColor(s.color),
        path: this.generatePolygonPath(polygon),
      }));
      return [...acc, ...mapped];
    }, []);
  }

  generateSurfaceLinesPaths(): void {
    this.surfaceLinesPaths = this.data.lines.reduce((acc: any, l: SurfaceLine) => {
      const lines = this.generateLinePaths(l);
      const mapped = lines.map((path: Path2D) => ({ color: this.colorToCSSColor(l.color), path }));
      return [...acc, ...mapped];
    }, []);
  }

  drawPolygonPath = (color: string, path: Path2D): void => {
    const { ctx } = this;
    ctx.fillStyle = color;
    ctx.fill(path);
  };

  drawLinePath = (color: string, path: Path2D): void => {
    const { ctx } = this;
    ctx.strokeStyle = color;
    ctx.stroke(path);
  };

  createPolygons = (data: any): number[][] => {
    const polygons: number[][] = [];
    let polygon: number[] = null;

    // Start generating polygons
    for (let i = 0; i < data.length; i++) {
      // Generate top of polygon as long as we have valid values
      const topIsValid = !!data[i][1];
      if (topIsValid) {
        if (polygon === null) {
          polygon = [];
        }
        polygon.push(data[i][0], data[i][1]);
      }

      const endIsReached = i === data.length - 1;
      if (!topIsValid || endIsReached) {
        if (polygon) {
          // Generate bottom of polygon
          for (let j: number = !topIsValid ? i - 1 : i; j >= 0; j--) {
            if (!data[j][1]) {
              break;
            }
            polygon.push(data[j][0], data[j][2] || this.maxDepth);
          }
          polygons.push(polygon);
          polygon = null;
        }
      }
    }

    return polygons;
  };

  generatePolygonPath = (polygon: number[]): Path2D => {
    const path = new Path2D();

    path.moveTo(polygon[0], polygon[1]);
    for (let i = 2; i < polygon.length; i += 2) {
      path.lineTo(polygon[i], polygon[i + 1]);
    }
    path.closePath();

    return path;
  };

  generateLinePaths = (s: any): Path2D[] => {
    const paths: Path2D[] = [];
    const { data: d } = s;

    let penDown = false;
    let path = null;
    for (let i = 0; i < d.length; i++) {
      if (d[i][1]) {
        if (penDown) {
          path.lineTo(d[i][0], d[i][1]);
        } else {
          path = new Path2D();
          path.moveTo(d[i][0], d[i][1]);
          penDown = true;
        }
      } else if (penDown) {
        paths.push(path);
        penDown = false;
      }
    }
    if (penDown) {
      paths.push(path);
    }

    return paths;
  };
}
