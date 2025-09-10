import { describe, expect, it } from 'vitest';
import { convertColor, colorToCSSColor } from '../../src/utils/color';

describe('color', () => {
  describe('convertColor', () => {
    it('should convert long form css color string to number', () => {
      const convertedColor = convertColor('#c7b9ab');
      expect(convertedColor).toEqual(0xc7b9ab);
    });

    it('should convert short hand css color to number', () => {
      const convertedColor = convertColor('#abc');
      expect(convertedColor).toEqual(0xaabbcc);
    });

    it('should convert black css name alias', () => {
      const convertedColor = convertColor('black');
      expect(convertedColor).toEqual(0x0);
    });

    it('should convert white css name alias', () => {
      const convertedColor = convertColor('white');
      expect(convertedColor).toEqual(0xffffff);
    });

    it('should convert rgb() color', () => {
      const convertedColor = convertColor('rgb(139, 69, 19)');
      expect(convertedColor).toEqual(0x8b4513);
    });
  });

  describe('colorToCSSColor', () => {
    it('should convert to css color string', () => {
      const convertedColor = colorToCSSColor(0xc7b9ab);
      expect(convertedColor).toEqual('#c7b9ab');
    });

    it('should convert to black hex string', () => {
      const convertedColor = colorToCSSColor(0x0);
      expect(convertedColor).toEqual('#000000');
    });

    it('should convert to white hex string', () => {
      const convertedColor = colorToCSSColor(0xffffff);
      expect(convertedColor).toEqual('#ffffff');
    });

    it('should pad short hex number to hex string', () => {
      const convertedColor = colorToCSSColor(0xfff);
      expect(convertedColor).toEqual('#000fff');
    });
  });

  it('should convert colors back and forth', () => {
    const number = 12345678;
    const cssColor = colorToCSSColor(number);
    expect(convertColor(cssColor)).toEqual(number);
  });
});
