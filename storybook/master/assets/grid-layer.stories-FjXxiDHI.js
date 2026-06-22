import{i as e}from"./preload-helper-xPQekRTU.js";import{a as t,b as n,i as r,l as i,o as a,t as o,ut as s}from"./utils-CwHZxYAM.js";import{t as c}from"./src-4xajX19V.js";var l,u,d,f,p,m;e((()=>{c(),o(),l=700,u=600,d=()=>{let e=a(l),i=t(l,u),o=new n(`grid`,{order:1,majorColor:`black`,minorColor:`black`,majorWidth:.5,minorWidth:.5});return o.onMount({elm:i,width:l,height:u}),new s(i,e=>{o.onRescale(e)}).adjustToSize(l,u),e.appendChild(r(`Low level interface to create and display grid. This layer is made using canvas.`)),e.appendChild(i),e},f=()=>{let e=a(l),o=t(l,u);return new i({container:o,layers:[new n(`grid`,{order:1,majorColor:`black`,minorColor:`black`,majorWidth:.5,minorWidth:.5})]}).adjustToSize(l,u),e.appendChild(r(`High level interface to create and display grid. This layer is made using canvas.`)),e.appendChild(o),e},p={title:`ESV Intersection/Features/Grid`,component:d},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => {
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
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`() => {
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
}`,...f.parameters?.docs?.source}}},m=[`GridUsingLowLevelInterface`,`GridUsingHighLevelInterface`]}))();export{f as GridUsingHighLevelInterface,d as GridUsingLowLevelInterface,m as __namedExportsOrder,p as default};