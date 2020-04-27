import { Controller, GridLayer } from '../src';

describe('Controller', () => {
  let elm: HTMLElement;
  beforeEach(() => {
    elm = document.createElement('div');
  });
  afterEach(() => {
    elm.remove();
  });
  it('should create overlay on instantiation', () => {
    const controller = new Controller({ container: elm });
    expect(controller.overlay).not.toEqual(undefined);
  });
  it('should create axis when options are supplied', () => {
    const c1 = new Controller({ container: elm });
    expect(c1.axis).toEqual(undefined);
    const c2 = new Controller({ container: elm, axisOptions: { unitOfMeasure: 'm', xLabel: 'x', yLabel: 'y' } });
    expect(c2.axis).not.toEqual(undefined);
  });
  it('should add and remove layer', () => {
    const controller = new Controller({ container: elm });
    const layer = new GridLayer('grid');
    controller.addLayer(layer);
    expect(controller.getLayer('grid')).toEqual(layer);
    controller.removeLayer('grid');
    expect(controller.getLayer('grid')).not.toEqual(layer);
  });
});
