import { Axis, Orientation } from "../../../src/components/axis";

export default {
  title: "Axis"
};

export const SingleAxis = () => {
  const div = document.createElement("div");
  const args = {
    mainGroup: "#mg",
    x: 100,
    y: 200,
    width: 150,
    height: 250,
    orientation: Orientation.ONE,
    showLabels: true
  };
  const axis = new Axis({ ...args });
  div.innerHTML = axis.render();
  return div;
};
