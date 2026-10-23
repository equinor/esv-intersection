import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{Y as t,a as n,c as r,i,o as a,r as o,y as s}from"./elements-DVs0HI8I.js";import{t as c}from"./src-7j-v1osd.js";var l,u,d,f,p,m;function h(){return(h=e((()=>{c(),a(),l=700,u=600,d=()=>{let e=n(l),r=i(l,u),a=new s(`grid`,{order:1,majorColor:`black`,minorColor:`black`,majorWidth:.5,minorWidth:.5});return a.onMount({elm:r,width:l,height:u}),new t(r,e=>{a.onRescale(e)}).adjustToSize(l,u),e.appendChild(o(`Low level interface to create and display grid. This layer is made using canvas.`)),e.appendChild(r),e},f=()=>{let e=n(l),t=i(l,u),a=new s(`grid`,{order:1,majorColor:`black`,minorColor:`black`,majorWidth:.5,minorWidth:.5});return new r({container:t,layers:[a]}).adjustToSize(l,u),e.appendChild(o(`High level interface to create and display grid. This layer is made using canvas.`)),e.appendChild(t),e},p={title:`ESV Intersection/Features/Grid`,component:d},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => {
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
}`,...f.parameters?.docs?.source}}},m=[`GridUsingLowLevelInterface`,`GridUsingHighLevelInterface`]})))()}h();export{f as GridUsingHighLevelInterface,d as GridUsingLowLevelInterface,m as __namedExportsOrder,p as default};