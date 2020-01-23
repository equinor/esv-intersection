// import d3 from 'd3';
import { LayerOptions, OnMountEvent, OnUnmountEvent, OnUpdateEvent, OnRescaleEvent } from '../Interfaces';


abstract class Layer {
  id: String;
  options: LayerOptions;
  loading: boolean;
  element?: HTMLElement;
  _opacity: Number;

  constructor(id: String, options: LayerOptions) {
    this.id = id;
    this.options = {
      ...options,
    };
    this.loading = false;
    this.element = null;
    this._opacity = options.layerOpacity || 1;

    this.onMount = this.onMount.bind(this);
    this.onUnmount = this.onUnmount.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onRescale = this.onRescale.bind(this);
  }

  onMount(event: OnMountEvent) : void {
    this.element = event.elm;
    if (this.options.onMount) {
      this.options.onMount(event, this);
    }
  }

  onUnmount(event: OnUnmountEvent) : void {
    if (this.options.onUnmount) {
      this.options.onUnmount(event, this);
    }
  }

  onUpdate(event: OnUpdateEvent) : void {
    if(this.options.onUpdate) {
      this.options.onUpdate(event, this);
    }
  }

  onRescale(event: OnRescaleEvent) {
    if (this.options.onRescale) {
      this.options.onRescale(event, this);
    }
  }

  set isLoading(loading: boolean) {
    // TODO: update d3 element
    this.loading = loading;

  }
  get isLoading() : boolean {
    return this.loading;
  }

  set opacity(opacity: Number) {
    this._opacity = opacity;
  }

  get opacity() : Number {
    return this._opacity;
  }
}

export default Layer;
