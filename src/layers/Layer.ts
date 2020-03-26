import { LayerOptions, OnMountEvent, OnUnmountEvent, OnUpdateEvent, OnRescaleEvent, OnResizeEvent } from '../interfaces';
import { IntersectionReferenceSystem } from '../control';

export abstract class Layer {
  id: string;
  _order: number;
  options: LayerOptions;
  loading: boolean;
  element?: HTMLElement;
  _opacity: number;
  _referenceSystem?: IntersectionReferenceSystem;
  _data?: any;
  _visible: boolean;

  constructor(id: string, options: LayerOptions) {
    this.id = id;
    this._order = options.order;
    this.options = {
      ...options,
    };
    this.loading = false;
    this.element = null;
    this._opacity = options.layerOpacity || 1;
    this._visible = true;

    this._data = options.data;

    if (options.referenceSystem) {
      this._referenceSystem = options.referenceSystem;
    }

    this.onMount = this.onMount.bind(this);
    this.onUnmount = this.onUnmount.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onRescale = this.onRescale.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onOrderChanged = this.onOrderChanged.bind(this);
    this.onOpacityChanged = this.onOpacityChanged.bind(this);
    this.setVisibility = this.setVisibility.bind(this);
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

  get referenceSystem(): IntersectionReferenceSystem {
    return this._referenceSystem;
  }

  set referenceSystem(referenceSystem: IntersectionReferenceSystem) {
    this._referenceSystem = referenceSystem;
  }

  get data(): any {
    return this._data;
  }

  set data(data: any) {
    this._data = data;
    this.onUpdate({ data });
  }

  get isVisible(): boolean {
    return this._visible;
  }

  setVisibility(visible: boolean): void {
    this._visible = visible;
  }

  onMount(event: OnMountEvent): void {
    this.element = event.elm;
    if (this.options.onMount) {
      this.options.onMount(event, this);
    }
  }

  onUnmount(event?: OnUnmountEvent): void {
    if (this.options.onUnmount) {
      this.options.onUnmount(event, this);
    }
  }

  onResize(event: OnResizeEvent): void {
    if (this.options.onResize) {
      this.options.onResize(event, this);
    }
  }

  onUpdate(event: OnUpdateEvent): void {
    if (event.data) {
      this._data = event.data;
    }
    if (this.options.onUpdate) {
      this.options.onUpdate(event, this);
    }
  }

  onRescale(event: OnRescaleEvent): void {
    if (this.options.onRescale) {
      this.options.onRescale(event, this);
    }
  }

  onOpacityChanged(opacity: number): void {
  }

  onOrderChanged(order: number): void {
  }
}
