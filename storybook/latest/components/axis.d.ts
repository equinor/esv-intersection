import { ScaleLinear } from 'd3-scale';
import { OnResizeEvent, OnRescaleEvent } from '../interfaces';
export type Options = {
    offsetX: number;
    offsetY: number;
    visible: boolean;
};
export declare class Axis {
    private mainGroup;
    private _scaleX;
    private _scaleY;
    private _showLabels;
    private _labelXDesc;
    private _labelYDesc;
    private _unitOfMeasure;
    private _offsetX;
    private _offsetY;
    private _flipX;
    private _flipY;
    private visible;
    constructor(mainGroup: Axis['mainGroup'], showLabels: boolean | undefined, labelXDesc: string, labelYDesc: string, unitOfMeasure: string, options?: Options);
    private renderLabelx;
    private renderLabely;
    private renderGy;
    private renderGx;
    private createOrGet;
    render(): void;
    onResize(event: OnResizeEvent): void;
    onRescale(event: OnRescaleEvent): void;
    show(): Axis;
    hide(): Axis;
    flipX(flipX: boolean): Axis;
    flipY(flipY: boolean): Axis;
    showLabels(): Axis;
    hideLabels(): Axis;
    setLabelX(label: string): Axis;
    setLabelY(label: string): Axis;
    setUnitOfMeasure(uom: string): Axis;
    setLabels(labelX: string, labelY: string, unitOfMeasure: string): Axis;
    get offsetX(): number;
    set offsetX(offset: number);
    get offsetY(): number;
    set offsetY(offset: number);
    get scaleX(): ScaleLinear<number, number>;
    get scaleY(): ScaleLinear<number, number>;
}
//# sourceMappingURL=axis.d.ts.map