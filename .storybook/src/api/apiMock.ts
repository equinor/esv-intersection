import { poslog, cementData, holeSizeData, casingData } from '../exampledata';

export const getWellborePath = (): Promise<any> => {
  const coords = poslog.map((c: any) => [c.easting, c.northing, c.tvd]);
  return Promise.resolve(coords);
};

export const getPositionLog = (): Promise<any> => {
  return Promise.resolve(poslog);
};

export const getCompletion = (): Promise<any[]> => {
  return Promise.resolve([]);
};

export const getSurfaces = (): Promise<any[]> => {
  return Promise.resolve([]);
};

export const getStratColumns = (): Promise<any[]> => {
  return Promise.resolve([]);
};

export const getSeismic = (): Promise<any> => {
  return Promise.resolve({
    requestId: '',
    fileId: '',
    fieldGuid: 0,
    fieldIdentifier: '',
    dateLastChange: '',
    yAxisLabel: '',
    yAxisUnits: '',
    yAxisValues: [],
  });
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

// Nothing for mock
export const fetchData = async (fileName: string) => {};
