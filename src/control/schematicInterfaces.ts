import { SHOE_LENGTH, SHOE_WIDTH } from '../constants';

export function assertNever(x: never): never {
  throw new Error(`Unexpected object: ${JSON.stringify(x)}`);
}

export interface HoleSize {
  diameter: number;
  start: number;
  end: number;
  innerDiameter?: number;
}

export interface Casing {
  diameter: number;
  start: number;
  end: number;
  hasShoe: boolean;
  innerDiameter: number;
  casingId: string;
}

interface SymbolComponent {
  diameter: number;
  start: number;
  end: number;
  symbolKey: string;
}

export interface PAndASymbol extends SymbolComponent {
  kind: 'pAndA-symbol';
}

export const isPAndASymbol = (item: PAndA): item is PAndASymbol => item.kind === 'pAndA-symbol';

export interface CementSqueeze {
  kind: 'cementSqueeze';
  top: number;
  bottom: number;
  casingIds?: string[];
}

export const isCementSqueeze = (item: PAndA): item is CementSqueeze => item.kind === 'cementSqueeze';

export interface CementPlug {
  id: string;
  top: number;
  bottom: number;
  kind: 'cementPlug';
  holeId?: string;
  casingId?: string;
  secondCasingId?: string;
}

export const isCementPlug = (item: PAndA): item is CementSqueeze => item.kind === 'cementPlug';

export type PAndA = PAndASymbol | CementSqueeze | CementPlug;

interface BaseCompletion {
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
  kind: 'completion-symbol';
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
      case 'completion-symbol':
        return fSymbol(completion);
      default:
        return assertNever(completion);
    }
  };

export interface Cement {
  toc: number;
  casingIds?: string[];
}

export interface SchematicData {
  holeSizes: HoleSize[];
  casings: Casing[];
  cements: Cement[];
  completion: Completion[];
  pAndA: PAndA[];
  symbols: {
    [key: string]: string;
  };
}

export interface InternalLayerOptions {
  holeLayerId: string;
  casingLayerId: string;
  completionLayerId: string;
  cementLayerId: string;
  pAndALayerId: string;
}

export const defaultInternalLayerOptions = (layerId: string) => ({
  holeLayerId: `${layerId}-hole`,
  casingLayerId: `${layerId}-casing`,
  completionLayerId: `${layerId}-completion`,
  pAndALayerId: `${layerId}-pAndA`,
  cementLayerId: `${layerId}-cement`,
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

export const defaultCasingOptions = {
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

export const defaultCementOptions = {
  firstColor: '#c7b9ab',
  secondColor: '#5b5b5b',
  scalingFactor: 4,
};

export interface CementSqueezeOptions {
  firstColor: string;
  secondColor: string;
  scalingFactor: number;
}

export const defaultCementSqueezeOptions = {
  firstColor: '#8b4513',
  secondColor: '#8b6713',
  scalingFactor: 4,
};

export interface ScreenOptions {
  scalingFactor: number;
  lineColor: string;
}

export const defaultScreenOptions = {
  scalingFactor: 4,
  lineColor: '#63666a',
};

export interface TubingOptions {
  innerColor: string;
  outerColor: string;
  scalingFactor: number;
}

export const defaultTubingOptions = {
  scalingFactor: 1,
  innerColor: '#eeeeff',
  outerColor: '#777788',
};

export interface CementPlugOptions {
  firstColor: string;
  secondColor: string;
  scalingFactor: number;
}

export const defaultCementPlugOptions = {
  firstColor: '#c7b9ab',
  secondColor: '#c7b9ab',
  scalingFactor: 4,
};
