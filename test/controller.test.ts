import { Controller, GridLayer } from '../src';

describe('Controller', () => {
  let elm: HTMLElement;
  let overlayElementGetter: any;
  beforeEach(() => {
    elm = document.createElement('div');
    overlayElementGetter = () => document.getElementById('overlay');
  });
  afterEach(() => {
    elm.remove();
  });
  it('should create overlay on instantiation', () => {
    const controller = new Controller({ container: elm, overlayElementGetter });
    expect(controller.overlay).not.toEqual(undefined);
  });
  it('should create axis when options are supplied', () => {
    const c1 = new Controller({ container: elm, overlayElementGetter });
    expect(c1.axis).toEqual(undefined);
    const c2 = new Controller({ container: elm, overlayElementGetter, axisOptions: { unitOfMeasure: 'm', xLabel: 'x', yLabel: 'y' } });
    expect(c2.axis).not.toEqual(undefined);
  });
  it('should add and remove layer', () => {
    const controller = new Controller({ container: elm, overlayElementGetter });
    const layer = new GridLayer('grid');
    controller.addLayer(layer);
    expect(controller.getLayer('grid')).toEqual(layer);
    controller.removeLayer('grid');
    expect(controller.getLayer('grid')).not.toEqual(layer);
  });
  it('should set default z-index for overlay', () => {
    const controller = new Controller({ container: elm, overlayElementGetter });
    const overlayZIndex = controller.overlay.elm.style('z-index');
    expect(overlayZIndex).toEqual('11');
  });
  it('should set z-index for overlay that is higher than layers', () => {
    const controller = new Controller({ container: elm, overlayElementGetter });
    const layer = new GridLayer('grid', { order: 13 });
    controller.addLayer(layer);
    const overlayZIndex = controller.overlay.elm.style('z-index');
    expect(overlayZIndex).toEqual('15');
    expect(layer.order).toBeLessThan(parseInt(overlayZIndex, 10));
  });
});
