import { mockedWellborePath, cementData, holeSizeData, casingData } from '../exampledata';

export const getWellborePath = () => {
  return mockedWellborePath;
};

export const getPositionLog = () => {
  const plog = mockedWellborePath.map((coords) => {
    return { easting: coords[0], northing: coords[1], tvd: coords[2] };
  });
  return plog;
};

export const getCompletion = (): any[] => {
  return [];
};

export const getSurfaces = (): any[] => {
  return [];
};

export const getStratColumns = (): any[] => {
  return [];
};

export const getSeismic = (): any => {
  return {
    requestId: '',
    fileId: '',
    fieldGuid: 0,
    fieldIdentifier: '',
    dateLastChange: '',
    yAxisLabel: '',
    yAxisUnits: '',
    yAxisValues: [],
  };
};

export const getHolesize = (): any[] => {
  return holeSizeData;
};

export const getCasings = (): any[] => {
  console.log(casingData);
  return casingData;
};

export const getCement = (): any[] => {
  return cementData;
};
