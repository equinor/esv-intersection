import{I as y,C as z}from"./MainController-BII56cSM.js";import{c as w,a as f,b as C,d as k,Z as I}from"./elements-DUrmcn_5.js";import{t as v,g as L,C as S}from"./picks-CAmpVr01.js";import{W as D}from"./WellborePathLayer-D36AqAmi.js";import{g as P,a as R,b as H}from"./data-D8Ls4_G-.js";import"./GridLayer-COqgr0cg.js";import"./preload-helper-PPVm8Dsz.js";import"./_commonjsHelpers-CqkleIqs.js";const b=[0,500],W=[0,500],x=500,T=500,i=500,B=500,s=()=>{const n=w(i),a=f(i,B);return Promise.all([P(),R(),H()]).then(d=>{const[p,m,h]=d,g=v(m,h),o=new y(p.map(e=>[e.easting,e.northing,e.tvd])),u=L(g),l=new D("path",{referenceSystem:o,stroke:"red",strokeWidth:"1"}),r=new S("callout",{order:1,referenceSystem:o});r.onMount({elm:a}),l.onMount({elm:a}),r.onUpdate({data:u});const t=new I(a,e=>{r.onRescale(e),l.onRescale(e)});t.setBounds(b,W),t.adjustToSize(x,T),t.setViewport(1500,1500,3e3)}),n.appendChild(C("Low level interface for creating and displaying a callout layer. We have also added a wellbore path to show the picks along its path. This layer is made using canvas.")),n.appendChild(a),n.appendChild(k()),n},c=()=>{const n=w(i),a=f(i,B);return Promise.all([P(),R(),H()]).then(d=>{const[p,m,h]=d,g=v(m,h),o=new y(p.map(e=>[e.easting,e.northing,e.tvd])),u=L(g),l=new D("path",{referenceSystem:o,stroke:"red",strokeWidth:"1"}),r=new S("callout",{order:1,data:u,referenceSystem:o}),t=new z({container:a,referenceSystem:o});t.addLayer(l),t.addLayer(r),t.setBounds(b,W),t.adjustToSize(x,T),t.setViewport(1500,1500,3e3)}),n.appendChild(C("High level interface for creating and displaying a callout layer. We have also added a wellbore path to show the picks along its path. This layer is made using canvas.")),n.appendChild(a),n.appendChild(k()),n},O={title:"ESV Intersection/Features/Callout",component:s};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => {
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
}`,...c.parameters?.docs?.source}}};const q=["CalloutUsingLowLevelInterface","CalloutUsingHighLevelInterface"];export{c as CalloutUsingHighLevelInterface,s as CalloutUsingLowLevelInterface,q as __namedExportsOrder,O as default};
