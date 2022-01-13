import { scaleLinear, zoomIdentity } from 'd3';
import { OnRescaleEvent } from '../src';

export function rescaleEventStub(data: any): OnRescaleEvent {
  const xBounds = [0, 1000] as [number, number];
  const yBounds = [0, 1000] as [number, number];
  const event = {
    data,
    xBounds,
    yBounds,
    zFactor: 1,
    viewportRatio: 1,
    xRatio: 1,
    yRatio: 1,
    width: 1,
    height: 1,
    transform: zoomIdentity,
    xScale: scaleLinear().domain(xBounds).range([0, 1]),
    yScale: scaleLinear().domain(yBounds).range([0, 1]),
  };

  return event;
}
