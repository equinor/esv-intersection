import{c as p,a as g,Z as w,b as C}from"./elements-861b6ce3.js";import{G as y}from"./axis-53cd7a79.js";import{C as v}from"./MainController-801c40c1.js";import"./_commonjsHelpers-de833af9.js";const r=700,a=600,o=()=>{const e=p(r),n=g(r,a),t=new y("grid",{order:1,majorColor:"black",minorColor:"black",majorWidth:.5,minorWidth:.5});return t.onMount({elm:n,width:r,height:a}),new w(n,L=>{t.onRescale(L)}).adjustToSize(r,a),e.appendChild(C("Low level interface to create and display grid. This layer is made using canvas.")),e.appendChild(n),e},i=()=>{const e=p(r),n=g(r,a),t=new y("grid",{order:1,majorColor:"black",minorColor:"black",majorWidth:.5,minorWidth:.5});return new v({container:n,layers:[t]}).adjustToSize(r,a),e.appendChild(C("High level interface to create and display grid. This layer is made using canvas.")),e.appendChild(n),e},b={title:"ESV Intersection/Features/Grid",component:o};var d,c,s;o.parameters={...o.parameters,docs:{...(d=o.parameters)==null?void 0:d.docs,source:{originalSource:`() => {
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
}`,...(s=(c=o.parameters)==null?void 0:c.docs)==null?void 0:s.source}}};var l,m,h;i.parameters={...i.parameters,docs:{...(l=i.parameters)==null?void 0:l.docs,source:{originalSource:`() => {
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
}`,...(h=(m=i.parameters)==null?void 0:m.docs)==null?void 0:h.source}}};const G=["GridUsingLowLevelInterface","GridUsingHighLevelInterface"];export{i as GridUsingHighLevelInterface,o as GridUsingLowLevelInterface,G as __namedExportsOrder,b as default};
//# sourceMappingURL=grid-layer.stories-b95a8bb3.js.map
