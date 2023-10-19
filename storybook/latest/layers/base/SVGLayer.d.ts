import { Selection } from 'd3-selection';
import { Layer } from './Layer';
import { OnMountEvent, OnResizeEvent } from '../../interfaces';
export declare abstract class SVGLayer<T> extends Layer<T> {
    elm: Selection<SVGSVGElement, unknown, null, undefined> | undefined;
    onMount(event: OnMountEvent): void;
    onUnmount(): void;
    onResize(event: OnResizeEvent): void;
    setVisibility(visible: boolean): void;
    onOpacityChanged(opacity: number): void;
    onOrderChanged(order: number): void;
    onInteractivityChanged(shouldBeInteractive: boolean): void;
}
//# sourceMappingURL=SVGLayer.d.ts.map