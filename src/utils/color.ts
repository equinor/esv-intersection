import { color } from 'd3-color';

const RADIX_SIXTEEN = 16;
const HEX_STRING_LENGTH = 6;
/**
 * Convert color string to number
 */
export function convertColor(colorStr: string): number {
  const c = color(colorStr);
  if (c != null) {
    const d: string = c?.formatHex();
    const n: number = parseInt(d.replace('#', '0x'));
    return n;
  } else {
    throw Error(`Could not format string ${colorStr} to hex code.`);
  }
}

export function colorToCSSColor(color: number | string): string {
  if (typeof color === 'string') {
    return color;
  }

  const colorHexString = color.toString(RADIX_SIXTEEN);
  return `#${colorHexString.padStart(HEX_STRING_LENGTH, '0')}`;
}
