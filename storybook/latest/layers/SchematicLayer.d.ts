import { ScaleLinear } from 'd3-scale';
import { IPoint, Point, Texture } from 'pixi.js';
import { LayerOptions, PixiLayer, PixiRenderApplication } from '.';
import { CasingOptions, CementOptions, CementPlugOptions, CementSqueezeOptions, HoleOptions, SchematicData, ScreenOptions, TubingOptions, InternalLayerOptions, PerforationOptions, OutlineClosure } from './schematicInterfaces';
import { OnUpdateEvent, OnRescaleEvent, OnUnmountEvent } from '../interfaces';
interface ScalingFactors {
    height: number;
    zFactor: number;
    yScale: ScaleLinear<number, number, never>;
}
export interface SchematicLayerOptions<T extends SchematicData> extends LayerOptions<T> {
    exaggerationFactor?: number;
    internalLayerOptions?: InternalLayerOptions;
    holeOptions?: HoleOptions;
    casingOptions?: CasingOptions;
    cementOptions?: CementOptions;
    cementSqueezeOptions?: CementSqueezeOptions;
    screenOptions?: ScreenOptions;
    tubingOptions?: TubingOptions;
    cementPlugOptions?: CementPlugOptions;
    perforationOptions?: PerforationOptions;
}
export declare class SchematicLayer<T extends SchematicData> extends PixiLayer<T> {
    private internalLayerVisibility;
    private cementTextureCache;
    private cementSqueezeTextureCache;
    private cementPlugTextureCache;
    private holeTextureCache;
    private screenTextureCache;
    private tubingTextureCache;
    private textureSymbolCacheArray;
    protected scalingFactors: ScalingFactors;
    constructor(ctx: PixiRenderApplication, id?: string, options?: SchematicLayerOptions<T>);
    onUnmount(event?: OnUnmountEvent): void;
    onUpdate(event: OnUpdateEvent<T>): void;
    onRescale(event: OnRescaleEvent): void;
    setVisibility(isVisible: boolean, layerId: string): void;
    getInternalLayerIds(): string[];
    /**
     * Calculate yRatio without zFactor
     * TODO consider to move this into ZoomPanHandler
     */
    protected yRatio(): number;
    protected getZFactorScaledPathForPoints: (start: number, end: number) => Point[];
    protected drawBigPolygon: (coords: IPoint[], color?: number) => void;
    protected drawRope(path: Point[], texture: Texture, tint?: number): void;
    /**
     *
     * @param leftPath Points for line on left side
     * @param rightPath Points for line on right side
     * @param lineColor Color of line
     * @param lineWidth Width of line
     * @param outlineClosure If line should be drawn at top and/or bottom of the paths
     * @param lineAlignment alignment of the line to draw, (0 = inner, 0.5 = middle, 1 = outer).
     */
    protected drawOutline(leftPath: Point[], rightPath: Point[], lineColor: number, lineWidth?: number, outlineClosure?: OutlineClosure, lineAlignment?: number): void;
    /**
     * Uses a dashed outline on one side to represent casing window
     * The casing window should be visualized at the upper side of the wellbore path
     * @param leftPath Points for line on left side
     * @param pointPath Points for line on right side
     * @param lineColor Color of line
     * @param lineWidth Width of line
     * @param lineAlignment alignment of the line to draw, (0 = inner, 0.5 = middle, 1 = outer).
     */
    protected drawCasingWindowOutline(leftPath: Point[], rightPath: Point[], { lineColor, windowOptions }: CasingOptions, lineWidth?: number): void;
    private perforationRopeAndTextureReferences;
    preRender(): void;
    private updateSymbolCache;
    private drawCementPlug;
    private createCasingRenderObject;
    private getCementPlugTexture;
    private prepareSymbolRenderObject;
    private drawSymbolComponent;
    private drawSVGRope;
    private getSymbolTexture;
    private drawHoleSize;
    private drawHoleRope;
    private getHoleTexture;
    /**
     * The rendering order of these components needs to be aligned
     * @param casingRenderObjects
     * @param cementRenderObject
     * @param cementSqueezes
     * @returns ordered rendering list
     */
    private sortCementAndCasingRenderObjects;
    /**
     *
     * @param intervals
     * @param texture
     * optionally fetch the exaggerationFactor from a different options prop
     * options.perforationOptions for example
     * @param getExaggerationFactor
     * @returns
     */
    private drawComplexRope;
    private static getOutlineClosureType;
    private drawCasing;
    private createCasingTexture;
    private drawShoe;
    private generateShoe;
    private createCementSqueezeShape;
    private getCementTexture;
    private createPerforationShape;
    private getCementSqueezeTexture;
    private drawScreen;
    private drawTubing;
    private getTubingTexture;
    private getScreenTexture;
    private drawCompletionRope;
}
export {};
