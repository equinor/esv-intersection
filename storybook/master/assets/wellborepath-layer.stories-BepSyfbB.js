import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{$ as t,Y as n,a as r,c as i,i as a,n as o,o as s,p as c}from"./elements-DhEJT-72.js";import{t as l}from"./src-DUG0gKZe.js";import{d as u,f as d}from"./data-5ctOw4ip.js";var f,p,m,h,g,_,v;function y(){return(y=e((()=>{l(),d(),s(),f=800,p=600,m=()=>{let e=r(f),i=a(f,p),s=o();return u().then(r=>{let a={order:1,strokeWidth:`2px`,stroke:`black`,referenceSystem:new t(r)},o=new c(`wellborepath`,a);o.onMount({elm:i,width:f,height:p});let l=new n(i,e=>{o.onRescale(e)});l.setBounds([0,1e3],[0,1e3]),l.adjustToSize(f,p,!1),l.setViewport(2e3,2e3,7e3),e.appendChild(i),e.appendChild(s)}),e},h=()=>{let e=r(f),n=a(f,p),s=o();return u().then(r=>{let a={order:1,strokeWidth:`2px`,stroke:`black`,referenceSystem:new t(r)},o=new c(`wellborepath`,a),l=new i({container:n,layers:[o]});l.setBounds([0,1e3],[0,1e3]),l.adjustToSize(f,p),l.setViewport(2e3,2e3,7e3),e.appendChild(n),e.appendChild(s)}),e},g=()=>{let e=r(f),n=a(f,p),s=o();return u().then(r=>{let a=new t(r).projectedPath,o=[];if(a.length>=2){let e=a[a.length-1],t=a[a.length-2],n=e[0]-t[0],r=e[1]-t[1];for(let t=1;t<=30;t++)o.push([e[0]+n*5*t,e[1]+r*5*t])}let l=[...a,...o],u={order:1,strokeWidth:`2px`,stroke:`red`,extrapolationStartIndex:a.length,extrapolatedStroke:`#000`,extrapolatedStrokeWidth:`2px`,extrapolatedOpacity:1,extrapolatedStrokeDasharray:`6 4`},d=new c(`wellborepath`,u);d.setData(l);let m=new i({container:n,layers:[d]});m.setBounds([0,1e3],[0,1e3]),m.adjustToSize(f,p),m.setViewport(3e3,3e3,1e4),e.appendChild(n),e.appendChild(s)}),e},_={title:`ESV Intersection/Features/Wellborepath`,component:m},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
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
}`,...g.parameters?.docs?.source}}},v=[`WellborepathUsingLowLevelInterface`,`WellborepathUsingHighLevelInterface`,`WellborepathWithExtrapolation`]})))()}y();export{h as WellborepathUsingHighLevelInterface,m as WellborepathUsingLowLevelInterface,g as WellborepathWithExtrapolation,v as __namedExportsOrder,_ as default};