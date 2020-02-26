import { clamp } from '@equinor/videx-math';

export const pixelsPerUnit = (x: any) => {
  const [min] = x.domain();
  return Math.abs(x(min + 1));
};

export const calcTextSize = (factor: any, min: any, max: any, x: any) => {
  return clamp(pixelsPerUnit(x) * factor, min, max);
};
