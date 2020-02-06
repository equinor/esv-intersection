import {
  GridLayer,
} from '../src/index';

describe('Layer', () => {
  describe('Grid', () => {
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
