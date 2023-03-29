import { CanvasLayer, LayerOptions } from './base';
import { OnUpdateEvent, OnRescaleEvent, OnMountEvent } from '../interfaces';
import { ScaleLinear } from 'd3-scale';
export type ReferenceLineType = 'wavy' | 'dashed' | 'solid';
export type ReferenceLine = {
    text?: string;
    lineType: ReferenceLineType;
    color: string;
    depth: number;
    lineWidth?: number;
    textColor?: string;
    fontSize?: string;
};
export interface ReferenceLineLayerOptions extends LayerOptions<ReferenceLine[]> {
}
export declare class ReferenceLineLayer extends CanvasLayer<ReferenceLine[]> {
    yScale: ScaleLinear<number, number, never> | null;
    xScale: ScaleLinear<number, number, never> | null;
    onMount(event: OnMountEvent): void;
    onUpdate(event: OnUpdateEvent<ReferenceLine[]>): void;
    onRescale(event: OnRescaleEvent): void;
    private drawDashed;
    private drawSolid;
    private drawWavy;
    private drawText;
    private setCtxLineStyle;
    private setCtxLineWidth;
    private render;
}
