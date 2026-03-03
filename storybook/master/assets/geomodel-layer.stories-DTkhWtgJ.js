import{I as L,C as V}from"./MainController-BII56cSM.js";import{C as W,l as O,c as P,a as x,d as T,k as v,b as M,P as B,Z as k}from"./elements-DUrmcn_5.js";import{G as F,a as U}from"./GeomodelLayerV2-BU0a4Gb_.js";import{c as H,k as j,b as z,g as A}from"./data-D8Ls4_G-.js";import"./GridLayer-COqgr0cg.js";import"./preload-helper-PPVm8Dsz.js";import"./_commonjsHelpers-CqkleIqs.js";import"./findsample-BBxmZGgX.js";const _=1e4;class Z extends W{constructor(t,d){super(t,d),this.surfaceAreasPaths=[],this.surfaceLinesPaths=[],this.maxDepth=_,this.drawPolygonPath=(a,n)=>{const{ctx:e}=this;e!=null&&(e.fillStyle=a,e.fill(n))},this.drawLinePath=(a,n)=>{const{ctx:e}=this;e!=null&&(e.strokeStyle=a,e.stroke(n))},this.createPolygons=a=>{const n=[];let e=[];for(let o=0;o<a.length;o++){const s=!!a[o]?.[1];s&&(e===null&&(e=[]),e.push(a[o]?.[0],a[o]?.[1]));const l=o===a.length-1;if((!s||l)&&e.length>0){for(let i=s?o:o-1;i>=0&&a[i]?.[1];i--)e.push(a[i]?.[0],a[i]?.[2]||this.maxDepth);n.push(e),e=[]}}return n},this.generatePolygonPath=a=>{const n=new Path2D;n.moveTo(a[0],a[1]);for(let e=2;e<a.length;e+=2)n.lineTo(a[e],a[e+1]);return n.closePath(),n},this.generateLinePaths=a=>{const n=[],{data:e}=a;let o=!1,s;for(let l=0;l<e.length;l++)e[l]?.[1]?o&&s?s.lineTo(e[l]?.[0],e[l]?.[1]):(s=new Path2D,s.moveTo(e[l]?.[0],e[l]?.[1]),o=!0):o&&s&&(n.push(s),o=!1);return o&&s&&n.push(s),n},this.render=this.render.bind(this),this.generateSurfaceAreasPaths=this.generateSurfaceAreasPaths.bind(this),this.generateSurfaceLinesPaths=this.generateSurfaceLinesPaths.bind(this),this.drawPolygonPath=this.drawPolygonPath.bind(this),this.drawLinePath=this.drawLinePath.bind(this),this.updatePaths=this.updatePaths.bind(this)}onUpdate(t){super.onUpdate(t),this.updatePaths(),this.render()}onRescale(t){this.rescaleEvent=t,this.setTransform(this.rescaleEvent),this.render()}updatePaths(){this.data?(this.generateSurfaceAreasPaths(),this.generateSurfaceLinesPaths()):(this.surfaceAreasPaths=[],this.surfaceLinesPaths=[])}render(){!this.ctx||!this.rescaleEvent||requestAnimationFrame(()=>{this.clearCanvas(),this.surfaceAreasPaths.forEach(t=>this.drawPolygonPath(t.color,t.path)),this.surfaceLinesPaths.forEach(t=>this.drawLinePath(t.color,t.path))})}colorToCSSColor(t){return O(t)}generateSurfaceAreasPaths(){this.surfaceAreasPaths=this.data?.areas.reduce((t,d)=>{const n=this.createPolygons(d.data).map(e=>({color:this.colorToCSSColor(d.color),path:this.generatePolygonPath(e)}));return t.push(...n),t},[])??[]}generateSurfaceLinesPaths(){this.surfaceLinesPaths=this.data?.lines.reduce((t,d)=>{const n=this.generateLinePaths(d).map(e=>({color:this.colorToCSSColor(d.color),path:e}));return t.push(...n),t},[])??[]}}const c=700,p=600,C=()=>{const r=P(c),t=x(c,p),d=T(),a={order:1},n=new B;return n.init({width:c,height:p}).then(()=>{const e=new F(n,"webgl",a);e.onMount({elm:t,height:p,width:c}),Promise.all([H(),j(),z(),A()]).then(s=>{const[l,i,h]=s,m=new L(l),g=1e3/(m.displacement||1),S=i[0]?.data?.values?.length||1,u=m.getTrajectory(S,0,1+g),f=L.toDisplacement(u.points,u.offset),b=v(f,h,i);e.onUpdate({data:b})});const o=new k(t,s=>{e.onRescale(s)});o.setBounds([0,1e3],[0,1e3]),o.adjustToSize(c,p,!0),o.zFactor=1,o.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),o.enableTranslateExtent=!1,o.setViewport(1e3,1e3,5e3),r.appendChild(M("Low level interface for creating and displaying geo model (aka surfaces). This layer is made using webGL.")),r.appendChild(t),r.appendChild(d)}),r},G=()=>{const r=P(c),t=x(c,p),d=T(),a={order:1},n=new B;return n.init({width:c,height:p}).then(()=>{const e=new F(n,"geomodels",a);e.onMount({elm:t,height:p,width:c});const o={order:1},s=new U("labels",o);s.onMount({elm:t});const l=new k(r,i=>{e.onRescale(i),s.onRescale({...i})});Promise.all([H(),j(),z()]).then(i=>{const[h,m,w]=i,g=new L(h),u=1e3/(g.displacement||1),f=m[0]?.data?.values?.length||1,b=g.getTrajectory(f,0,1+u),D=L.toDisplacement(b.points,b.offset),y=v(D,w,m);e.referenceSystem=g,s.referenceSystem=g,e.setData(y),s.setData(y)}),l.setBounds([0,1e3],[0,1e3]),l.adjustToSize(c,p,!0),l.zFactor=1,l.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),l.enableTranslateExtent=!1,l.setViewport(1e3,1e3,5e3),r.appendChild(M("Low level interface for creating and displaying geo model (aka surfaces) with labels. The geo model layer is made using webGL and the labels using canvas.")),r.appendChild(t),r.appendChild(d)}),r},R=()=>{const r=P(c),t=x(c,p),d=T(),a={order:1},n=new B;return n.init({width:c,height:p}).then(()=>{const e=new F(n,"webgl",a);Promise.all([H(),j(),z(),A()]).then(s=>{const[l,i,h]=s,m=new L(l),g=1e3/(m.displacement||1),S=i[0]?.data?.values?.length||1,u=m.getTrajectory(S,0,1+g),f=L.toDisplacement(u.points,u.offset),b=v(f,h,i);e.setData(b)});const o=new V({container:t,layers:[e]});o.setBounds([0,1e3],[0,1e3]),o.adjustToSize(c,p),o.zoomPanHandler.zFactor=1,o.zoomPanHandler.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),o.zoomPanHandler.enableTranslateExtent=!1,o.setViewport(1e3,1e3,5e3),r.appendChild(M("High level interface for creating and displaying geo model (aka surfaces). This layer is made using webGL.")),r.appendChild(t),r.appendChild(d)}),r},I=()=>{const r=P(c),t=x(c,p),d=T(),a={order:1},n=new B;return n.init({width:c,height:p}).then(()=>{const e=new F(n,"geomodels",a);e.onMount({elm:t,height:p,width:c});const o={order:1},s=new U("labels",o);s.onMount({elm:t}),Promise.all([H(),j(),z()]).then(l=>{const[i,h,m]=l,w=new L(i),S=1e3/(w.displacement||1),u=h[0]?.data?.values?.length||1,f=w.getTrajectory(u,0,1+S),b=L.toDisplacement(f.points,f.offset),D=v(b,m,h),y=new V({container:t,layers:[e,s]});y.setReferenceSystem(w),e.setData(D),s.setData(D),y.setBounds([0,1e3],[0,1e3]),y.adjustToSize(c,p),y.zoomPanHandler.zFactor=1,y.zoomPanHandler.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),y.zoomPanHandler.enableTranslateExtent=!1,y.setViewport(1e3,1e3,5e3)}),r.appendChild(M("High level interface for creating and displaying geo model (aka surfaces) with labels. The geo model layer is made using webGL and the labels using canvas.")),r.appendChild(t),r.appendChild(d)}),r},E=()=>{const r=P(c),t=x(c,p),d=T(),a={order:1},n=new Z("canvas",a);Promise.all([H(),j(),z(),A()]).then(o=>{const[s,l,i]=o,h=new L(s),w=1e3/(h.displacement||1),g=l[0]?.data?.values?.length||1,S=h.getTrajectory(g,0,1+w),u=L.toDisplacement(S.points,S.offset),f=v(u,i,l);n.setData(f)});const e=new V({container:t,layers:[n]});return e.setBounds([0,1e3],[0,1e3]),e.adjustToSize(c,p),e.zoomPanHandler.zFactor=1,e.zoomPanHandler.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),e.zoomPanHandler.enableTranslateExtent=!1,e.setViewport(1e3,1e3,5e3),r.appendChild(M("High level interface for creating and displaying geo model (aka surfaces). This layer is made using plain HTML canvas. GeomodelLayer is preferred for rendering geo models if your browser supports WebGL.")),r.appendChild(t),r.appendChild(d),r},ee={title:"ESV Intersection/Features/Geo Model",component:C};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`() => {
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
}`,...C.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`() => {
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
}`,...G.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`() => {
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
}`,...R.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`() => {
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
}`,...I.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`() => {
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
}`,...E.parameters?.docs?.source}}};const te=["GeoModelUsingLowLevelInterface","GeoModelWithLabelsUsingLowLevelInterface","GeoModelUsingHighLevelInterface","GeoModelWithLabelsUsingHighLevelInterface","GeoModelCanvasUsingHighLevelInterface"];export{E as GeoModelCanvasUsingHighLevelInterface,R as GeoModelUsingHighLevelInterface,C as GeoModelUsingLowLevelInterface,I as GeoModelWithLabelsUsingHighLevelInterface,G as GeoModelWithLabelsUsingLowLevelInterface,te as __namedExportsOrder,ee as default};
