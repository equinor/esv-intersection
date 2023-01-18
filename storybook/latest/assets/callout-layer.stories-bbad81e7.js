import{I as f,C as F}from"./MainController-ab86abdb.js";import{c as C,d as k,Z as U,f as v,e as L}from"./elements-d59828a4.js";import{t as S,g as D,C as P}from"./picks-28fffdb5.js";import{W as R}from"./WellborePathLayer-4fc61340.js";import{k as H,i as W,d as x}from"./data-e45bb153.js";import"./GridLayer-052b3f5c.js";import"./_commonjsHelpers-28e086c5.js";const T=[0,500],b=[0,500],B=500,z=500,c=500,I=500,l=()=>{const n=C(c),a=k(c,I);return Promise.all([H(),W(),x()]).then(i=>{const[d,p,m]=i,h=S(p,m),o=new f(d.map(e=>[e.easting,e.northing,e.tvd])),u=D(h),s=new R("path",{referenceSystem:o,stroke:"red",strokeWidth:"1"}),r=new P("callout",{order:1,referenceSystem:o});r.onMount({elm:a}),s.onMount({elm:a}),r.onUpdate({data:u});const t=new U(a,e=>{r.onRescale(e),s.onRescale(e)});t.setBounds(T,b),t.adjustToSize(B,z),t.setViewport(1500,1500,3e3)}),n.appendChild(v("Low level interface for creating and displaying a callout layer. We have also added a wellbore path to show the picks along its path. This layer is made using canvas.")),n.appendChild(a),n.appendChild(L()),n},g=()=>{const n=C(c),a=k(c,I);return Promise.all([H(),W(),x()]).then(i=>{const[d,p,m]=i,h=S(p,m),o=new f(d.map(e=>[e.easting,e.northing,e.tvd])),u=D(h),s=new R("path",{referenceSystem:o,stroke:"red",strokeWidth:"1"}),r=new P("callout",{order:1,data:u,referenceSystem:o}),t=new F({container:a,referenceSystem:o});t.addLayer(s),t.addLayer(r),t.setBounds(T,b),t.adjustToSize(B,z),t.setViewport(1500,1500,3e3)}),n.appendChild(v("High level interface for creating and displaying a callout layer. We have also added a wellbore path to show the picks along its path. This layer is made using canvas.")),n.appendChild(a),n.appendChild(L()),n},q={title:"ESV Intersection/Features/Callout",component:l};var y;l.parameters={...l.parameters,storySource:{source:`() => {
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
}`,...(y=l.parameters)==null?void 0:y.storySource}};var w;g.parameters={...g.parameters,storySource:{source:`() => {
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
}`,...(w=g.parameters)==null?void 0:w.storySource}};const A=["CalloutUsingLowLevelInterface","CalloutUsingHighLevelInterface"];export{g as CalloutUsingHighLevelInterface,l as CalloutUsingLowLevelInterface,A as __namedExportsOrder,q as default};
//# sourceMappingURL=callout-layer.stories-bbad81e7.js.map
