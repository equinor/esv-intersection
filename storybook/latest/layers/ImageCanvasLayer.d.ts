import { CanvasLayer } from './base/CanvasLayer';
import { OnUpdateEvent, OnMountEvent, OnRescaleEvent } from '../interfaces';
import { ScaleLinear } from 'd3-scale';
export interface OnImageLayerUpdateEvent<T> extends OnUpdateEvent<T> {
    url: string;
    xScale: ScaleLinear<number, number, never>;
    yScale: ScaleLinear<number, number, never>;
    xRatio?: number;
    yRatio?: number;
    x?: number;
    y?: number;
}
export type OnImageLayerRescaleEvent<T> = OnImageLayerUpdateEvent<T> & OnRescaleEvent;
export declare class ImageLayer<T> extends CanvasLayer<T> {
    img: HTMLImageElement;
    onMount(event: OnMountEvent): void;
    onUpdate(event: OnImageLayerUpdateEvent<T>): void;
    onRescale(event: OnImageLayerRescaleEvent<T>): void;
    render(event: OnImageLayerUpdateEvent<T>): void;
}
