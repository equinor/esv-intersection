import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{$ as t,F as n,I as r,P as i,Y as a,a as o,c as s,i as c,n as l,o as u,p as d,r as f,z as p}from"./elements-DVs0HI8I.js";import{t as m}from"./src-7j-v1osd.js";import{f as h,l as g,o as _,s as v}from"./data-5ctOw4ip.js";var y,b,x,S,C,w,T,E,D,O;function k(){return(k=e((()=>{m(),h(),n(),u(),y=[0,500],b=[0,500],x=500,S=500,C=500,w=500,T=()=>{let e=o(C),n=c(C,w);return Promise.all([v(),_(),g()]).then(e=>{let[o,s,c]=e,l=r(s,c),u=new t(o.map(e=>[e.easting,e.northing,e.tvd])),f=i(l),m=new d(`path`,{referenceSystem:u,stroke:`red`,strokeWidth:`1`}),h=new p(`callout`,{order:1,referenceSystem:u});h.onMount({elm:n}),m.onMount({elm:n}),h.onUpdate({data:f});let g=new a(n,e=>{h.onRescale(e),m.onRescale(e)});g.setBounds(y,b),g.adjustToSize(x,S),g.setViewport(1500,1500,3e3)}),e.appendChild(f(`Low level interface for creating and displaying a callout layer. We have also added a wellbore path to show the picks along its path. This layer is made using canvas.`)),e.appendChild(n),e.appendChild(l()),e},E=()=>{let e=o(C),n=c(C,w);return Promise.all([v(),_(),g()]).then(e=>{let[a,o,c]=e,l=r(o,c),u=new t(a.map(e=>[e.easting,e.northing,e.tvd])),f=i(l),m=new d(`path`,{referenceSystem:u,stroke:`red`,strokeWidth:`1`}),h=new p(`callout`,{order:1,data:f,referenceSystem:u}),g=new s({container:n,referenceSystem:u});g.addLayer(m),g.addLayer(h),g.setBounds(y,b),g.adjustToSize(x,S),g.setViewport(1500,1500,3e3)}),e.appendChild(f(`High level interface for creating and displaying a callout layer. We have also added a wellbore path to show the picks along its path. This layer is made using canvas.`)),e.appendChild(n),e.appendChild(l()),e},D={title:`ESV Intersection/Features/Callout`,component:T},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`() => {
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
}`,...E.parameters?.docs?.source}}},O=[`CalloutUsingLowLevelInterface`,`CalloutUsingHighLevelInterface`]})))()}k();export{E as CalloutUsingHighLevelInterface,T as CalloutUsingLowLevelInterface,O as __namedExportsOrder,D as default};