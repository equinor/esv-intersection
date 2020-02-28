import { Axis } from '../../../src/components';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';

export default {
  title: 'Axis',
};

export const SingleAxis = () => {
  const div = document.createElement('div');
  div.setAttribute('style', 'background-color: white; width: 1000px;');

  const svg = select(div)
    .append('svg')
    .attr('height', '1000px')
    .attr('width', '1000px');

  const createScale = (
    xMin: number,
    xMax: number,
    yMin: number,
    yMax: number,
    height: number,
    width: number,
  ) => {
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

  const axis = new Axis(
    mainGroup,
    scaleX,
    scaleY,
    showLabels,
    'Displacement',
    'TVD MSL',
    'm',
  );
  axis.render();
  return div;
};
