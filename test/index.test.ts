import { GridLayer, WellborepathLayer } from '../src/index';

const wellborePath = [0, 0, 0, 12, 4, 12];

describe('Layer', () => {
  let elm: HTMLElement;
  beforeEach(() => {
    elm = document.createElement('div');
  });
  afterEach(() => {
    elm.remove();
  });
  describe('SVG', () => {
    it('should instantiate a layer without needing to supply any input', () => {
      const layer = new WellborepathLayer();
      expect(layer.id).toBeTruthy();
    });
    it('should set and remove data on demand', () => {
      const layer = new WellborepathLayer();
      layer.setData(wellborePath);
      expect(layer.data).toBeTruthy();
      layer.clearData();
      expect(layer.data).toBeFalsy();
    });
    it('should not remount new elements on same layer', () => {
      const layer = new WellborepathLayer('well', {
        order: 1,
        stroke: 'black',
        strokeWidth: '1',
      });
      layer.onMount({ elm });
      layer.onMount({ elm });
      expect(elm.children.length).toEqual(1);
    });
    it('should add and remove element on mount/unmount', () => {
      const layer = new WellborepathLayer('well', {
        order: 1,
        stroke: 'black',
        strokeWidth: '1',
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
  });
  describe('Canvas', () => {
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
});
