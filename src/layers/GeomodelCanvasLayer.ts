import { SurfaceArea, SurfaceData, SurfaceLine } from '../datautils';
import { OnUpdateEvent, OnRescaleEvent } from '../interfaces';
import { colorToCSSColor } from '../utils/color';
import { LayerOptions } from './base';
import { CanvasLayer } from './base/CanvasLayer';

const DEFAULT_MAX_DEPTH = 10000;

type SurfacePaths = {
  color: string;
  path: Path2D;
};

export class GeomodelCanvasLayer<T extends SurfaceData> extends CanvasLayer<T> {
  rescaleEvent: OnRescaleEvent;

  surfaceAreasPaths: SurfacePaths[] = [];

  surfaceLinesPaths: SurfacePaths[] = [];

  maxDepth: number = DEFAULT_MAX_DEPTH;

  constructor(id?: string, options?: LayerOptions<T>) {
    super(id, options);
    this.render = this.render.bind(this);
    this.generateSurfaceAreasPaths = this.generateSurfaceAreasPaths.bind(this);
    this.generateSurfaceLinesPaths = this.generateSurfaceLinesPaths.bind(this);
    this.drawPolygonPath = this.drawPolygonPath.bind(this);
    this.drawLinePath = this.drawLinePath.bind(this);
    this.updatePaths = this.updatePaths.bind(this);
  }

  onUpdate(event: OnUpdateEvent<T>): void {
    super.onUpdate(event);
    this.updatePaths();
    this.render();
  }

  onRescale(event: OnRescaleEvent): void {
    this.rescaleEvent = event;
    this.setTransform(this.rescaleEvent);
    this.render();
  }

  updatePaths(): void {
    if (!this.data) {
      this.surfaceAreasPaths = [];
      this.surfaceLinesPaths = [];
    } else {
      this.generateSurfaceAreasPaths();
      this.generateSurfaceLinesPaths();
    }
  }

  render(): void {
    if (!this.ctx || !this.rescaleEvent) {
      return;
    }

    requestAnimationFrame(() => {
      this.clearCanvas();
      this.surfaceAreasPaths.forEach((p: SurfacePaths) => this.drawPolygonPath(p.color, p.path));
      this.surfaceLinesPaths.forEach((l: SurfacePaths) => this.drawLinePath(l.color, l.path));
    });
  }

  colorToCSSColor(color: number | string): string {
    return colorToCSSColor(color);
  }

  generateSurfaceAreasPaths(): void {
    this.surfaceAreasPaths = this.data.areas.reduce((acc: SurfacePaths[], s: SurfaceArea) => {
      const polygons = this.createPolygons(s.data);
      const mapped: SurfacePaths[] = polygons.map((polygon: number[]) => ({
        color: this.colorToCSSColor(s.color),
        path: this.generatePolygonPath(polygon),
      }));
      acc.push(...mapped);
      return acc;
    }, []);
  }

  generateSurfaceLinesPaths(): void {
    this.surfaceLinesPaths = this.data.lines.reduce((acc: SurfacePaths[], l: SurfaceLine) => {
      const lines = this.generateLinePaths(l);
      const mapped: SurfacePaths[] = lines.map((path: Path2D) => ({ color: this.colorToCSSColor(l.color), path }));
      acc.push(...mapped);
      return acc;
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

  createPolygons = (data: number[][]): number[][] => {
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

  generateLinePaths = (s: SurfaceLine): Path2D[] => {
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

  getInternalLayerIds(): string[] {
    return [];
  }
}
