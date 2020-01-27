import { Axis, Orientation } from '../../../src/components/axis'
import { select } from 'd3-selection'

export default {
  title: 'Axis',
}

export const SingleAxis = () => {
  const div = document.createElement('div')
  const svg = select(div).append('svg')
  const args = {
    mainGroup: svg,
    x: 100,
    y: 200,
    width: 150,
    height: 250,
    orientation: Orientation.ONE,
    showLabels: true,
  }
  const axis = new Axis(
    args.mainGroup,
    args.x,
    args.y,
    args.width,
    args.height,
    args.orientation,
    args.showLabels,
  )
  div.innerHTML = axis.render()
  return div
}
