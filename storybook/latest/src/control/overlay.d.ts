import { Selection } from 'd3-selection';
import { OverlayCallbacks } from './interfaces';
export declare class Overlay<T> {
    elm: Selection<Element, unknown, null, undefined>;
    source: Element;
    elements: {
        [propName: string]: Element;
    };
    listeners: {
        [propName: string]: OverlayCallbacks<T>;
    };
    enabled: boolean;
    constructor(caller: T, container: HTMLElement);
    create(key: string, callbacks?: OverlayCallbacks<T>): HTMLElement;
    register(key: string, callbacks: OverlayCallbacks<T>): void;
    remove(key: string): void;
    setZIndex(zIndex: number): void;
    destroy(): void;
}
export declare const overlay: <T>(caller: T, container: HTMLElement) => Overlay<T>;
//# sourceMappingURL=overlay.d.ts.map