import{i as e}from"./preload-helper-xPQekRTU.js";import{_t as t,a as n,ft as r,i,l as a,lt as o,mt as s,o as c,r as l,t as u,ut as d,vt as f}from"./utils-CwHZxYAM.js";import{t as p}from"./src-4xajX19V.js";var m,h,g,_,v,y;e((()=>{t(),r(),p(),u(),o(),m=500,h=300,g=()=>{let e=c(m),t=n(m,h),r=new f(s(t).append(`svg`).attr(`height`,`${h}px`).attr(`width`,`${m}px`).style(`background-color`,`#eee`),!0,`x`,`y`,`m`),a=new d(t,e=>{r.onRescale(e)});return a.setBounds([0,1e3],[0,1e3]),a.adjustToSize(m-40,h-30),e.appendChild(i(`Low level interface for creating and displaying an axis, there is also a zoom and pan handler connected`)),e.appendChild(t),e.appendChild(l()),e},_=()=>{let e=c(m),t=n(m,h),r=new a({container:t,axisOptions:{xLabel:`x`,yLabel:`y`,unitOfMeasure:`m`}});return r.setBounds([0,1e3],[0,1e3]),r.adjustToSize(m,h),e.appendChild(i(`High level interface for creating and displaying an axis, there is also a zoom and pan handler connected`)),e.appendChild(t),e.appendChild(l()),e},v={title:`ESV Intersection/Features/Axis`,component:g},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`() => {
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
}`,..._.parameters?.docs?.source}}},y=[`AxisUsingLowLevelInterface`,`AxisUsingHighLevelInterface`]}))();export{_ as AxisUsingHighLevelInterface,g as AxisUsingLowLevelInterface,y as __namedExportsOrder,v as default};