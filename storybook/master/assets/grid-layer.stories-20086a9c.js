import{c as p,d as g,Z as L,f as y}from"./elements-879199e9.js";import{G as C}from"./GridLayer-7caf88fb.js";import{C as v}from"./MainController-8cce63f0.js";import"./_commonjsHelpers-28e086c5.js";const n=700,a=600,r=()=>{const e=p(n),o=g(n,a),i=new C("grid",{order:1,majorColor:"black",minorColor:"black",majorWidth:.5,minorWidth:.5});return i.onMount({elm:o,width:n,height:a}),new L(o,w=>{i.onRescale(w)}).adjustToSize(n,a),e.appendChild(y("Low level interface to create and display grid. This layer is made using canvas.")),e.appendChild(o),e},t=()=>{const e=p(n),o=g(n,a),i=new C("grid",{order:1,majorColor:"black",minorColor:"black",majorWidth:.5,minorWidth:.5});return new v({container:o,layers:[i]}).adjustToSize(n,a),e.appendChild(y("High level interface to create and display grid. This layer is made using canvas.")),e.appendChild(o),e},b={title:"ESV Intersection/Features/Grid",component:r};var d,c,s;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const gridLayer = new GridLayer('grid', {
    order: 1,
    majorColor: 'black',
    minorColor: 'black',
    majorWidth: 0.5,
    minorWidth: 0.5
  });
  gridLayer.onMount({
    elm: container,
    width,
    height
  });
  const zoomHandler = new ZoomPanHandler(container, (event: OnRescaleEvent) => {
    gridLayer.onRescale(event);
  });
  zoomHandler.adjustToSize(width, height);
  root.appendChild(createHelpText('Low level interface to create and display grid. This layer is made using canvas.'));
  root.appendChild(container);
  return root;
}`,...(s=(c=r.parameters)==null?void 0:c.docs)==null?void 0:s.source}}};var l,h,m;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const gridLayer = new GridLayer('grid', {
    order: 1,
    majorColor: 'black',
    minorColor: 'black',
    majorWidth: 0.5,
    minorWidth: 0.5
  });
  const controller = new Controller({
    container,
    layers: [gridLayer]
  });
  controller.adjustToSize(width, height);
  root.appendChild(createHelpText('High level interface to create and display grid. This layer is made using canvas.'));
  root.appendChild(container);
  return root;
}`,...(m=(h=t.parameters)==null?void 0:h.docs)==null?void 0:m.source}}};r.parameters={storySource:{source:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const gridLayer = new GridLayer('grid', {
    order: 1,
    majorColor: 'black',
    minorColor: 'black',
    majorWidth: 0.5,
    minorWidth: 0.5
  });
  gridLayer.onMount({
    elm: container,
    width,
    height
  });
  const zoomHandler = new ZoomPanHandler(container, (event: OnRescaleEvent) => {
    gridLayer.onRescale(event);
  });
  zoomHandler.adjustToSize(width, height);
  root.appendChild(createHelpText('Low level interface to create and display grid. This layer is made using canvas.'));
  root.appendChild(container);
  return root;
}`},...r.parameters};t.parameters={storySource:{source:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const gridLayer = new GridLayer('grid', {
    order: 1,
    majorColor: 'black',
    minorColor: 'black',
    majorWidth: 0.5,
    minorWidth: 0.5
  });
  const controller = new Controller({
    container,
    layers: [gridLayer]
  });
  controller.adjustToSize(width, height);
  root.appendChild(createHelpText('High level interface to create and display grid. This layer is made using canvas.'));
  root.appendChild(container);
  return root;
}`},...t.parameters};const k=["GridUsingLowLevelInterface","GridUsingHighLevelInterface"];export{t as GridUsingHighLevelInterface,r as GridUsingLowLevelInterface,k as __namedExportsOrder,b as default};
//# sourceMappingURL=grid-layer.stories-20086a9c.js.map
