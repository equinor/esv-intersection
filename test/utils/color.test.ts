/* eslint-disable no-magic-numbers */
import { convertColor, colorToCSSColor } from '../../src/utils/color';

describe('color', () => {
  describe('convertColor', () => {
    it('should css color string', () => {
      const convertedColor = convertColor('#c7b9ab');
      expect(convertedColor).toEqual(13089195);
    });

    it('should convert black css name alias', () => {
      const convertedColor = convertColor('black');
      expect(convertedColor).toEqual(0);
    });

    it('should convert white css name alias', () => {
      const convertedColor = convertColor('white');
      expect(convertedColor).toEqual(16777215);
    });
  });

  describe('colorToCSSColor', () => {
    it('should css color string', () => {
      const convertedColor = colorToCSSColor(13089195);
      expect(convertedColor).toEqual('#c7b9ab');
    });

    it('should convert black css name alias', () => {
      const convertedColor = colorToCSSColor(0);
      expect(convertedColor).toEqual('#000000');
    });

    it('should convert white css name alias', () => {
      const convertedColor = colorToCSSColor(16777215);
      expect(convertedColor).toEqual('#ffffff');
    });
  });
});
