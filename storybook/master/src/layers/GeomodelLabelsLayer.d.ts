import Vector2 from '@equinor/videx-vector2';
import { CanvasLayer } from './base/CanvasLayer';
import { OnUpdateEvent, OnRescaleEvent, OnMountEvent } from '../interfaces';
import { SurfaceArea, SurfaceLine, SurfaceData } from '../datautils';
import { LayerOptions } from './base/Layer';
export interface GeomodelLayerLabelsOptions<T extends SurfaceData> extends LayerOptions<T> {
    margins?: number;
    minFontSize?: number;
    maxFontSize?: number;
    textColor?: string;
    font?: string;
}
interface SurfaceAreaWithAvgTopDepth extends SurfaceArea {
    avgTopDepth: number;
}
export declare class GeomodelLabelsLayer<T extends SurfaceData> extends CanvasLayer<T> {
    defaultMargins: number;
    defaultMinFontSize: number;
    defaultMaxFontSize: number;
    defaultTextColor: string;
    defaultFont: string;
    rescaleEvent: OnRescaleEvent | undefined;
    isLabelsOnLeftSide: boolean;
    maxFontSizeInWorldCoordinates: number;
    isXFlipped: boolean;
    areasWithAvgTopDepth: SurfaceAreaWithAvgTopDepth[];
    constructor(id?: string, options?: GeomodelLayerLabelsOptions<T>);
    get options(): GeomodelLayerLabelsOptions<T>;
    setData(data: T): void;
    generateSurfacesWithAvgDepth(): void;
    onMount(event: OnMountEvent): void;
    onUpdate(event: OnUpdateEvent<T>): void;
    onRescale(event: OnRescaleEvent): void;
    render(): void;
    drawAreaLabels(): void;
    drawLineLabels(): void;
    drawAreaLabel: (surfaceArea: SurfaceArea, nextSurfaceArea: SurfaceArea | null, surfaces: SurfaceArea[], i: number) => void;
    drawLineLabel: (s: SurfaceLine) => void;
    colorToCSSColor(color: number | string): string;
    calcPos(data: number[][], offset: number, count: number, step: number, topLimit?: number, bottomLimit?: number, alternativeSurfaceData?: number[][], surfaces?: SurfaceArea[] | null, currentSurfaceIndex?: number): Vector2 | null;
    getAlternativeYValueIfAvailable(x: number, topLimit?: number, bottomLimit?: number, alternativeSurfaceData?: number[][], surfaces?: SurfaceArea[] | null, currentSurfaceIndex?: number): number | null;
    calcLineDir(data: number[][], offset: number, count: number, step: number, zFactor: number, initalVector?: Vector2, topLimit?: number, bottomLimit?: number): Vector2;
    calcAreaDir(top: number[][], bottom: number[][], offset: number, count: number, step: number, initalVector: Vector2 | undefined, topLimit: number, bottomLimit: number, minReductionAngle: number | undefined, maxReductionAngle: number | undefined, angleReductionExponent: number | undefined, alternativeSurfaceBottomData: number[][], surfaces: SurfaceArea[] | null | undefined, currentSurfaceIndex: number): number;
    updateXFlipped(): void;
    getMarginsInWorldCoordinates(): number;
    getSurfacesAreaEdges(): number[];
    checkDrawLabelsOnLeftSide(): boolean;
}
export {};
//# sourceMappingURL=GeomodelLabelsLayer.d.ts.map