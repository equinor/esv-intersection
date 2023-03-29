import { SeismicCanvasDataOptions } from '../layers/SeismicCanvasLayer';
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
export declare const getSeismicOptions: (info: SeismicInfo | null) => SeismicCanvasDataOptions;
/**
 * Get key information about the seismic data
 * Code originally developed for the REP project
 * @param data Seismic data
 * @param trajectory Wellbore or freehand trajectory
 * @return  Key domain and depth information for seismic data
 */
export declare function getSeismicInfo(data: {
    datapoints: number[][];
    yAxisValues: number[];
}, trajectory: number[][]): SeismicInfo | null;
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
export declare function generateSeismicSliceImage(data: {
    datapoints: number[][];
    yAxisValues: number[];
}, trajectory: number[][], colormap: string[], options?: {
    isLeftToRight: true;
    seismicRange?: number;
    seismicMin?: number;
    seismicMax?: number;
}): Promise<ImageBitmap>;
