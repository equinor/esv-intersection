export class Axis {
  constructor(
    from: number,
    to: number,
    maxLengthInPx: number,
    orientation: Orientation
  ) {}
  render() {
    return "<h1>hei</h1>";
  }
}

export enum Orientation {
  ONE,
  TWO
}
