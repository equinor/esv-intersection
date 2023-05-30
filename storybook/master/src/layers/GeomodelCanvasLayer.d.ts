import { SurfaceData, SurfaceLine } from '../datautils';
import { OnUpdateEvent, OnRescaleEvent } from '../interfaces';
import { LayerOptions } from './base';
import { CanvasLayer } from './base/CanvasLayer';
type SurfacePaths = {
    color: string;
    path: Path2D;
};
export declare class GeomodelCanvasLayer<T extends SurfaceData> extends CanvasLayer<T> {
    rescaleEvent: OnRescaleEvent;
    surfaceAreasPaths: SurfacePaths[];
    surfaceLinesPaths: SurfacePaths[];
    maxDepth: number;
    constructor(id?: string, options?: LayerOptions<T>);
    onUpdate(event: OnUpdateEvent<T>): void;
    onRescale(event: OnRescaleEvent): void;
    updatePaths(): void;
    render(): void;
    colorToCSSColor(color: number | string): string;
    generateSurfaceAreasPaths(): void;
    generateSurfaceLinesPaths(): void;
    drawPolygonPath: (color: string, path: Path2D) => void;
    drawLinePath: (color: string, path: Path2D) => void;
    createPolygons: (data: number[][]) => number[][];
    generatePolygonPath: (polygon: number[]) => Path2D;
    generateLinePaths: (s: SurfaceLine) => Path2D[];
}
export {};
//# sourceMappingURL=GeomodelCanvasLayer.d.ts.map