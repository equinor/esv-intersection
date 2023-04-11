import{I as b,C as O}from"./MainController-cab0cfd5.js";import{C as se,t as le,c as D,d as R,e as G,P as A,g as I,Z as ae,f as B}from"./elements-c9ae7b8d.js";import{G as k,a as re}from"./GeomodelLayerV2-53ffb235.js";import{g as F,c as E,d as V,k as W}from"./data-e45bb153.js";import"./GridLayer-ed34e704.js";import"./_commonjsHelpers-28e086c5.js";import"./findsample-f4fa7ca8.js";const ce=1e4;class ie extends se{constructor(n,p){super(n,p),this.surfaceAreasPaths=[],this.surfaceLinesPaths=[],this.maxDepth=ce,this.drawPolygonPath=(o,a)=>{const{ctx:e}=this;e.fillStyle=o,e.fill(a)},this.drawLinePath=(o,a)=>{const{ctx:e}=this;e.strokeStyle=o,e.stroke(a)},this.createPolygons=o=>{const a=[];let e=null;for(let t=0;t<o.length;t++){const s=!!o[t][1];s&&(e===null&&(e=[]),e.push(o[t][0],o[t][1]));const l=t===o.length-1;if((!s||l)&&e){for(let i=s?t:t-1;i>=0&&o[i][1];i--)e.push(o[i][0],o[i][2]||this.maxDepth);a.push(e),e=null}}return a},this.generatePolygonPath=o=>{const a=new Path2D;a.moveTo(o[0],o[1]);for(let e=2;e<o.length;e+=2)a.lineTo(o[e],o[e+1]);return a.closePath(),a},this.generateLinePaths=o=>{const a=[],{data:e}=o;let t=!1,s=null;for(let l=0;l<e.length;l++)e[l][1]?t?s.lineTo(e[l][0],e[l][1]):(s=new Path2D,s.moveTo(e[l][0],e[l][1]),t=!0):t&&(a.push(s),t=!1);return t&&a.push(s),a},this.render=this.render.bind(this),this.generateSurfaceAreasPaths=this.generateSurfaceAreasPaths.bind(this),this.generateSurfaceLinesPaths=this.generateSurfaceLinesPaths.bind(this),this.drawPolygonPath=this.drawPolygonPath.bind(this),this.drawLinePath=this.drawLinePath.bind(this),this.updatePaths=this.updatePaths.bind(this)}onUpdate(n){super.onUpdate(n),this.updatePaths(),this.render()}onRescale(n){this.rescaleEvent=n,this.setTransform(this.rescaleEvent),this.render()}updatePaths(){this.data?(this.generateSurfaceAreasPaths(),this.generateSurfaceLinesPaths()):(this.surfaceAreasPaths=[],this.surfaceLinesPaths=[])}render(){!this.ctx||!this.rescaleEvent||requestAnimationFrame(()=>{this.clearCanvas(),this.surfaceAreasPaths.forEach(n=>this.drawPolygonPath(n.color,n.path)),this.surfaceLinesPaths.forEach(n=>this.drawLinePath(n.color,n.path))})}colorToCSSColor(n){return le(n)}generateSurfaceAreasPaths(){this.surfaceAreasPaths=this.data.areas.reduce((n,p)=>{const a=this.createPolygons(p.data).map(e=>({color:this.colorToCSSColor(p.color),path:this.generatePolygonPath(e)}));return n.push(...a),n},[])}generateSurfaceLinesPaths(){this.surfaceLinesPaths=this.data.lines.reduce((n,p)=>{const a=this.generateLinePaths(p).map(e=>({color:this.colorToCSSColor(p.color),path:e}));return n.push(...a),n},[])}}const c=700,m=600,x=()=>{const r=D(c),n=R(c,m),p=G(),o={order:1},a=new A({width:c,height:m}),e=new k(a,"webgl",o);e.onMount({elm:n,height:m,width:c}),Promise.all([F(),E(),V(),W()]).then(s=>{var h,d,S;const[l,i,g]=s,u=new b(l),f=1e3/(u.displacement||1),P=((S=(d=(h=i[0])==null?void 0:h.data)==null?void 0:d.values)==null?void 0:S.length)||1,y=u.getTrajectory(P,0,1+f),w=b.toDisplacement(y.points,y.offset),L=I(w,g,i);e.onUpdate({data:L})});const t=new ae(n,s=>{e.onRescale(s)});return t.setBounds([0,1e3],[0,1e3]),t.adjustToSize(c,m),t.zFactor=1,t.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),t.enableTranslateExtent=!1,t.setViewport(1e3,1e3,5e3),r.appendChild(B("Low level interface for creating and displaying geo model (aka surfaces). This layer is made using webGL.")),r.appendChild(n),r.appendChild(p),r},T=()=>{const r=D(c),n=R(c,m),p=G(),o={order:1},a=new A({width:c,height:m}),e=new k(a,"geomodels",o);e.onMount({elm:n,height:m,width:c});const t={order:1},s=new re("labels",t);s.onMount({elm:n});const l=new ae(r,i=>{e.onRescale(i),s.onRescale({...i})});return Promise.all([F(),E(),V()]).then(i=>{var S,j,z;const[g,u,C]=i,f=new b(g),y=1e3/(f.displacement||1),w=((z=(j=(S=u[0])==null?void 0:S.data)==null?void 0:j.values)==null?void 0:z.length)||1,L=f.getTrajectory(w,0,1+y),h=b.toDisplacement(L.points,L.offset),d=I(h,C,u);e.referenceSystem=f,s.referenceSystem=f,e.setData(d),s.setData(d)}),l.setBounds([0,1e3],[0,1e3]),l.adjustToSize(c,m),l.zFactor=1,l.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),l.enableTranslateExtent=!1,l.setViewport(1e3,1e3,5e3),r.appendChild(B("Low level interface for creating and displaying geo model (aka surfaces) with labels. The geo model layer is made using webGL and the labels using canvas.")),r.appendChild(n),r.appendChild(p),r},v=()=>{const r=D(c),n=R(c,m),p=G(),o={order:1},a=new A({width:c,height:m}),e=new k(a,"webgl",o);Promise.all([F(),E(),V(),W()]).then(s=>{var h,d,S;const[l,i,g]=s,u=new b(l),f=1e3/(u.displacement||1),P=((S=(d=(h=i[0])==null?void 0:h.data)==null?void 0:d.values)==null?void 0:S.length)||1,y=u.getTrajectory(P,0,1+f),w=b.toDisplacement(y.points,y.offset),L=I(w,g,i);e.setData(L)});const t=new O({container:n,layers:[e]});return t.setBounds([0,1e3],[0,1e3]),t.adjustToSize(c,m),t.zoomPanHandler.zFactor=1,t.zoomPanHandler.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),t.zoomPanHandler.enableTranslateExtent=!1,t.setViewport(1e3,1e3,5e3),r.appendChild(B("High level interface for creating and displaying geo model (aka surfaces). This layer is made using webGL.")),r.appendChild(n),r.appendChild(p),r},M=()=>{const r=D(c),n=R(c,m),p=G(),o={order:1},a=new A({width:c,height:m}),e=new k(a,"geomodels",o);e.onMount({elm:n,height:m,width:c});const t={order:1},s=new re("labels",t);return s.onMount({elm:n}),Promise.all([F(),E(),V()]).then(l=>{var S,j,z;const[i,g,u]=l,C=new b(i),P=1e3/(C.displacement||1),y=((z=(j=(S=g[0])==null?void 0:S.data)==null?void 0:j.values)==null?void 0:z.length)||1,w=C.getTrajectory(y,0,1+P),L=b.toDisplacement(w.points,w.offset),h=I(L,u,g),d=new O({container:n,layers:[e,s]});d.setReferenceSystem(C),e.setData(h),s.setData(h),d.setBounds([0,1e3],[0,1e3]),d.adjustToSize(c,m),d.zoomPanHandler.zFactor=1,d.zoomPanHandler.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),d.zoomPanHandler.enableTranslateExtent=!1,d.setViewport(1e3,1e3,5e3)}),r.appendChild(B("High level interface for creating and displaying geo model (aka surfaces) with labels. The geo model layer is made using webGL and the labels using canvas.")),r.appendChild(n),r.appendChild(p),r},H=()=>{const r=D(c),n=R(c,m),p=G(),o={order:1},a=new ie("canvas",o);Promise.all([F(),E(),V(),W()]).then(t=>{var L,h,d;const[s,l,i]=t,g=new b(s),C=1e3/(g.displacement||1),f=((d=(h=(L=l[0])==null?void 0:L.data)==null?void 0:h.values)==null?void 0:d.length)||1,P=g.getTrajectory(f,0,1+C),y=b.toDisplacement(P.points,P.offset),w=I(y,i,l);a.setData(w)});const e=new O({container:n,layers:[a]});return e.setBounds([0,1e3],[0,1e3]),e.adjustToSize(c,m),e.zoomPanHandler.zFactor=1,e.zoomPanHandler.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),e.zoomPanHandler.enableTranslateExtent=!1,e.setViewport(1e3,1e3,5e3),r.appendChild(B("High level interface for creating and displaying geo model (aka surfaces). This layer is made using plain HTML canvas. GeomodelLayer is preferred for rendering geo models if your browser supports WebGL.")),r.appendChild(n),r.appendChild(p),r},ye={title:"ESV Intersection/Features/Geo Model",component:x};var U,Z,_;x.parameters={...x.parameters,docs:{...(U=x.parameters)==null?void 0:U.docs,source:{originalSource:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();
  const options: LayerOptions<SurfaceData> = {
    order: 1
  };
  const pixiContext = new PixiRenderApplication({
    width,
    height
  });
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
  zoomHandler.adjustToSize(width, height);
  zoomHandler.zFactor = 1;
  zoomHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
  zoomHandler.enableTranslateExtent = false;
  zoomHandler.setViewport(1000, 1000, 5000);
  root.appendChild(createHelpText('Low level interface for creating and displaying geo model (aka surfaces). This layer is made using webGL.'));
  root.appendChild(container);
  root.appendChild(fpsLabel);
  return root;
}`,...(_=(Z=x.parameters)==null?void 0:Z.docs)==null?void 0:_.source}}};var q,X,J;T.parameters={...T.parameters,docs:{...(q=T.parameters)==null?void 0:q.docs,source:{originalSource:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();
  const options: LayerOptions<SurfaceData> = {
    order: 1
  };
  const pixiContext = new PixiRenderApplication({
    width,
    height
  });
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
  zoomHandler.adjustToSize(width, height);
  zoomHandler.zFactor = 1;
  zoomHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
  zoomHandler.enableTranslateExtent = false;
  zoomHandler.setViewport(1000, 1000, 5000);
  root.appendChild(createHelpText('Low level interface for creating and displaying geo model (aka surfaces) with labels. The geo model layer is made using webGL and the labels using canvas.'));
  root.appendChild(container);
  root.appendChild(fpsLabel);
  return root;
}`,...(J=(X=T.parameters)==null?void 0:X.docs)==null?void 0:J.source}}};var K,N,Q;v.parameters={...v.parameters,docs:{...(K=v.parameters)==null?void 0:K.docs,source:{originalSource:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();
  const options: LayerOptions<SurfaceData> = {
    order: 1
  };
  const pixiContext = new PixiRenderApplication({
    width,
    height
  });
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
  return root;
}`,...(Q=(N=v.parameters)==null?void 0:N.docs)==null?void 0:Q.source}}};var Y,$,ee;M.parameters={...M.parameters,docs:{...(Y=M.parameters)==null?void 0:Y.docs,source:{originalSource:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();
  const options: LayerOptions<SurfaceData> = {
    order: 1
  };
  const pixiContext = new PixiRenderApplication({
    width,
    height
  });
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
  return root;
}`,...(ee=($=M.parameters)==null?void 0:$.docs)==null?void 0:ee.source}}};var ne,te,oe;H.parameters={...H.parameters,docs:{...(ne=H.parameters)==null?void 0:ne.docs,source:{originalSource:`() => {
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
}`,...(oe=(te=H.parameters)==null?void 0:te.docs)==null?void 0:oe.source}}};x.parameters={storySource:{source:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();
  const options: LayerOptions<SurfaceData> = {
    order: 1
  };
  const pixiContext = new PixiRenderApplication({
    width,
    height
  });
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
  zoomHandler.adjustToSize(width, height);
  zoomHandler.zFactor = 1;
  zoomHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
  zoomHandler.enableTranslateExtent = false;
  zoomHandler.setViewport(1000, 1000, 5000);
  root.appendChild(createHelpText('Low level interface for creating and displaying geo model (aka surfaces). This layer is made using webGL.'));
  root.appendChild(container);
  root.appendChild(fpsLabel);
  return root;
}`},...x.parameters};T.parameters={storySource:{source:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();
  const options: LayerOptions<SurfaceData> = {
    order: 1
  };
  const pixiContext = new PixiRenderApplication({
    width,
    height
  });
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
  zoomHandler.adjustToSize(width, height);
  zoomHandler.zFactor = 1;
  zoomHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
  zoomHandler.enableTranslateExtent = false;
  zoomHandler.setViewport(1000, 1000, 5000);
  root.appendChild(createHelpText('Low level interface for creating and displaying geo model (aka surfaces) with labels. The geo model layer is made using webGL and the labels using canvas.'));
  root.appendChild(container);
  root.appendChild(fpsLabel);
  return root;
}`},...T.parameters};v.parameters={storySource:{source:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();
  const options: LayerOptions<SurfaceData> = {
    order: 1
  };
  const pixiContext = new PixiRenderApplication({
    width,
    height
  });
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
  return root;
}`},...v.parameters};M.parameters={storySource:{source:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const fpsLabel = createFPSLabel();
  const options: LayerOptions<SurfaceData> = {
    order: 1
  };
  const pixiContext = new PixiRenderApplication({
    width,
    height
  });
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
  return root;
}`},...M.parameters};H.parameters={storySource:{source:`() => {
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
}`},...H.parameters};const Le=["GeoModelUsingLowLevelInterface","GeoModelWithLabelsUsingLowLevelInterface","GeoModelUsingHighLevelInterface","GeoModelWithLabelsUsingHighLevelInterface","GeoModelCanvasUsingHighLevelInterface"];export{H as GeoModelCanvasUsingHighLevelInterface,v as GeoModelUsingHighLevelInterface,x as GeoModelUsingLowLevelInterface,M as GeoModelWithLabelsUsingHighLevelInterface,T as GeoModelWithLabelsUsingLowLevelInterface,Le as __namedExportsOrder,ye as default};
//# sourceMappingURL=geomodel-layer.stories-e8f8e1ea.js.map
