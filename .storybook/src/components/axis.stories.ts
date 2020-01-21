import { Axis, Orientation } from "../../../src/components/axis";

export default {
  title: "Axis"
};

export const SingleAxis = () => {
  const div = document.createElement("div");
  const axis = new Axis(0, 2000, 500, Orientation.ONE);
  div.innerHTML = axis.render();
  return div;
};
