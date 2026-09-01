import { SVGLayer } from './base/SVGLayer';
import { OnUpdateEvent, OnRescaleEvent } from '../interfaces';
import { LayerOptions } from '..';
export interface WellborepathLayerOptions<T extends [number, number][]> extends LayerOptions<T> {
    stroke: string;
    strokeWidth: string;
    curveType?: string;
    tension?: number;
    /**
     * Index in `data` where the extrapolated portion begins. When set, points
     * from this index onward are rendered as a separate path so they can be
     * styled differently. Ignored if <= 0 or >= data.length.
     */
    extrapolationStartIndex?: number;
    extrapolatedStroke?: string;
    extrapolatedStrokeWidth?: string;
    extrapolatedOpacity?: number;
    extrapolatedStrokeDasharray?: string;
}
export declare class WellborepathLayer<T extends [number, number][]> extends SVGLayer<T> {
    rescaleEvent: OnRescaleEvent | undefined;
    constructor(id?: string, options?: WellborepathLayerOptions<T>);
    onUpdate(event: OnUpdateEvent<T>): void;
    onRescale(event: OnRescaleEvent): void;
    render(): void;
    private renderWellborePath;
    private getCurveFactory;
}
//# sourceMappingURL=WellborePathLayer.d.ts.map