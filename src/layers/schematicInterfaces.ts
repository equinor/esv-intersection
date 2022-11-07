import { SHOE_LENGTH, SHOE_WIDTH } from '../constants';

export function assertNever(x: never): never {
  throw new Error(`Unexpected object: ${JSON.stringify(x)}`);
}

export interface HoleSize {
  kind: 'hole';
  id: string;
  diameter: number;
  start: number;
  end: number;
  innerDiameter?: number;
}

export interface Casing {
  kind: 'casing';
  id: string;
  diameter: number;
  start: number;
  end: number;
  hasShoe: boolean;
  innerDiameter: number;
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

export const isPAndASymbol = (item: PAndA): item is PAndASymbol => item.kind === 'pAndASymbol';

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

export const isCementSqueeze = (item: PAndA): item is CementSqueeze => item.kind === 'cementSqueeze';

export interface CementPlug {
  kind: 'cementPlug';
  id: string;
  start: number;
  end: number;
  /**
   * Referenced Hole, Casing, Completion ids
   */
  referenceIds: string[];
}

export const isCementPlug = (item: PAndA): item is CementSqueeze => item.kind === 'cementPlug';

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

export const foldCompletion =
  <T>(fScreen: (obj: Screen) => T, fTubing: (obj: Tubing) => T, fSymbol: (obj: CompletionSymbol) => T) =>
  (completion: Completion): T => {
    switch (completion.kind) {
      case 'screen':
        return fScreen(completion);
      case 'tubing':
        return fTubing(completion);
      case 'completionSymbol':
        return fSymbol(completion);
      default:
        return assertNever(completion);
    }
  };

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
export type PerforationSubKind =
  | 'Perforation'
  | 'Open hole gravel pack'
  | 'Open hole frac pack'
  | 'Cased hole frac pack'
  | 'Cased hole gravel pack'
  | 'Cased hole fracturation';

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
  /**
   * currently only looking at 'casingids' and not holeIds.
   */
  referenceIds: string[];
}

export const foldPerforationSubKind = <T>(
  options: {
    Perforation: (kind: 'Perforation') => T;
    OpenHoleGravelPack: (kind: 'Open hole gravel pack') => T;
    OpenHoleFracPack: (kind: 'Open hole frac pack') => T;
    CasedHoleGravelPack: (kind: 'Cased hole gravel pack') => T;
    CasedHoleFracPack: (kind: 'Cased hole frac pack') => T;
    CasedHoleFracturation: (kind: 'Cased hole fracturation') => T;
  },
  subKind: PerforationSubKind,
) => {
  switch (subKind) {
    case 'Perforation':
      return options.Perforation(subKind);

    case 'Open hole gravel pack':
      return options.OpenHoleGravelPack(subKind);

    case 'Open hole frac pack':
      return options.OpenHoleFracPack(subKind);

    case 'Cased hole fracturation':
      return options.CasedHoleFracturation(subKind);

    case 'Cased hole frac pack':
      return options.CasedHoleFracPack(subKind);

    case 'Cased hole gravel pack':
      return options.CasedHoleGravelPack(subKind);

    default:
      return assertNever(subKind);
  }
};

export const getPerforationsThatStartAtHoleDiameter = (perforations: Perforation[]) =>
  perforations.filter((perf) =>
    foldPerforationSubKind(
      {
        Perforation: () => true,
        OpenHoleGravelPack: () => true,
        OpenHoleFracPack: () => false,
        CasedHoleFracturation: () => false,
        CasedHoleGravelPack: () => false,
        CasedHoleFracPack: () => false,
      },
      perf.subKind,
    ),
  );

export const getPerforationsThatSTartAtCasingDiameter = (perforations: Perforation[]) =>
  perforations.filter((perf) =>
    foldPerforationSubKind(
      {
        Perforation: () => false,
        OpenHoleGravelPack: () => false,
        OpenHoleFracPack: () => true,
        CasedHoleFracturation: () => true,
        CasedHoleGravelPack: () => true,
        CasedHoleFracPack: () => true,
      },
      perf.subKind,
    ),
  );

export function hasGravelPack(perf: Perforation): boolean {
  return foldPerforationSubKind(
    {
      Perforation: () => false,
      OpenHoleGravelPack: () => true,
      OpenHoleFracPack: () => false,
      CasedHoleFracturation: () => false,
      CasedHoleGravelPack: () => true,
      CasedHoleFracPack: () => false,
    },
    perf.subKind,
  );
}

