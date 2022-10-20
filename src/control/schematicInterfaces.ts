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
  /**
   * Should remove optional on casingIds when casingId is removed in next major release
   * @‌deprecated use casingIds
   */
  casingId?: string;
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

export interface HoleOptions {
  firstColor: string;
  secondColor: string;
  lineColor: string;
}

export interface CasingOptions {
  solidColor: string;
  lineColor: string;
  shoeSize: CasingShoeSize;
}

export interface CementOptions {
  firstColor: string;
  secondColor: string;
  scalingFactor: number;
}

export interface CementSqueezeOptions {
  firstColor: string;
  secondColor: string;
  scalingFactor: number;
}

export interface CasingShoeSize {
  width: number;
  length: number;
}

export interface ScreenOptions {
  scalingFactor: number;
  lineColor: string;
}

export interface TubingOptions {
  innerColor: string;
  outerColor: string;
  scalingFactor: number;
}

export interface CementPlugOptions {
  firstColor: string;
  secondColor: string;
  scalingFactor: number;
}
