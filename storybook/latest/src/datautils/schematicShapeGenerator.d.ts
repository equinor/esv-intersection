import { IPoint, Point, Texture } from 'pixi.js';
import { Casing, Cement, CementOptions, CementPlug, CementPlugOptions, CementSqueeze, CementSqueezeOptions, Completion, HoleOptions, HoleSize, ScreenOptions, TubingOptions, Perforation, PerforationOptions, PerforationSubKind } from '../layers/schematicInterfaces';
import { ComplexRopeSegment } from '../layers/CustomDisplayObjects/ComplexRope';
export type PerforationShape = ComplexRopeSegment;
export interface TubularRenderingObject {
    leftPath: Point[];
    rightPath: Point[];
}
export interface CasingRenderObject {
    id: string;
    kind: 'casing';
    referenceDiameter: number;
    referenceRadius: number;
    casingWallWidth: number;
    hasShoe: boolean;
    bottom: number;
    zIndex?: number;
    sections: {
        kind: 'casing' | 'casing-window';
        leftPath: Point[];
        rightPath: Point[];
        pathPoints: Point[];
    }[];
}
export declare const getEndLines: (rightPath: [IPoint, IPoint, ...IPoint[]], leftPath: [IPoint, IPoint, ...IPoint[]]) => {
    top: [IPoint, IPoint];
    bottom: [IPoint, IPoint];
};
export declare const overlaps: (top1: number, bottom1: number, top2: number, bottom2: number) => boolean;
export declare const strictlyOverlaps: (top1: number, bottom1: number, top2: number, bottom2: number) => boolean;
export declare const uniq: <T>(arr: T[]) => T[];
export declare const getUniqueDiameterChangeDepths: ([intervalStart, intervalEnd]: [number, number], diameterIntervals: {
    start: number;
    end: number;
}[]) => number[];
export declare const findCementOuterDiameterAtDepth: (attachedStrings: (Casing | Completion)[], nonAttachedStrings: (Casing | Completion)[], holes: HoleSize[], depth: number) => number;
export declare const findPerforationOuterDiameterAtDepth: (nonAttachedStrings: (Casing | Completion)[], holes: HoleSize[], depth: number, perforationSubKind: PerforationSubKind) => number;
export declare const findCementPlugInnerDiameterAtDepth: (attachedStrings: (Casing | Completion)[], nonAttachedStrings: (Casing | Completion)[], holes: HoleSize[], depth: number) => number;
export declare const createComplexRopeSegmentsForCement: (cement: Cement, casings: Casing[], completion: Completion[], holes: HoleSize[], exaggerationFactor: number, getPoints: (start: number, end: number) => Point[]) => ComplexRopeSegment[];
export declare const createComplexRopeSegmentsForCementSqueeze: (squeeze: CementSqueeze, casings: Casing[], completion: Completion[], holes: HoleSize[], exaggerationFactor: number, getPoints: (start: number, end: number) => Point[]) => ComplexRopeSegment[];
export declare const createComplexRopeSegmentsForCementPlug: (plug: CementPlug, casings: Casing[], completion: Completion[], holes: HoleSize[], exaggerationFactor: number, getPoints: (start: number, end: number) => Point[]) => ComplexRopeSegment[];
export declare const createHoleBaseTexture: ({ firstColor, secondColor }: HoleOptions, width: number, height: number) => Texture;
export declare const createScreenTexture: ({ scalingFactor }: ScreenOptions) => Texture;
export declare const createTubingTexture: ({ innerColor, outerColor, scalingFactor }: TubingOptions) => Texture;
export declare const createCementTexture: ({ firstColor, secondColor, scalingFactor }: CementOptions) => Texture;
export declare const createCementPlugTexture: ({ firstColor, secondColor, scalingFactor }: CementPlugOptions) => Texture;
export declare const createCementSqueezeTexture: ({ firstColor, secondColor, scalingFactor }: CementSqueezeOptions) => Texture;
export declare const createTubularRenderingObject: (radius: number, pathPoints: IPoint[]) => TubularRenderingObject;
export type CasingInterval = {
    kind: 'casing' | 'casing-window';
    start: number;
    end: number;
};
export declare const getCasingIntervalsWithWindows: (casing: Casing) => CasingInterval[];
export declare const prepareCasingRenderObject: (exaggerationFactor: number, casing: Casing, getPathPoints: (start: number, end: number) => Point[]) => CasingRenderObject;
export declare const createComplexRopeSegmentsForPerforation: (perforation: Perforation, casings: Casing[], holes: HoleSize[], exaggerationFactor: number, getPoints: (start: number, end: number) => Point[]) => ComplexRopeSegment[];
export declare const createPerforationPackingTexture: (perforation: Perforation, perfShape: ComplexRopeSegment, perforationOptions: PerforationOptions) => Texture;
export declare const createPerforationFracLineTexture: (perforation: Perforation, perfShape: ComplexRopeSegment, perforationOptions: PerforationOptions) => Texture;
export declare const createPerforationSpikeTexture: (perforation: Perforation, otherPerforations: Perforation[], perfShape: ComplexRopeSegment, perforationOptions: PerforationOptions) => Texture;
//# sourceMappingURL=schematicShapeGenerator.d.ts.map