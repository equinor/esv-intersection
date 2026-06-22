import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t,F as n,I as r,L as i,a,ht as o,i as s,l as c,m as l,o as u,r as d,t as f,ut as p}from"./utils-CwHZxYAM.js";import{t as m}from"./src-4xajX19V.js";import{f as h,l as g,o as _,s as v}from"./data-DjlWSgKa.js";var y,b,x,S,C,w,T,E,D,O;e((()=>{m(),h(),r(),f(),y=[0,500],b=[0,500],x=500,S=500,C=500,w=500,T=()=>{let e=u(C),r=a(C,w);return Promise.all([v(),_(),g()]).then(e=>{let[a,s,c]=e,u=i(s,c),d=new o(a.map(e=>[e.easting,e.northing,e.tvd])),f=n(u),m=new l(`path`,{referenceSystem:d,stroke:`red`,strokeWidth:`1`}),h=new t(`callout`,{order:1,referenceSystem:d});h.onMount({elm:r}),m.onMount({elm:r}),h.onUpdate({data:f});let g=new p(r,e=>{h.onRescale(e),m.onRescale(e)});g.setBounds(y,b),g.adjustToSize(x,S),g.setViewport(1500,1500,3e3)}),e.appendChild(s(`Low level interface for creating and displaying a callout layer. We have also added a wellbore path to show the picks along its path. This layer is made using canvas.`)),e.appendChild(r),e.appendChild(d()),e},E=()=>{let e=u(C),r=a(C,w);return Promise.all([v(),_(),g()]).then(e=>{let[a,s,u]=e,d=i(s,u),f=new o(a.map(e=>[e.easting,e.northing,e.tvd])),p=n(d),m=new l(`path`,{referenceSystem:f,stroke:`red`,strokeWidth:`1`}),h=new t(`callout`,{order:1,data:p,referenceSystem:f}),g=new c({container:r,referenceSystem:f});g.addLayer(m),g.addLayer(h),g.setBounds(y,b),g.adjustToSize(x,S),g.setViewport(1500,1500,3e3)}),e.appendChild(s(`High level interface for creating and displaying a callout layer. We have also added a wellbore path to show the picks along its path. This layer is made using canvas.`)),e.appendChild(r),e.appendChild(d()),e},D={title:`ESV Intersection/Features/Callout`,component:T},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  Promise.all([getPositionLog(), getPicks(), getStratColumns()]).then(values => {
    const [poslog, picks, stratcolumn] = values;
    const transformedData = transformFormationData(picks, stratcolumn);
    const rs = new IntersectionReferenceSystem(poslog.map((p: any) => [p.easting, p.northing, p.tvd]));
    const picksData = getPicksData(transformedData);
    const wp = new WellborepathLayer('path', {
      referenceSystem: rs,
      stroke: 'red',
      strokeWidth: '1'
    });
    const layer = new CalloutCanvasLayer('callout', {
      order: 1,
      referenceSystem: rs
    });
    layer.onMount({
      elm: container
    });
    wp.onMount({
      elm: container
    });
    layer.onUpdate({
      data: picksData
    });
    const zoompanHandler = new ZoomPanHandler(container, event => {
      layer.onRescale(event);
      wp.onRescale(event);
    });
    zoompanHandler.setBounds(xBounds, yBounds);
    zoompanHandler.adjustToSize(xRange, yRange);
    zoompanHandler.setViewport(1500, 1500, 3000);
  });
  root.appendChild(createHelpText('Low level interface for creating and displaying a callout layer. We have also added a wellbore path to show the picks along its path. This layer is made using canvas.'));
  root.appendChild(container);
  root.appendChild(createFPSLabel());
  return root;
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  Promise.all([getPositionLog(), getPicks(), getStratColumns()]).then(values => {
    const [poslog, picks, stratcolumn] = values;
    const transformedData = transformFormationData(picks, stratcolumn);
    const rs = new IntersectionReferenceSystem(poslog.map((p: any) => [p.easting, p.northing, p.tvd]));
    const picksData = getPicksData(transformedData);
    const wp = new WellborepathLayer('path', {
      referenceSystem: rs,
      stroke: 'red',
      strokeWidth: '1'
    });
    const layer = new CalloutCanvasLayer('callout', {
      order: 1,
      data: picksData,
      referenceSystem: rs
    });
    const controller = new Controller({
      container,
      referenceSystem: rs
    });
    controller.addLayer(wp);
    controller.addLayer(layer);
    controller.setBounds(xBounds, yBounds);
    controller.adjustToSize(xRange, yRange);
    controller.setViewport(1500, 1500, 3000);
  });
  root.appendChild(createHelpText('High level interface for creating and displaying a callout layer. We have also added a wellbore path to show the picks along its path. This layer is made using canvas.'));
  root.appendChild(container);
  root.appendChild(createFPSLabel());
  return root;
}`,...E.parameters?.docs?.source}}},O=[`CalloutUsingLowLevelInterface`,`CalloutUsingHighLevelInterface`]}))();export{E as CalloutUsingHighLevelInterface,T as CalloutUsingLowLevelInterface,O as __namedExportsOrder,D as default};