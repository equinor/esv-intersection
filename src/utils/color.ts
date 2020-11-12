import { color, Color } from 'd3-color';

/**
 * Convert color string to number
 */
export function convertColor(colorStr: string): number {
  const c: Color = color(colorStr);
  const d: string = c.hex();
  const n: number = parseInt(d.replace('#', '0x'));
  return n;
}

export function colorToCSSColor(color: number | string): string {
  if (typeof color === 'string') {
    return color;
  }

  let hexString = color.toString(16);
  hexString = '000000'.substr(0, 6 - hexString.length) + hexString;
  return `#${hexString}`;
}
