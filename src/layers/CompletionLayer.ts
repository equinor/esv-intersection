import Vector2 from '@equinor/videx-vector2';
import { Graphics } from 'pixi.js';
import { PixiLayer } from './base/PixiLayer';
import { OnUpdateEvent } from '..';
import { CompletionLayerOptions, OnRescaleEvent } from '../interfaces';

export interface CompletionItem {
  graphics: Graphics;
}

type CompletionData = {
  shape: string;
  start: number;
  end: number;
  diameter: number;
};

export class CompletionLayer extends PixiLayer<CompletionData[]> {
  constructor(id: string, options: CompletionLayerOptions<CompletionData[]>) {
    super(id, options);
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

  onUpdate(event: OnUpdateEvent): void {
    super.onUpdate(event);
    this.clearStage();
    this.preRender();
    this.render();
  }

  preRender(): void {
    const wellborePath = this.referenceSystem ? (this.referenceSystem.projectedPath as [number, number][]) : [];

    if (wellborePath == null) {
      return;
    }

    // TODO: clear old completion items when there is no data to display
    const items: CompletionItem[] = this.data?.length > 0 ? this.data.map((d: CompletionData) => this.generateCompletionItem(wellborePath, d)) : [];
    items.map((s: CompletionItem) => this.drawCompletionItem(s));
  }

  clearStage(): void {
    const children = this.ctx.stage.removeChildren();
    children.forEach((child) => {
      child.destroy();
    });
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

  generateCompletionItem(_wbp: any, data: CompletionData): CompletionItem {
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
