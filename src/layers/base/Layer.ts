import { LayerOptions, OnMountEvent, OnUnmountEvent, OnUpdateEvent, OnRescaleEvent, OnResizeEvent } from '../../interfaces';
import { IntersectionReferenceSystem } from '../../control';

const defaultOptions = {
  order: 1,
  layerOpacity: 1,
  interactive: false,
};

const ONE_THOUSAND = 1000;

export abstract class Layer<T> {
  private _id: string;
  private _order: number;
  protected _options: LayerOptions<T>;
  private loading: boolean;
  private _element?: HTMLElement;
  private _opacity: number;
  private _referenceSystem?: IntersectionReferenceSystem = null;
  private _data?: T;
  private _visible: boolean;
  private _interactive: boolean = false;

  constructor(id?: string, options?: LayerOptions<T>) {
    this._id = id || `layer-${Math.floor(Math.random() * ONE_THOUSAND)}`;
    const opts = options || defaultOptions;
    this._order = opts.order || 1;
    this._options = {
      ...opts,
    };
    this.loading = false;
    this._element = null;
    this._opacity = opts.layerOpacity || 1;
    this._visible = true;
    this._interactive = opts.interactive || false;

    if (options && options.data) {
      this.setData(options.data);
    }
    this._referenceSystem = options && options.referenceSystem;

    this.onMount = this.onMount.bind(this);
    this.onUnmount = this.onUnmount.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onRescale = this.onRescale.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onOrderChanged = this.onOrderChanged.bind(this);
    this.onOpacityChanged = this.onOpacityChanged.bind(this);
    this.setVisibility = this.setVisibility.bind(this);
  }

  get id(): string {
    return this._id;
  }

  get element(): HTMLElement {
    return this._element;
  }

  get options(): LayerOptions<T> {
    return this._options;
  }

  set options(options: LayerOptions<T>) {
    this._options = options;
  }

  set isLoading(loading: boolean) {
    this.loading = loading;
  }

  get isLoading(): boolean {
    return this.loading;
  }

  set opacity(opacity: number) {
    this._opacity = opacity;
    this.onOpacityChanged(opacity);
  }

  get opacity(): number {
    return this._opacity;
  }

  set order(order: number) {
    this._order = order;
    this.onOrderChanged(order);
  }

  get order(): number {
    return this._order;
  }

  set interactive(shouldBeInteractive: boolean) {
    this._interactive = shouldBeInteractive;
    this.onInteractivityChanged(shouldBeInteractive);
  }

  get interactive(): boolean {
    return this._interactive;
  }

  get referenceSystem(): IntersectionReferenceSystem {
    return this._referenceSystem;
  }

  set referenceSystem(referenceSystem: IntersectionReferenceSystem) {
    this._referenceSystem = referenceSystem;
  }

  get data(): T {
    return this.getData();
  }

  set data(data: T) {
    this.setData(data);
  }

  get isVisible(): boolean {
    return this._visible;
  }

  getData(): T {
    return this._data;
  }

  setData(data: T): void {
    this._data = data;
    // should not be called when there is no visual element to work with
    if (this.element) {
      this.onUpdate({ data });
    }
  }

  /**
   * Clears data and (optionally) the reference system
   * @param includeReferenceSystem - (optional) if true also removes reference system, default is true
   */
  clearData(includeReferenceSystem: boolean = true): void {
    this._data = null;
    if (includeReferenceSystem) {
      this.referenceSystem = null;
    }
    this.onUpdate({});
  }

  setVisibility(visible: boolean): void {
    this._visible = visible;
  }

  onMount(event: OnMountEvent): void {
    this._element = event.elm;
    if (this._options.onMount) {
      this._options.onMount(event, this);
    }
  }

  onUnmount(event?: OnUnmountEvent): void {
    if (this._options.onUnmount) {
      this._options.onUnmount(event, this);
    }
  }

  onResize(event: OnResizeEvent): void {
    if (this._options.onResize) {
      this._options.onResize(event, this);
    }
  }

  onUpdate(event: OnUpdateEvent<T>): void {
    if (event.data) {
      this._data = event.data;
    }
    if (this._options.onUpdate) {
      this._options.onUpdate(event, this);
    }
  }

  onRescale(event: OnRescaleEvent): void {
    this.optionsRescale(event);
  }

  optionsRescale(event: OnRescaleEvent): void {
    if (this._options.onRescale) {
      this._options.onRescale(event, this);
    }
  }

  abstract onOpacityChanged(opacity: number): void;

  abstract onOrderChanged(order: number): void;

  abstract onInteractivityChanged(interactive: boolean): void;
}
