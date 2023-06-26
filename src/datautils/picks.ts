import { Annotation } from '../interfaces';

type Pick = {
  pickIdentifier?: string;
  confidence: string | null;
  depthReferencePoint: string;
  md: number;
  mdUnit: string;
  tvd: number;
};

type PickWithId = {
  identifier: string;
} & Pick;

type Unit = {
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

type UnitDto = {
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

type PickAndUnit = PickWithId & UnitDto;

type PairedPickAndUnit = {
  name: string;
  mdEntry: number;
  tvdEntry: number;
  color: { r: number; g: number; b: number };
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

const mapPick = (p: PickWithId, groupName: string): Annotation => ({
  title: p.pickIdentifier || p.identifier,
  group: groupName,
  label: `${p.md} ${p.mdUnit} ${p.depthReferencePoint}`,
  color: groupName === 'strat-picks' ? '#227' : 'rgba(0,0,0,0.8)',
  md: p.md,
});

function getReferencePicks(picks: PickWithId[]): Annotation[] {
  if (!picks) {
    return [];
  }

  return picks.map((p: PickWithId) => mapPick(p, 'ref-picks'));
}

function getEntryPicks(formationPicks: PairedPickAndUnit[]): Annotation[] {
  if (!formationPicks) {
    return [];
  }

  return formationPicks
    .filter((d: PairedPickAndUnit) => d.entryPick.md === d.from)
    .map((p: PairedPickAndUnit) => mapPick(p.entryPick, 'strat-picks'));
}

function getFilteredExitPicks(formationPicks: PairedPickAndUnit[]): Annotation[] {
  if (!formationPicks) {
    return [];
  }

  return (
    formationPicks
      .filter((d: PairedPickAndUnit) => formationPicks.findIndex((p: PairedPickAndUnit) => Math.abs(p.entryPick.md - d.exitPick.md) < 0.5) === -1)
      .map((p: PairedPickAndUnit) => mapPick(p.exitPick, 'strat-picks'))
      // Remove duplicates from unitpicks filling in gaps in formation
      .filter((obj: Annotation, i: number, array: Annotation[]) => i === array.findIndex((v: Annotation) => v.title === obj.title && v.md === obj.md))
  );
}

export const getPicksData = (picksData: { unitPicks: PairedPickAndUnit[]; nonUnitPicks: PickWithId[] }): Annotation[] =>
  [...getReferencePicks(picksData.nonUnitPicks), ...getEntryPicks(picksData.unitPicks), ...getFilteredExitPicks(picksData.unitPicks)].sort(
    (a, b) => a.md! - b.md!,
  );

/**
 * @param {Unit} u
 */
const unitDto = (u: Unit): UnitDto => ({
  unitName: u.identifier,
  topSurface: u.top,
  baseSurface: u.base,
  ageBase: u.baseAge,
  ageTop: u.topAge,
  color: {
    r: u.colorR === null ? 255 : u.colorR,
    g: u.colorG === null ? 255 : u.colorG,
    b: u.colorB === null ? 255 : u.colorB,
  },
  level: u.stratUnitLevel,
  lithType: u.lithologyType,
  parent: u.stratUnitParent,
});

/**
 *
 * @param {number} from
 * @param {number} to
 * @param {{ from: number; to: number; itm: PairedPickAndUnit }[]} arr
 * @param {number} arr.to
 * @param {number} arr.from
 * @returns {[number, number][]}
 */
function findGaps(from: number, to: number, arr: { from: number; to: number; itm: PairedPickAndUnit }[]): [number, number][] {
  if (arr.length === 0) {
    return [[from, to]];
  }
  const gaps: [number, number][] = [];
  let d = from;
  let i = 0;
  while (d < to && i < arr.length) {
    const itm = arr[i]!;
    if (itm.from > d) {
      gaps.push([d, Math.min(itm.from, to)]);
    }
    d = Math.min(to, Math.max(from, itm.to));
    i += 1;
  }
  if (d < to) {
    gaps.push([d, to]);
  }
  return gaps;
}

/**
 * @param {Unit[]} units
 * @returns {UnitDto[]}
 */
const transformStratColumn = (units: Unit[]): UnitDto[] => units.map(unitDto);

/**
 * Join picks data with strat column units
 * @param {Pick[]} picks picks
 * @param {Unit[]} stratColumn strat column
 */
function joinPicksAndStratColumn(picks: Pick[], stratColumn: Unit[]): { joined: PickAndUnit[]; nonUnitPicks: PickWithId[] } {
  const transformed = transformStratColumn(stratColumn);
  const nonUnitPicks: PickWithId[] = [];
  const joined: PickAndUnit[] = [];
  picks.forEach((p: Pick) => {
    const matches = transformed.filter((u: UnitDto) => p.pickIdentifier?.search(new RegExp(`(${u.topSurface}|${u.baseSurface})`, 'i')) !== -1);
    if (matches.length > 0) {
      matches.forEach((u: UnitDto) =>
        joined.push({
          md: p.md,
          tvd: p.tvd,
          identifier: p.pickIdentifier!,
          confidence: p.confidence,
          mdUnit: p.mdUnit,
          depthReferencePoint: p.depthReferencePoint,
          ...u,
        }),
      );
    } else {
      nonUnitPicks.push({ identifier: p.pickIdentifier!, ...p });
    }
  });

  return { joined, nonUnitPicks };
}

/**
 * Find matching pairs of entry/exit picks
 * @param {PickAndUnit[]} joined picks joined with strat column units
 */
function pairJoinedPicks(joined: PickAndUnit[]): PairedPickAndUnit[] {
  // pair picks by unit name
  const pairs = [];
  let current = null;

  const sorted = joined
    .filter((d: PickAndUnit) => d.level)
    .sort((a: PickAndUnit, b: PickAndUnit) => a.unitName.localeCompare(b.unitName) || a.md - b.md || a.ageTop - b.ageTop);

  while (sorted.length > 0) {
    current = sorted.shift()!;
    const name = current.identifier;
    let pairWithName: string;

    const isTop = name === current.topSurface;
    const isBase = name === current.baseSurface;

    if (isTop) {
      pairWithName = current.baseSurface;
    } else if (isBase) {
      pairWithName = current.topSurface;
    } else {
      console.warn(`Unable to match ${name} with top or base surface, ignored`);
      continue;
    }

    let top: PickAndUnit | undefined;
    let base: PickAndUnit | undefined;

    const pairWith = sorted.find((p: PickAndUnit) => p.identifier === pairWithName);
    if (!pairWith) {
      console.warn(`Unable to find ${pairWithName} pick for ${name}`);
      if (isTop) {
        top = current;
        base = joined
          .filter((d: PickAndUnit) => d.level)
          .sort((a: PickAndUnit, b: PickAndUnit) => a.md - b.md)
          .find((p: PickAndUnit) => p.md > top!.md);
        if (base) {
          console.warn(`Using ${base.identifier} as base for ${name}`);
        } else {
          console.warn(`Unable to find a base pick for ${name} pick at ${top.md}, ignored`);
          continue;
        }
      } else if (isBase) {
        base = current;
        top = joined
          .filter((d: PickAndUnit) => d.level)
          .sort((a: PickAndUnit, b: PickAndUnit) => b.md - a.md)
          .find((p: PickAndUnit) => p.md < base!.md);
        if (top) {
          console.warn(`Using ${top.identifier} as top for ${name}`);
        } else {
          console.warn(`Unable to find a top pick for ${name} pick at ${base.md}, ignored`);
          continue;
        }
      } else {
        console.warn(`${name} ignored`);
        continue;
      }
    } else {
      top = isTop ? current : pairWith;
      base = isTop ? pairWith : current;

      if (top.md > base.md) {
        [top, base] = [base, top];
      }

      sorted.splice(sorted.indexOf(pairWith), 1);
    }

    pairs.push(<PairedPickAndUnit>{
      name: top.unitName,
      mdEntry: top.md,
      tvdEntry: top.tvd,
      color: top.color,
      level: top.level,
      entryPick: top,
      mdExit: base.md,
      tvdExit: base.tvd,
      exitPick: base,
      confidenceEntry: top.confidence,
      confidenceExit: base.confidence,
    });
  }

  return pairs;
}

/**
 * Transform data for formation track
 * @param {Pick[]} picks picks
 * @param {Unit[]} stratColumn strat column
 */
export function transformFormationData(picks: Pick[], stratColumn: Unit[]): { unitPicks: PairedPickAndUnit[]; nonUnitPicks: PickWithId[] } {
  const { joined, nonUnitPicks } = joinPicksAndStratColumn(picks, stratColumn);
  const pairs = pairJoinedPicks(joined);

  const itemstack = pairs
    .filter((d: PairedPickAndUnit) => d.mdEntry < d.mdExit)
    .sort((a, b) => a.mdEntry - b.mdEntry || a.level - b.level)
    .reverse();

  // flatten groups of unit picks, so that the highest level is
  // given presedence over lower levels for overlapping picks.
  const unitPicks = [];
  while (itemstack.length > 0) {
    const first = itemstack.pop()!;
    const group: PairedPickAndUnit[] = [];
    while (itemstack.length > 0 && itemstack[itemstack.length - 1]?.level! > first.level) {
      group.push(itemstack.pop()!);
    }
    group.reverse();
    group.push(first);
    const arr: { from: number; to: number; itm: PairedPickAndUnit }[] = [];
    group.forEach((itm: PairedPickAndUnit) => {
      const gaps = findGaps(itm.mdEntry, itm.mdExit, arr);
      arr.push(...gaps.map((g) => ({ from: g[0], to: g[1], itm })));
    });
    arr.sort((a, b) => a.from - b.from);
    unitPicks.push(
      ...arr.map((d) => ({
        from: d.from,
        to: d.to,
        ...d.itm,
      })),
    );
  }
  return { unitPicks, nonUnitPicks };
}
