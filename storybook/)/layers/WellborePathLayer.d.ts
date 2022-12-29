import { SVGLayer } from './base/SVGLayer';
import { OnUpdateEvent, OnRescaleEvent } from '../interfaces';
import { LayerOptions } from '..';
export interface WellborepathLayerOptions<T extends [number, number][]> extends LayerOptions<T> {
    stroke: string;
    strokeWidth: string;
    curveType?: string;
    tension?: number;
}
export declare class WellborepathLayer<T extends [number, number][]> extends SVGLayer<T> {
    rescaleEvent: OnRescaleEvent;
    constructor(id?: string, options?: WellborepathLayerOptions<T>);
    onUpdate(event: OnUpdateEvent<T>): void;
    onRescale(event: OnRescaleEvent): void;
    render(): void;
    private renderWellborePath;
}
