import{A as w}from"./GridLayer-02f0a062.js";import{c as p,d as h,s as C,Z as b,H as A,j as S,f as u,e as x}from"./elements-bce68b8a.js";import{C as I}from"./MainController-99ef3014.js";import"./_commonjsHelpers-28e086c5.js";const n=500,o=300,r=()=>{const e=p(n),t=h(n,o),s=C(t).append("svg").attr("height",`${o}px`).attr("width",`${n}px`).style("background-color","#eee"),a=!0,m="x",L="y",f="m",g=new w(s,a,m,L,f),c=new b(t,y=>{g.onRescale(y)});return c.setBounds([0,1e3],[0,1e3]),c.adjustToSize(n-A,o-S),e.appendChild(u("Low level interface for creating and displaying an axis, there is also a zoom and pan handler connected")),e.appendChild(t),e.appendChild(x()),e},i=()=>{const e=p(n),t=h(n,o),s={xLabel:"x",yLabel:"y",unitOfMeasure:"m"},a=new I({container:t,axisOptions:s});return a.setBounds([0,1e3],[0,1e3]),a.adjustToSize(n,o),e.appendChild(u("High level interface for creating and displaying an axis, there is also a zoom and pan handler connected")),e.appendChild(t),e.appendChild(x()),e},z={title:"ESV Intersection/Features/Axis",component:r};var l;r.parameters={...r.parameters,storySource:{source:`() => {
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
}`,...(l=r.parameters)==null?void 0:l.storySource}};var d;i.parameters={...i.parameters,storySource:{source:`() => {
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
}`,...(d=i.parameters)==null?void 0:d.storySource}};const T=["AxisUsingLowLevelInterface","AxisUsingHighLevelInterface"];export{i as AxisUsingHighLevelInterface,r as AxisUsingLowLevelInterface,T as __namedExportsOrder,z as default};
//# sourceMappingURL=axis.stories-a6411141.js.map
