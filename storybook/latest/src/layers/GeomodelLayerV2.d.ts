import { PixiLayer } from './base/PixiLayer';
import { OnUpdateEvent, OnRescaleEvent } from '../interfaces';
import { SurfaceArea, SurfaceData, SurfaceLine } from '../datautils';
export declare class GeomodelLayerV2<T extends SurfaceData> extends PixiLayer<T> {
    private isPreRendered;
    onRescale(event: OnRescaleEvent): void;
    onUpdate(event: OnUpdateEvent<T>): void;
    preRender(): void;
    createPolygons: (data: number[][]) => number[][];
    generateAreaPolygon: (s: SurfaceArea) => void;
    generateSurfaceLine: (s: SurfaceLine) => void;
}
//# sourceMappingURL=GeomodelLayerV2.d.ts.map