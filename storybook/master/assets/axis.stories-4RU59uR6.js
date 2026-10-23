import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{J as t,Q as n,Y as r,Z as i,a,c as o,i as s,n as c,nt as l,o as u,r as d,tt as f}from"./elements-DVs0HI8I.js";import{t as p}from"./src-7j-v1osd.js";var m,h,g,_,v,y;function b(){return(b=e((()=>{l(),i(),p(),u(),t(),m=500,h=300,g=()=>{let e=a(m),t=s(m,h),i=n(t).append(`svg`).attr(`height`,`${h}px`).attr(`width`,`${m}px`).style(`background-color`,`#eee`),o=new f(i,!0,`x`,`y`,`m`),l=new r(t,e=>{o.onRescale(e)});return l.setBounds([0,1e3],[0,1e3]),l.adjustToSize(m-40,h-30),e.appendChild(d(`Low level interface for creating and displaying an axis, there is also a zoom and pan handler connected`)),e.appendChild(t),e.appendChild(c()),e},_=()=>{let e=a(m),t=s(m,h),n=new o({container:t,axisOptions:{xLabel:`x`,yLabel:`y`,unitOfMeasure:`m`}});return n.setBounds([0,1e3],[0,1e3]),n.adjustToSize(m,h),e.appendChild(d(`High level interface for creating and displaying an axis, there is also a zoom and pan handler connected`)),e.appendChild(t),e.appendChild(c()),e},v={title:`ESV Intersection/Features/Axis`,component:g},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`() => {
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
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`() => {
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
}`,..._.parameters?.docs?.source}}},y=[`AxisUsingLowLevelInterface`,`AxisUsingHighLevelInterface`]})))()}b();export{_ as AxisUsingHighLevelInterface,g as AxisUsingLowLevelInterface,y as __namedExportsOrder,v as default};