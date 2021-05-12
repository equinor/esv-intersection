/* eslint-disable no-magic-numbers */

/**
 * Find index where value[index] =< searchValue and value[index+1] >= searchValue using binary search
 * @param {Number} values Array of sorted values
 * @param {Number} searchValue Value to search for
 */
export class BinarySearch {
  static search(values: number[], searchValue: number): number {
    let il = 0;
    let ih = values.length - 1;
    let i = Math.floor(il + ih / 2);
    while (i > il && i < ih) {
      const v = values[i];
      const v1 = values[i + 1];
      if (v <= searchValue && v1 >= searchValue) {
        return i;
      }
      if (searchValue < v) {
        ih = i;
      } else {
        il = i;
      }
      i = Math.floor(il + ih / 2);
    }
    return i;
  }
}
