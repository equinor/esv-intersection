import{A as S}from"./GridLayer-c4d0ce91.js";import{c as m,d as L,s as v,Z as H,H as O,j as I,f as w,e as g}from"./elements-c524eb90.js";import{C as R}from"./MainController-41902cc8.js";import"./_commonjsHelpers-28e086c5.js";const n=500,r=300,t=()=>{const e=m(n),o=L(n,r),i=v(o).append("svg").attr("height",`${r}px`).attr("width",`${n}px`).style("background-color","#eee"),s=!0,y="x",f="y",C="m",b=new S(i,s,y,f,C),c=new H(o,A=>{b.onRescale(A)});return c.setBounds([0,1e3],[0,1e3]),c.adjustToSize(n-O,r-I),e.appendChild(w("Low level interface for creating and displaying an axis, there is also a zoom and pan handler connected")),e.appendChild(o),e.appendChild(g()),e},a=()=>{const e=m(n),o=L(n,r),i={xLabel:"x",yLabel:"y",unitOfMeasure:"m"},s=new R({container:o,axisOptions:i});return s.setBounds([0,1e3],[0,1e3]),s.adjustToSize(n,r),e.appendChild(w("High level interface for creating and displaying an axis, there is also a zoom and pan handler connected")),e.appendChild(o),e.appendChild(g()),e},G={title:"ESV Intersection/Features/Axis",component:t};var l,d,h;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`() => {
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
}`,...(h=(d=t.parameters)==null?void 0:d.docs)==null?void 0:h.source}}};var p,u,x;a.parameters={...a.parameters,docs:{...(p=a.parameters)==null?void 0:p.docs,source:{originalSource:`() => {
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
}`,...(x=(u=a.parameters)==null?void 0:u.docs)==null?void 0:x.source}}};t.parameters={storySource:{source:`() => {
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
}`},...t.parameters};a.parameters={storySource:{source:`() => {
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
}`},...a.parameters};const j=["AxisUsingLowLevelInterface","AxisUsingHighLevelInterface"];export{a as AxisUsingHighLevelInterface,t as AxisUsingLowLevelInterface,j as __namedExportsOrder,G as default};
//# sourceMappingURL=axis.stories-082f8aa0.js.map
