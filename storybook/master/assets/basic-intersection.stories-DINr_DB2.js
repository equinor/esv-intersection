import{i as e}from"./preload-helper-xPQekRTU.js";import{a as t,b as n,d as r,i,l as a,o,t as s}from"./utils-CwHZxYAM.js";import{t as c}from"./src-4xajX19V.js";var l,u,d,f,p;e((()=>{r(),c(),s(),l=700,u=600,d=()=>{let e=o(l),r=t(l,u),s=new a({container:r});return s.addLayer(new n(`grid`)),s.adjustToSize(l,u),e.appendChild(i(`A basic example of setting up the controller along with a layer. The only required input is an HTML container.`)),e.appendChild(r),e},f={title:`ESV Intersection/Other examples`,component:d},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => {
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
}`,...d.parameters?.docs?.source}}},p=[`BasicSetup`]}))();export{d as BasicSetup,p as __namedExportsOrder,f as default};