import { clamp } from '@equinor/videx-math';
import { SeismicCanvasDataOptions } from '../layers/SeismicCanvasLayer';

import { createColorTable } from './colortable';
import { findIndexOfSample } from './findsample';

export type SeismicInfo = {
  minX: number;
  maxX: number;
  minTvdMsl: number;
  maxTvdMsl: number;
  domain: {
    min: number;
    max: number;
    difference: number;
  };
};

export const getSeismicOptions = (
  info: SeismicInfo | null,
): SeismicCanvasDataOptions => {
  if (!info) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }
  return {
    x: info.minX,
    y: info.minTvdMsl,
    width: info.maxX - info.minX,
    height: info.maxTvdMsl - info.minTvdMsl,
  };
};

/**
 * Get key information about the seismic data
 * Code originally developed for the REP project
 * @param data Seismic data
 * @param trajectory Wellbore or freehand trajectory
 * @return  Key domain and depth information for seismic data
 */
export function getSeismicInfo(
  data: { datapoints: number[][]; yAxisValues: number[] },
  trajectory: number[][],
): SeismicInfo | null {
  if (!(data && data.datapoints)) {
    return null;
  }
  const minX = trajectory.reduce(
    (acc: number, val: number[]) => Math.min(acc, val[0]!),
    0,
  );
  const maxX = trajectory.reduce(
    (acc: number, val: number[]) => Math.max(acc, val[0]!),
    0,
  );

  const minTvdMsl = data.yAxisValues && data.yAxisValues[0]!;
  const maxTvdMsl =
    data.yAxisValues && data.yAxisValues[data.yAxisValues.length - 1]!;

  // Find value domain
  const dp = data.datapoints || [];
  const min = -dp.reduce(
    (val: number, array: number[]) => Math.min(...array, val),
    0,
  );
  const max = dp.reduce(
    (val: number, array: number[]) => Math.max(...array, val),
    0,
  );

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

/**
 * Generate seismic
 * Code originally developed for the REP project
 * @param data Seismic data
 * @param trajectory Wellbore or freehand trajectory
 * @param colormap Color map for rendering
 * @param options.isLeftToRight (optional) draw left to right
 * @param options.seismicRange (optional) Range for mapping seimic values to color map
 * @param options.seismicMin (optional) Min seismic value for mapping seimic values to color map
 * @param options.seismicMax (optional) Max seismic value for mapping seimic values to color map
 * @return  Key domain and depth information for seismic data
 */
export async function generateSeismicSliceImage(
  data: { datapoints: number[][]; yAxisValues: number[] },
  trajectory: number[][],
  colormap: string[],
  options: {
    isLeftToRight: boolean;
    seismicRange?: number;
    seismicMin?: number;
    seismicMax?: number;
    seismicScale?: number;
  } = { isLeftToRight: true },
): Promise<ImageBitmap | undefined> {
  if (!(data && data.datapoints && data.datapoints.length > 0)) {
    return undefined;
  }
  const { datapoints: dp } = data;

  const min =
    options?.seismicMin ||
    options?.seismicRange ||
    dp.reduce((val: number, array: number[]) => Math.min(...array, val), 0);
  const max =
    options?.seismicMax ||
    options?.seismicRange ||
    dp.reduce((val: number, array: number[]) => Math.max(...array, val), 0);

  const absMax = Math.max(Math.abs(min), Math.abs(max));

  const dmin = -absMax;
  const dmax = absMax;

  const domain = {
    min: dmin,
    max: dmax,
    difference: dmax - dmin,
  };

  const scaleValue = Math.max(1, options?.seismicScale ?? 1);

  const length = trajectory[0]?.[0]! - trajectory[trajectory.length - 1]?.[0]!;
  const baseWidth = Math.abs(Math.floor(length / 5));
  const baseHeight = data.yAxisValues.length;
  const width = Math.max(1, baseWidth * scaleValue);
  const height = Math.max(1, baseHeight * scaleValue);

  // Generate color table
  const colorTableSize = 1000;
  const colorTable = createColorTable(colormap, colorTableSize);

  // Generate image
  const d = new Uint8ClampedArray(width * height * 4);

  const colorFactor = (colorTableSize - 1) / domain.difference;

  const startPos = options?.isLeftToRight
    ? trajectory[0]?.[0]!
    : trajectory[trajectory.length - 1]?.[0]!;

  const step = (length / width) * (options?.isLeftToRight ? -1 : 1);

  // Map output rows to fractional indices into the source yAxisValues rows.
  const yScale = baseHeight > 1 ? (baseHeight - 1) / (height - 1 || 1) : 0;

  const black = [0, 0, 0];

  let pos = startPos;

  for (let x = 0; x < width; x++) {
    const index = findIndexOfSample(trajectory, pos);
    const x1 = trajectory[index]?.[0];
    const x2 = trajectory[index + 1]?.[0];
    const validColumn = index >= 0 && x1 != null && x2 != null && x2 - x1 !== 0;
    const ratioX = validColumn ? (pos - x1!) / (x2! - x1!) : 0;

    let offset = x * 4;

    for (let y = 0; y < height; y++) {
      let col: number[] = black;
      let opacity = 0;

      if (validColumn) {
        const fy = y * yScale;
        const y0 = Math.floor(fy);
        const y1 = Math.min(y0 + 1, baseHeight - 1);
        const ratioY = fy - y0;

        const v00 = dp[y0]?.[index];
        const v01 = dp[y0]?.[index + 1];
        const v10 = dp[y1]?.[index];
        const v11 = dp[y1]?.[index + 1];

        if (v00 != null && v01 != null && v10 != null && v11 != null) {
          // Bilinear interpolation on data values (not on colours).
          const top = v00 * (1 - ratioX) + v01 * ratioX;
          const bottom = v10 * (1 - ratioX) + v11 * ratioX;
          const val = top * (1 - ratioY) + bottom * ratioY;

          const i = clamp(
            ~~((val - domain.min) * colorFactor),
            0,
            colorTableSize - 1,
          );
          col = colorTable[i]!;
          opacity = 255;
        }
      }

      d.set([col[0]!, col[1]!, col[2]!, opacity], offset);

      offset += width * 4;
    }
    pos += step;
  }
  const imageData = new ImageData(d, width, height);
  const image = await createImageBitmap(imageData, 0, 0, width, height);

  return image;
}
