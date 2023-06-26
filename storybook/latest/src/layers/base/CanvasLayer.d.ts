import { Layer } from './Layer';
import { OnMountEvent, OnUpdateEvent, OnResizeEvent, OnRescaleEvent } from '../../interfaces';
export declare abstract class CanvasLayer<T> extends Layer<T> {
    ctx: CanvasRenderingContext2D | undefined;
    elm: HTMLElement | undefined;
    canvas: HTMLCanvasElement | undefined;
    onOpacityChanged(_opacity: number): void;
    onOrderChanged(_order: number): void;
    onInteractivityChanged(_interactive: boolean): void;
    setVisibility(visible: boolean): void;
    updateStyle(visible?: boolean): void;
    onMount(event: OnMountEvent): void;
    onUnmount(): void;
    onResize(event: OnResizeEvent): void;
    onUpdate(event: OnUpdateEvent<T>): void;
    resetTransform(): void;
    setTransform(event: OnRescaleEvent): void;
    clearCanvas(): void;
}
//# sourceMappingURL=CanvasLayer.d.ts.map