import Vector2 from '@equinor/videx-vector2';
import { Graphics } from 'pixi.js';
import { PixiLayer } from './base/PixiLayer';
import { LayerOptions, OnUpdateEvent, PixiRenderApplication } from '..';
import { CompletionData, OnRescaleEvent } from '../interfaces';

export interface CompletionItem {
  graphics: Graphics;
}

export interface CompletionLayerOptions<T extends CompletionData[]> extends LayerOptions<T> {}

export class CompletionLayer extends PixiLayer {
  constructor(ctx: PixiRenderApplication, id: string, options: CompletionLayerOptions) {
    super(ctx, id, options);
    this.options = {
      ...this.options,
      ...options,
    };
    this.render = this.render.bind(this);
  }

  onRescale(event: OnRescaleEvent): void {
    super.onRescale(event);
    this.clearStage();
    this.preRender();
    this.render();
  }

  onUpdate(event: OnUpdateEvent<T>): void {
    super.onUpdate(event);
    this.clearStage();
    this.preRender();
    this.render();
  }

  preRender(): void {
    const wellborePath = this.referenceSystem ? this.referenceSystem.projectedPath : [];

    if (wellborePath == null) {
      return;
    }

    // TODO: clear old completion items when there is no data to display
    const items: CompletionItem[] = this.data?.length > 0 ? this.data.map((d: CompletionData) => this.generateCompletionItem(wellborePath, d)) : [];
    items.map((s: CompletionItem) => this.drawCompletionItem(s));
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

  getScale(type: string, _length: number, _width: number): { scaleX: number; scaleY: number } {
    switch (type) {
      default:
        return { scaleX: 1, scaleY: 1 };
    }
  }

  /**
   * @‌deprecated use generateCompletionGraphics
   */
  generateCompletionItem(_wbp: unknown, data: CompletionData): CompletionItem {
    return this.generateCompletionGraphics(data);
  }

  generateCompletionGraphics(data: CompletionData): CompletionItem {
    if (!this.referenceSystem) {
      return;
    }
    const pointTop = this.referenceSystem.project(data.start);
    const pointBottom = this.referenceSystem.project(data.end);
    const rotation = Vector2.angle(pointTop, pointBottom);

    const graphics: Graphics = this.getShape(data.shape); // cache?
    const { scaleX, scaleY } = this.getScale(data.shape, data.start - data.end, data.diameter);
    const [x, y] = pointTop;

    graphics.setTransform(x, y, scaleX, scaleY, rotation); // translate shape to pos in draw?

    return { graphics };
  }

  drawCompletionItem(item: CompletionItem): void {
    this.ctx.stage.addChild(item.graphics);
  }
}
