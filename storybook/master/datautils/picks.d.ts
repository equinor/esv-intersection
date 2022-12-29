import { Annotation } from '../interfaces';
declare type Pick = {
    pickIdentifier?: string;
    confidence: string | null;
    depthReferencePoint: string;
    md: number;
    mdUnit: string;
    tvd: number;
};
declare type PickWithId = {
    identifier: string;
} & Pick;
declare type Unit = {
    identifier: string;
    top: string;
    base: string;
    baseAge: number;
    topAge: number;
    colorR: number;
    colorG: number;
    colorB: number;
    stratUnitLevel: number;
    lithologyType: number;
    stratUnitParent: number;
};
declare type UnitDto = {
    unitName: string;
    topSurface: string;
    baseSurface: string;
    ageBase: number;
    ageTop: number;
    color: {
        r: number;
        g: number;
        b: number;
    };
    level: number;
    lithType: number;
    parent: number;
};
declare type PickAndUnit = PickWithId & UnitDto;
declare type PairedPickAndUnit = {
    name: string;
    mdEntry: number;
    tvdEntry: number;
    color: {
        r: number;
        g: number;
        b: number;
    };
    level: number;
    entryPick: PickAndUnit;
    mdExit: number;
    tvdExit: number;
    exitPick: PickAndUnit;
    confidenceEntry: string;
    confidenceExit: string;
    from?: number;
    to?: number;
};
export declare const getPicksData: (picksData: {
    unitPicks: PairedPickAndUnit[];
    nonUnitPicks: PickWithId[];
}) => Annotation[];
/**
 * Transform data for formation track
 * @param {Pick[]} picks picks
 * @param {Unit[]} stratColumn strat column
 */
export declare function transformFormationData(picks: Pick[], stratColumn: Unit[]): {
    unitPicks: PairedPickAndUnit[];
    nonUnitPicks: PickWithId[];
};
export {};
