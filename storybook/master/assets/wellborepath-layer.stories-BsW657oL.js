import{i as e}from"./preload-helper-xPQekRTU.js";import{a as t,ht as n,l as r,m as i,o as a,r as o,t as s,ut as c}from"./utils-kBbCFTX1.js";import{t as l}from"./src-D1cywwom.js";import{d as u,f as d}from"./data-DjlWSgKa.js";var f,p,m,h,g,_,v;e((()=>{l(),d(),s(),f=800,p=600,m=()=>{let e=a(f),r=t(f,p),s=o();return u().then(t=>{let a=new i(`wellborepath`,{order:1,strokeWidth:`2px`,stroke:`black`,referenceSystem:new n(t)});a.onMount({elm:r,width:f,height:p});let o=new c(r,e=>{a.onRescale(e)});o.setBounds([0,1e3],[0,1e3]),o.adjustToSize(f,p,!1),o.setViewport(2e3,2e3,7e3),e.appendChild(r),e.appendChild(s)}),e},h=()=>{let e=a(f),s=t(f,p),c=o();return u().then(t=>{let a=new r({container:s,layers:[new i(`wellborepath`,{order:1,strokeWidth:`2px`,stroke:`black`,referenceSystem:new n(t)})]});a.setBounds([0,1e3],[0,1e3]),a.adjustToSize(f,p),a.setViewport(2e3,2e3,7e3),e.appendChild(s),e.appendChild(c)}),e},g=()=>{let e=a(f),s=t(f,p),c=o();return u().then(t=>{let a=new n(t).projectedPath,o=[];if(a.length>=2){let e=a[a.length-1],t=a[a.length-2],n=e[0]-t[0],r=e[1]-t[1];for(let t=1;t<=30;t++)o.push([e[0]+n*5*t,e[1]+r*5*t])}let l=[...a,...o],u=new i(`wellborepath`,{order:1,strokeWidth:`2px`,stroke:`red`,extrapolationStartIndex:a.length,extrapolatedStroke:`#000`,extrapolatedStrokeWidth:`2px`,extrapolatedOpacity:1,extrapolatedStrokeDasharray:`6 4`});u.setData(l);let d=new r({container:s,layers:[u]});d.setBounds([0,1e3],[0,1e3]),d.adjustToSize(f,p),d.setViewport(3e3,3e3,1e4),e.appendChild(s),e.appendChild(c)}),e},_={title:`ESV Intersection/Features/Wellborepath`,component:m},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
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
    zoomHandler.adjustToSize(width, height, false);
    zoomHandler.setViewport(2000, 2000, 7000);
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
    controller.setViewport(2000, 2000, 7000);
    root.appendChild(container);
    root.appendChild(fpsLabel);
  });
  return root;
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();
  getWellborePath().then(data => {
    const referenceSystem = new IntersectionReferenceSystem(data);
    const projectedPath = referenceSystem.projectedPath as [number, number][];

    // Extend the trajectory linearly from the last segment to simulate an extrapolated tail.
    const extrapolatedPoints: [number, number][] = [];
    if (projectedPath.length >= 2) {
      const last = projectedPath[projectedPath.length - 1];
      const prev = projectedPath[projectedPath.length - 2];
      const dx = last[0] - prev[0];
      const dy = last[1] - prev[1];
      const steps = 30;
      const stepScale = 5;
      for (let i = 1; i <= steps; i++) {
        extrapolatedPoints.push([last[0] + dx * stepScale * i, last[1] + dy * stepScale * i]);
      }
    }
    const combined: [number, number][] = [...projectedPath, ...extrapolatedPoints];
    const options: WellborepathLayerOptions<[number, number][]> = {
      order: 1,
      strokeWidth: '2px',
      stroke: 'red',
      extrapolationStartIndex: projectedPath.length,
      extrapolatedStroke: '#000',
      extrapolatedStrokeWidth: '2px',
      extrapolatedOpacity: 1,
      extrapolatedStrokeDasharray: '6 4'
    };
    const wellborePathLayer = new WellborepathLayer('wellborepath', options);
    wellborePathLayer.setData(combined);
    const controller = new Controller({
      container,
      layers: [wellborePathLayer]
    });
    controller.setBounds([0, 1000], [0, 1000]);
    controller.adjustToSize(width, height);
    controller.setViewport(3000, 3000, 10000);
    root.appendChild(container);
    root.appendChild(fpsLabel);
  });
  return root;
}`,...g.parameters?.docs?.source}}},v=[`WellborepathUsingLowLevelInterface`,`WellborepathUsingHighLevelInterface`,`WellborepathWithExtrapolation`]}))();export{h as WellborepathUsingHighLevelInterface,m as WellborepathUsingLowLevelInterface,g as WellborepathWithExtrapolation,v as __namedExportsOrder,_ as default};