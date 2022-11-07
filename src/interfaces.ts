import { ZoomTransform } from 'd3-zoom';
import { Graphics } from 'pixi.js';
import Vector2 from '@equinor/videx-vector2';
import { ScaleLinear } from 'd3-scale';
import { ExtendedCurveInterpolator } from './control/ExtendedCurveInterpolator';
import { CurveInterpolator } from 'curve-interpolator';
import { ComplexRopeSegment } from './layers/CustomDisplayObjects/ComplexRope';

interface LayerEvent {
  elm?: HTMLElement;
}

export interface OnMountEvent extends LayerEvent {
  elm: HTMLElement;
  width?: number;
  height?: number;
}

export interface OnUnmountEvent extends LayerEvent {}

export interface OnResizeEvent extends LayerEvent {
  width: number;
  height: number;
}

export interface OnRescaleEvent extends LayerEvent {
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
  xBounds: [number, number];
  yBounds: [number, number];
  zFactor: number;
  viewportRatio: number;
  xRatio: number;
  yRatio: number;
  width: number;
  height: number;
  transform: ZoomTransform;
}

export interface OnUpdateEvent<T> extends LayerEvent {
  data?: T;
}

export interface ZoomAndPanOptions {
  maxZoomLevel: number;
  minZoomLevel: number;
}

export interface Connector {
  end: string;
  endScale: number;
}

export interface Annotation {
  title: string;
  label: string;
  color: string;
  group: string;
  md?: number;
  pos?: [number, number];
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

export type PAndA = PAndASymbol | CementSqueeze | CementPlug;

export interface CementPlug {
  id: string;
  top: number;
  bottom: number;
  kind: 'cementPlug';
  holeId?: string;
  casingId?: string;
  secondCasingId?: string;
}

export type PerforationSubKind =
  | 'Perforation'
  | 'Open hole gravel pack'
  | 'Open hole screen'
  | 'Open hole'
  | 'Open hole frac pack'
  | 'Cased hole frac pack'
  | 'Cased hole gravel pack'
  | 'Cased hole fracturation';

export interface Perforation {
  kind: 'perforation';
  subKind: PerforationSubKind;
  id: string;
  top: number;
  bottom: number;
  isOpen: boolean;
  casingIds: string[];
  holeId?: string[];
}

export type PerforationShape = ComplexRopeSegment;

export const foldPerforationSubKind = <T>(
  options: {
    Perforation: (kind: 'Perforation') => T;
    OpenHole: (kind: 'Open hole') => T;
    OpenHoleGravelPack: (kind: 'Open hole gravel pack') => T;
    OpenHoleFracPack: (kind: 'Open hole frac pack') => T;
    OpenHoleScreen: (kind: 'Open hole screen') => T;
    CasedHoleGravelPack: (kind: 'Cased hole gravel pack') => T;
    CasedHoleFracPack: (kind: 'Cased hole frac pack') => T;
    CasedHoleFracturation: (kind: 'Cased hole fracturation') => T;
  },
  subKind: PerforationSubKind,
) => {
  switch (subKind) {
    case 'Perforation':
      return options.Perforation(subKind);

    case 'Open hole':
      return options.OpenHole(subKind);

    case 'Open hole gravel pack':
      return options.OpenHoleGravelPack(subKind);

    case 'Open hole frac pack':
      return options.OpenHoleFracPack(subKind);

    case 'Open hole screen':
      return options.OpenHoleScreen(subKind);

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

export function hasGravelPack(perf: Perforation): boolean {
  return foldPerforationSubKind(
    {
      Perforation: () => false,
      OpenHole: () => false,
      OpenHoleGravelPack: () => true,
      OpenHoleFracPack: () => false,
      OpenHoleScreen: () => false,
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
      OpenHole: () => false,
      OpenHoleGravelPack: () => false,
      OpenHoleFracPack: () => false,
      OpenHoleScreen: () => false,
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
      OpenHole: () => false,
      OpenHoleGravelPack: () => false,
      OpenHoleFracPack: () => false,
      OpenHoleScreen: () => false,
      CasedHoleFracturation: () => false,
      CasedHoleGravelPack: () => false,
      CasedHoleFracPack: () => true,
    },
    perf.subKind,
  );
}

export const intersect = (a: Perforation, b: Perforation): boolean => {
  return a.top < b.bottom && a.bottom > b.top;
};

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

export interface CementSqueeze {
  kind: 'cementSqueeze';
  top: number;
  bottom: number;
  casingIds?: string[];
}

export const isCementSqueeze = (item: PAndA): item is CementSqueeze => item.kind === 'cementSqueeze';

export interface MDPoint {
  point: number[];
  normal?: Vector2;
  md: number; // Currently calculated MD
}

export interface WellItemGraphics {
  graphics: Graphics;
}

export interface ScaleOptions {
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  xBounds?: [number, number];
  yBounds?: [number, number];
}

export interface Interpolators {
  trajectory: CurveInterpolator;
  curtain: ExtendedCurveInterpolator;
  curve?: ExtendedCurveInterpolator;
}

export interface Trajectory {
  points: number[][];
  offset: number;
}

export type BoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  offsetX?: number;
  offsetY?: number;
};
