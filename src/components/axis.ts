import { axisRight, axisBottom } from "d3-axis";
import { scaleLinear } from "d3-scale";

export class Axis {
  constructor(
    mainGroup: any,
    x: number,
    y: number,
    width: number,
    height: number,
    orientation: Orientation,
    showLabels = true
  ) {
    const scalex = scaleLinear()
      .domain([x, y])
      .range([x, y]);

    const xAxis = axisBottom(scalex);
    const yAxis = axisRight(scalex);

    const gx = this.gx(mainGroup, xAxis, height);

    const gy = this.gy(mainGroup, yAxis, width);

    let labely = gy.select("text.axis-labely");
    if (showLabels) {
      if (labely.empty()) {
        labely = gy
          .append("text")
          .attrs({
            class: "axis-labely",
            fill: "rgba(0,0,0,0.3)"
          })
          .styles({
            "text-anchor": "middle",
            "font-weight": "800",
            "font-size": "10px"
          })
          .text("TVD MSL (m)");
      }
      labely.attr("transform", `translate(-10,${height / 2})rotate(90)`);
    } else {
      labely.remove();
    }
    const labelx = this.labelx(mainGroup, gx, showLabels, width);
  }

  labelx(mainGroup: any, gx: any, showLabels: any, width: any) {
    let labelx = gx.select("text.axis-labelx");
    if (showLabels) {
      if (labelx.empty()) {
        labelx = gx
          .append("text")
          .attrs({
            class: "axis-labelx",
            fill: "rgba(0,0,0,0.3)"
          })
          .styles({
            "text-anchor": "middle",
            "font-weight": "800",
            "font-size": "10px"
          })
          .text("Displacement (m)");
      }
    } else {
      labelx.remove();
    }
    labelx.attr("transform", `translate(${width / 2},-4)`);
    return labelx;
  }

  gy(mainGroup: any, yAxis: any, width: any) {
    let gy = mainGroup.select("g.y-axis");
    if (gy.empty()) {
      gy = mainGroup.append("g").attrs({ class: "y-axis" });
    }
    gy.call(yAxis);
    gy.attrs({
      transform: `translate(${width},0)`
    });

    return gy;
  }

  gx(mainGroup: any, xAxis: any, height: any) {
    let gx = mainGroup.select("g.x-axis");
    if (gx.empty()) {
      gx = mainGroup.append("g").attrs({ class: "x-axis" });
    }
    gx.attrs({
      transform: `translate(0, ${height})`
    });
    gx.call(xAxis);
    return gx;
  }
  render() {
    return "<h1>hei</h1>";
  }
}

export enum Orientation {
  ONE,
  TWO
}
