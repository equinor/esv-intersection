import { axisRight, axisBottom } from 'd3-axis'
import { scaleLinear } from 'd3-scale'
import { BaseType } from 'd3'

export class Axis {
  labelxx: d3.Selection<BaseType, any, null, undefined>
  yAxiss: d3.Selection<BaseType, any, null, undefined>

  constructor(
    mainGroup: d3.Selection<SVGElement, any, null, undefined>,
    x: number,
    y: number,
    width: number,
    height: number,
    orientation: Orientation,
    showLabels = true,
  ) {
    const scalex = scaleLinear()
      .domain([x, y])
      .range([x, y])

    const xAxis = axisBottom(scalex)
    const yAxis = axisRight(scalex)

    const gx = this.gx(mainGroup, xAxis, height)

    const gy = this.gy(mainGroup, yAxis, width)

    let labely = gy.select('text.axis-labely')
    if (showLabels) {
      if (labely.empty()) {
        labely = gy
          .append('text')
          .attr('class', 'axis-labely')
          .attr('fill', 'rgba(0,0,0,0.3)')
          .style('text-anchor', 'middle')
          .style('font-weight', '800')
          .style('font-size', '10px')
          .text('TVD MSL (m)')
      }
      labely.attr('transform', `translate(-10,${height / 2})rotate(90)`)
    } else {
      labely.remove()
    }
    const labelx = this.labelx(mainGroup, gx, showLabels, width)
    this.labelxx = labelx
    this.yAxiss = gy
  }

  labelx(
    mainGroup: any,
    gx: d3.Selection<BaseType, any, null, undefined>,
    showLabels: any,
    width: any,
  ): d3.Selection<BaseType, any, null, undefined> {
    let labelx = gx.select('text.axis-labelx')
    if (showLabels) {
      if (labelx.empty()) {
        labelx = gx
          .append('text')
          .attr('class', 'axis-labelx')
          .attr('fill', 'rgba(0,0,0,0.3)')
          .style('text-anchor', 'middle')
          .style('font-weight', '800')
          .style('font-size', '10px')
          .text('Displacement (m)')
      }
    } else {
      labelx.remove()
    }
    labelx.attr('transform', `translate(${width / 2},-4)`)
    return labelx
  }

  gy(
    mainGroup: d3.Selection<BaseType, any, null, undefined>,
    yAxis: any,
    width: any,
  ): d3.Selection<BaseType, any, null, undefined> {
    let gy = mainGroup.select('g.y-axis')
    if (gy.empty()) {
      gy = mainGroup.append('g').attr('class', 'y-axis')
    }
    gy.call(yAxis)
    gy.attr('transform', `translate(${width},0)`)

    return gy
  }

  gx(
    mainGroup: d3.Selection<BaseType, any, null, undefined>,
    xAxis: any,
    height: any,
  ): d3.Selection<BaseType, any, null, undefined> {
    let gx = mainGroup.select('g.x-axis')
    if (gx.empty()) {
      gx = mainGroup.append('g').attr('class', 'x-axis')
    }
    gx.attr('transform', `translate(0, ${height})`)
    gx.call(xAxis)
    return gx
  }
  render() {
    return this.yAxiss.html()
  }
}

export enum Orientation {
  ONE,
  TWO,
}
