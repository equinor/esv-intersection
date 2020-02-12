export class SurfaceGenerator {
  numCoords = 500;
  multiplier = 15;

  generateXValues = (): number[] => {
    let prevVal = 0;
    const xValues: number[] = [];
    for (let i = 0; i < this.numCoords; i++) {
      const newVal = (prevVal += Math.random() * this.multiplier);
      xValues.push(newVal);
      prevVal = newVal;
    }

    return xValues;
  };

  upDown = () => (Math.random() < 0.5 ? 1 : -1);

  generateLine = (offset: number) => {
    const values: number[] = [];
    for (let u = 0; u < this.numCoords; u++) {
      const newVal = offset + Math.random() * this.multiplier * this.upDown();
      values.push(newVal);
    }
    return values;
  };

  generateData = (): [number[], number[], number[]][] => {
    const xValues = this.generateXValues();
    let yValues: number[][] = [];
    let yBottomValues: number[][] = [];

    // Each surface y coords
    for (let i = 0; i < 10; i++) {
      // First top layer is generated, second is copied from previous bottom
      yValues.push(i === 0 ? this.generateLine(200) : yBottomValues[i - 1]);

      // Generate bottom layer
      yBottomValues.push(this.generateLine(200 + i * 50));
    }

    const res: [number[], number[], number[]][] = [];
    yValues.map((y, index) => res.push([xValues, y, yBottomValues[index]]));
    return res;
  };
}
