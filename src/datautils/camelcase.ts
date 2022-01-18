/* eslint-disable @typescript-eslint/no-explicit-any */
import camelCase from 'camelcase';

/**
 * Convert json input keys to camelcase
 * @param {*} data
 */
export function convertToCamelCase(data: any): any {
  if (Array.isArray(data)) {
    return data.map((p) => {
      if (typeof p === 'object' && p != null) {
        return convertToCamelCase(p);
      }
      return p;
    });
  }

  const res = Object.keys(data).reduce((obj: any, key) => {
    let d = data[key];
    if (typeof d === 'object' && d != null) {
      d = convertToCamelCase(d);
    }
    obj[camelCase(key)] = d;
    return obj;
  }, {});

  return res;
}
