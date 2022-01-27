import { Annotation } from '../interfaces';

function mapPick(
  p: { pickIdentifier: any; identifier: any; md: number; tvd: any; mdUnit: any; depthReferencePoint: any },
  groupName: string,
): Annotation {
  const itm = {
    title: p.pickIdentifier || p.identifier,
    group: groupName,
    label: `${p.md} ${p.mdUnit} ${p.depthReferencePoint}`,
    color: groupName === 'strat-picks' ? '#227' : 'rgba(0,0,0,0.8)',
    md: p.md,
  };
  return itm;
}

function getReferencePicks(picks: any[]): any[] {
  if (!picks) {
    return [];
  }

  return picks.map((p: any) => mapPick(p, 'ref-picks'));
}

function getEntryPicks(formationPicks: any[]): any[] {
  if (!formationPicks) {
    return [];
  }

  return formationPicks
    .filter((d: { entryPick: { md: any }; from: any }) => d.entryPick.md === d.from)
    .map((p: { entryPick: any }) => mapPick(p.entryPick, 'strat-picks'));
}

function getFilteredExitPicks(formationPicks: any[]): any[] {
  if (!formationPicks) {
    return [];
  }

  return (
    formationPicks
      .filter(
        (d: { exitPick: { md: number } }) =>
          formationPicks.findIndex((p: { entryPick: { md: number } }) => Math.abs(p.entryPick.md - d.exitPick.md) < 0.5) === -1,
      )
      .map((p: { exitPick: any }) => mapPick(p.exitPick, 'strat-picks'))
      // Remove duplicates from unitpicks filling in gaps in formation
      .filter(
        (obj: Annotation, i: any, array: any[]) => i === array.findIndex((v: { title: any; md: any }) => v.title === obj.title && v.md === obj.md),
      )
  );
}

export function getPicksData(picksData: any): any[] {
  const { unitPicks, nonUnitPicks } = picksData;

  const picks = [...getReferencePicks(nonUnitPicks), ...getEntryPicks(unitPicks), ...getFilteredExitPicks(unitPicks)];

  picks.sort((a, b) => a.md - b.md);

  return picks;
}

/**
 * @param {{
 *  identifier: string,
 *  top: string,
 *  base: string,
 *  baseAge: number,
 *  topAge: number,
 *  colorR: number,
 *  colorG: number,
 *  colorB: number,
 *  stratUnitLevel: number,
 *  lithologyType: number,
 *  stratUnitParent: number }} u
 */
const unitDto = (u: any) => ({
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
 * @param {object[]} arr
 * @param {number} arr.to
 * @param {number} arr.from
 * @returns {[number, number][]}
 */
function findGaps(from: number, to: number, arr: any[]) {
  if (arr.length === 0) {
    return [[from, to]];
  }
  const gaps = [];
  let d = from;
  let i = 0;
  while (d < to && i < arr.length) {
    const itm = arr[i];
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
 * @param {[]} units
 * @param {[]} res
 * @returns {[]}
 */
function transformStratColumn(units: any, res: any[] = []) {
  for (let i = 0; i < units.length; i += 1) {
    const unit = unitDto(units[i]);
    res.push(unit);
  }
  return res;
}

/**
 * Join picks data with strat column units
 * @param {object[]} picks picks
 * @param {object[]} stratColumn strat column
 */
function joinPicksAndStratColumn(picks: any, stratColumn: any) {
  const transformed = transformStratColumn(stratColumn);
  const nonUnitPicks: any[] = [];
  const joined: any[] = [];
  picks.forEach((p: any) => {
    const matches = transformed.filter((u) => p.pickIdentifier.search(new RegExp(`(${u.topSurface}|${u.baseSurface})`, 'i')) !== -1);
    if (matches.length > 0) {
      matches.forEach((u) =>
        joined.push({
          md: p.md,
          tvd: p.tvd,
          identifier: p.pickIdentifier,
          confidence: p.confidence,
          mdUnit: p.mdUnit,
          depthReferencePoint: p.depthReferencePoint,
          ...u,
        }),
      );
    } else {
      nonUnitPicks.push(p);
    }
  });

  return { joined, nonUnitPicks };
}

/**
 * Find matching pairs of entry/exit picks
 * @param {object[]} joined picks joined with strat column units
 */
function pairJoinedPicks(joined: any) {
  // pair picks by unit name
  const pairs = [];
  let current = null;

  const sorted = joined
    .filter((d: any) => d.level)
    .sort((a: any, b: any) => a.unitName.localeCompare(b.unitName) || a.md - b.md || a.ageTop - b.ageTop);

  while (sorted.length > 0) {
    current = sorted.shift();
    const name = current.identifier;
    let pairWithName: any;

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

    let top: any;
    let base: any;

    const pairWith = sorted.find((p: any) => p.identifier === pairWithName);
    if (!pairWith) {
      console.warn(`Unable to find ${pairWithName} pick for ${name}`);
      if (isTop) {
        top = current;
        base = joined
          .filter((d: any) => d.level)
          .sort((a: any, b: any) => a.md - b.md)
          .find((p: any) => p.md > top.md);
        if (base) {
          console.warn(`Using ${base.identifier} as base for ${name}`);
        } else {
          console.warn(`Unable to find a base pick for ${name} pick at ${top.md}, ignored`);
          continue;
        }
      } else if (isBase) {
        base = current;
        top = joined
          .filter((d: any) => d.level)
          .sort((a: any, b: any) => b.md - a.md)
          .find((p: any) => p.md < base.md);
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

    pairs.push({
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
 * @param {object[]} picks picks
 * @param {object[]} stratColumn strat column
 */
export function transformFormationData(picks: any, stratColumn: any) {
  const { joined, nonUnitPicks } = joinPicksAndStratColumn(picks, stratColumn);
  const pairs = pairJoinedPicks(joined);

  const itemstack = pairs
    .filter((d) => d.mdEntry < d.mdExit)
    .sort((a, b) => a.mdEntry - b.mdEntry || a.level - b.level)
    .reverse();

  // flatten groups of unit picks, so that the highest level is
  // given presedence over lower levels for overlapping picks.
  const unitPicks = [];
  while (itemstack.length > 0) {
    const first = itemstack.pop();
    const group = [];
    while (itemstack.length > 0 && itemstack[itemstack.length - 1].level > first.level) {
      group.push(itemstack.pop());
    }
    group.reverse();
    group.push(first);
    const arr: any[] = [];
    group.forEach((itm) => {
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
