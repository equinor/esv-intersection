import { scaleLinear } from 'd3-scale';
import { color } from 'd3-color';

export function createColorTable(colorMap: string[], size: number): number[][] {
  const colorDomain = colorMap.map((v, i) => (i * size) / colorMap.length);
  const colorScale = scaleLinear<string>().domain(colorDomain).range(colorMap);

  const table = Array.from(new Array(size).keys()).map((i) => {
    const rgb = color(colorScale(i)).rgb();
    return [rgb.r, rgb.g, rgb.b];
  });

  return table;
}
