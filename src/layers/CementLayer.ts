import { WellboreBaseComponentLayer } from './WellboreBaseComponentLayer';
import { CementLayerOptions, OnMountEvent, OnUpdateEvent, OnRescaleEvent } from '..';

export class CementLayer extends WellboreBaseComponentLayer {
  options: CementLayerOptions;

  constructor(id?: string, options?: CementLayerOptions) {
    super(id, options);
    this.options = {
      firstColor: '#777788',
      secondColor: '#EEEEFF',
      lineColor: 0x575757,
      percentFirstColor: 1,
      rotation: 45,
      topBottomLineColor: 0x575757,
      maxTextureDiameterScale: 2,
      ...options,
    };
    this.render = this.render.bind(this);
  }

  onMount(event: OnMountEvent): void {
    super.onMount(event);
  }

  onUpdate(event: OnUpdateEvent): void {
    this.createCementShapes(null, null, null);

    super.onUpdate(event);
    this.render(event);
  }

  onRescale(event: OnRescaleEvent): void {
    super.onRescale(event);
  }

  render(event: OnRescaleEvent | OnUpdateEvent): void {
    super.render(event);
  }

  createCementShapes(cement: any, casings: any, holes: any): any {
    // foreach cement
    // find bottom of cement based on connected casing
    // find all items in the cement range
    // find outer edge, based on closest item
    // return polygon
  }
}
