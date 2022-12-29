var Q=Object.defineProperty;var Y=(s,r,e)=>r in s?Q(s,r,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[r]=e;var b=(s,r,e)=>(Y(s,typeof r!="symbol"?r+"":r,e),e);import{I as P,C as W}from"./MainController.5bd28a66.js";import{C as $,K as ee,c as M,b as H,d as j,g as z,Z as J,e as D}from"./elements.87f68392.js";import{P as B}from"./PixiLayer.a52855e3.js";import{G as F,a as N}from"./GeomodelLayerV2.4a7ba33c.js";import{g as G,c as R,d as I,k as O}from"./data.640a7923.js";import"./GridLayer.439d0b2f.js";import"./_commonjsHelpers.c10bf6cb.js";import"./findsample.2f856921.js";const te=1e4;class ne extends ${constructor(e,o){super(e,o);b(this,"rescaleEvent");b(this,"surfaceAreasPaths",[]);b(this,"surfaceLinesPaths",[]);b(this,"maxDepth",te);b(this,"drawPolygonPath",(e,o)=>{const{ctx:n}=this;n.fillStyle=e,n.fill(o)});b(this,"drawLinePath",(e,o)=>{const{ctx:n}=this;n.strokeStyle=e,n.stroke(o)});b(this,"createPolygons",e=>{const o=[];let n=null;for(let t=0;t<e.length;t++){const a=!!e[t][1];a&&(n===null&&(n=[]),n.push(e[t][0],e[t][1]));const l=t===e.length-1;if((!a||l)&&n){for(let i=a?t:t-1;i>=0&&e[i][1];i--)n.push(e[i][0],e[i][2]||this.maxDepth);o.push(n),n=null}}return o});b(this,"generatePolygonPath",e=>{const o=new Path2D;o.moveTo(e[0],e[1]);for(let n=2;n<e.length;n+=2)o.lineTo(e[n],e[n+1]);return o.closePath(),o});b(this,"generateLinePaths",e=>{const o=[],{data:n}=e;let t=!1,a=null;for(let l=0;l<n.length;l++)n[l][1]?t?a.lineTo(n[l][0],n[l][1]):(a=new Path2D,a.moveTo(n[l][0],n[l][1]),t=!0):t&&(o.push(a),t=!1);return t&&o.push(a),o});this.render=this.render.bind(this),this.generateSurfaceAreasPaths=this.generateSurfaceAreasPaths.bind(this),this.generateSurfaceLinesPaths=this.generateSurfaceLinesPaths.bind(this),this.drawPolygonPath=this.drawPolygonPath.bind(this),this.drawLinePath=this.drawLinePath.bind(this),this.updatePaths=this.updatePaths.bind(this)}onUpdate(e){super.onUpdate(e),this.updatePaths(),this.render()}onRescale(e){this.rescaleEvent=e,this.setTransform(this.rescaleEvent),this.render()}updatePaths(){this.data?(this.generateSurfaceAreasPaths(),this.generateSurfaceLinesPaths()):(this.surfaceAreasPaths=[],this.surfaceLinesPaths=[])}render(){!this.ctx||!this.rescaleEvent||requestAnimationFrame(()=>{this.clearCanvas(),this.surfaceAreasPaths.forEach(e=>this.drawPolygonPath(e.color,e.path)),this.surfaceLinesPaths.forEach(e=>this.drawLinePath(e.color,e.path))})}colorToCSSColor(e){return ee(e)}generateSurfaceAreasPaths(){this.surfaceAreasPaths=this.data.areas.reduce((e,o)=>{const t=this.createPolygons(o.data).map(a=>({color:this.colorToCSSColor(o.color),path:this.generatePolygonPath(a)}));return e.push(...t),e},[])}generateSurfaceLinesPaths(){this.surfaceLinesPaths=this.data.lines.reduce((e,o)=>{const t=this.generateLinePaths(o).map(a=>({color:this.colorToCSSColor(o.color),path:a}));return e.push(...t),e},[])}}const c=700,p=600,E=()=>{const s=M(c),r=H(c,p),e=j(),o={order:1},n=new B({width:c,height:p}),t=new F(n,"webgl",o);t.onMount({elm:r,height:p,width:c}),Promise.all([G(),R(),I(),O()]).then(l=>{var m,d,S;const[i,h,g]=l,u=new P(i),f=1e3/(u.displacement||1),T=((S=(d=(m=h[0])==null?void 0:m.data)==null?void 0:d.values)==null?void 0:S.length)||1,y=u.getTrajectory(T,0,1+f),w=P.toDisplacement(y.points,y.offset),L=z(w,g,h);t.onUpdate({data:L})});const a=new J(r,l=>{t.onRescale(l)});return a.setBounds([0,1e3],[0,1e3]),a.adjustToSize(c,p),a.zFactor=1,a.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),a.enableTranslateExtent=!1,a.setViewport(1e3,1e3,5e3),s.appendChild(D("Low level interface for creating and displaying geo model (aka surfaces). This layer is made using webGL.")),s.appendChild(r),s.appendChild(e),s},V=()=>{const s=M(c),r=H(c,p),e=j(),o={order:1},n=new B({width:c,height:p}),t=new F(n,"geomodels",o);t.onMount({elm:r,height:p,width:c});const a={order:1},l=new N("labels",a);l.onMount({elm:r});const i=new J(s,h=>{t.onRescale(h),l.onRescale({...h})});return Promise.all([G(),R(),I()]).then(h=>{var S,x,v;const[g,u,C]=h,f=new P(g),y=1e3/(f.displacement||1),w=((v=(x=(S=u[0])==null?void 0:S.data)==null?void 0:x.values)==null?void 0:v.length)||1,L=f.getTrajectory(w,0,1+y),m=P.toDisplacement(L.points,L.offset),d=z(m,C,u);t.referenceSystem=f,l.referenceSystem=f,t.setData(d),l.setData(d)}),i.setBounds([0,1e3],[0,1e3]),i.adjustToSize(c,p),i.zFactor=1,i.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),i.enableTranslateExtent=!1,i.setViewport(1e3,1e3,5e3),s.appendChild(D("Low level interface for creating and displaying geo model (aka surfaces) with labels. The geo model layer is made using webGL and the labels using canvas.")),s.appendChild(r),s.appendChild(e),s},A=()=>{const s=M(c),r=H(c,p),e=j(),o={order:1},n=new B({width:c,height:p}),t=new F(n,"webgl",o);Promise.all([G(),R(),I(),O()]).then(l=>{var m,d,S;const[i,h,g]=l,u=new P(i),f=1e3/(u.displacement||1),T=((S=(d=(m=h[0])==null?void 0:m.data)==null?void 0:d.values)==null?void 0:S.length)||1,y=u.getTrajectory(T,0,1+f),w=P.toDisplacement(y.points,y.offset),L=z(w,g,h);t.setData(L)});const a=new W({container:r,layers:[t]});return a.setBounds([0,1e3],[0,1e3]),a.adjustToSize(c,p),a.zoomPanHandler.zFactor=1,a.zoomPanHandler.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),a.zoomPanHandler.enableTranslateExtent=!1,a.setViewport(1e3,1e3,5e3),s.appendChild(D("High level interface for creating and displaying geo model (aka surfaces). This layer is made using webGL.")),s.appendChild(r),s.appendChild(e),s},U=()=>{const s=M(c),r=H(c,p),e=j(),o={order:1},n=new B({width:c,height:p}),t=new F(n,"geomodels",o);t.onMount({elm:r,height:p,width:c});const a={order:1},l=new N("labels",a);return l.onMount({elm:r}),Promise.all([G(),R(),I()]).then(i=>{var S,x,v;const[h,g,u]=i,C=new P(h),T=1e3/(C.displacement||1),y=((v=(x=(S=g[0])==null?void 0:S.data)==null?void 0:x.values)==null?void 0:v.length)||1,w=C.getTrajectory(y,0,1+T),L=P.toDisplacement(w.points,w.offset),m=z(L,u,g),d=new W({container:r,layers:[t,l]});d.setReferenceSystem(C),t.setData(m),l.setData(m),d.setBounds([0,1e3],[0,1e3]),d.adjustToSize(c,p),d.zoomPanHandler.zFactor=1,d.zoomPanHandler.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),d.zoomPanHandler.enableTranslateExtent=!1,d.setViewport(1e3,1e3,5e3)}),s.appendChild(D("High level interface for creating and displaying geo model (aka surfaces) with labels. The geo model layer is made using webGL and the labels using canvas.")),s.appendChild(r),s.appendChild(e),s},k=()=>{const s=M(c),r=H(c,p),e=j(),o={order:1},n=new ne("canvas",o);Promise.all([G(),R(),I(),O()]).then(a=>{var L,m,d;const[l,i,h]=a,g=new P(l),C=1e3/(g.displacement||1),f=((d=(m=(L=i[0])==null?void 0:L.data)==null?void 0:m.values)==null?void 0:d.length)||1,T=g.getTrajectory(f,0,1+C),y=P.toDisplacement(T.points,T.offset),w=z(y,h,i);n.setData(w)});const t=new W({container:r,layers:[n]});return t.setBounds([0,1e3],[0,1e3]),t.adjustToSize(c,p),t.zoomPanHandler.zFactor=1,t.zoomPanHandler.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),t.zoomPanHandler.enableTranslateExtent=!1,t.setViewport(1e3,1e3,5e3),s.appendChild(D("High level interface for creating and displaying geo model (aka surfaces). This layer is made using plain HTML canvas. GeomodelLayer is preferred for rendering geo models if your browser supports WebGL.")),s.appendChild(r),s.appendChild(e),s},he={title:"ESV Intersection/Features/Geo Model",component:E};var _;E.parameters={...E.parameters,storySource:{source:`() => {
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
}`,...(_=E.parameters)==null?void 0:_.storySource}};var Z;V.parameters={...V.parameters,storySource:{source:`() => {
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
}`,...(Z=V.parameters)==null?void 0:Z.storySource}};var q;A.parameters={...A.parameters,storySource:{source:`() => {
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
}`,...(q=A.parameters)==null?void 0:q.storySource}};var K;U.parameters={...U.parameters,storySource:{source:`() => {
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
}`,...(K=U.parameters)==null?void 0:K.storySource}};var X;k.parameters={...k.parameters,storySource:{source:`() => {
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
}`,...(X=k.parameters)==null?void 0:X.storySource}};const me=["GeoModelUsingLowLevelInterface","GeoModelWithLabelsUsingLowLevelInterface","GeoModelUsingHighLevelInterface","GeoModelWithLabelsUsingHighLevelInterface","GeoModelCanvasUsingHighLevelInterface"];export{k as GeoModelCanvasUsingHighLevelInterface,A as GeoModelUsingHighLevelInterface,E as GeoModelUsingLowLevelInterface,U as GeoModelWithLabelsUsingHighLevelInterface,V as GeoModelWithLabelsUsingLowLevelInterface,me as __namedExportsOrder,he as default};
//# sourceMappingURL=geomodel-layer.stories.0aff4732.js.map
