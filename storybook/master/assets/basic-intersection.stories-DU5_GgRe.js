import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{a as t,c as n,i as r,o as i,r as a,u as o,y as s}from"./elements-DhEJT-72.js";import{t as c}from"./src-DUG0gKZe.js";var l,u,d,f,p;function m(){return(m=e((()=>{o(),c(),i(),l=700,u=600,d=()=>{let e=t(l),i=r(l,u),o=new n({container:i});return o.addLayer(new s(`grid`)),o.adjustToSize(l,u),e.appendChild(a(`A basic example of setting up the controller along with a layer. The only required input is an HTML container.`)),e.appendChild(i),e},f={title:`ESV Intersection/Other examples`,component:d},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => {
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
}`,...d.parameters?.docs?.source}}},p=[`BasicSetup`]})))()}m();export{d as BasicSetup,p as __namedExportsOrder,f as default};