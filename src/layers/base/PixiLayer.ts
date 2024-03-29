import { IRenderer, Application, autoDetectRenderer, Container, DisplayObject, IRendererOptionsAuto, Renderer, RENDERER_TYPE } from 'pixi.js';
import { Layer, LayerOptions } from './Layer';
import { OnMountEvent, OnRescaleEvent, OnResizeEvent, OnUnmountEvent } from '../../interfaces';
import { DEFAULT_LAYER_HEIGHT, DEFAULT_LAYER_WIDTH } from '../../constants';

// PixiRenderApplication has many similarities with PIXI.Application,
// but an important distinction is that it does not run the TickerPlugin.
// We only want to re-render on data changes
// The plugin we are trying to avoid:
// https://github.com/pixijs/pixijs/blob/dev/packages/ticker/src/TickerPlugin.ts
export class PixiRenderApplication {
  stage: Container | undefined;

  renderer: IRenderer<HTMLCanvasElement> | undefined;

  constructor(pixiRenderOptions?: IRendererOptionsAuto) {
    const options = {
      width: DEFAULT_LAYER_WIDTH,
      height: DEFAULT_LAYER_HEIGHT,
      antialias: true,
      backgroundAlpha: 0,
      clearBeforeRender: true,
      // autoResize: true,
      preserveDrawingBuffer: true,
      ...pixiRenderOptions,
    };
    this.renderer = autoDetectRenderer<HTMLCanvasElement>(options);
    this.stage = new Container();
  }

  destroy() {
    this.stage?.destroy({
      children: true,
      texture: true,
      baseTexture: true,
    });
    this.stage = undefined;

    // Get renderType and clContext before we destroy the renderer
    const renderType = this.renderer?.type;
    const glContext = this.renderer instanceof Renderer ? this.renderer?.gl : undefined;

    /**
     * WebGL v2 does supposedly not have WEBGL_lose_context
     * so Pixi.js does not use it to "clean up" on v2.
     *
     * Cleaning up our self since it still seems to work and fix issue with lingering context
     */
    if (renderType === RENDERER_TYPE.WEBGL && glContext) {
      glContext?.getExtension('WEBGL_lose_context')?.loseContext();
    }

    this.renderer?.destroy(true);
    this.renderer = undefined;
  }

  get view() {
    return this.renderer?.view;
  }

  render() {
    if (this.stage != null) {
      this.renderer?.render(this.stage);
    }
  }
}

export abstract class PixiLayer<T> extends Layer<T> {
  private pixiViewContainer: HTMLElement | undefined;
  private ctx: PixiRenderApplication;
  private container: Container;

  constructor(ctx: Application<HTMLCanvasElement> | PixiRenderApplication, id?: string, options?: LayerOptions<T>) {
    super(id, options);

    this.ctx = ctx;

    this.container = new Container();
    this.ctx.stage?.addChild(this.container);
  }

  render(): void {
    this.ctx.render();
  }

  addChild(child: DisplayObject) {
    this.container.addChild(child);
  }

  clearLayer() {
    const children = this.container.removeChildren();
    children.forEach((child) => {
      child.destroy();
    });
  }

  override onMount(event: OnMountEvent) {
    super.onMount(event);

    this.pixiViewContainer = this.element?.querySelector('#webgl-layer') ?? undefined;

    if (!this.pixiViewContainer) {
      this.pixiViewContainer = document.createElement('div');
      this.pixiViewContainer.setAttribute('id', `${this.id}`);
      this.pixiViewContainer.setAttribute('class', 'webgl-layer');

      if (this.ctx.view != null) {
        this.pixiViewContainer.appendChild(this.ctx.view);
      }

      this.element?.appendChild(this.pixiViewContainer);

      this.updateStyle();
    }
  }

  override onUnmount(event?: OnUnmountEvent) {
    super.onUnmount(event);

    this.clearLayer();
    this.ctx.stage?.removeChild(this.container);
    this.container.destroy();
    this.pixiViewContainer?.remove();
    this.pixiViewContainer = undefined;
  }

  override onResize(event: OnResizeEvent): void {
    super.onResize(event);
    this.ctx.renderer?.resize(event.width, event.height);
  }

  override onRescale(event: OnRescaleEvent): void {
    super.onRescale(event);

    const flippedX = event.xBounds[0] > event.xBounds[1];
    const flippedY = event.yBounds[0] > event.yBounds[1];
    this.setContainerPosition(event.xScale(0), event.yScale(0));
    this.setContainerScale(event.xRatio * (flippedX ? -1 : 1), event.yRatio * (flippedY ? -1 : 1));
  }

  protected setContainerPosition(x?: number, y?: number) {
    this.container.position.set(x, y);
  }

  protected setContainerScale(x?: number, y?: number) {
    this.container.scale.set(x, y);
  }

  updateStyle(visible?: boolean): void {
    const isVisible = visible || this.isVisible;
    const interactive = this.interactive ? 'auto' : 'none';
    this.container.visible = isVisible;

    const styles = [
      ['position', 'absolute'],
      ['pointer-events', `${interactive}`],
      ['z-index', `${this.order}`],
      ['opacity', `${this.opacity}`],
    ]
      .map((pair) => pair.join(':'))
      .join(';');

    this.pixiViewContainer?.setAttribute('style', styles);
  }

  override setVisibility(visible: boolean, layerId?: string): void {
    super.setVisibility(visible, layerId);
    if (this.pixiViewContainer) {
      this.updateStyle(visible);
    }
  }

  onOpacityChanged(_opacity: number): void {
    if (this.pixiViewContainer) {
      this.updateStyle();
    }
  }

  onOrderChanged(_order: number): void {
    if (this.pixiViewContainer) {
      this.updateStyle();
    }
  }

  onInteractivityChanged(_interactive: boolean): void {
    if (this.pixiViewContainer) {
      this.updateStyle();
    }
  }

  renderType(): RENDERER_TYPE | undefined {
    return this.ctx.renderer?.type;
  }
}
