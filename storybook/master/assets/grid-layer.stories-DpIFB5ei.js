import{c as d,a as c,b as s,Z as p}from"./elements-DUrmcn_5.js";import{G as l}from"./GridLayer-COqgr0cg.js";import{C as g}from"./MainController-BII56cSM.js";import"./preload-helper-PPVm8Dsz.js";import"./_commonjsHelpers-CqkleIqs.js";const r=700,a=600,o=()=>{const e=d(r),n=c(r,a),t=new l("grid",{order:1,majorColor:"black",minorColor:"black",majorWidth:.5,minorWidth:.5});return t.onMount({elm:n,width:r,height:a}),new p(n,h=>{t.onRescale(h)}).adjustToSize(r,a),e.appendChild(s("Low level interface to create and display grid. This layer is made using canvas.")),e.appendChild(n),e},i=()=>{const e=d(r),n=c(r,a),t=new l("grid",{order:1,majorColor:"black",minorColor:"black",majorWidth:.5,minorWidth:.5});return new g({container:n,layers:[t]}).adjustToSize(r,a),e.appendChild(s("High level interface to create and display grid. This layer is made using canvas.")),e.appendChild(n),e},v={title:"ESV Intersection/Features/Grid",component:o};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};const H=["GridUsingLowLevelInterface","GridUsingHighLevelInterface"];export{i as GridUsingHighLevelInterface,o as GridUsingLowLevelInterface,H as __namedExportsOrder,v as default};
