import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{$ as t,C as n,H as r,L as i,O as a,T as o,Y as s,a as c,c as l,i as u,n as d,o as f,r as p,x as m}from"./elements-DhEJT-72.js";import{t as h}from"./src-DUG0gKZe.js";import{d as g,f as _,l as v,s as y,u as b}from"./data-5ctOw4ip.js";var x,S,C,w,T,E,D,O,k;function A(){return(A=e((()=>{h(),o(),_(),f(),x=700,S=600,C=()=>{let e=c(x),n=u(x,S),i=d(),o={order:1},l=new r;return l.init({width:x,height:S}).then(()=>{let r=new m(l,`webgl`,o);r.onMount({elm:n,height:S,width:x}),Promise.all([g(),b(),v(),y()]).then(e=>{let[n,i,o]=e,s=new t(n),c=1e3/(s.displacement||1),l=i[0]?.data?.values?.length||1,u=s.getTrajectory(l,0,1+c),d=t.toDisplacement(u.points,u.offset),f=a(d,o,i);r.onUpdate({data:f})});let c=new s(n,e=>{r.onRescale(e)});c.setBounds([0,1e3],[0,1e3]),c.adjustToSize(x,S,!0),c.zFactor=1,c.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),c.enableTranslateExtent=!1,c.setViewport(1e3,1e3,5e3),e.appendChild(p(`Low level interface for creating and displaying geo model (aka surfaces). This layer is made using webGL.`)),e.appendChild(n),e.appendChild(i)}),e},w=()=>{let e=c(x),i=u(x,S),o=d(),l={order:1},f=new r;return f.init({width:x,height:S}).then(()=>{let r=new m(f,`geomodels`,l);r.onMount({elm:i,height:S,width:x});let c=new n(`labels`,{order:1});c.onMount({elm:i});let u=new s(e,e=>{r.onRescale(e),c.onRescale({...e})});Promise.all([g(),b(),v()]).then(e=>{let[n,i,o]=e,s=new t(n),l=1e3/(s.displacement||1),u=i[0]?.data?.values?.length||1,d=s.getTrajectory(u,0,1+l),f=t.toDisplacement(d.points,d.offset),p=a(f,o,i);r.referenceSystem=s,c.referenceSystem=s,r.setData(p),c.setData(p)}),u.setBounds([0,1e3],[0,1e3]),u.adjustToSize(x,S,!0),u.zFactor=1,u.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),u.enableTranslateExtent=!1,u.setViewport(1e3,1e3,5e3),e.appendChild(p(`Low level interface for creating and displaying geo model (aka surfaces) with labels. The geo model layer is made using webGL and the labels using canvas.`)),e.appendChild(i),e.appendChild(o)}),e},T=()=>{let e=c(x),n=u(x,S),i=d(),o={order:1},s=new r;return s.init({width:x,height:S}).then(()=>{let r=new m(s,`webgl`,o);Promise.all([g(),b(),v(),y()]).then(e=>{let[n,i,o]=e,s=new t(n),c=1e3/(s.displacement||1),l=i[0]?.data?.values?.length||1,u=s.getTrajectory(l,0,1+c),d=t.toDisplacement(u.points,u.offset),f=a(d,o,i);r.setData(f)});let c=new l({container:n,layers:[r]});c.setBounds([0,1e3],[0,1e3]),c.adjustToSize(x,S),c.zoomPanHandler.zFactor=1,c.zoomPanHandler.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),c.zoomPanHandler.enableTranslateExtent=!1,c.setViewport(1e3,1e3,5e3),e.appendChild(p(`High level interface for creating and displaying geo model (aka surfaces). This layer is made using webGL.`)),e.appendChild(n),e.appendChild(i)}),e},E=()=>{let e=c(x),i=u(x,S),o=d(),s={order:1},f=new r;return f.init({width:x,height:S}).then(()=>{let r=new m(f,`geomodels`,s);r.onMount({elm:i,height:S,width:x});let c=new n(`labels`,{order:1});c.onMount({elm:i}),Promise.all([g(),b(),v()]).then(e=>{let[n,o,s]=e,u=new t(n),d=1e3/(u.displacement||1),f=o[0]?.data?.values?.length||1,p=u.getTrajectory(f,0,1+d),m=t.toDisplacement(p.points,p.offset),h=a(m,s,o),g=new l({container:i,layers:[r,c]});g.setReferenceSystem(u),r.setData(h),c.setData(h),g.setBounds([0,1e3],[0,1e3]),g.adjustToSize(x,S),g.zoomPanHandler.zFactor=1,g.zoomPanHandler.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),g.zoomPanHandler.enableTranslateExtent=!1,g.setViewport(1e3,1e3,5e3)}),e.appendChild(p(`High level interface for creating and displaying geo model (aka surfaces) with labels. The geo model layer is made using webGL and the labels using canvas.`)),e.appendChild(i),e.appendChild(o)}),e},D=()=>{let e=c(x),n=u(x,S),r=d(),o=new i(`canvas`,{order:1});Promise.all([g(),b(),v(),y()]).then(e=>{let[n,r,i]=e,s=new t(n),c=1e3/(s.displacement||1),l=r[0]?.data?.values?.length||1,u=s.getTrajectory(l,0,1+c),d=t.toDisplacement(u.points,u.offset),f=a(d,i,r);o.setData(f)});let s=new l({container:n,layers:[o]});return s.setBounds([0,1e3],[0,1e3]),s.adjustToSize(x,S),s.zoomPanHandler.zFactor=1,s.zoomPanHandler.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),s.zoomPanHandler.enableTranslateExtent=!1,s.setViewport(1e3,1e3,5e3),e.appendChild(p(`High level interface for creating and displaying geo model (aka surfaces). This layer is made using plain HTML canvas. GeomodelLayer is preferred for rendering geo models if your browser supports WebGL.`)),e.appendChild(n),e.appendChild(r),e},O={title:`ESV Intersection/Features/Geo Model`,component:C},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`() => {
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
}`,...D.parameters?.docs?.source}}},k=[`GeoModelUsingLowLevelInterface`,`GeoModelWithLabelsUsingLowLevelInterface`,`GeoModelUsingHighLevelInterface`,`GeoModelWithLabelsUsingHighLevelInterface`,`GeoModelCanvasUsingHighLevelInterface`]})))()}A();export{D as GeoModelCanvasUsingHighLevelInterface,T as GeoModelUsingHighLevelInterface,C as GeoModelUsingLowLevelInterface,E as GeoModelWithLabelsUsingHighLevelInterface,w as GeoModelWithLabelsUsingLowLevelInterface,k as __namedExportsOrder,O as default};