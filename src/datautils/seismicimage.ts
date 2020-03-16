import { clamp } from '@equinor/videx-math';

import { createColorTable } from './colortable';

export function getSeismicInfo(seismic: any, trajectory: number[][]): any {
  const minX = trajectory.reduce((acc: number, val: number[]) => Math.min(acc, val[0]), 0);
  const maxX = trajectory.reduce((acc: number, val: number[]) => Math.max(acc, val[0]), 0);

  const minTvdMsl = seismic.yAxisValues && seismic.yAxisValues[0];
  const maxTvdMsl = seismic.yAxisValues && seismic.yAxisValues[seismic.yAxisValues.length - 1];

  // Find value domain
  const dp = seismic.datapoints || [];
  const min = -dp.reduce((val: number, array: number[]) => Math.min(...array, val), 0);
  const max = dp.reduce((val: number, array: number[]) => Math.max(...array, val), 0);

  const absMax = Math.max(Math.abs(min), Math.abs(max));

  const dmin = -absMax;
  const dmax = absMax;

  const info = {
    minX,
    maxX,
    minTvdMsl,
    maxTvdMsl,
    domain: {
      min: dmin,
      max: dmax,
      difference: dmax - dmin,
    },
  };

  return info;
}

export async function generateSeismicSliceImage(
  data: { datapoints: number[][]; yAxisValues: number[] },
  trajectory: number[][],
  colormap: string[],
): Promise<ImageBitmap> {
  const { datapoints: dp } = data;

  const min = dp.reduce((val: number, array: number[]) => Math.min(...array, val), 0);
  const max = dp.reduce((val: number, array: number[]) => Math.max(...array, val), 0);

  const absMax = Math.max(Math.abs(min), Math.abs(max));

  const dmin = -absMax;
  const dmax = absMax;

  const domain = {
    min: dmin,
    max: dmax,
    difference: dmax - dmin,
  };

  const isLeftToRight = false; //TODO: need to support this in the future

  const length = trajectory[0][0] - trajectory[trajectory.length - 1][0];
  const width = Math.floor(length / 5);
  const height = data.yAxisValues.length;

  // Generate color table
  const steps = 1000;
  const colorTable = createColorTable(colormap, steps);

  // Generate image
  const d = new Uint8ClampedArray(width * height * 4);

  let offset = 0;
  const colorFactor = (steps - 1) / domain.difference;

  let pos = isLeftToRight ? trajectory[0][0] : trajectory[trajectory.length - 1][0];

  const findIndexByPos = (cur: number[], i: number, array: number[][]): boolean => {
    let v1 = array[i + 1][0];
    let v2 = cur[0];
    if (v1 > v2) {
      [v1, v2] = [v2, v1];
    }
    return v1 <= pos && v2 >= pos;
  };

  const step = (length / width) * (isLeftToRight ? -1 : 1);

  let val1;
  let val2;
  let val;
  let i;
  let col: number[];
  const black = [0, 0, 0];
  let opacity;

  for (let x = 0; x < width; x++) {
    offset = x * 4;
    const index = trajectory.findIndex(findIndexByPos);
    const x1 = trajectory[index][0];
    const x2 = trajectory[index + 1][0];
    const span = x2 - x1;
    const dx = pos - x1;
    const ratio = dx / span;

    for (let y = 0; y < height; y++) {
      val1 = dp[y][index];
      val2 = dp[y][index + 1];
      if (val1 === null || val2 === null) {
        col = black;
        opacity = 0;
      } else {
        val = val1 * (1 - ratio) + val2 * ratio;
        i = (val - domain.min) * colorFactor;
        i = clamp(Math.floor(i), 0, steps - 1);
        col = colorTable[i];
        opacity = 255;
      }

      d.set([col[0], col[1], col[2], opacity], offset);

      offset += width * 4;
    }
    pos += step;
  }

  const imageData = new ImageData(d, width, height);
  const image = await createImageBitmap(imageData, 0, 0, width, height);

  return image;
}
