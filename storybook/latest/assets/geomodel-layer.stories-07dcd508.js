import{I as b,C as k}from"./MainController-cfe2978b.js";import{C as re,i as le,c as M,d as H,e as j,P as A,g as z,Z as ae,f as D}from"./elements-9b1e449a.js";import{G as U,a as se}from"./GeomodelLayerV2-395b47c8.js";import{g as G,c as R,d as I,k as W}from"./data-e45bb153.js";import"./GridLayer-a4a12c3a.js";import"./_commonjsHelpers-725317a4.js";import"./findsample-4951fca8.js";const ce=1e4;class ie extends re{constructor(t,p){super(t,p),this.surfaceAreasPaths=[],this.surfaceLinesPaths=[],this.maxDepth=ce,this.drawPolygonPath=(o,a)=>{const{ctx:e}=this;e.fillStyle=o,e.fill(a)},this.drawLinePath=(o,a)=>{const{ctx:e}=this;e.strokeStyle=o,e.stroke(a)},this.createPolygons=o=>{const a=[];let e=null;for(let n=0;n<o.length;n++){const r=!!o[n][1];r&&(e===null&&(e=[]),e.push(o[n][0],o[n][1]));const l=n===o.length-1;if((!r||l)&&e){for(let i=r?n:n-1;i>=0&&o[i][1];i--)e.push(o[i][0],o[i][2]||this.maxDepth);a.push(e),e=null}}return a},this.generatePolygonPath=o=>{const a=new Path2D;a.moveTo(o[0],o[1]);for(let e=2;e<o.length;e+=2)a.lineTo(o[e],o[e+1]);return a.closePath(),a},this.generateLinePaths=o=>{const a=[],{data:e}=o;let n=!1,r=null;for(let l=0;l<e.length;l++)e[l][1]?n?r.lineTo(e[l][0],e[l][1]):(r=new Path2D,r.moveTo(e[l][0],e[l][1]),n=!0):n&&(a.push(r),n=!1);return n&&a.push(r),a},this.render=this.render.bind(this),this.generateSurfaceAreasPaths=this.generateSurfaceAreasPaths.bind(this),this.generateSurfaceLinesPaths=this.generateSurfaceLinesPaths.bind(this),this.drawPolygonPath=this.drawPolygonPath.bind(this),this.drawLinePath=this.drawLinePath.bind(this),this.updatePaths=this.updatePaths.bind(this)}onUpdate(t){super.onUpdate(t),this.updatePaths(),this.render()}onRescale(t){this.rescaleEvent=t,this.setTransform(this.rescaleEvent),this.render()}updatePaths(){this.data?(this.generateSurfaceAreasPaths(),this.generateSurfaceLinesPaths()):(this.surfaceAreasPaths=[],this.surfaceLinesPaths=[])}render(){!this.ctx||!this.rescaleEvent||requestAnimationFrame(()=>{this.clearCanvas(),this.surfaceAreasPaths.forEach(t=>this.drawPolygonPath(t.color,t.path)),this.surfaceLinesPaths.forEach(t=>this.drawLinePath(t.color,t.path))})}colorToCSSColor(t){return le(t)}generateSurfaceAreasPaths(){this.surfaceAreasPaths=this.data.areas.reduce((t,p)=>{const a=this.createPolygons(p.data).map(e=>({color:this.colorToCSSColor(p.color),path:this.generatePolygonPath(e)}));return t.push(...a),t},[])}generateSurfaceLinesPaths(){this.surfaceLinesPaths=this.data.lines.reduce((t,p)=>{const a=this.generateLinePaths(p).map(e=>({color:this.colorToCSSColor(p.color),path:e}));return t.push(...a),t},[])}}const c=700,h=600,v=()=>{const s=M(c),t=H(c,h),p=j(),o={order:1},a=new A({width:c,height:h}),e=new U(a,"webgl",o);e.onMount({elm:t,height:h,width:c}),Promise.all([G(),R(),I(),W()]).then(r=>{var m,d,w;const[l,i,g]=r,u=new b(l),f=1e3/(u.displacement||1),C=((w=(d=(m=i[0])==null?void 0:m.data)==null?void 0:d.values)==null?void 0:w.length)||1,y=u.getTrajectory(C,0,1+f),S=b.toDisplacement(y.points,y.offset),L=z(S,g,i);e.onUpdate({data:L})});const n=new ae(t,r=>{e.onRescale(r)});return n.setBounds([0,1e3],[0,1e3]),n.adjustToSize(c,h),n.zFactor=1,n.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),n.enableTranslateExtent=!1,n.setViewport(1e3,1e3,5e3),s.appendChild(D("Low level interface for creating and displaying geo model (aka surfaces). This layer is made using webGL.")),s.appendChild(t),s.appendChild(p),s},E=()=>{const s=M(c),t=H(c,h),p=j(),o={order:1},a=new A({width:c,height:h}),e=new U(a,"geomodels",o);e.onMount({elm:t,height:h,width:c});const n={order:1},r=new se("labels",n);r.onMount({elm:t});const l=new ae(s,i=>{e.onRescale(i),r.onRescale({...i})});return Promise.all([G(),R(),I()]).then(i=>{var w,T,x;const[g,u,P]=i,f=new b(g),y=1e3/(f.displacement||1),S=((x=(T=(w=u[0])==null?void 0:w.data)==null?void 0:T.values)==null?void 0:x.length)||1,L=f.getTrajectory(S,0,1+y),m=b.toDisplacement(L.points,L.offset),d=z(m,P,u);e.referenceSystem=f,r.referenceSystem=f,e.setData(d),r.setData(d)}),l.setBounds([0,1e3],[0,1e3]),l.adjustToSize(c,h),l.zFactor=1,l.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),l.enableTranslateExtent=!1,l.setViewport(1e3,1e3,5e3),s.appendChild(D("Low level interface for creating and displaying geo model (aka surfaces) with labels. The geo model layer is made using webGL and the labels using canvas.")),s.appendChild(t),s.appendChild(p),s},B=()=>{const s=M(c),t=H(c,h),p=j(),o={order:1},a=new A({width:c,height:h}),e=new U(a,"webgl",o);Promise.all([G(),R(),I(),W()]).then(r=>{var m,d,w;const[l,i,g]=r,u=new b(l),f=1e3/(u.displacement||1),C=((w=(d=(m=i[0])==null?void 0:m.data)==null?void 0:d.values)==null?void 0:w.length)||1,y=u.getTrajectory(C,0,1+f),S=b.toDisplacement(y.points,y.offset),L=z(S,g,i);e.setData(L)});const n=new k({container:t,layers:[e]});return n.setBounds([0,1e3],[0,1e3]),n.adjustToSize(c,h),n.zoomPanHandler.zFactor=1,n.zoomPanHandler.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),n.zoomPanHandler.enableTranslateExtent=!1,n.setViewport(1e3,1e3,5e3),s.appendChild(D("High level interface for creating and displaying geo model (aka surfaces). This layer is made using webGL.")),s.appendChild(t),s.appendChild(p),s},F=()=>{const s=M(c),t=H(c,h),p=j(),o={order:1},a=new A({width:c,height:h}),e=new U(a,"geomodels",o);e.onMount({elm:t,height:h,width:c});const n={order:1},r=new se("labels",n);return r.onMount({elm:t}),Promise.all([G(),R(),I()]).then(l=>{var w,T,x;const[i,g,u]=l,P=new b(i),C=1e3/(P.displacement||1),y=((x=(T=(w=g[0])==null?void 0:w.data)==null?void 0:T.values)==null?void 0:x.length)||1,S=P.getTrajectory(y,0,1+C),L=b.toDisplacement(S.points,S.offset),m=z(L,u,g),d=new k({container:t,layers:[e,r]});d.setReferenceSystem(P),e.setData(m),r.setData(m),d.setBounds([0,1e3],[0,1e3]),d.adjustToSize(c,h),d.zoomPanHandler.zFactor=1,d.zoomPanHandler.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),d.zoomPanHandler.enableTranslateExtent=!1,d.setViewport(1e3,1e3,5e3)}),s.appendChild(D("High level interface for creating and displaying geo model (aka surfaces) with labels. The geo model layer is made using webGL and the labels using canvas.")),s.appendChild(t),s.appendChild(p),s},V=()=>{const s=M(c),t=H(c,h),p=j(),o={order:1},a=new ie("canvas",o);Promise.all([G(),R(),I(),W()]).then(n=>{var L,m,d;const[r,l,i]=n,g=new b(r),P=1e3/(g.displacement||1),f=((d=(m=(L=l[0])==null?void 0:L.data)==null?void 0:m.values)==null?void 0:d.length)||1,C=g.getTrajectory(f,0,1+P),y=b.toDisplacement(C.points,C.offset),S=z(y,i,l);a.setData(S)});const e=new k({container:t,layers:[a]});return e.setBounds([0,1e3],[0,1e3]),e.adjustToSize(c,h),e.zoomPanHandler.zFactor=1,e.zoomPanHandler.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),e.zoomPanHandler.enableTranslateExtent=!1,e.setViewport(1e3,1e3,5e3),s.appendChild(D("High level interface for creating and displaying geo model (aka surfaces). This layer is made using plain HTML canvas. GeomodelLayer is preferred for rendering geo models if your browser supports WebGL.")),s.appendChild(t),s.appendChild(p),s},ye={title:"ESV Intersection/Features/Geo Model",component:v};var O,_,Z;v.parameters={...v.parameters,docs:{...(O=v.parameters)==null?void 0:O.docs,source:{originalSource:`() => {
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
}`,...(Z=(_=v.parameters)==null?void 0:_.docs)==null?void 0:Z.source}}};var q,X,J;E.parameters={...E.parameters,docs:{...(q=E.parameters)==null?void 0:q.docs,source:{originalSource:`() => {
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
}`,...(J=(X=E.parameters)==null?void 0:X.docs)==null?void 0:J.source}}};var K,N,Q;B.parameters={...B.parameters,docs:{...(K=B.parameters)==null?void 0:K.docs,source:{originalSource:`() => {
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
}`,...(Q=(N=B.parameters)==null?void 0:N.docs)==null?void 0:Q.source}}};var Y,$,ee;F.parameters={...F.parameters,docs:{...(Y=F.parameters)==null?void 0:Y.docs,source:{originalSource:`() => {
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
}`,...(ee=($=F.parameters)==null?void 0:$.docs)==null?void 0:ee.source}}};var te,ne,oe;V.parameters={...V.parameters,docs:{...(te=V.parameters)==null?void 0:te.docs,source:{originalSource:`() => {
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
}`,...(oe=(ne=V.parameters)==null?void 0:ne.docs)==null?void 0:oe.source}}};const Le=["GeoModelUsingLowLevelInterface","GeoModelWithLabelsUsingLowLevelInterface","GeoModelUsingHighLevelInterface","GeoModelWithLabelsUsingHighLevelInterface","GeoModelCanvasUsingHighLevelInterface"];export{V as GeoModelCanvasUsingHighLevelInterface,B as GeoModelUsingHighLevelInterface,v as GeoModelUsingLowLevelInterface,F as GeoModelWithLabelsUsingHighLevelInterface,E as GeoModelWithLabelsUsingLowLevelInterface,Le as __namedExportsOrder,ye as default};
//# sourceMappingURL=geomodel-layer.stories-07dcd508.js.map
