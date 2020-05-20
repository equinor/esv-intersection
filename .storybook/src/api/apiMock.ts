import { mockedWellborePath, cementData, holeSizeData, casingData } from '../exampledata';

export const getWellborePath = (): Promise<any> => {
  return Promise.resolve(mockedWellborePath);
};

export const getPositionLog = (): Promise<any> => {
  const plog = mockedWellborePath.map((coords) => {
    return { easting: coords[0], northing: coords[1], tvd: coords[2] };
  });
  return Promise.resolve(plog);
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
  console.log(casingData);
  return Promise.resolve(casingData);
};

export const getCement = (): Promise<any[]> => {
  return Promise.resolve(cementData);
};

// Nothing for mock
export const fetchData = async (fileName: string) => {};
