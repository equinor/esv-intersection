export function findIndexOfSample(data: number[][], pos: number): number {
  if (data.length < 2) {
    return -1;
  }

  const linearSearchLimit = 20;
  let a = 0;
  let b = data.length - 1;
  let aPos = data[a]?.[0];
  let bPos = data[b]?.[0];

  while (b - a > linearSearchLimit) {
    const splitAt = Math.floor((b + a) / 2);
    const splitPos = data[splitAt]?.[0];

    if (aPos == null || bPos == null || splitPos == null) {
      return -1;
    }

    if (pos >= aPos && pos < splitPos) {
      b = splitAt;
      bPos = data[b]?.[0];
    } else if (pos >= splitPos && pos <= bPos) {
      a = splitAt;
      aPos = data[a]?.[0];
    } else if (pos <= aPos && pos > splitPos) {
      b = splitAt;
      bPos = data[b]?.[0];
    } else if (pos <= splitPos && pos >= bPos) {
      a = splitAt;
      aPos = data[a]?.[0];
    } else {
      return -1;
    }
  }

  let index = -1;
  for (let i = a; i < b; i++) {
    const v1 = data[i]?.[0];
    const v2 = data[i + 1]?.[0];
    if (v1 != null && v2 != null && Math.min(v1, v2) <= pos && pos <= Math.max(v1, v2)) {
      index = i;
      break;
    }
  }

  return index;
}

export function findSampleAtPos(data: number[][], pos: number, topLimit: number = null, bottomLimit: number = null): number {
  let y: number = null;
  const index = findIndexOfSample(data, pos);
  if (index !== -1) {
    const v1 = data[index][1];
    const v2 = data[index + 1][1];
    if (v2 && v2) {
      const x1 = data[index][0];
      const x2 = data[index + 1][0];
      const span = x2 - x1;
      const d = pos - x1;
      const f = d / span;
      y = v1 * (1 - f) + v2 * f;
      if (topLimit && topLimit > y) {
        y = topLimit;
      }
      if (bottomLimit && bottomLimit < y) {
        y = bottomLimit;
      }
    }
  }
  return y;
}
