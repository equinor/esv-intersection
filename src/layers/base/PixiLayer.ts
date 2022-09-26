import { AbstractRenderer, Application, autoDetectRenderer, Container, DisplayObject, IRendererOptionsAuto, RENDERER_TYPE } from 'pixi.js';
import { Layer, LayerOptions } from './Layer';
import { OnMountEvent, OnRescaleEvent, OnResizeEvent } from '../../interfaces';
import { DEFAULT_LAYER_HEIGHT, DEFAULT_LAYER_WIDTH } from '../../constants';

// PixiRenderApplication does not inherit from PIXI.Application to avoid registering the gameloop plugin
// The gameloop plugin tries to re-render at 60fps
// We only want to re-render on data changes
export class PixiRenderApplication {
  stage: Container;

  renderer: AbstractRenderer;

  constructor(pixiRenderOptions?: IRendererOptionsAuto) {
    this.renderer = autoDetectRenderer({
      width: DEFAULT_LAYER_WIDTH,
      height: DEFAULT_LAYER_HEIGHT,
      antialias: true,
      backgroundAlpha: 0,
      clearBeforeRender: true,
      // autoResize: true,
      preserveDrawingBuffer: true,
      ...pixiRenderOptions,
    });
    this.stage = new Container();
  }

  destroy() {
    this.stage.destroy({
      children: true,
      texture: true,
      baseTexture: true,
    });
    this.stage = null;
    this.renderer.destroy(true);
    this.renderer = null;
  }

  get view() {
    return this.renderer.view;
  }

  render() {
    this.renderer.render(this.stage);
  }
}

export abstract class PixiLayer<T> extends Layer<T> {
  private _pixiViewContainer: HTMLElement;
  private _ctx: PixiRenderApplication;
  private _container: Container;

  get container() {
    return this._container;
  }

  constructor(ctx: Application | PixiRenderApplication, id?: string, options?: LayerOptions<T>) {
    super(id, options);

    this._ctx = ctx;

    this._container = new Container();
    this._ctx.stage.addChild(this._container);
  }

  render(): void {
    this._ctx.render();
  }

  addChild(child: DisplayObject) {
    this._container.addChild(child);
  }

  clearLayer() {
    const children = this._container.removeChildren();
    children.forEach((child) => {
      child.destroy();
    });
  }

  onMount(event: OnMountEvent) {
    super.onMount(event);

    if (!this._pixiViewContainer) {
      const container = document.createElement('div');
      container.setAttribute('id', `${this.id}`);
      container.setAttribute('class', 'webgl-layer');

      this._pixiViewContainer = container;
      this._pixiViewContainer.appendChild(this._ctx.view);

      this.element.appendChild(container);

      this.updateStyle();
    }
  }

  onResize(event: OnResizeEvent): void {
    super.onResize(event);
    this._ctx.renderer.resize(event.width, event.height);
  }

  onRescale(event: OnRescaleEvent): void {
    super.onRescale(event);

    const flippedX = event.xBounds[0] > event.xBounds[1];
    const flippedY = event.yBounds[0] > event.yBounds[1];
    this.container.position.set(event.xScale(0), event.yScale(0));
    this.container.scale.set(event.xRatio * (flippedX ? -1 : 1), event.yRatio * (flippedY ? -1 : 1));
  }

  updateStyle(visible?: boolean): void {
    const isVisible = visible || this.isVisible;
    const interactive = this.interactive ? 'auto' : 'none';
    this._container.visible = isVisible;
    this._pixiViewContainer.setAttribute('style', `position:absolute;pointer-events:${interactive};z-index:${this.order};opacity:${this.opacity};`);
  }

  setVisibility(visible: boolean): void {
    super.setVisibility(visible);
    if (this._pixiViewContainer) {
      this.updateStyle(visible);
    }
  }

  onOpacityChanged(_opacity: number): void {
    if (this._pixiViewContainer) {
      this.updateStyle();
    }
  }

  onOrderChanged(_order: number): void {
    if (this._pixiViewContainer) {
      this.updateStyle();
    }
  }

  onInteractivityChanged(_interactive: boolean): void {
    if (this._pixiViewContainer) {
      this.updateStyle();
    }
  }

  renderType(): RENDERER_TYPE {
    return this._ctx.renderer.type;
  }
}
