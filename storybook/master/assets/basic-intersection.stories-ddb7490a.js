import{c as s,d as c,f as l}from"./elements-bb7591df.js";import{G as p}from"./GridLayer-c7ca5df2.js";import{C as d}from"./MainController-6de464fc.js";import"./_commonjsHelpers-28e086c5.js";const r=700,a=600,e=()=>{const t=s(r),n=c(r,a),o=new d({container:n});return o.addLayer(new p("grid")),o.adjustToSize(r,a),t.appendChild(l("A basic example of setting up the controller along with a layer. The only required input is an HTML container.")),t.appendChild(n),t},w={title:"ESV Intersection/Other examples",component:e};var i;e.parameters={...e.parameters,storySource:{source:`() => {
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
}`,...(i=e.parameters)==null?void 0:i.storySource}};const C=["BasicSetup"];export{e as BasicSetup,C as __namedExportsOrder,w as default};
//# sourceMappingURL=basic-intersection.stories-ddb7490a.js.map
