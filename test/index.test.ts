/* eslint-disable no-undef */
import {
  GridLayer,
} from '../src/index';

describe('Layer', () => {
  describe('Grid', () => {
    it('should have a default opacity of 1 if no option is set', () => {
      const layer = new GridLayer('grid');
      expect(layer._opacity).toEqual(1);
    });
  });
});
