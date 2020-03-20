import { OnMountEvent, OnUpdateEvent, OnRescaleEvent } from '..';
import { CompletionLayerOptions } from '../interfaces';
import { WebGLLayer } from './WebGLLayer';
import { WellboreBaseComponentLayer } from './WellboreBaseComponentLayer';
import { Graphics } from 'pixi.js';
import { pointToArray } from '../utils/vectorUtils';

interface CompletionItem {}

export class CompletionLayer extends WebGLLayer {
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
  }

  render(event: OnRescaleEvent | OnUpdateEvent): void {
    const { data, wellborePath } = event;

    const items: CompletionItem[] = data.map(d => this.generateCompletionItem(wellborePath, d));

    items.map((s: any) => this.drawCompletionItem(s));
  }
  getShape(type: string): Graphics {
    const graphics = new Graphics();
    switch (type) {
      default:
        const color = 0x343434;
        const rSize = 50;
        graphics.beginFill(color);
        graphics.drawRect(0, 0, rSize, rSize);
        graphics.endFill();
        break;
    }
    return graphics;
  }
  getScale(type: string, length: number, width: number) {
    switch (type) {
      default:
        return { scaleX: 1, scaleY: 1 };
    }
  }
  getAngle(p1, p2): number {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
  }

  generateCompletionItem(wbp: any, data: any): CompletionItem {
    // const [x,y, dir] = wbp.getPosFromMD(data.start)
    const pointTop = wbp.getPointAt(data.start);
    const pointBottom = wbp.getPointAt(data.end);
    const rotation = this.getAngle(pointTop, pointBottom);

    const graphics: Graphics = this.getShape(data.shape);
    const { scaleX, scaleY } = this.getScale(data.shape, data.start - data.end, data.diameter);
    const { x, y } = pointTop;

    graphics.setTransform(x, y, scaleX, scaleY, rotation); // translate shape to pos in draw?

    return { x, y, graphics };
  }
}
