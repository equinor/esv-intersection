import{i as e}from"./preload-helper-xPQekRTU.js";import{D as t,E as n,M as r,N as i,a,g as o,j as s,o as c,r as l,t as u,ut as d}from"./utils-CwHZxYAM.js";import{t as f}from"./src-4xajX19V.js";import{r as p,t as m}from"./exampledata-DjsKOj3G.js";import{c as h,f as g,s as _}from"./data-DjlWSgKa.js";var v,y,b,x,S;e((()=>{f(),n(),g(),m(),u(),v=700,y=600,b=()=>{let e=c(v),n=a(v,y);return Promise.all([_(),h()]).then(e=>{let[a,c]=e,l=new o(`seismic`,{order:2,layerOpacity:1}),u={elm:n,width:v,height:y};l.onMount({...u});let f=t(a,45),m=r(c,f);s(c,f,p,{isLeftToRight:!0,seismicScale:2}).then(e=>{l.data={image:e,options:i(m)}});let h=new d(n,e=>{l.onRescale(e)});h.setBounds([0,v],[0,y]),h.adjustToSize(v,y),h.setViewport(v/2,y/2,v/2)}),e.appendChild(n),e.appendChild(l()),e},x={title:`ESV Intersection/Features/Seismic`,component:b},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`() => {
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
}`,...b.parameters?.docs?.source}}},S=[`SeismicUsingLowLevelInterface`]}))();export{b as SeismicUsingLowLevelInterface,S as __namedExportsOrder,x as default};