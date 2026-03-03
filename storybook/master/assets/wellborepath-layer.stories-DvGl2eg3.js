import{I as h,C as u}from"./MainController-BII56cSM.js";import{c as d,a as m,d as b,Z as S}from"./elements-DUrmcn_5.js";import{W as w}from"./WellborePathLayer-D36AqAmi.js";import{c as L}from"./data-D8Ls4_G-.js";import"./GridLayer-COqgr0cg.js";import"./preload-helper-PPVm8Dsz.js";import"./_commonjsHelpers-CqkleIqs.js";const n=700,a=600,r=()=>{const e=d(n),o=m(n,a),c=b();return L().then(i=>{const p={order:1,strokeWidth:"2px",stroke:"black",referenceSystem:new h(i)},s=new w("wellborepath",p);s.onMount({elm:o,width:n,height:a});const t=new S(o,f=>{s.onRescale(f)});t.setBounds([0,1e3],[0,1e3]),t.adjustToSize(n,a),t.setViewport(1e3,1e3,5e3),e.appendChild(o),e.appendChild(c)}),e},l=()=>{const e=d(n),o=m(n,a),c=b();return L().then(i=>{const p={order:1,strokeWidth:"2px",stroke:"black",referenceSystem:new h(i)},s=new w("wellborepath",p),t=new u({container:o,layers:[s]});t.setBounds([0,1e3],[0,1e3]),t.adjustToSize(n,a),t.setViewport(1e3,1e3,5e3),e.appendChild(o),e.appendChild(c)}),e},I={title:"ESV Intersection/Features/Wellborepath",component:r};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();
  getWellborePath().then(data => {
    const referenceSystem = new IntersectionReferenceSystem(data);
    const options: WellborepathLayerOptions<[number, number][]> = {
      order: 1,
      strokeWidth: '2px',
      stroke: 'black',
      referenceSystem
    };
    const wellborePathLayer = new WellborepathLayer('wellborepath', options);
    wellborePathLayer.onMount({
      elm: container,
      width,
      height
    });
    const zoomHandler = new ZoomPanHandler(container, (event: OnRescaleEvent) => {
      wellborePathLayer.onRescale(event);
    });
    zoomHandler.setBounds([0, 1000], [0, 1000]);
    zoomHandler.adjustToSize(width, height);
    zoomHandler.setViewport(1000, 1000, 5000);
    root.appendChild(container);
    root.appendChild(fpsLabel);
  });
  return root;
}`,...r.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();
  getWellborePath().then(data => {
    const referenceSystem = new IntersectionReferenceSystem(data);
    const options: WellborepathLayerOptions<[number, number][]> = {
      order: 1,
      strokeWidth: '2px',
      stroke: 'black',
      referenceSystem
    };
    const wellborePathLayer = new WellborepathLayer('wellborepath', options);
    const controller = new Controller({
      container,
      layers: [wellborePathLayer]
    });
    controller.setBounds([0, 1000], [0, 1000]);
    controller.adjustToSize(width, height);
    controller.setViewport(1000, 1000, 5000);
    root.appendChild(container);
    root.appendChild(fpsLabel);
  });
  return root;
}`,...l.parameters?.docs?.source}}};const R=["WellborepathUsingLowLevelInterface","WellborepathUsingHighLevelInterface"];export{l as WellborepathUsingHighLevelInterface,r as WellborepathUsingLowLevelInterface,R as __namedExportsOrder,I as default};
