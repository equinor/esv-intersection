import { Axis } from '../../../src/components';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';

export default {
  title: 'Axis',
};

const width = 1000;
const height = 1000;

export const SingleAxis = () => {
  const div = document.createElement('div');
  div.setAttribute('style', `background-color: white; width: ${width}px;`);

  const svg = select(div)
    .append('svg')
    .attr('height', `${height}px`)
    .attr('width', `${width}px`);

  const createScale = (xMin: number, xMax: number, yMin: number, yMax: number, height: number, width: number) => {
    return [
      scaleLinear()
        .domain([xMin, xMax])
        .range([0, width]),
      scaleLinear()
        .domain([yMin, yMax])
        .range([0, height]),
    ];
  };

  const [scaleX, scaleY] = createScale(0, 250, 0, 300, 500, 600);
  const mainGroup = svg;
  const showLabels = true;

  const axis = new Axis(mainGroup, showLabels, 'Displacement', 'TVD MSL', 'm');
  axis.onRescale({xScale: scaleX, yScale: scaleY});
  return div;
};
