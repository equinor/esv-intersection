export declare function assertNever(x: never): never;
/**
 * The closure type of the outline
 */
export type OutlineClosure = 'None' | 'TopAndBottom' | 'Top' | 'Bottom';
export interface HoleSize {
    kind: 'hole';
    id: string;
    diameter: number;
    start: number;
    end: number;
}
export interface CasingWindow {
    id: string;
    start: number;
    end: number;
}
export interface Casing {
    kind: 'casing';
    id: string;
    diameter: number;
    start: number;
    end: number;
    hasShoe: boolean;
    innerDiameter: number;
    windows?: CasingWindow[];
}
interface SymbolComponent {
    id: string;
    diameter: number;
    start: number;
    end: number;
    symbolKey: string;
}
export interface PAndASymbol extends SymbolComponent {
    kind: 'pAndASymbol';
}
export declare const isPAndASymbol: (item: PAndA) => item is PAndASymbol;
export interface CementSqueeze {
    kind: 'cementSqueeze';
    id: string;
    start: number;
    end: number;
    /**
     * Referenced Casing and Completion ids
     */
    referenceIds: string[];
}
export declare const isCementSqueeze: (item: PAndA) => item is CementSqueeze;
export interface CementPlug {
    kind: 'cementPlug';
    id: string;
    start: number;
    end: number;
    /**
     * Referenced Casing, Completion ids
     */
    referenceIds: string[];
}
export declare const isCementPlug: (item: PAndA) => item is CementSqueeze;
export type PAndA = PAndASymbol | CementSqueeze | CementPlug;
interface BaseCompletion {
    id: string;
    diameter: number;
    start: number;
    end: number;
}
export interface Screen extends BaseCompletion {
    kind: 'screen';
}
export interface Tubing extends BaseCompletion {
    kind: 'tubing';
}
export interface CompletionSymbol extends BaseCompletion {
    kind: 'completionSymbol';
    symbolKey: string;
}
export type Completion = Tubing | Screen | CompletionSymbol;
export declare const foldCompletion: <T>(fScreen: (obj: Screen) => T, fTubing: (obj: Tubing) => T, fSymbol: (obj: CompletionSymbol) => T) => (completion: Completion) => T;
export interface Cement {
    kind: 'cement';
    id: string;
    /**
     *  Referenced Casing and Completion ids
     */
    referenceIds: string[];
    toc: number;
}
/**
 * 'Open hole' and 'Open hole screen' are not included as they are not visualized and also not included in the ruleset
 */
export type PerforationSubKind = 'Perforation' | 'Open hole gravel pack' | 'Open hole frac pack' | 'Cased hole frac pack' | 'Cased hole gravel pack' | 'Cased hole fracturation';
export interface Perforation {
    kind: 'perforation';
    subKind: PerforationSubKind;
    id: string;
    start: number;
    end: number;
    /**
     * is the perforation open or sealed?
     */
    isOpen: boolean;
}
export declare const foldPerforationSubKind: <T>(options: {
    Perforation: (kind: "Perforation") => T;
    OpenHoleGravelPack: (kind: "Open hole gravel pack") => T;
    OpenHoleFracPack: (kind: "Open hole frac pack") => T;
    CasedHoleGravelPack: (kind: "Cased hole gravel pack") => T;
    CasedHoleFracPack: (kind: "Cased hole frac pack") => T;
    CasedHoleFracturation: (kind: "Cased hole fracturation") => T;
}, subKind: PerforationSubKind) => T;
export declare const shouldPerforationStartAtHoleDiameter: (perf: Perforation) => boolean;
export declare const shouldPerforationStartAtCasingDiameter: (perf: Perforation) => boolean;
export declare const hasPacking: (perf: Perforation) => boolean;
export declare function hasFracLines(perf: Perforation): boolean;
export declare function hasSpikes(perf: Perforation): boolean;
export declare function isSubkindCasedHoleGravelPack(perf: Perforation): boolean;
export declare function isSubKindPerforation(perf: Perforation): boolean;
export declare function isSubKindCasedHoleFracPack(perf: Perforation): boolean;
export declare function isOpenHoleFracPack(perf: Perforation): boolean;
export declare const isSubKindCasedHoleFracturation: (perf: Perforation) => boolean;
export declare const intersect: (a: Perforation, b: Perforation) => boolean;
export interface SchematicData {
    holeSizes: HoleSize[];
    casings: Casing[];
    cements: Cement[];
    completion: Completion[];
    pAndA: PAndA[];
    symbols: {
        [key: string]: string;
    };
    perforations: Perforation[];
}
export interface InternalLayerOptions {
    holeLayerId: string;
    casingLayerId: string;
    completionLayerId: string;
    cementLayerId: string;
    pAndALayerId: string;
    perforationLayerId: string;
}
export declare const defaultInternalLayerOptions: (layerId: string) => InternalLayerOptions;
export interface HoleOptions {
    firstColor: string;
    secondColor: string;
    lineColor: string;
}
export declare const defaultHoleOptions: HoleOptions;
export interface CasingShoeSize {
    width: number;
    length: number;
}
export interface WindowOptions {
    dashColor: string;
    dashLength: number;
    spaceLength: number;
}
export interface CasingOptions {
    solidColor: string;
    lineColor: string;
    shoeSize: CasingShoeSize;
    windowOptions: WindowOptions;
}
export declare const defaultCasingOptions: CasingOptions;
export interface PerforationOptions {
    stroke: string;
    yellow: string;
    grey: string;
    red: string;
    outline: string;
    transparent: string;
    spikeWidth: number;
    spikeLength: number;
    packingOpacity: number;
    fracLineLength: number;
    fracLineCurve: number;
    scalingFactor: number;
}
export declare const defaultPerforationOptions: PerforationOptions;
export interface CementOptions {
    firstColor: string;
    secondColor: string;
    scalingFactor: number;
}
export declare const defaultCementOptions: CementOptions;
export interface CementSqueezeOptions {
    firstColor: string;
    secondColor: string;
    scalingFactor: number;
}
export declare const defaultCementSqueezeOptions: CementSqueezeOptions;
export interface ScreenOptions {
    scalingFactor: number;
    lineColor: string;
}
export declare const defaultScreenOptions: ScreenOptions;
export interface TubingOptions {
    innerColor: string;
    outerColor: string;
    scalingFactor: number;
}
export declare const defaultTubingOptions: TubingOptions;
export interface CementPlugOptions {
    firstColor: string;
    secondColor: string;
    scalingFactor: number;
}
export declare const defaultCementPlugOptions: CementPlugOptions;
export {};
//# sourceMappingURL=schematicInterfaces.d.ts.map