import{I as P,C as U}from"./MainController-BrT9vEc5.js";import{C as re,l as le,c as M,a as H,d as j,P as A,k as z,Z as ae,b as D}from"./elements-bFXFHGGJ.js";import{G as k,a as se}from"./GeomodelLayerV2-D4m2dz15.js";import{c as G,k as R,b as I,g as W}from"./data-D8Ls4_G-.js";import"./GridLayer-PgiAz4v5.js";import"./preload-helper-Dp1pzeXC.js";import"./_commonjsHelpers-CqkleIqs.js";import"./findsample-BL-n9qHX.js";const ce=1e4;class ie extends re{constructor(t,m){super(t,m),this.surfaceAreasPaths=[],this.surfaceLinesPaths=[],this.maxDepth=ce,this.drawPolygonPath=(n,o)=>{const{ctx:e}=this;e!=null&&(e.fillStyle=n,e.fill(o))},this.drawLinePath=(n,o)=>{const{ctx:e}=this;e!=null&&(e.strokeStyle=n,e.stroke(o))},this.createPolygons=n=>{var a,s,i,p,g,u;const o=[];let e=[];for(let d=0;d<n.length;d++){const l=!!((a=n[d])!=null&&a[1]);l&&(e===null&&(e=[]),e.push((s=n[d])==null?void 0:s[0],(i=n[d])==null?void 0:i[1]));const w=d===n.length-1;if((!l||w)&&e.length>0){for(let f=l?d:d-1;f>=0&&((p=n[f])!=null&&p[1]);f--)e.push((g=n[f])==null?void 0:g[0],((u=n[f])==null?void 0:u[2])||this.maxDepth);o.push(e),e=[]}}return o},this.generatePolygonPath=n=>{const o=new Path2D;o.moveTo(n[0],n[1]);for(let e=2;e<n.length;e+=2)o.lineTo(n[e],n[e+1]);return o.closePath(),o},this.generateLinePaths=n=>{var i,p,g,u,d;const o=[],{data:e}=n;let a=!1,s;for(let l=0;l<e.length;l++)(i=e[l])!=null&&i[1]?a&&s?s.lineTo((p=e[l])==null?void 0:p[0],(g=e[l])==null?void 0:g[1]):(s=new Path2D,s.moveTo((u=e[l])==null?void 0:u[0],(d=e[l])==null?void 0:d[1]),a=!0):a&&s&&(o.push(s),a=!1);return a&&s&&o.push(s),o},this.render=this.render.bind(this),this.generateSurfaceAreasPaths=this.generateSurfaceAreasPaths.bind(this),this.generateSurfaceLinesPaths=this.generateSurfaceLinesPaths.bind(this),this.drawPolygonPath=this.drawPolygonPath.bind(this),this.drawLinePath=this.drawLinePath.bind(this),this.updatePaths=this.updatePaths.bind(this)}onUpdate(t){super.onUpdate(t),this.updatePaths(),this.render()}onRescale(t){this.rescaleEvent=t,this.setTransform(this.rescaleEvent),this.render()}updatePaths(){this.data?(this.generateSurfaceAreasPaths(),this.generateSurfaceLinesPaths()):(this.surfaceAreasPaths=[],this.surfaceLinesPaths=[])}render(){!this.ctx||!this.rescaleEvent||requestAnimationFrame(()=>{this.clearCanvas(),this.surfaceAreasPaths.forEach(t=>this.drawPolygonPath(t.color,t.path)),this.surfaceLinesPaths.forEach(t=>this.drawLinePath(t.color,t.path))})}colorToCSSColor(t){return le(t)}generateSurfaceAreasPaths(){var t;this.surfaceAreasPaths=((t=this.data)==null?void 0:t.areas.reduce((m,n)=>{const e=this.createPolygons(n.data).map(a=>({color:this.colorToCSSColor(n.color),path:this.generatePolygonPath(a)}));return m.push(...e),m},[]))??[]}generateSurfaceLinesPaths(){var t;this.surfaceLinesPaths=((t=this.data)==null?void 0:t.lines.reduce((m,n)=>{const e=this.generateLinePaths(n).map(a=>({color:this.colorToCSSColor(n.color),path:a}));return m.push(...e),m},[]))??[]}}const c=700,y=600,v=()=>{const r=M(c),t=H(c,y),m=j(),n={order:1},o=new A;return o.init({width:c,height:y}).then(()=>{const e=new k(o,"webgl",n);e.onMount({elm:t,height:y,width:c}),Promise.all([G(),R(),I(),W()]).then(s=>{var L,h,b;const[i,p,g]=s,u=new P(i),l=1e3/(u.displacement||1),w=((b=(h=(L=p[0])==null?void 0:L.data)==null?void 0:h.values)==null?void 0:b.length)||1,f=u.getTrajectory(w,0,1+l),C=P.toDisplacement(f.points,f.offset),S=z(C,g,p);e.onUpdate({data:S})});const a=new ae(t,s=>{e.onRescale(s)});a.setBounds([0,1e3],[0,1e3]),a.adjustToSize(c,y,!0),a.zFactor=1,a.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),a.enableTranslateExtent=!1,a.setViewport(1e3,1e3,5e3),r.appendChild(D("Low level interface for creating and displaying geo model (aka surfaces). This layer is made using webGL.")),r.appendChild(t),r.appendChild(m)}),r},E=()=>{const r=M(c),t=H(c,y),m=j(),n={order:1},o=new A;return o.init({width:c,height:y}).then(()=>{const e=new k(o,"geomodels",n);e.onMount({elm:t,height:y,width:c});const a={order:1},s=new se("labels",a);s.onMount({elm:t});const i=new ae(r,p=>{e.onRescale(p),s.onRescale({...p})});Promise.all([G(),R(),I()]).then(p=>{var b,x,T;const[g,u,d]=p,l=new P(g),f=1e3/(l.displacement||1),C=((T=(x=(b=u[0])==null?void 0:b.data)==null?void 0:x.values)==null?void 0:T.length)||1,S=l.getTrajectory(C,0,1+f),L=P.toDisplacement(S.points,S.offset),h=z(L,d,u);e.referenceSystem=l,s.referenceSystem=l,e.setData(h),s.setData(h)}),i.setBounds([0,1e3],[0,1e3]),i.adjustToSize(c,y,!0),i.zFactor=1,i.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),i.enableTranslateExtent=!1,i.setViewport(1e3,1e3,5e3),r.appendChild(D("Low level interface for creating and displaying geo model (aka surfaces) with labels. The geo model layer is made using webGL and the labels using canvas.")),r.appendChild(t),r.appendChild(m)}),r},B=()=>{const r=M(c),t=H(c,y),m=j(),n={order:1},o=new A;return o.init({width:c,height:y}).then(()=>{const e=new k(o,"webgl",n);Promise.all([G(),R(),I(),W()]).then(s=>{var L,h,b;const[i,p,g]=s,u=new P(i),l=1e3/(u.displacement||1),w=((b=(h=(L=p[0])==null?void 0:L.data)==null?void 0:h.values)==null?void 0:b.length)||1,f=u.getTrajectory(w,0,1+l),C=P.toDisplacement(f.points,f.offset),S=z(C,g,p);e.setData(S)});const a=new U({container:t,layers:[e]});a.setBounds([0,1e3],[0,1e3]),a.adjustToSize(c,y),a.zoomPanHandler.zFactor=1,a.zoomPanHandler.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),a.zoomPanHandler.enableTranslateExtent=!1,a.setViewport(1e3,1e3,5e3),r.appendChild(D("High level interface for creating and displaying geo model (aka surfaces). This layer is made using webGL.")),r.appendChild(t),r.appendChild(m)}),r},F=()=>{const r=M(c),t=H(c,y),m=j(),n={order:1},o=new A;return o.init({width:c,height:y}).then(()=>{const e=new k(o,"geomodels",n);e.onMount({elm:t,height:y,width:c});const a={order:1},s=new se("labels",a);s.onMount({elm:t}),Promise.all([G(),R(),I()]).then(i=>{var b,x,T;const[p,g,u]=i,d=new P(p),w=1e3/(d.displacement||1),f=((T=(x=(b=g[0])==null?void 0:b.data)==null?void 0:x.values)==null?void 0:T.length)||1,C=d.getTrajectory(f,0,1+w),S=P.toDisplacement(C.points,C.offset),L=z(S,u,g),h=new U({container:t,layers:[e,s]});h.setReferenceSystem(d),e.setData(L),s.setData(L),h.setBounds([0,1e3],[0,1e3]),h.adjustToSize(c,y),h.zoomPanHandler.zFactor=1,h.zoomPanHandler.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),h.zoomPanHandler.enableTranslateExtent=!1,h.setViewport(1e3,1e3,5e3)}),r.appendChild(D("High level interface for creating and displaying geo model (aka surfaces) with labels. The geo model layer is made using webGL and the labels using canvas.")),r.appendChild(t),r.appendChild(m)}),r},V=()=>{const r=M(c),t=H(c,y),m=j(),n={order:1},o=new ie("canvas",n);Promise.all([G(),R(),I(),W()]).then(a=>{var S,L,h;const[s,i,p]=a,g=new P(s),d=1e3/(g.displacement||1),l=((h=(L=(S=i[0])==null?void 0:S.data)==null?void 0:L.values)==null?void 0:h.length)||1,w=g.getTrajectory(l,0,1+d),f=P.toDisplacement(w.points,w.offset),C=z(f,p,i);o.setData(C)});const e=new U({container:t,layers:[o]});return e.setBounds([0,1e3],[0,1e3]),e.adjustToSize(c,y),e.zoomPanHandler.zFactor=1,e.zoomPanHandler.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),e.zoomPanHandler.enableTranslateExtent=!1,e.setViewport(1e3,1e3,5e3),r.appendChild(D("High level interface for creating and displaying geo model (aka surfaces). This layer is made using plain HTML canvas. GeomodelLayer is preferred for rendering geo models if your browser supports WebGL.")),r.appendChild(t),r.appendChild(m),r},Le={title:"ESV Intersection/Features/Geo Model",component:v};var O,_,Z;v.parameters={...v.parameters,docs:{...(O=v.parameters)==null?void 0:O.docs,source:{originalSource:`() => {
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
}`,...(Z=(_=v.parameters)==null?void 0:_.docs)==null?void 0:Z.source}}};var q,X,J;E.parameters={...E.parameters,docs:{...(q=E.parameters)==null?void 0:q.docs,source:{originalSource:`() => {
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
}`,...(J=(X=E.parameters)==null?void 0:X.docs)==null?void 0:J.source}}};var K,N,Q;B.parameters={...B.parameters,docs:{...(K=B.parameters)==null?void 0:K.docs,source:{originalSource:`() => {
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
}`,...(Q=(N=B.parameters)==null?void 0:N.docs)==null?void 0:Q.source}}};var Y,$,ee;F.parameters={...F.parameters,docs:{...(Y=F.parameters)==null?void 0:Y.docs,source:{originalSource:`() => {
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
}`,...(oe=(ne=V.parameters)==null?void 0:ne.docs)==null?void 0:oe.source}}};const we=["GeoModelUsingLowLevelInterface","GeoModelWithLabelsUsingLowLevelInterface","GeoModelUsingHighLevelInterface","GeoModelWithLabelsUsingHighLevelInterface","GeoModelCanvasUsingHighLevelInterface"];export{V as GeoModelCanvasUsingHighLevelInterface,B as GeoModelUsingHighLevelInterface,v as GeoModelUsingLowLevelInterface,F as GeoModelWithLabelsUsingHighLevelInterface,E as GeoModelWithLabelsUsingLowLevelInterface,we as __namedExportsOrder,Le as default};
