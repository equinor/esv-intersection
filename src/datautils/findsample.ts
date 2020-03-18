// eslint-disable-next-line class-methods-use-this
export function findIndexOfSample(data: number[][], pos: number): number {
  let lowLim = 0;
  let highLim = data.length - 1;
  const linearSearchLimit = 20;

  while (highLim - lowLim > linearSearchLimit) {
    const mid = Math.floor((highLim + lowLim) / 2);
    const midX = data[mid][0];
    if (midX <= pos) {
      highLim = mid;
    } else {
      lowLim = mid;
    }
  }

  let index = -1;
  for (let i = lowLim; i < highLim; i++) {
    if (data[i][0] >= pos && data[i + 1][0] <= pos) {
      index = i;
      break;
    }
  }

  return index;
}

export function findSampleAtPos(data: number[][], pos: number, topLimit: number = null, bottomLimit: number = null): number {
  let y: number = null;
  const index = findIndexOfSample(data, pos);
  if (index !== -1 && data[index][1] && data[index + 1][1]) {
    const x: number = pos;
    const span = data[index + 1][0] - data[index][0];
    const d = pos - data[index][0];
    const f = d / span;
    y = data[index][1] * (1 - f) + data[index + 1][1] * f;
    if (topLimit && topLimit > y) {
      y = topLimit;
    }
    if (bottomLimit && bottomLimit < y) {
      y = bottomLimit;
    }
  }
  return y;
}
