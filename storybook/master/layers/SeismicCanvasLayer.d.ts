import { CanvasLayer } from './base/CanvasLayer';
import { OnUpdateEvent, OnMountEvent, OnRescaleEvent } from '../interfaces';
export declare type SeismicCanvasDataOptions = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare type SeismicCanvasData = {
    image: CanvasImageSource | OffscreenCanvas;
    options: SeismicCanvasDataOptions;
};
export declare class SeismicCanvasLayer extends CanvasLayer<SeismicCanvasData> {
    onMount(event: OnMountEvent): void;
    onUpdate(event: OnUpdateEvent<SeismicCanvasData>): void;
    onRescale(event: OnRescaleEvent): void;
    render(): void;
}
