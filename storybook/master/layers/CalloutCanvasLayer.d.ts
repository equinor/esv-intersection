import { ScaleLinear } from 'd3-scale';
import { CanvasLayer } from './base/CanvasLayer';
import { OnUpdateEvent, Annotation, OnRescaleEvent, BoundingBox } from '../interfaces';
import { LayerOptions } from './base/Layer';
export type Point = {
    x: number;
    y: number;
};
export type Callout = {
    title: string;
    label: string;
    color: string;
    pos: Point;
    group: string;
    alignment: string;
    boundingBox: BoundingBox;
    dx: number;
    dy: number;
};
export interface CalloutOptions<T extends Annotation[]> extends LayerOptions<T> {
    minFontSize?: number;
    maxFontSize?: number;
    fontSizeFactor?: number;
    offsetMin?: number;
    offsetMax?: number;
    offsetFactor?: number;
    fontColor?: string;
    backgroundColor?: string;
    backgroundPadding?: number;
    backgroundBorderRadius?: number;
}
export declare class CalloutCanvasLayer<T extends Annotation[]> extends CanvasLayer<T> {
    rescaleEvent: OnRescaleEvent | undefined;
    xRatio: number | undefined;
    callouts: Callout[];
    groupFilter: string[];
    minFontSize: number;
    maxFontSize: number;
    fontSizeFactor: number;
    offsetMin: number;
    offsetMax: number;
    offsetFactor: number;
    fontColor: string | undefined;
    backgroundActive: boolean;
    backgroundColor: string;
    backgroundPadding: number;
    backgroundBorderRadius: number;
    constructor(id?: string, options?: CalloutOptions<T>);
    setGroupFilter(filter: string[]): void;
    onUpdate(event: OnUpdateEvent<T>): void;
    onRescale(event: OnRescaleEvent): void;
    render(isPanning?: boolean): void;
    private renderBackground;
    private renderAnnotation;
    private renderText;
    private measureTextWidth;
    private renderPoint;
    private renderCallout;
    private renderLine;
    private getPosition;
    positionCallouts(annotations: Annotation[], isLeftToRight: boolean, xScale: ScaleLinear<number, number>, yScale: ScaleLinear<number, number>, _scale: number, fontSize: number, offset?: number): Callout[];
    getAnnotationBoundingBox(title: string, label: string, pos: number[], xScale: ScaleLinear<number, number>, yScale: ScaleLinear<number, number>, height: number): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    chooseTopOrBottomPosition(nodes: Callout[], bottom: Callout[], top: Callout[]): void;
    adjustTopPositions(top: Callout[]): void;
    adjustBottomPositions(bottom: Callout[]): void;
}
//# sourceMappingURL=CalloutCanvasLayer.d.ts.map