export function isSubKindPerforation(perf: Perforation): boolean {
  return foldPerforationSubKind(
    {
      Perforation: () => true,
      OpenHoleGravelPack: () => false,
      OpenHoleFracPack: () => false,
      CasedHoleFracturation: () => false,
      CasedHoleGravelPack: () => false,
      CasedHoleFracPack: () => false,
    },
    perf.subKind,
  );
}

export function isSubKindCasedHoleFracPack(perf: Perforation): boolean {
  return foldPerforationSubKind(
    {
      Perforation: () => false,
      OpenHoleGravelPack: () => false,
      OpenHoleFracPack: () => false,
      CasedHoleFracturation: () => false,
      CasedHoleGravelPack: () => false,
      CasedHoleFracPack: () => true,
    },
    perf.subKind,
  );
}

export function isOpenHoleFracPack(perf: Perforation) {
  return foldPerforationSubKind(
    {
      Perforation: () => false,
      OpenHoleGravelPack: () => false,
      OpenHoleFracPack: () => true,
      CasedHoleFracturation: () => false,
      CasedHoleGravelPack: () => false,
      CasedHoleFracPack: () => false,
    },
    perf.subKind,
  );
}

export const intersect = (a: Perforation, b: Perforation): boolean => {
  return a.start < b.end && a.end > b.start;
};

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

export const defaultInternalLayerOptions = (layerId: string): InternalLayerOptions => ({
  holeLayerId: `${layerId}-hole`,
  casingLayerId: `${layerId}-casing`,
  completionLayerId: `${layerId}-completion`,
  cementLayerId: `${layerId}-cement`,
  pAndALayerId: `${layerId}-pAndA`,
  perforationLayerId: `${layerId}-perforation`,
});

export interface HoleOptions {
  firstColor: string;
  secondColor: string;
  lineColor: string;
}

export const defaultHoleOptions: HoleOptions = {
  firstColor: '#8c541d',
  secondColor: '#eee3d8',
  lineColor: '#8b4513',
};

export interface CasingShoeSize {
  width: number;
  length: number;
}

export interface CasingOptions {
  solidColor: string;
  lineColor: string;
  shoeSize: CasingShoeSize;
}

export interface PerforationOptions {
  stroke: string;
  yellow: string;
  grey: string;
  red: string;
  transparent: string;
  spikeWidth: number;
  packingOpacity: number;
  fracLineLength: number;
  fracLineHalfWidth: number;
  scalingFactor: number;
}

export const defaultPerforationOptions: PerforationOptions = {
  stroke: 'rgba(0, 0, 0, 0.25)',
  yellow: '#FFFC00',
  grey: 'gray',
  red: '#FF5050',
  transparent: 'rgba(255, 255, 255, 0)',
  spikeWidth: 25,
  packingOpacity: 0.5,
  fracLineHalfWidth: 10,
  fracLineLength: 25,
  scalingFactor: 4,
};

export const defaultCasingOptions: CasingOptions = {
  solidColor: '#dcdcdc',
  lineColor: '#575757',
  shoeSize: {
    width: SHOE_WIDTH,
    length: SHOE_LENGTH,
  },
};

export interface CementOptions {
  firstColor: string;
  secondColor: string;
  scalingFactor: number;
}

export const defaultCementOptions: CementOptions = {
  firstColor: '#c7b9ab',
  secondColor: '#5b5b5b',
  scalingFactor: 4,
};

export interface CementSqueezeOptions {
  firstColor: string;
  secondColor: string;
  scalingFactor: number;
}

export const defaultCementSqueezeOptions: CementSqueezeOptions = {
  firstColor: '#8b6713',
  secondColor: '#000000',
  scalingFactor: 4,
};

export interface ScreenOptions {
  scalingFactor: number;
  lineColor: string;
}

export const defaultScreenOptions: ScreenOptions = {
  scalingFactor: 4,
  lineColor: '#63666a',
};

export interface TubingOptions {
  innerColor: string;
  outerColor: string;
  scalingFactor: number;
}

export const defaultTubingOptions: TubingOptions = {
  scalingFactor: 1,
  innerColor: '#eeeeff',
  outerColor: '#777788',
};

export interface CementPlugOptions {
  firstColor: string;
  secondColor: string;
  scalingFactor: number;
}

export const defaultCementPlugOptions: CementPlugOptions = {
  firstColor: '#c7b9ab',
  secondColor: '#000000',
  scalingFactor: 4,
};
