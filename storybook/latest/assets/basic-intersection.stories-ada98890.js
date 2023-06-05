import{c as l,d,f as p}from"./elements-125f75e3.js";import{G as h}from"./GridLayer-8f39d692.js";import{C as m}from"./MainController-3ef45eec.js";import"./_commonjsHelpers-28e086c5.js";const r=700,a=600,e=()=>{const t=l(r),n=d(r,a),o=new m({container:n});return o.addLayer(new h("grid")),o.adjustToSize(r,a),t.appendChild(p("A basic example of setting up the controller along with a layer. The only required input is an HTML container.")),t.appendChild(n),t},C={title:"ESV Intersection/Other examples",component:e};var i,s,c;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`() => {
  const root = createRootContainer(width);
  // this is merely a html element with some basic styling
  const container = createLayerContainer(width, height);
  const controller = new Controller({
    container
  });
  controller.addLayer(new GridLayer('grid'));
  controller.adjustToSize(width, height);
  root.appendChild(createHelpText('A basic example of setting up the controller along with a layer. The only required input is an HTML container.'));
  root.appendChild(container);
  return root;
}`,...(c=(s=e.parameters)==null?void 0:s.docs)==null?void 0:c.source}}};const L=["BasicSetup"];export{e as BasicSetup,L as __namedExportsOrder,C as default};
//# sourceMappingURL=basic-intersection.stories-ada98890.js.map