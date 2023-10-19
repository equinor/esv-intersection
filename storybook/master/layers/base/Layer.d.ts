import { OnMountEvent, OnUnmountEvent, OnUpdateEvent, OnRescaleEvent, OnResizeEvent } from '../../interfaces';
import { IntersectionReferenceSystem } from '../../control';
export interface LayerOptions<T> {
    order?: number;
    layerOpacity?: number;
    referenceSystem?: IntersectionReferenceSystem;
    data?: T;
    interactive?: boolean;
    onMount?(event: OnMountEvent, layer: Layer<T>): void;
    onUnmount?(event: OnUnmountEvent, layer: Layer<T>): void;
    onUpdate?(event: OnUpdateEvent<T>, layer: Layer<T>): void;
    onRescale?(event: OnRescaleEvent, layer: Layer<T>): void;
    onResize?(event: OnResizeEvent, layer: Layer<T>): void;
}
export declare abstract class Layer<T> {
    private _id;
    private _order;
    protected _options: LayerOptions<T>;
    private loading;
    private _element;
    private _opacity;
    private _referenceSystem;
    private _data;
    private _visible;
    private _interactive;
    constructor(id?: string, options?: LayerOptions<T>);
    get id(): string;
    get element(): HTMLElement | undefined;
    get options(): LayerOptions<T>;
    set options(options: LayerOptions<T>);
    set isLoading(loading: boolean);
    get isLoading(): boolean;
    set opacity(opacity: number);
    get opacity(): number;
    set order(order: number);
    get order(): number;
    set interactive(shouldBeInteractive: boolean);
    get interactive(): boolean;
    get referenceSystem(): IntersectionReferenceSystem | undefined;
    set referenceSystem(referenceSystem: IntersectionReferenceSystem | undefined);
    get data(): T | undefined;
    set data(data: T | undefined);
    get isVisible(): boolean;
    getData(): T | undefined;
    setData(data: T | undefined): void;
    /**
     * Clears data and (optionally) the reference system
     * @param includeReferenceSystem - (optional) if true also removes reference system, default is true
     */
    clearData(includeReferenceSystem?: boolean): void;
    setVisibility(visible: boolean, _layerId?: string): void;
    onMount(event: OnMountEvent): void;
    onUnmount(event?: OnUnmountEvent): void;
    onResize(event: OnResizeEvent): void;
    onUpdate(event: OnUpdateEvent<T>): void;
    onRescale(event: OnRescaleEvent): void;
    optionsRescale(event: OnRescaleEvent): void;
    abstract onOpacityChanged(opacity: number): void;
    abstract onOrderChanged(order: number): void;
    abstract onInteractivityChanged(interactive: boolean): void;
    /**
     *
     * Some layers might be built up of several internal layers that should individually be visibility-togglable.
     * Reasons for having multiple internal layers might be tightly related data between layers or need for sharing render context
     *
     * @returns list of internal layer ids
     */
    getInternalLayerIds(): string[];
}
//# sourceMappingURL=Layer.d.ts.map