import{A as I}from"./GridLayer-7ca99885.js";import{c as m,d as L,s as v,Z as H,H as S,V as O,f as g,e as f}from"./elements-467e2c81.js";import{C as R}from"./MainController-bf8aba0b.js";import"./_commonjsHelpers-725317a4.js";const n=500,a=300,o=()=>{const e=m(n),t=L(n,a),i=v(t).append("svg").attr("height",`${a}px`).attr("width",`${n}px`).style("background-color","#eee"),r=!0,w="x",y="y",C="m",b=new I(i,r,w,y,C),c=new H(t,A=>{b.onRescale(A)});return c.setBounds([0,1e3],[0,1e3]),c.adjustToSize(n-S,a-O),e.appendChild(g("Low level interface for creating and displaying an axis, there is also a zoom and pan handler connected")),e.appendChild(t),e.appendChild(f()),e},s=()=>{const e=m(n),t=L(n,a),i={xLabel:"x",yLabel:"y",unitOfMeasure:"m"},r=new R({container:t,axisOptions:i});return r.setBounds([0,1e3],[0,1e3]),r.adjustToSize(n,a),e.appendChild(g("High level interface for creating and displaying an axis, there is also a zoom and pan handler connected")),e.appendChild(t),e.appendChild(f()),e},G={title:"ESV Intersection/Features/Axis",component:o};var l,d,p;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const mainGroup = ((select(container).append('svg').attr('height', \`\${height}px\`).attr('width', \`\${width}px\`).style('background-color', '#eee') as unknown) as Selection<SVGElement, unknown, null, undefined>);
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
}`,...(p=(d=o.parameters)==null?void 0:d.docs)==null?void 0:p.source}}};var h,u,x;s.parameters={...s.parameters,docs:{...(h=s.parameters)==null?void 0:h.docs,source:{originalSource:`() => {
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
}`,...(x=(u=s.parameters)==null?void 0:u.docs)==null?void 0:x.source}}};const E=["AxisUsingLowLevelInterface","AxisUsingHighLevelInterface"];export{s as AxisUsingHighLevelInterface,o as AxisUsingLowLevelInterface,E as __namedExportsOrder,G as default};
//# sourceMappingURL=axis.stories-1aa305aa.js.map
