import { Graphics, Container } from 'pixi.js';
import { PixiLayer } from './PixiLayer';
import { GeoModelData, GeomodelLayerOptions, OnUpdateEvent, OnRescaleEvent, OnMountEvent } from '../interfaces';

export class GeomodelLayerV2 extends PixiLayer {
  options: GeomodelLayerOptions;

  pixiContainer: Container;

  data: any;

  polygons: any;

  onMount(event: OnMountEvent): void {
    super.onMount(event);
    this.pixiContainer = new Container();
    this.ctx.stage.addChild(this.pixiContainer);
  }

  onUnmount(): void {
    super.onUnmount();
    this.pixiContainer = null;
  }

  onUpdate(event: OnUpdateEvent): void {
    super.onUpdate(event);
    this.data = event.data;
    this.cleanUpContainer();

    this.data.areas.forEach((p: any) => this.generateAreaPolygon(p));
    this.data.lines.forEach((l: any) => this.generateSurfaceLine(l));
  }

  onRescale(event: OnRescaleEvent): void {
    this.pixiContainer.position.set(event.transform.x, event.transform.y);
    this.pixiContainer.scale.set(event.xRatio, event.yRatio);
  }

  cleanUpContainer(): void {
    this.pixiContainer.children.forEach((g: Graphics) => g.destroy());
    this.pixiContainer.removeChildren();
  }

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
            if (!data[j][1]) break;
            polygon.push(data[j][0], data[j][2] || 10000);
          }
          polygons.push(polygon);
          polygon = null;
        }
      }
    }
    return polygons;
  };

  generateAreaPolygon = (s: GeoModelData): void => {
    const g = new Graphics();
    g.lineStyle(1, s.color, 1);
    g.beginFill(s.color);
    const polygons = this.createPolygons(s.data);
    polygons.forEach((polygon: any) => g.drawPolygon(polygon));
    g.endFill();
    this.pixiContainer.addChild(g);
  };

  generateSurfaceLine = (s: any): void => {
    const g = new Graphics();
    const { data: d } = s;
    g.lineStyle(s.width, s.color, 1);
    let penDown = false;
    for (let i = 0; i < d.length; i++) {
      if (d[i][1]) {
        if (penDown) {
          g.lineTo(d[i][0], d[i][1]);
        } else {
          g.moveTo(d[i][0], d[i][1]);
          penDown = true;
        }
      } else {
        penDown = false;
      }
    }
    this.pixiContainer.addChild(g);
  };
}
