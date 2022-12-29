import { CanvasLayer } from './base/CanvasLayer';
import { OnUpdateEvent, OnRescaleEvent } from '../interfaces';
import { ScaleLinear } from 'd3-scale';
import { LayerOptions } from './base/Layer';
export interface GridLayerOptions<T> extends LayerOptions<T> {
    majorWidth?: number;
    majorColor?: string;
    minorWidth?: number;
    minorColor?: string;
}
export interface OnGridLayerUpdateEvent<T> extends OnUpdateEvent<T> {
    xScale?: ScaleLinear<number, number, never>;
    yScale?: ScaleLinear<number, number, never>;
}
export declare class GridLayer<T> extends CanvasLayer<T> {
    private _offsetX;
    private _offsetY;
    constructor(id?: string, options?: GridLayerOptions<T>);
    onUpdate(event: OnGridLayerUpdateEvent<T>): void;
    onRescale(event: OnRescaleEvent): void;
    render(event: OnRescaleEvent | OnGridLayerUpdateEvent<T>): void;
    private renderTicksX;
    private renderTicksY;
    private mapMinorTicks;
    get offsetX(): number;
    set offsetX(offset: number);
    get offsetY(): number;
    set offsetY(offset: number);
}
