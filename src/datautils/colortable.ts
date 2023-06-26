import { scaleLinear } from 'd3-scale';
import { color } from 'd3-color';

export function createColorTable(colorMap: string[], size: number): [number, number, number][] {
  const colorDomain = colorMap.map((_v, i) => (i * size) / colorMap.length);
  const colorScale = scaleLinear<string>().domain(colorDomain).range(colorMap);

  const table = Array.from(new Array(size).keys()).map<[number, number, number]>((i) => {
    const rgb = color(colorScale(i))?.rgb();
    return rgb != null ? [rgb.r, rgb.g, rgb.b] : [0, 0, 0];
  });

  return table;
}
