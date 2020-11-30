import { Application, Transform, RENDERER_TYPE } from 'pixi.js';
import { Layer } from './Layer';
import { OnMountEvent, OnRescaleEvent, OnResizeEvent, OnUnmountEvent } from '../../interfaces';
import { DEFAULT_LAYER_HEIGHT, DEFAULT_LAYER_WIDTH } from '../../constants';

export abstract class PixiLayer extends Layer {
  elm: HTMLElement;

  ctx: Application;

  transform: Transform;

  onMount(event: OnMountEvent): void {
    super.onMount(event);

    if (!this.elm) {
      const container = document.createElement('div');
      container.setAttribute('id', `${this.id}`);
      container.setAttribute('class', 'webgl-layer');
      this.elm = container;
      this.updateStyle();

      const { elm, height, width } = event;

      const pixiOptions = {
        width: width || parseInt(this.elm.getAttribute('width'), 10) || DEFAULT_LAYER_WIDTH,
        height: height || parseInt(this.elm.getAttribute('height'), 10) || DEFAULT_LAYER_HEIGHT,
        antialias: true,
        transparent: true,
        clearBeforeRender: true,
        autoResize: true,
        preserveDrawingBuffer: true,
      };

      this.ctx = new Application(pixiOptions);
      container.appendChild(this.ctx.view);
      elm.appendChild(container);
    }
  }

  onUnmount(event?: OnUnmountEvent): void {
    super.onUnmount(event);

    // Get renderType and clContext before we destroy the renderer
    const renderType = this.renderType();
    const glContext = this.ctx.renderer?.gl;

    this.ctx.stop();
    this.ctx.destroy(true, { children: true, texture: true, baseTexture: true });

    /**
     * WebGL v2 does supposedly not have WEBGL_lose_context
     * so Pixi.js does not use it to "clean up" on v2.
     *
     * Cleaning up our self since it still seems to work and fix issue with lingering contexts
     */
    if (renderType === RENDERER_TYPE.WEBGL) {
      glContext?.getExtension('WEBGL_lose_context')?.loseContext();
    }

    this.elm.remove();
    this.elm = null;
    this.ctx = null;
    this.transform = null;
  }

  onResize(event: OnResizeEvent): void {
    super.onResize(event);
    this.ctx.renderer.resize(event.width, event.height);
  }

  onRescale(event: OnRescaleEvent): void {
    super.onRescale(event);
    if (!this.ctx) {
      return;
    }

    const flippedX = event.xBounds[0] > event.xBounds[1];
    const flippedY = event.yBounds[0] > event.yBounds[1];
    this.ctx.stage.position.set(event.xScale(0), event.yScale(0));
    this.ctx.stage.scale.set(event.xRatio * (flippedX ? -1 : 1), event.yRatio * (flippedY ? -1 : 1));
  }

  updateStyle(visible?: boolean): void {
    const isVisible = visible || this.isVisible;
    const visibility = isVisible ? 'visible' : 'hidden';
    const interactive = this.interactive ? 'auto' : 'none';
    this.elm.setAttribute(
      'style',
      `position:absolute;pointer-events:${interactive};z-index:${this.order};opacity:${this.opacity};visibility:${visibility}`,
    );
  }

  setVisibility(visible: boolean): void {
    super.setVisibility(visible);
    if (this.elm) {
      this.updateStyle(visible);
    }
  }

  onOpacityChanged(opacity: number): void {
    if (this.elm) {
      this.updateStyle();
    }
  }

  onOrderChanged(order: number): void {
    if (this.elm) {
      this.updateStyle();
    }
  }

  onInteractivityChanged(interactive: boolean): void {
    if (this.elm) {
      this.updateStyle();
    }
  }

  renderType(): RENDERER_TYPE {
    return this.ctx.renderer.type;
  }
}
