import{I as L,C as k}from"./MainController-cab0cfd5.js";import{c as u,d as f,e as S,Z as z}from"./elements-c9ae7b8d.js";import{W as C}from"./WellborePathLayer-14cfe374.js";import{g as W}from"./data-e45bb153.js";import"./GridLayer-ed34e704.js";import"./_commonjsHelpers-28e086c5.js";const t=700,s=600,o=()=>{const e=u(t),r=f(t,s),c=S();return W().then(i=>{const p={order:1,strokeWidth:"2px",stroke:"black",referenceSystem:new L(i)},l=new C("wellborepath",p);l.onMount({elm:r,width:t,height:s});const n=new z(r,P=>{l.onRescale(P)});n.setBounds([0,1e3],[0,1e3]),n.adjustToSize(t,s),n.setViewport(1e3,1e3,5e3),e.appendChild(r),e.appendChild(c)}),e},a=()=>{const e=u(t),r=f(t,s),c=S();return W().then(i=>{const p={order:1,strokeWidth:"2px",stroke:"black",referenceSystem:new L(i)},l=new C("wellborepath",p),n=new k({container:r,layers:[l]});n.setBounds([0,1e3],[0,1e3]),n.adjustToSize(t,s),n.setViewport(1e3,1e3,5e3),e.appendChild(r),e.appendChild(c)}),e},V={title:"ESV Intersection/Features/Wellborepath",component:o};var h,d,b;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:`() => {
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
}`,...(b=(d=o.parameters)==null?void 0:d.docs)==null?void 0:b.source}}};var m,w,y;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`() => {
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
}`,...(y=(w=a.parameters)==null?void 0:w.docs)==null?void 0:y.source}}};o.parameters={storySource:{source:`() => {
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
}`},...o.parameters};a.parameters={storySource:{source:`() => {
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
}`},...a.parameters};const j=["WellborepathUsingLowLevelInterface","WellborepathUsingHighLevelInterface"];export{a as WellborepathUsingHighLevelInterface,o as WellborepathUsingLowLevelInterface,j as __namedExportsOrder,V as default};
//# sourceMappingURL=wellborepath-layer.stories-e802c026.js.map
