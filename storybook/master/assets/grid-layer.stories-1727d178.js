import{c as s,d as l,Z as y,f as h}from"./elements-bce68b8a.js";import{G as m}from"./GridLayer-02f0a062.js";import{C}from"./MainController-99ef3014.js";import"./_commonjsHelpers-28e086c5.js";const r=700,o=600,a=()=>{const e=s(r),n=l(r,o),t=new m("grid",{order:1,majorColor:"black",minorColor:"black",majorWidth:.5,minorWidth:.5});return t.onMount({elm:n,width:r,height:o}),new y(n,g=>{t.onRescale(g)}).adjustToSize(r,o),e.appendChild(h("Low level interface to create and display grid. This layer is made using canvas.")),e.appendChild(n),e},i=()=>{const e=s(r),n=l(r,o),t=new m("grid",{order:1,majorColor:"black",minorColor:"black",majorWidth:.5,minorWidth:.5});return new C({container:n,layers:[t]}).adjustToSize(r,o),e.appendChild(h("High level interface to create and display grid. This layer is made using canvas.")),e.appendChild(n),e},f={title:"ESV Intersection/Features/Grid",component:a};var d;a.parameters={...a.parameters,storySource:{source:`() => {
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
}`,...(d=a.parameters)==null?void 0:d.storySource}};var c;i.parameters={...i.parameters,storySource:{source:`() => {
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
}`,...(c=i.parameters)==null?void 0:c.storySource}};const H=["GridUsingLowLevelInterface","GridUsingHighLevelInterface"];export{i as GridUsingHighLevelInterface,a as GridUsingLowLevelInterface,H as __namedExportsOrder,f as default};
//# sourceMappingURL=grid-layer.stories-1727d178.js.map
