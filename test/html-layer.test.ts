import { HTMLLayer } from '../src';

class htmlLayer extends HTMLLayer {}
const data = { key: 'value' };
describe('HTML', () => {
  let elm: HTMLElement;
  beforeEach(() => {
    elm = document.createElement('div');
  });
  afterEach(() => {
    elm.remove();
  });
  it('should instantiate a layer without needing to supply any input', () => {
    const layer = new htmlLayer();
    expect(layer.id).toBeTruthy();
  });
  it('should set and remove data on demand', () => {
    const layer = new htmlLayer();
    layer.setData(data);
    expect(layer.data).toBeTruthy();
    layer.clearData();
    expect(layer.data).toBeFalsy();
  });
  it('should not remount new elements on same layer', () => {
    const layer = new htmlLayer('html', {
      order: 1,
    });
    layer.onMount({ elm });
    layer.onMount({ elm });
    expect(elm.children.length).toEqual(1);
  });
  it('should add and remove element on mount/unmount', () => {
    const layer = new htmlLayer('html', {
      order: 1,
    });
    expect(elm.children.length).toEqual(0);
    layer.onMount({ elm });
    expect(elm.children.length).toEqual(1);
    layer.onUnmount();
    // run onmount/unmount several times to make sure element and its reference is properly handled
    expect(elm.children.length).toEqual(0);
    layer.onMount({ elm });
    expect(elm.children.length).toEqual(1);
    layer.onUnmount();
    expect(elm.children.length).toEqual(0);
  });
  it('should have default visibility true', () => {
    const layer = new htmlLayer('well');
    expect(layer.isVisible).toEqual(true);
  });
  it('should have interactive set to false and pointer-events:none by default', () => {
    const layer = new htmlLayer('well');
    layer.onMount({ elm });
    expect(layer.elm.style('pointer-events')).toEqual('none');
    expect(layer.interactive).toEqual(false);
  });
  it('should set pointer-events:auto when setting interactive to true', () => {
    const layer = new htmlLayer('well');
    layer.onMount({ elm });
    layer.interactive = true;
    expect(layer.elm.style('pointer-events')).toEqual('auto');
  });
  it('should update z-index when changing order', () => {
    const layer = new htmlLayer('well');
    layer.onMount({ elm });
    expect(layer.order).toEqual(1);
    expect(layer.elm.style('z-index')).toEqual('1');
    layer.order = 2;
    expect(layer.order).toEqual(2);
    expect(layer.elm.style('z-index')).toEqual('2');
  });
  it('should update opacity when changing its value', () => {
    const layer = new htmlLayer('well');
    layer.onMount({ elm });
    expect(layer.opacity).toEqual(1);
    expect(layer.elm.style('opacity')).toEqual('1');
    layer.opacity = 0.5;
    expect(layer.opacity).toEqual(0.5);
    expect(layer.elm.style('opacity')).toEqual('0.5');
  });
});
