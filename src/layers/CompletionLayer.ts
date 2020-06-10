import { OnMountEvent, OnUpdateEvent, OnRescaleEvent } from '..';
import { CompletionLayerOptions } from '../interfaces';
import { PixiLayer } from './base/PixiLayer';
import { Graphics, Point } from 'pixi.js';

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
    this.render();
  }

  onRescale(event: OnRescaleEvent): void {
    super.onRescale(event);
    this.ctx.stage.position.set(event.transform.x, event.transform.y);
    this.ctx.stage.scale.set(event.xRatio, event.yRatio);
  }

  render(): void {
    const wellborePath = this.referenceSystem ? (this.referenceSystem.projectedPath as [number, number][]) : [];

    if (wellborePath == null) {
      return;
    }

    // TODO: clear old completion items when there is no data to display
    const items: CompletionItem[] = this.data?.length > 0 ? this.data.map((d: any) => this.generateCompletionItem(wellborePath, d)) : [];
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

  generateCompletionItem(wbp: any, data: any): CompletionItem {
    if (!this.referenceSystem) {
      return;
    }
    const offset = 1;
    const pointTop = this.referenceSystem.project(data.start);
    const pointBottom = this.referenceSystem.project(data.end);
    const rotation = this.getAngle(new Point(pointTop[0], pointTop[1]), new Point(pointBottom[0], pointBottom[1]));

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
