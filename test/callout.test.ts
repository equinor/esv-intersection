const checkForOverlap = (r1: any, r2: any) => {
  const r1x2 = r1.x + r1.width;
  const r2x2 = r2.x + r2.width;
  const r1y2 = r1.y + r1.height;
  const r2y2 = r2.y + r2.height;

  if (r2.x > r1x2 || r2.y > r1y2 || r2x2 < r1.x || r2y2 < r1.y) {
    return null;
  }

  const dx = Math.max(0, Math.min(r1.x + r1.width, r2.x + r2.width) - Math.max(r1.x, r2.x));
  const dy = Math.max(0, Math.min(r1.y + r1.height, r2.y + r2.height) - Math.max(r1.y, r2.y));

  const newPoints = {
    dx,
    dy,
  };
  return newPoints;
};

const t1Width = 150;
const t2Width = 130;
const height = 12;

describe('callout', () => {
  describe('overlap', () => {
    it('should return offset values when there is overlap of two text in x- and y-direction', () => {
      const one = {
        x: 0,
        y: 0,
        width: t1Width,
        height,
      };
      const two = {
        x: 50,
        y: 8,
        width: t2Width,
        height,
      };
      const actual = checkForOverlap(one, two);
      const actual2 = checkForOverlap(two, one);
      const offset = {
        dx: 100,
        dy: 4,
      };
      expect(actual).toEqual(offset);
      expect(actual2).toEqual(offset);
    });
    it('should return null for two texts not overlapping in y-direction', () => {
      const one = {
        x: 0,
        y: 0,
        width: t1Width,
        height,
      };
      const two = {
        x: 50,
        y: 13,
        width: t2Width,
        height,
      };
      const actual = checkForOverlap(one, two);
      const actual2 = checkForOverlap(two, one);
      expect(actual).toEqual(null);
      expect(actual2).toEqual(null);
    });
    it('should return null for two texts not overlapping in x-direction', () => {
      const one = {
        x: 0,
        y: 0,
        width: t1Width,
        height,
      };
      const two = {
        x: 151,
        y: 8,
        width: t2Width,
        height,
      };
      const actual = checkForOverlap(one, two);
      const actual2 = checkForOverlap(two, one);
      expect(actual).toEqual(null);
      expect(actual2).toEqual(null);
    });
    it('should highlight two overlapping texts', () => {
      const arr = [
        {
          x: 0,
          y: 0,
          width: t1Width,
          height,
        },
        {
          x: 50,
          y: 8,
          width: t2Width,
          height,
        },
        {
          x: 200,
          y: 0,
          width: t1Width,
          height,
        },
      ];

      let overlap = [];

      for (let i = 0; i < arr.length; i++) {
        const eli = arr[i];
        for (let j = 0; j < arr.length; j++) {
          const elj = arr[j];
          if (i !== j) {
            const overlapping = checkForOverlap(eli, elj);
            if (overlapping) {
              overlap.push(eli);
            }
          }
        }
      }
      const expectation = [
        {
          x: 0,
          y: 0,
          width: t1Width,
          height,
        },
        {
          x: 50,
          y: 8,
          width: t2Width,
          height,
        },
      ];
      expect(overlap).toEqual(expectation);
    });
    it('should highlight three overlapping texts', () => {
      const arr = [
        {
          id: 0,
          x: 0,
          y: 0,
          width: t1Width,
          height,
        },
        {
          id: 1,
          x: 50,
          y: 8,
          width: t2Width,
          height,
        },
        {
          id: 2,
          x: 200,
          y: 40,
          width: t1Width,
          height,
        },
        {
          id: 3,
          x: 120,
          y: 8,
          width: t1Width,
          height,
        },
      ];

      let overlap = [];

      for (let i = 0; i < arr.length; i++) {
        const eli = arr[i];
        for (let j = 0; j < arr.length; j++) {
          const elj = arr[j];
          if (i !== j) {
            const overlapping = checkForOverlap(eli, elj);
            if (overlapping) {
              const exist = overlap.find((s) => s.id === eli.id);
              if (!exist) {
                overlap.push(eli);
              }
            }
          }
        }
      }
      const expectation = [
        {
          id: 0,
          x: 0,
          y: 0,
          width: t1Width,
          height,
        },
        {
          id: 1,
          x: 50,
          y: 8,
          width: t2Width,
          height,
        },
        {
          id: 3,
          x: 120,
          y: 8,
          width: t1Width,
          height,
        },
      ];
      expect(overlap).toEqual(expectation);
    });
  });
});
