import{I as b,C as W}from"./MainController.bb1db3a7.js";import{c as m,b as w,d as y,Z as C}from"./elements.b2968f38.js";import{W as L}from"./WellborePathLayer.669d3395.js";import{g as f}from"./data.640a7923.js";import"./GridLayer.fc0b255b.js";import"./_commonjsHelpers.4e997714.js";const n=700,r=600,s=()=>{const e=m(n),o=w(n,r),l=y();return f().then(c=>{const i={order:1,strokeWidth:"2px",stroke:"black",referenceSystem:new b(c)},a=new L("wellborepath",i);a.onMount({elm:o,width:n,height:r});const t=new C(o,S=>{a.onRescale(S)});t.setBounds([0,1e3],[0,1e3]),t.adjustToSize(n,r),t.setViewport(1e3,1e3,5e3),e.appendChild(o),e.appendChild(l)}),e},p=()=>{const e=m(n),o=w(n,r),l=y();return f().then(c=>{const i={order:1,strokeWidth:"2px",stroke:"black",referenceSystem:new b(c)},a=new L("wellborepath",i),t=new W({container:o,layers:[a]});t.setBounds([0,1e3],[0,1e3]),t.adjustToSize(n,r),t.setViewport(1e3,1e3,5e3),e.appendChild(o),e.appendChild(l)}),e},R={title:"ESV Intersection/Features/Wellborepath",component:s};var h;s.parameters={...s.parameters,storySource:{source:`() => {
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
}`,...(h=s.parameters)==null?void 0:h.storySource}};var d;p.parameters={...p.parameters,storySource:{source:`() => {
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
}`,...(d=p.parameters)==null?void 0:d.storySource}};const v=["WellborepathUsingLowLevelInterface","WellborepathUsingHighLevelInterface"];export{p as WellborepathUsingHighLevelInterface,s as WellborepathUsingLowLevelInterface,v as __namedExportsOrder,R as default};
//# sourceMappingURL=wellborepath-layer.stories.08961eda.js.map
