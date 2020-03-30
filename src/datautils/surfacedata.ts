import { interpolateRgb, quantize } from 'd3-interpolate';
import { scaleOrdinal } from 'd3-scale';
import { color, Color } from 'd3-color';
import { StratUnit, SurfaceMetaAndValues, SurfaceLine, SurfaceArea, SurfaceData } from './interfaces';

/**
 * Generate surface data from trajectory, stratcolum and surface data
 * Code originally developed for the REP project
 * @param trajectory Projected trajectory generated from the poslog used when retrieving surface data from surface API
 * @param stratColumn Strat columnd from SMDA
 * @param surfaceData - Surfaces meta data with surface values in data section
 * @return  Surface areas ready for rendering in geolayer
 */
export function generateSurfaceData(trajectory: number[][], stratColumn: StratUnit[], surfaceData: SurfaceMetaAndValues[]): SurfaceData {
  const firstUnit = stratColumn && stratColumn.find((d) => d.stratUnitLevel === 1);
  const defaultGroupName: string = firstUnit ? firstUnit.identifier : 'SEABED';
  const filteredSurfaces: SurfaceMetaAndValues[] = surfaceData.filter((s) => s.data.values);
  const mappedSurfaces: any = mapSurfaceData(filteredSurfaces);
  const stratGroups = new Map();
  const lines: SurfaceLine[] = getSurfaceLines(mappedSurfaces, trajectory);

  const stratigraphies: any = mappedSurfaces
    .filter((d: any) => d.visualization === 'interval' || d.visualization === 'none')
    .map((s: any) => {
      const path: StratUnit[] = [];
      const stratUnit: StratUnit = findStratcolumnUnit(stratColumn, s.name, path);
      if (!stratUnit) {
        console.warn(`Not able to map ${s.name} to a strat column`);
      }
      const group: StratUnit = path[0] || stratUnit;
      const groupName: string = (group && group.identifier) || defaultGroupName;
      if (group && !stratGroups.has(groupName)) {
        stratGroups.set(groupName, {
          age: group.topAge,
          name: group.identifier,
        });
      }
      return {
        ...s,
        unit: stratUnit,
        group: groupName,
      };
    })
    .sort((a: any, b: any) => {
      if (!a.unit && !b.unit) return 0;
      if (!a.unit) return -1;
      if (!b.unit) return 1;
      if (a.unit.topAge === b.unit.topAge) {
        return a.isBase ? 1 : -1;
      }
      return a.unit.topAge - b.unit.topAge;
    });
  const surfaceAreas: any = generateSurfaceAreas(trajectory, stratigraphies);

  const groups: any = Array.from(stratGroups.values())
    .sort((a: any, b: any) => a.age - b.age)
    .filter((g: any) => {
      const surfaces: string = surfaceAreas[g.name];
      const isValid = surfaces && surfaces.length > 0;
      if (!isValid) {
        console.warn(
          `Intersection surface group '${g.name}' has no valid entries and will be discarded.`,
          stratigraphies.filter((d: any) => d.group === g.name),
        );
      }
      return isValid;
    })
    .map((g: any, i: number) => {
      const surface = surfaceAreas[g.name];
      const top = surface[0];
      return {
        id: g.name,
        color: unassignedColorScale(i),
        top: top.data.map((d: number[]) => d[1]),
      };
    });
  const groupAreas: any = groups.map((g: any, i: number) => {
    const next: any = i + 1 < groups.length ? groups[i + 1] : null;
    return {
      id: g.id,
      color: convertColor(g.color),
      data: trajectory.map((p, j) => [p[0], g.top[j], next ? next.top[j] : null]),
    };
  });

  const areas: SurfaceArea[] = groupAreas.concat(
    Object.keys(surfaceAreas)
      .reduce((acc: any[], k: any) => [...acc, ...surfaceAreas[k]], [])
      .filter((d: any) => !d.exclude),
  );
  const data = {
    lines,
    areas,
  };

  return data;
}

/**
 * Get surfaces which should be rendered as lines
 * @param  mappedSurfaces
 * @param  trajectory
 */
function getSurfaceLines(mappedSurfaces: any, trajectory: number[][]): SurfaceLine[] {
  const lines: SurfaceLine[] = mappedSurfaces
    .filter((d: any) => d.visualization === 'line')
    .map((l: any) => ({
      id: l.name,
      label: l.name,
      width: 2,
      color: convertColor(l.color || 'black'),
      data: trajectory.map((p, j) => [p[0], l.values[j]]),
    }));

  return lines;
}

