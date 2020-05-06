import { mockedWellborePath } from '../exampledata';

export const fetchData = async (fileName: string) => {
  return await fetch(`https://api.github.com/repos/equinor/esv-intersection-data/contents/${fileName}`).then(async (res: Response) => {
    return res.json();
  }).then((data) => {
    if (data.content) {
      const content = JSON.parse(atob(data.content));
      return content;
    }
    return {};
  });
}


export const getWellborePath = () => {
  return fetchData('coordinates.json').then((data) => {
    const coords = data && data.length > 0 ? data : mockedWellborePath;
    return coords;
  });
}

export const getCompletion = () => {
  return fetchData('completion.json').then((data) => {
    return data && data.length > 0 ? data : [];
  });
}

export const getSurfaces = () => {
  return fetchData('surfaces.json').then((data) => {
    return data && data.length > 0 ? data : [];
  });
}

export const getStratColumns = () => {
  return fetchData('strat-columns.json').then((data) => {
    return data && data.length > 0 ? data : [];
  });
}

export const getSeismic = () => {
  return fetchData('seismic.json').then((data) => {
    return data && data.requestId ? data : {
      requestId: '',
      fileId: '',
      fieldGuid: 0,
      fieldIdentifier: '',
      dateLastChange: '',
      yAxisLabel: '',
      yAxisUnits: '',
      yAxisValues: []
    }
  });
}
