import { poslog, cementData, holeSizeData, casingData, surfaces, completion, stratColumns, picks, seismic } from './esv-intersection-data';

export const getWellborePath = (): Promise<any> => {
  const coords = poslog.map((c: any) => [c.easting, c.northing, c.tvd]);
  return Promise.resolve(coords);
};

export const getPositionLog = (): Promise<any> => {
  return Promise.resolve(poslog);
};

export const getCompletion = (): Promise<any[]> => {
  const compl = completion.map((c: any) => ({ start: c.mdTop, end: c.mdBottom, diameter: c.odMax }));
  return Promise.resolve(compl);
};

export const getSurfaces = (): Promise<any[]> => {
  return Promise.resolve(surfaces);
};

export const getStratColumns = (): Promise<any[]> => {
  return Promise.resolve(stratColumns);
};

export const getSeismic = (): Promise<any> => {
  return Promise.resolve(seismic);
};

export const getHolesize = (): Promise<any[]> => {
  return Promise.resolve(holeSizeData);
};

export const getCasings = (): Promise<any[]> => {
  return Promise.resolve(casingData);
};

export const getCement = (): Promise<any[]> => {
  return Promise.resolve(cementData);
};

export const getPicks = (): Promise<any[]> => {
  return Promise.resolve(picks);
}

// Nothing for mock
export const fetchData = async (fileName: string) => {};
