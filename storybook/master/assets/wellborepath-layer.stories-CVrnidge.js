import{I as y,C as k}from"./MainController-BrT9vEc5.js";import{c as f,a as u,d as S,Z as z}from"./elements-bFXFHGGJ.js";import{W}from"./WellborePathLayer-B27LKqGl.js";import{c as g}from"./data-D8Ls4_G-.js";import"./GridLayer-PgiAz4v5.js";import"./preload-helper-Dp1pzeXC.js";import"./_commonjsHelpers-CqkleIqs.js";const n=700,a=600,r=()=>{const e=f(n),o=u(n,a),c=S();return g().then(i=>{const p={order:1,strokeWidth:"2px",stroke:"black",referenceSystem:new y(i)},s=new W("wellborepath",p);s.onMount({elm:o,width:n,height:a});const t=new z(o,P=>{s.onRescale(P)});t.setBounds([0,1e3],[0,1e3]),t.adjustToSize(n,a),t.setViewport(1e3,1e3,5e3),e.appendChild(o),e.appendChild(c)}),e},l=()=>{const e=f(n),o=u(n,a),c=S();return g().then(i=>{const p={order:1,strokeWidth:"2px",stroke:"black",referenceSystem:new y(i)},s=new W("wellborepath",p),t=new k({container:o,layers:[s]});t.setBounds([0,1e3],[0,1e3]),t.adjustToSize(n,a),t.setViewport(1e3,1e3,5e3),e.appendChild(o),e.appendChild(c)}),e},B={title:"ESV Intersection/Features/Wellborepath",component:r};var h,d,m;r.parameters={...r.parameters,docs:{...(h=r.parameters)==null?void 0:h.docs,source:{originalSource:`() => {
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
}`,...(m=(d=r.parameters)==null?void 0:d.docs)==null?void 0:m.source}}};var b,w,L;l.parameters={...l.parameters,docs:{...(b=l.parameters)==null?void 0:b.docs,source:{originalSource:`() => {
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
}`,...(L=(w=l.parameters)==null?void 0:w.docs)==null?void 0:L.source}}};const F=["WellborepathUsingLowLevelInterface","WellborepathUsingHighLevelInterface"];export{l as WellborepathUsingHighLevelInterface,r as WellborepathUsingLowLevelInterface,F as __namedExportsOrder,B as default};