/**
 * @param {[]} units
 * @param {string} unitname
 * @param {[]} path
 */
function findStratcolumnUnit(units: any, unitname: any, path: any[] = []): any {
  const unit: any = units.find((u: any) => u.identifier.toLowerCase() === unitname.toLowerCase());
  if (unit) {
    // Build path
    let temp: any = unit;
    do {
      path.unshift(temp);
      temp = units.find((u: any) => u.identifier === temp.stratUnitParent);
    } while (temp);

    return unit;
  }
  return null;
}

function mapSurfaceData(surfaces: SurfaceMetaAndValues[]): any {
  return surfaces.map((s: any) => {
    const displayName: string = s.visualSettings.displayName;
    let mappedName: string = displayName;
    return {
      name: mappedName.replace(/\s(Base|Top)/g, ''),
      isBase: mappedName.endsWith('Base'),
      values: s.data.values,
      color: s.visualSettings.colors.crossSection,
      visualization: s.visualSettings.crossSection.toLowerCase(),
    };
  });
}

/**
 * Convert color string to number
 */
function convertColor(colorStr: string): number {
  const c: Color = color(colorStr);
  const d: string = c.hex();
  const n: number = parseInt(d.replace('#', '0x'));
  return n;
}

function getColorFromUnit(unit: any): number {
  if (unit.colorR === null || unit.colorG === null || unit.colorB === null) {
    return 0x80000000;
  }
  const res: number = (unit.colorR << 16) | (unit.colorG << 8) | unit.colorB;
  return res;
}

const unassignedColorScale = scaleOrdinal<number, string>()
  .domain([0, 100])
  .range(quantize(interpolateRgb('#e6f1cf', '#85906d'), 10));

/**
 * Find the best matching base index based on name or by values
 */
function findBestMatchingBaseIndex(top: any, index: number, surfaces: any): number {
  const nextIndex: number = index + 1;

  if (!surfaces || nextIndex >= surfaces.length) return null;

  // if there is a matching base by name, use that
  let candidate: any = surfaces[nextIndex];
  if (candidate.isBase && candidate.name === top.name) {
    return nextIndex;
  }
  // verify that each data point in the top has a corresponding
  // data point in the base candidate. If not, find another candidate
  // if none match up, select the best ranked, based on the info we have.
  const scores: any = [];
  let isAcceptable: boolean;
  let ci: number = nextIndex;
  for (; ci < surfaces.length; ci++) {
    candidate = surfaces[ci];
    let score: number = 0;
    isAcceptable = true;
    for (let x = 0; x < top.values.length; x++) {
      if (top.values[x] !== null && candidate.values[x] === null) {
        isAcceptable = false;
        break;
      } else {
        score += 1;
      }
    }
    if (isAcceptable) break;
    scores.push({ ci, score });
  }
  if (isAcceptable) return ci;

  if (scores.length < 2) return nextIndex;
  scores.sort((a: any, b: any) => b.score - a.score || a.ci - b.ci);

  return scores[0].ci;
}

function generateSurfaceAreas(projection: number[][], surfaces: any): any {
  const areas: any = surfaces.reduce((acc: any, surface: any, i: number) => {
    if (!surface.isBase) {
      if (!acc[surface.group]) {
        acc[surface.group] = [];
      }
      const baseIndex: number = findBestMatchingBaseIndex(surface, i, surfaces);
      acc[surface.group].push({
        id: surface.name,
        label: surface.name,
        color: (surface.unit && getColorFromUnit(surface.unit)) || 0xffffffff,
        exclude: surface.visualization === 'none' || !surface.unit,
        data: projection.map((p, j) => {
          const baseValue: number = surface.values[j] !== null ? getBaseValue(baseIndex, surfaces, j) : null;
          return [p[0], surface.values[j], baseValue];
        }),
      });
    }
    return acc;
  }, {});
  return areas;
}

// get the value from the surface with the supplied index,
// iterate to next surface if value is null
function getBaseValue(index: number, surfaces: any[], datapoint: number) {
  if (!surfaces || !index || index >= surfaces.length) return null;

  for (let i: number = index; i < surfaces.length; i++) {
    if (surfaces[i].values[datapoint] !== null) {
      return surfaces[i].values[datapoint];
    }
  }
  return null;
}
