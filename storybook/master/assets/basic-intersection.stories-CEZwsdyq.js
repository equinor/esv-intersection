import{c as i,a as s,b as c}from"./elements-DUrmcn_5.js";import{G as l}from"./GridLayer-COqgr0cg.js";import{C as p}from"./MainController-BII56cSM.js";import"./preload-helper-PPVm8Dsz.js";import"./_commonjsHelpers-CqkleIqs.js";const r=700,a=600,e=()=>{const t=i(r),o=s(r,a),n=new p({container:o});return n.addLayer(new l("grid")),n.adjustToSize(r,a),t.appendChild(c("A basic example of setting up the controller along with a layer. The only required input is an HTML container.")),t.appendChild(o),t},g={title:"ESV Intersection/Other examples",component:e};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...e.parameters?.docs?.source}}};const w=["BasicSetup"];export{e as BasicSetup,w as __namedExportsOrder,g as default};
