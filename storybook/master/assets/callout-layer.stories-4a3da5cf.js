import{I as L,C as M}from"./MainController-801c40c1.js";import{c as S,a as D,Z,b as P,d as R}from"./elements-861b6ce3.js";import{t as H,g as W,C as b}from"./picks-b0b737e9.js";import{W as x}from"./WellborePathLayer-cf266e8c.js";import{a as T,k as B,j as z}from"./data-d6ca7689.js";import"./axis-53cd7a79.js";import"./_commonjsHelpers-de833af9.js";const I=[0,500],F=[0,500],U=500,j=500,i=500,V=500,s=()=>{const n=S(i),a=D(i,V);return Promise.all([T(),B(),z()]).then(d=>{const[p,m,h]=d,g=H(m,h),o=new L(p.map(e=>[e.easting,e.northing,e.tvd])),u=W(g),l=new x("path",{referenceSystem:o,stroke:"red",strokeWidth:"1"}),r=new b("callout",{order:1,referenceSystem:o});r.onMount({elm:a}),l.onMount({elm:a}),r.onUpdate({data:u});const t=new Z(a,e=>{r.onRescale(e),l.onRescale(e)});t.setBounds(I,F),t.adjustToSize(U,j),t.setViewport(1500,1500,3e3)}),n.appendChild(P("Low level interface for creating and displaying a callout layer. We have also added a wellbore path to show the picks along its path. This layer is made using canvas.")),n.appendChild(a),n.appendChild(R()),n},c=()=>{const n=S(i),a=D(i,V);return Promise.all([T(),B(),z()]).then(d=>{const[p,m,h]=d,g=H(m,h),o=new L(p.map(e=>[e.easting,e.northing,e.tvd])),u=W(g),l=new x("path",{referenceSystem:o,stroke:"red",strokeWidth:"1"}),r=new b("callout",{order:1,data:u,referenceSystem:o}),t=new M({container:a,referenceSystem:o});t.addLayer(l),t.addLayer(r),t.setBounds(I,F),t.adjustToSize(U,j),t.setViewport(1500,1500,3e3)}),n.appendChild(P("High level interface for creating and displaying a callout layer. We have also added a wellbore path to show the picks along its path. This layer is made using canvas.")),n.appendChild(a),n.appendChild(R()),n},K={title:"ESV Intersection/Features/Callout",component:s};var y,w,f;s.parameters={...s.parameters,docs:{...(y=s.parameters)==null?void 0:y.docs,source:{originalSource:`() => {
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
}`,...(f=(w=s.parameters)==null?void 0:w.docs)==null?void 0:f.source}}};var C,k,v;c.parameters={...c.parameters,docs:{...(C=c.parameters)==null?void 0:C.docs,source:{originalSource:`() => {
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
}`,...(v=(k=c.parameters)==null?void 0:k.docs)==null?void 0:v.source}}};const N=["CalloutUsingLowLevelInterface","CalloutUsingHighLevelInterface"];export{c as CalloutUsingHighLevelInterface,s as CalloutUsingLowLevelInterface,N as __namedExportsOrder,K as default};
//# sourceMappingURL=callout-layer.stories-4a3da5cf.js.map
