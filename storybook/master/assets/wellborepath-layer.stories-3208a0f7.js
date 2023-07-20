import{I as y,C as k}from"./MainController-6bf5fec0.js";import{c as f,a as u,d as S,Z as z}from"./elements-7cf8c049.js";import{W as g}from"./WellborePathLayer-6c4610ab.js";import{g as W}from"./data-d6ca7689.js";import"./axis-d094e8fd.js";import"./_commonjsHelpers-725317a4.js";const t=700,a=600,r=()=>{const e=f(t),o=u(t,a),c=S();return W().then(i=>{const p={order:1,strokeWidth:"2px",stroke:"black",referenceSystem:new y(i)},s=new g("wellborepath",p);s.onMount({elm:o,width:t,height:a});const n=new z(o,P=>{s.onRescale(P)});n.setBounds([0,1e3],[0,1e3]),n.adjustToSize(t,a),n.setViewport(1e3,1e3,5e3),e.appendChild(o),e.appendChild(c)}),e},l=()=>{const e=f(t),o=u(t,a),c=S();return W().then(i=>{const p={order:1,strokeWidth:"2px",stroke:"black",referenceSystem:new y(i)},s=new g("wellborepath",p),n=new k({container:o,layers:[s]});n.setBounds([0,1e3],[0,1e3]),n.adjustToSize(t,a),n.setViewport(1e3,1e3,5e3),e.appendChild(o),e.appendChild(c)}),e},j={title:"ESV Intersection/Features/Wellborepath",component:r};var h,d,m;r.parameters={...r.parameters,docs:{...(h=r.parameters)==null?void 0:h.docs,source:{originalSource:`() => {
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
}`,...(L=(w=l.parameters)==null?void 0:w.docs)==null?void 0:L.source}}};const B=["WellborepathUsingLowLevelInterface","WellborepathUsingHighLevelInterface"];export{l as WellborepathUsingHighLevelInterface,r as WellborepathUsingLowLevelInterface,B as __namedExportsOrder,j as default};
//# sourceMappingURL=wellborepath-layer.stories-3208a0f7.js.map
