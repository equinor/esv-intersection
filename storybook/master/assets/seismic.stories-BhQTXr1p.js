import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{A as t,E as n,M as r,T as i,Y as a,a as o,h as s,i as c,j as l,n as u,o as d}from"./elements-DVs0HI8I.js";import{t as f}from"./src-7j-v1osd.js";import{n as p,t as m}from"./seismic-colormap-C7IAEONq.js";import{c as h,f as g,s as _}from"./data-5ctOw4ip.js";var v,y,b,x,S;function C(){return(C=e((()=>{f(),i(),g(),m(),d(),v=700,y=600,b=()=>{let e=o(v),i=c(v,y);return Promise.all([_(),h()]).then(e=>{let[o,c]=e,u=new s(`seismic`,{order:2,layerOpacity:1}),d={elm:i,width:v,height:y};u.onMount({...d});let f=n(o,45),m=l(c,f);t(c,f,p,{isLeftToRight:!0,seismicScale:2}).then(e=>{u.data={image:e,options:r(m)}});let h=new a(i,e=>{u.onRescale(e)});h.setBounds([0,v],[0,y]),h.adjustToSize(v,y),h.setViewport(v/2,y/2,v/2)}),e.appendChild(i),e.appendChild(u()),e},x={title:`ESV Intersection/Features/Seismic`,component:b},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  Promise.all([getPositionLog(), getSeismic()]).then(values => {
    const [poslog, seismic] = values;
    const seismicLayer = new SeismicCanvasLayer('seismic', {
      order: 2,
      layerOpacity: 1
    });
    const ev = {
      elm: container,
      width,
      height
    };
    seismicLayer.onMount({
      ...ev
    });
    const trajectory: number[][] = generateProjectedTrajectory(poslog, 45);
    const seismicInfo = getSeismicInfo(seismic, trajectory);
    generateSeismicSliceImage(seismic, trajectory, seismicColorMap, {
      isLeftToRight: true,
      seismicScale: 2
    }).then((seismicImage: ImageBitmap) => {
      seismicLayer.data = {
        image: seismicImage,
        options: getSeismicOptions(seismicInfo)
      };
    });
    const zoomHandler = new ZoomPanHandler(container, (event: OnRescaleEvent) => {
      seismicLayer.onRescale(event);
    });
    zoomHandler.setBounds([0, width], [0, height]);
    zoomHandler.adjustToSize(width, height);
    zoomHandler.setViewport(width / 2, height / 2, width / 2);
  });
  root.appendChild(container);
  root.appendChild(createFPSLabel());
  return root;
}`,...b.parameters?.docs?.source}}},S=[`SeismicUsingLowLevelInterface`]})))()}C();export{b as SeismicUsingLowLevelInterface,S as __namedExportsOrder,x as default};