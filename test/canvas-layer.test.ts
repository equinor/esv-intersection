import { GridLayer } from '../src/index';

describe('Canvas', () => {
  let elm: HTMLElement;
  beforeEach(() => {
    elm = document.createElement('div');
  });
  afterEach(() => {
    elm.remove();
  });
  it('should not remount new elements on same layer', () => {
    const layer = new GridLayer('grid');
    layer.onMount({ elm });
    layer.onMount({ elm });
    expect(elm.children.length).toEqual(1);
  });
  it('should add and remove element on mount/unmount', () => {
    const layer = new GridLayer('grid');
    expect(elm.children.length).toEqual(0);
    layer.onMount({ elm });
    expect(elm.children.length).toEqual(1);
    layer.onUnmount();
    expect(elm.children.length).toEqual(0);
  });
  it('should have a default opacity of 1 if no option is set', () => {
    const layer = new GridLayer('grid');
    expect(layer.opacity).toEqual(1);
  });
  it('should overwrite default opacity of 1 with 0.5', () => {
    const layer = new GridLayer('grid', { layerOpacity: 0.5, order: 1 });
    expect(layer.opacity).toEqual(0.5);
  });
});
