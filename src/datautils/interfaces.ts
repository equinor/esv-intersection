/**
 * Survey data from SDMA
 */
export interface SurveySample {
  md: number;
  tvd: number;
  easting: number;
  northing: number;
}

/**
 * Strat unit element as retrieved from SDMA
 */
export interface StratUnit {
  [propType: string]: any;
}

/**
 * Surfaces meta data as received from surface API with surface values injected
 */
export interface SurfaceMetaAndValues {
  [propType: string]: any;
  data: {
    values: number[];
  };
  visualSettings: {
    displayName: string;
    crossSection: string;
    colors: {
      crossSection: string;
    };
  };
}

/**
 * Surfaces lines ready for drawing by geomodel layer
 */
export interface SurfaceLine {
  id?: string;
  label: string;
  color: number | string; // Color is passed to pixi.js and accepts both CSS color strings and hex color value
  data: number[][];
}

/**
 * Surfaces areas ready for drawing by geomodel layer
 */
export interface SurfaceArea {
  id?: string;
  label: string;
  color: number | string; // Color is passed to pixi.js and accepts both CSS color strings and hex color value
  data: number[][];
  exclude?: boolean;
}

/**
 * Surfaces lines and areas ready for drawing by geomodel layer
 */
export interface SurfaceData {
  lines: SurfaceLine[];
  areas: SurfaceArea[];
}
