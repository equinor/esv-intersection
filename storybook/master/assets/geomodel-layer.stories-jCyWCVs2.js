import{i as e}from"./preload-helper-xPQekRTU.js";import{E as t,R as n,S as r,U as i,a,ht as o,i as s,k as c,l,o as u,r as d,t as f,ut as p,w as m}from"./utils-CwHZxYAM.js";import{t as h}from"./src-4xajX19V.js";import{d as g,f as _,l as v,s as y,u as b}from"./data-DjlWSgKa.js";var x,S,C,w,T,E,D,O,k;e((()=>{h(),t(),_(),f(),x=700,S=600,C=()=>{let e=u(x),t=a(x,S),n=d(),l={order:1},f=new i;return f.init({width:x,height:S}).then(()=>{let i=new r(f,`webgl`,l);i.onMount({elm:t,height:S,width:x}),Promise.all([g(),b(),v(),y()]).then(e=>{let[t,n,r]=e,a=new o(t),s=1e3/(a.displacement||1),l=n[0]?.data?.values?.length||1,u=a.getTrajectory(l,0,1+s),d=c(o.toDisplacement(u.points,u.offset),r,n);i.onUpdate({data:d})});let a=new p(t,e=>{i.onRescale(e)});a.setBounds([0,1e3],[0,1e3]),a.adjustToSize(x,S,!0),a.zFactor=1,a.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),a.enableTranslateExtent=!1,a.setViewport(1e3,1e3,5e3),e.appendChild(s(`Low level interface for creating and displaying geo model (aka surfaces). This layer is made using webGL.`)),e.appendChild(t),e.appendChild(n)}),e},w=()=>{let e=u(x),t=a(x,S),n=d(),l={order:1},f=new i;return f.init({width:x,height:S}).then(()=>{let i=new r(f,`geomodels`,l);i.onMount({elm:t,height:S,width:x});let a=new m(`labels`,{order:1});a.onMount({elm:t});let u=new p(e,e=>{i.onRescale(e),a.onRescale({...e})});Promise.all([g(),b(),v()]).then(e=>{let[t,n,r]=e,s=new o(t),l=1e3/(s.displacement||1),u=n[0]?.data?.values?.length||1,d=s.getTrajectory(u,0,1+l),f=c(o.toDisplacement(d.points,d.offset),r,n);i.referenceSystem=s,a.referenceSystem=s,i.setData(f),a.setData(f)}),u.setBounds([0,1e3],[0,1e3]),u.adjustToSize(x,S,!0),u.zFactor=1,u.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),u.enableTranslateExtent=!1,u.setViewport(1e3,1e3,5e3),e.appendChild(s(`Low level interface for creating and displaying geo model (aka surfaces) with labels. The geo model layer is made using webGL and the labels using canvas.`)),e.appendChild(t),e.appendChild(n)}),e},T=()=>{let e=u(x),t=a(x,S),n=d(),f={order:1},p=new i;return p.init({width:x,height:S}).then(()=>{let i=new r(p,`webgl`,f);Promise.all([g(),b(),v(),y()]).then(e=>{let[t,n,r]=e,a=new o(t),s=1e3/(a.displacement||1),l=n[0]?.data?.values?.length||1,u=a.getTrajectory(l,0,1+s),d=c(o.toDisplacement(u.points,u.offset),r,n);i.setData(d)});let a=new l({container:t,layers:[i]});a.setBounds([0,1e3],[0,1e3]),a.adjustToSize(x,S),a.zoomPanHandler.zFactor=1,a.zoomPanHandler.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),a.zoomPanHandler.enableTranslateExtent=!1,a.setViewport(1e3,1e3,5e3),e.appendChild(s(`High level interface for creating and displaying geo model (aka surfaces). This layer is made using webGL.`)),e.appendChild(t),e.appendChild(n)}),e},E=()=>{let e=u(x),t=a(x,S),n=d(),f={order:1},p=new i;return p.init({width:x,height:S}).then(()=>{let i=new r(p,`geomodels`,f);i.onMount({elm:t,height:S,width:x});let a=new m(`labels`,{order:1});a.onMount({elm:t}),Promise.all([g(),b(),v()]).then(e=>{let[n,r,s]=e,u=new o(n),d=1e3/(u.displacement||1),f=r[0]?.data?.values?.length||1,p=u.getTrajectory(f,0,1+d),m=c(o.toDisplacement(p.points,p.offset),s,r),h=new l({container:t,layers:[i,a]});h.setReferenceSystem(u),i.setData(m),a.setData(m),h.setBounds([0,1e3],[0,1e3]),h.adjustToSize(x,S),h.zoomPanHandler.zFactor=1,h.zoomPanHandler.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),h.zoomPanHandler.enableTranslateExtent=!1,h.setViewport(1e3,1e3,5e3)}),e.appendChild(s(`High level interface for creating and displaying geo model (aka surfaces) with labels. The geo model layer is made using webGL and the labels using canvas.`)),e.appendChild(t),e.appendChild(n)}),e},D=()=>{let e=u(x),t=a(x,S),r=d(),i=new n(`canvas`,{order:1});Promise.all([g(),b(),v(),y()]).then(e=>{let[t,n,r]=e,a=new o(t),s=1e3/(a.displacement||1),l=n[0]?.data?.values?.length||1,u=a.getTrajectory(l,0,1+s),d=c(o.toDisplacement(u.points,u.offset),r,n);i.setData(d)});let f=new l({container:t,layers:[i]});return f.setBounds([0,1e3],[0,1e3]),f.adjustToSize(x,S),f.zoomPanHandler.zFactor=1,f.zoomPanHandler.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),f.zoomPanHandler.enableTranslateExtent=!1,f.setViewport(1e3,1e3,5e3),e.appendChild(s(`High level interface for creating and displaying geo model (aka surfaces). This layer is made using plain HTML canvas. GeomodelLayer is preferred for rendering geo models if your browser supports WebGL.`)),e.appendChild(t),e.appendChild(r),e},O={title:`ESV Intersection/Features/Geo Model`,component:C},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();
  const options: LayerOptions<SurfaceData> = {
    order: 1
  };
  const pixiContext = new PixiRenderApplication();
  pixiContext.init({
    width,
    height
  }).then(() => {
    const geoModelLayer = new GeomodelLayerV2(pixiContext, 'webgl', options);
    geoModelLayer.onMount({
      elm: container,
      height,
      width
    });
    Promise.all([getWellborePath(), getSurfaces(), getStratColumns(), getPositionLog()]).then(values => {
      const [path, surfaces, stratColumns] = values;
      const referenceSystem = new IntersectionReferenceSystem(path);
      const displacement = referenceSystem.displacement || 1;
      const extend = 1000 / displacement;
      const steps = surfaces[0]?.data?.values?.length || 1;
      const traj = referenceSystem.getTrajectory(steps, 0, 1 + extend);
      const trajectory: number[][] = IntersectionReferenceSystem.toDisplacement(traj.points, traj.offset);
      const geolayerdata: SurfaceData = generateSurfaceData(trajectory, stratColumns, surfaces);
      geoModelLayer.onUpdate({
        data: geolayerdata
      });
    });
    const zoomHandler = new ZoomPanHandler(container, (event: OnRescaleEvent) => {
      geoModelLayer.onRescale(event);
    });
    zoomHandler.setBounds([0, 1000], [0, 1000]);
    zoomHandler.adjustToSize(width, height, true);
    zoomHandler.zFactor = 1;
    zoomHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
    zoomHandler.enableTranslateExtent = false;
    zoomHandler.setViewport(1000, 1000, 5000);
    root.appendChild(createHelpText('Low level interface for creating and displaying geo model (aka surfaces). This layer is made using webGL.'));
    root.appendChild(container);
    root.appendChild(fpsLabel);
  });
  return root;
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();
  const options: LayerOptions<SurfaceData> = {
    order: 1
  };
  const pixiContext = new PixiRenderApplication();
  pixiContext.init({
    width,
    height
  }).then(() => {
    const geoModelLayer = new GeomodelLayerV2(pixiContext, 'geomodels', options);
    geoModelLayer.onMount({
      elm: container,
      height,
      width
    });
    const options2: GeomodelLayerLabelsOptions<SurfaceData> = {
      order: 1
    };
    const geoModelLabelsLayer = new GeomodelLabelsLayer('labels', options2);
    geoModelLabelsLayer.onMount({
      elm: container
    });
    const zoomHandler = new ZoomPanHandler(root, (event: OnRescaleEvent) => {
      geoModelLayer.onRescale(event);
      geoModelLabelsLayer.onRescale({
        ...event
      });
    });
    Promise.all([getWellborePath(), getSurfaces(), getStratColumns()]).then(values => {
      const [path, surfaces, stratColumns] = values;
      const referenceSystem = new IntersectionReferenceSystem(path);
      const displacement = referenceSystem.displacement || 1;
      const extend = 1000 / displacement;
      const steps = surfaces[0]?.data?.values?.length || 1;
      const traj = referenceSystem.getTrajectory(steps, 0, 1 + extend);
      const trajectory: number[][] = IntersectionReferenceSystem.toDisplacement(traj.points, traj.offset);
      const geolayerdata: SurfaceData = generateSurfaceData(trajectory, stratColumns, surfaces);
      geoModelLayer.referenceSystem = referenceSystem;
      geoModelLabelsLayer.referenceSystem = referenceSystem;
      geoModelLayer.setData(geolayerdata);
      geoModelLabelsLayer.setData(geolayerdata);
    });
    zoomHandler.setBounds([0, 1000], [0, 1000]);
    zoomHandler.adjustToSize(width, height, true);
    zoomHandler.zFactor = 1;
    zoomHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
    zoomHandler.enableTranslateExtent = false;
    zoomHandler.setViewport(1000, 1000, 5000);
    root.appendChild(createHelpText('Low level interface for creating and displaying geo model (aka surfaces) with labels. The geo model layer is made using webGL and the labels using canvas.'));
    root.appendChild(container);
    root.appendChild(fpsLabel);
  });
  return root;
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();
  const options: LayerOptions<SurfaceData> = {
    order: 1
  };
  const pixiContext = new PixiRenderApplication();
  pixiContext.init({
    width,
    height
  }).then(() => {
    const geoModelLayer = new GeomodelLayerV2(pixiContext, 'webgl', options);
    Promise.all([getWellborePath(), getSurfaces(), getStratColumns(), getPositionLog()]).then(values => {
      const [path, surfaces, stratColumns] = values;
      const referenceSystem = new IntersectionReferenceSystem(path);
      const displacement = referenceSystem.displacement || 1;
      const extend = 1000 / displacement;
      const steps = surfaces[0]?.data?.values?.length || 1;
      const traj = referenceSystem.getTrajectory(steps, 0, 1 + extend);
      const trajectory: number[][] = IntersectionReferenceSystem.toDisplacement(traj.points, traj.offset);
      const geolayerdata: SurfaceData = generateSurfaceData(trajectory, stratColumns, surfaces);
      geoModelLayer.setData(geolayerdata);
    });
    const controller = new Controller({
      container,
      layers: [geoModelLayer]
    });
    controller.setBounds([0, 1000], [0, 1000]);
    controller.adjustToSize(width, height);
    controller.zoomPanHandler.zFactor = 1;
    controller.zoomPanHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
    controller.zoomPanHandler.enableTranslateExtent = false;
    controller.setViewport(1000, 1000, 5000);
    root.appendChild(createHelpText('High level interface for creating and displaying geo model (aka surfaces). This layer is made using webGL.'));
    root.appendChild(container);
    root.appendChild(fpsLabel);
  });
  return root;
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();
  const options: LayerOptions<SurfaceData> = {
    order: 1
  };
  const pixiContext = new PixiRenderApplication();
  pixiContext.init({
    width,
    height
  }).then(() => {
    const geoModelLayer = new GeomodelLayerV2(pixiContext, 'geomodels', options);
    geoModelLayer.onMount({
      elm: container,
      height,
      width
    });
    const options2: GeomodelLayerLabelsOptions<SurfaceData> = {
      order: 1
    };
    const geoModelLabelsLayer = new GeomodelLabelsLayer('labels', options2);
    geoModelLabelsLayer.onMount({
      elm: container
    });
    Promise.all([getWellborePath(), getSurfaces(), getStratColumns()]).then(values => {
      const [path, surfaces, stratColumns] = values;
      const referenceSystem = new IntersectionReferenceSystem(path);
      const displacement = referenceSystem.displacement || 1;
      const extend = 1000 / displacement;
      const steps = surfaces[0]?.data?.values?.length || 1;
      const traj = referenceSystem.getTrajectory(steps, 0, 1 + extend);
      const trajectory: number[][] = IntersectionReferenceSystem.toDisplacement(traj.points, traj.offset);
      const geolayerdata: SurfaceData = generateSurfaceData(trajectory, stratColumns, surfaces);
      const controller = new Controller({
        container,
        layers: [geoModelLayer, geoModelLabelsLayer]
      });
      controller.setReferenceSystem(referenceSystem);
      geoModelLayer.setData(geolayerdata);
      geoModelLabelsLayer.setData(geolayerdata);
      controller.setBounds([0, 1000], [0, 1000]);
      controller.adjustToSize(width, height);
      controller.zoomPanHandler.zFactor = 1;
      controller.zoomPanHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
      controller.zoomPanHandler.enableTranslateExtent = false;
      controller.setViewport(1000, 1000, 5000);
    });
    root.appendChild(createHelpText('High level interface for creating and displaying geo model (aka surfaces) with labels. The geo model layer is made using webGL and the labels using canvas.'));
    root.appendChild(container);
    root.appendChild(fpsLabel);
  });
  return root;
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();
  const options: LayerOptions<SurfaceData> = {
    order: 1
  };
  const geoModelLayer = new GeomodelCanvasLayer('canvas', options);
  Promise.all([getWellborePath(), getSurfaces(), getStratColumns(), getPositionLog()]).then(values => {
    const [path, surfaces, stratColumns] = values;
    const referenceSystem = new IntersectionReferenceSystem(path);
    const displacement = referenceSystem.displacement || 1;
    const extend = 1000 / displacement;
    const steps = surfaces[0]?.data?.values?.length || 1;
    const traj = referenceSystem.getTrajectory(steps, 0, 1 + extend);
    const trajectory: number[][] = IntersectionReferenceSystem.toDisplacement(traj.points, traj.offset);
    const geolayerdata: SurfaceData = generateSurfaceData(trajectory, stratColumns, surfaces);
    geoModelLayer.setData(geolayerdata);
  });
  const controller = new Controller({
    container,
    layers: [geoModelLayer]
  });
  controller.setBounds([0, 1000], [0, 1000]);
  controller.adjustToSize(width, height);
  controller.zoomPanHandler.zFactor = 1;
  controller.zoomPanHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
  controller.zoomPanHandler.enableTranslateExtent = false;
  controller.setViewport(1000, 1000, 5000);
  root.appendChild(createHelpText('High level interface for creating and displaying geo model (aka surfaces). This layer is made using plain HTML canvas. GeomodelLayer is preferred for rendering geo models if your browser supports WebGL.'));
  root.appendChild(container);
  root.appendChild(fpsLabel);
  return root;
}`,...D.parameters?.docs?.source}}},k=[`GeoModelUsingLowLevelInterface`,`GeoModelWithLabelsUsingLowLevelInterface`,`GeoModelUsingHighLevelInterface`,`GeoModelWithLabelsUsingHighLevelInterface`,`GeoModelCanvasUsingHighLevelInterface`]}))();export{D as GeoModelCanvasUsingHighLevelInterface,T as GeoModelUsingHighLevelInterface,C as GeoModelUsingLowLevelInterface,E as GeoModelWithLabelsUsingHighLevelInterface,w as GeoModelWithLabelsUsingLowLevelInterface,k as __namedExportsOrder,O as default};