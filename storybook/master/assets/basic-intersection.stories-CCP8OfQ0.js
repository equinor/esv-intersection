import{c as l,a as p,b as d}from"./elements-bFXFHGGJ.js";import{G as h}from"./GridLayer-PgiAz4v5.js";import{C as m}from"./MainController-BrT9vEc5.js";import"./preload-helper-Dp1pzeXC.js";import"./_commonjsHelpers-CqkleIqs.js";const r=700,a=600,e=()=>{const t=l(r),o=p(r,a),n=new m({container:o});return n.addLayer(new h("grid")),n.adjustToSize(r,a),t.appendChild(d("A basic example of setting up the controller along with a layer. The only required input is an HTML container.")),t.appendChild(o),t},L={title:"ESV Intersection/Other examples",component:e};var i,s,c;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`() => {
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
}`,...(c=(s=e.parameters)==null?void 0:s.docs)==null?void 0:c.source}}};const T=["BasicSetup"];export{e as BasicSetup,T as __namedExportsOrder,L as default};
