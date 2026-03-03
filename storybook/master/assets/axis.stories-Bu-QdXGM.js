import{A as f}from"./GridLayer-COqgr0cg.js";import{c as l,a as d,b as p,d as h,s as w,Z as y,H as C,V as b}from"./elements-DUrmcn_5.js";import{C as A}from"./MainController-BII56cSM.js";import"./preload-helper-PPVm8Dsz.js";import"./_commonjsHelpers-CqkleIqs.js";const n=500,a=300,o=()=>{const e=l(n),t=d(n,a),i=w(t).append("svg").attr("height",`${a}px`).attr("width",`${n}px`).style("background-color","#eee"),r=!0,u="x",x="y",m="m",L=new f(i,r,u,x,m),c=new y(t,g=>{L.onRescale(g)});return c.setBounds([0,1e3],[0,1e3]),c.adjustToSize(n-C,a-b),e.appendChild(p("Low level interface for creating and displaying an axis, there is also a zoom and pan handler connected")),e.appendChild(t),e.appendChild(h()),e},s=()=>{const e=l(n),t=d(n,a),i={xLabel:"x",yLabel:"y",unitOfMeasure:"m"},r=new A({container:t,axisOptions:i});return r.setBounds([0,1e3],[0,1e3]),r.adjustToSize(n,a),e.appendChild(p("High level interface for creating and displaying an axis, there is also a zoom and pan handler connected")),e.appendChild(t),e.appendChild(h()),e},R={title:"ESV Intersection/Features/Axis",component:o};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const mainGroup = select(container).append('svg').attr('height', \`\${height}px\`).attr('width', \`\${width}px\`).style('background-color', '#eee') as unknown as Selection<SVGElement, unknown, null, undefined>;
  const showLabels = true;
  const xLabel = 'x';
  const yLabel = 'y';
  const unitOfMeasure = 'm';
  const axis = new Axis(mainGroup, showLabels, xLabel, yLabel, unitOfMeasure);
  const zoomHandler = new ZoomPanHandler(container, (event: OnRescaleEvent) => {
    axis.onRescale(event);
  });

  // overrides the default bounds of [0, 1]
  zoomHandler.setBounds([0, 1000], [0, 1000]);
  // adjusts the dimensions of the axis
  zoomHandler.adjustToSize(width - HORIZONTAL_AXIS_MARGIN, height - VERTICAL_AXIS_MARGIN);
  root.appendChild(createHelpText('Low level interface for creating and displaying an axis, there is also a zoom and pan handler connected'));
  root.appendChild(container);
  root.appendChild(createFPSLabel());
  return root;
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);

  // axisOptions passed into the controller when created is currently the only way to create the axis via the controller
  const axisOptions = {
    xLabel: 'x',
    yLabel: 'y',
    unitOfMeasure: 'm'
  };
  const controller = new Controller({
    container,
    axisOptions
  });

  // overrides the default bounds of [0, 1]
  controller.setBounds([0, 1000], [0, 1000]);
  // displays the axis (and any other connected layers)
  controller.adjustToSize(width, height);
  root.appendChild(createHelpText('High level interface for creating and displaying an axis, there is also a zoom and pan handler connected'));
  root.appendChild(container);
  root.appendChild(createFPSLabel());
  return root;
}`,...s.parameters?.docs?.source}}};const z=["AxisUsingLowLevelInterface","AxisUsingHighLevelInterface"];export{s as AxisUsingHighLevelInterface,o as AxisUsingLowLevelInterface,z as __namedExportsOrder,R as default};
