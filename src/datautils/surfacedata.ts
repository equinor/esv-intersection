/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { interpolateRgb, quantize } from 'd3-interpolate';
import { scaleOrdinal } from 'd3-scale';
import { convertColor } from '../utils/color';
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
  if (trajectory.length < 0) {
    return;
  }
  const filteredSurfaces: SurfaceMetaAndValues[] = surfaceData.filter((s) => s.data.values);
  const mappedSurfaces: any = mapSurfaceData(filteredSurfaces);

  const stratGroups = new Map();
  const stratigraphies = combineSurfacesAndStratColumn(mappedSurfaces, stratColumn, stratGroups);
  sortStratigraphies(stratigraphies);

  const lines: SurfaceLine[] = getSurfaceLines(mappedSurfaces, trajectory);
  const surfaceAreas: SurfaceArea[][] = generateSurfaceAreas(trajectory, stratigraphies, stratColumn);

  const groups: any = mapGroups(stratGroups, surfaceAreas);
  const groupAreas: SurfaceArea[] = generateGroupAreas(groups, trajectory);

  //Combine group areas with surface areas
  const areas: SurfaceArea[] = [
    ...groupAreas,
    ...Object.values(surfaceAreas)
      .flat()
      .filter((d: any) => !d.exclude),
  ];

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

function generateGroupAreas(groups: any, trajectory: number[][]): any {
  const groupAreas: any = groups.map((g: any, i: number) => {
    const next: any = i + 1 < groups.length ? groups[i + 1] : null;
    return {
      id: g.id,
      label: g.label,
      color: convertColor(g.color),
      data: trajectory.map((p: any, j: any) => [p[0], g.top[j], next ? next.top[j] : null]),
    };
  });
  return groupAreas;
}

function mapGroups(stratGroups: any, surfaceAreas: SurfaceArea[][]): any {
  const groups: any = Array.from(stratGroups.values())
    .sort((a: any, b: any) => a.age - b.age)
    .filter((g: any) => {
      const surfaces: SurfaceArea[] = surfaceAreas[g.name];
      const isValid = surfaces && surfaces.length > 0;
      if (!isValid) {
        console.warn(`Intersection surface group '${g.name}' has no valid entries and will be discarded.`);
      }
      return isValid;
    })
    .map((g: any, i: number) => {
      const surface = surfaceAreas[g.name];
      const top = surface[0];
      return {
        id: g.name,
        label: g.name,
        color: unassignedColorScale(i),
        top: top.data.map((d: number[]) => d[1]),
      };
    });
  return groups;
}

function combineSurfacesAndStratColumn(mappedSurfaces: any, stratColumn: StratUnit[], stratGroups: Map<string, any>): any {
  const firstUnit = stratColumn && stratColumn.find((d: any) => d.stratUnitLevel === 1);
  const defaultGroupName: string = firstUnit ? firstUnit.identifier : 'SEABED';
  const stratigrafies = mappedSurfaces
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
    });
  return stratigrafies;
}

/**
 * Sort stratigrafies on unit and age, base after top and higher level after lower
 * @param  stratigrafies
 */
function sortStratigraphies(stratigrafies: any): void {
  stratigrafies.sort((a: any, b: any) => {
    if (!a.unit && !b.unit) {
      return 0;
    }
    if (!a.unit) {
      return -1;
    }
    if (!b.unit) {
      return 1;
    }
    const aAge = a.isBase ? a.unit.baseAge : a.unit.topAge;
    const bAge = b.isBase ? b.unit.baseAge : b.unit.topAge;
    if (aAge !== bAge) {
      return aAge - bAge;
    }
    if (a.isBase && !b.isBase) {
      return 1;
    }
    if (!a.isBase && b.isBase) {
      return -1;
    }
    return a.unit.stratUnitLevel - b.unit.stratUnitLevel;
  });
}

/**
 * @param {[]} units
 * @param {string} unitname
 * @param {[]} path
 */
function findStratcolumnUnit(units: StratUnit[], unitname: string, path: StratUnit[] = []): any {
  const unit: StratUnit = units.find((u: any) => u.identifier.toLowerCase() === unitname.toLowerCase());
  if (unit) {
    // Build path
    let temp: StratUnit = unit;
    do {
      path.unshift(temp);
      temp = units.find((u: StratUnit) => u.identifier === temp.stratUnitParent);
    } while (temp);

    return unit;
  }
  return null;
}

function mapSurfaceData(surfaces: SurfaceMetaAndValues[]): any {
  return surfaces.map((s: SurfaceMetaAndValues) => {
    const displayName: string = s.visualSettings.displayName;
    const mappedName: string = displayName;
    return {
      name: mappedName.replace(/\s(Base|Top)/g, ''),
      isBase: mappedName.endsWith('Base'),
      values: s.data.values,
      color: s.visualSettings.colors.crossSection,
      visualization: s.visualSettings.crossSection.toLowerCase(),
    };
  });
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
function findBestMatchingBaseIndex(top: any, index: number, surfaces: any, stratColumn: StratUnit[]): number {
  const nextIndex: number = index + 1;

  if (!surfaces || nextIndex >= surfaces.length) {
    return null;
  }

  // If there is a matching base by name, use that. More robust, does not rely on sorting
  const baseSurfaceIndex = surfaces.findIndex((candidate: any) => candidate.isBase && candidate.name === top.name);
  if (baseSurfaceIndex !== -1) {
    return baseSurfaceIndex;
  }

  for (let i = nextIndex; i < surfaces.length; i++) {
    const candidate = surfaces[i];
    if (!candidate.isBase) {
      return i;
    }
    if (isAnchestor(top, candidate, stratColumn)) {
      return i;
    }
  }
  return null;
}

function isAnchestor(descendant: any, candidate: any, stratColumn: StratUnit[]): boolean {
  const path: StratUnit[] = [];
  findStratcolumnUnit(stratColumn, descendant.name, path);
  return path.some((p: StratUnit) => candidate.name === p.identifier);
}

function generateSurfaceAreas(projection: number[][], surfaces: any, stratColumn: StratUnit[]): SurfaceArea[][] {
  const areas: SurfaceArea[][] = surfaces.reduce((acc: any, surface: any, i: number) => {
    if (!surface.isBase) {
      if (!acc[surface.group]) {
        acc[surface.group] = [];
      }
      const baseIndex: number = findBestMatchingBaseIndex(surface, i, surfaces, stratColumn);
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
function getBaseValue(index: number, surfaces: any[], datapoint: number): number {
  if (!surfaces || !index || index >= surfaces.length) {
    return null;
  }

  for (let i: number = index; i < surfaces.length; i++) {
    if (surfaces[i].values[datapoint] !== null) {
      return surfaces[i].values[datapoint];
    }
  }
  return null;
}
