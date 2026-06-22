import{i as e}from"./preload-helper-xPQekRTU.js";import{a as t,ht as n,l as r,m as i,o as a,r as o,t as s,ut as c}from"./utils-CwHZxYAM.js";import{t as l}from"./src-4xajX19V.js";import{d as u,f as d}from"./data-DjlWSgKa.js";var f,p,m,h,g,_;e((()=>{l(),d(),s(),f=700,p=600,m=()=>{let e=a(f),r=t(f,p),s=o();return u().then(t=>{let a=new i(`wellborepath`,{order:1,strokeWidth:`2px`,stroke:`black`,referenceSystem:new n(t)});a.onMount({elm:r,width:f,height:p});let o=new c(r,e=>{a.onRescale(e)});o.setBounds([0,1e3],[0,1e3]),o.adjustToSize(f,p),o.setViewport(1e3,1e3,5e3),e.appendChild(r),e.appendChild(s)}),e},h=()=>{let e=a(f),s=t(f,p),c=o();return u().then(t=>{let a=new r({container:s,layers:[new i(`wellborepath`,{order:1,strokeWidth:`2px`,stroke:`black`,referenceSystem:new n(t)})]});a.setBounds([0,1e3],[0,1e3]),a.adjustToSize(f,p),a.setViewport(1e3,1e3,5e3),e.appendChild(s),e.appendChild(c)}),e},g={title:`ESV Intersection/Features/Wellborepath`,component:m},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
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
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`() => {
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
}`,...h.parameters?.docs?.source}}},_=[`WellborepathUsingLowLevelInterface`,`WellborepathUsingHighLevelInterface`]}))();export{h as WellborepathUsingHighLevelInterface,m as WellborepathUsingLowLevelInterface,_ as __namedExportsOrder,g as default};