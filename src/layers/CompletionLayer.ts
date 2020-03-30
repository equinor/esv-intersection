import { OnMountEvent, OnUpdateEvent, OnRescaleEvent } from '..';
import { CompletionLayerOptions } from '../interfaces';
import { PixiLayer } from './PixiLayer';
import { Graphics, Point } from 'pixi.js';
import { calcDist } from '../utils/vectorUtils';

interface CompletionItem {}

export class CompletionLayer extends PixiLayer {
  options: CompletionLayerOptions;

  constructor(id: string, options: CompletionLayerOptions) {
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
    const { wellborePath } = event;

    if (wellborePath == null) {
      return;
    }

    const items: CompletionItem[] = this.data.map((d: any) => this.generateCompletionItem(wellborePath, d));
    items.map((s: any) => this.drawCompletionItem(s));
  }

  getShape(type: string): Graphics {
    const graphics = new Graphics();
    switch (type) {
      default:
        const color = 0x343434;
        const rSize = 10;
        graphics.beginFill(color);
        graphics.drawRect(-rSize / 2, -rSize / 2, rSize, rSize);
        graphics.endFill();
        break;
    }
    return graphics;
  }

  getScale(type: string, length: number, width: number): { scaleX: number; scaleY: number } {
    switch (type) {
      default:
        return { scaleX: 1, scaleY: 1 };
    }
  }

  getAngle(p1: { y: number; x: number }, p2: { y: number; x: number }): number {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
  }
  getPointAtMd(wbp: any, depth: number, offset: number): any {
    const maxMin = (input: number, max: number): number => {
      let index = input + offset;
      index = index > 0 ? index : 0;
      index = index < max ? index : max;
      return index;
    };

    let tot = 0;
    for (let i = 1; i < wbp.length; i++) {
      tot += calcDist(wbp[i - 1], wbp[i]);
      if (tot > depth) {
        return wbp[maxMin(i, wbp.length)];
      }
    }

    return wbp[wbp.length - 1];
  }

  // dbgPt(point: Point, point2: Point, c: any = 0x4ff545) {
  //   const line = new Graphics();
  //   line.lineStyle(2, c, undefined, 1).moveTo(point.x, point.y);
  //   line.lineTo(point2.x, point2.y);

  //   this.ctx.stage.addChild(line);
  // }

  generateCompletionItem(wbp: any, data: any): CompletionItem {
    const offset = 1;
    const pointTop = this.getPointAtMd(wbp, data.start, offset);
    const pointBottom = this.getPointAtMd(wbp, data.end, -offset);
    const rotation = this.getAngle(new Point(pointTop[0], pointTop[1]), new Point(pointBottom[0], pointBottom[1]));
    // this.dbgPt(new Point(pointTop[0], pointTop[1]), new Point(pointBottom[0], pointBottom[1]));

    const graphics: Graphics = this.getShape(data.shape); // cache?
    const { scaleX, scaleY } = this.getScale(data.shape, data.start - data.end, data.diameter);
    const [x, y] = pointTop;

    graphics.setTransform(x, y, scaleX, scaleY, rotation); // translate shape to pos in draw?

    return { graphics };
  }

  drawCompletionItem(item: any): void {
    this.ctx.stage.addChild(item.graphics);
  }
}
