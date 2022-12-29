import { AbstractRenderer, Application, Container, DisplayObject, IRendererOptionsAuto, RENDERER_TYPE } from 'pixi.js';
import { Layer, LayerOptions } from './Layer';
import { OnMountEvent, OnRescaleEvent, OnResizeEvent, OnUnmountEvent } from '../../interfaces';
export declare class PixiRenderApplication {
    stage: Container;
    renderer: AbstractRenderer;
    constructor(pixiRenderOptions?: IRendererOptionsAuto);
    destroy(): void;
    get view(): HTMLCanvasElement;
    render(): void;
}
export declare abstract class PixiLayer<T> extends Layer<T> {
    private pixiViewContainer;
    private ctx;
    private container;
    constructor(ctx: Application | PixiRenderApplication, id?: string, options?: LayerOptions<T>);
    render(): void;
    addChild(child: DisplayObject): void;
    clearLayer(): void;
    onMount(event: OnMountEvent): void;
    onUnmount(event?: OnUnmountEvent): void;
    onResize(event: OnResizeEvent): void;
    onRescale(event: OnRescaleEvent): void;
    protected setContainerPosition(x?: number, y?: number): void;
    protected setContainerScale(x?: number, y?: number): void;
    updateStyle(visible?: boolean): void;
    setVisibility(visible: boolean, layerId?: string): void;
    onOpacityChanged(_opacity: number): void;
    onOrderChanged(_order: number): void;
    onInteractivityChanged(_interactive: boolean): void;
    renderType(): RENDERER_TYPE;
}
