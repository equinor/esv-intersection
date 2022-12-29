import { StratUnit, SurfaceMetaAndValues, SurfaceData } from './interfaces';
/**
 * Generate surface data from trajectory, stratcolum and surface data
 * Code originally developed for the REP project
 * @param trajectory Projected trajectory generated from the poslog used when retrieving surface data from surface API
 * @param stratColumn Strat columnd from SMDA
 * @param surfaceData - Surfaces meta data with surface values in data section
 * @return  Surface areas ready for rendering in geolayer
 */
export declare function generateSurfaceData(trajectory: number[][], stratColumn: StratUnit[], surfaceData: SurfaceMetaAndValues[]): SurfaceData;
