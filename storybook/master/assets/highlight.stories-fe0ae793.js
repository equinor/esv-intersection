import{L as P,D as A,q as M,s as F,c as x,d as b,Z as k,e as C}from"./elements-c524eb90.js";import{W as H}from"./WellborePathLayer-72db9201.js";import{I as E,C as U}from"./MainController-41902cc8.js";import{g as z}from"./data-e45bb153.js";import"./_commonjsHelpers-28e086c5.js";import"./GridLayer-c4d0ce91.js";class $ extends P{onMount(e){super.onMount(e);const{elm:t}=e,o=e.width||parseInt(t.getAttribute("width"),10)||A,i=e.height||parseInt(t.getAttribute("height"),10)||M;this.elm||(this.elm=F(t).append("div"),this.elm.attr("id",`${this.id}`),this.elm.attr("class","html-layer"));const r=this.interactive?"auto":"none";this.elm.style("position","absolute").style("height",`${i}px`).style("width",`${o}px`).style("opacity",this.opacity).style("overflow","hidden").style("pointer-events",r).style("z-index",this.order)}onUnmount(){super.onUnmount(),this.elm.remove(),this.elm=null}onResize(e){this.elm&&(super.onResize(e),this.elm.style("height",`${e.height}px`).style("width",`${e.width}px`))}setVisibility(e){super.setVisibility(e),this.elm&&this.elm.attr("visibility",e?"visible":"hidden")}onOpacityChanged(e){this.elm&&this.elm.style("opacity",e)}onOrderChanged(e){this.elm&&this.elm.style("z-index",e)}onInteractivityChanged(e){if(this.elm){const t=e?"auto":"none";this.elm.style("pointer-events",t)}}}const R=5,T=5,y=2,V=(T+y)/2,B=(R+y)/2,l=700,d=600,m=[0,1e3],g=[0,1e3],D={xMin:m[0],xMax:m[1],yMin:g[0],yMax:g[1]},N={xLabel:"Displacement",yLabel:"TVD MSL",unitOfMeasure:"m"},s=()=>{const n=x(l),e=b(l,d);return z().then(t=>{const o=new E(t),i=new H("wellborepath",{order:3,strokeWidth:"2px",stroke:"red",referenceSystem:o});i.onMount({elm:e}),i.onUpdate({});const r=new O("pointhighlighter",{order:105,referenceSystem:o,layerOpacity:.5});r.onMount({elm:e,width:l,height:d});const a=new k(e,h=>{i.onRescale({...h}),r.onRescale({...h})});a.setBounds([0,1e3],[0,1e3]),a.adjustToSize(l,d),a.zFactor=1,a.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),a.enableTranslateExtent=!1,a.setViewport(1e3,1e3,5e3),r.onRescale(a.currentStateAsEvent());const p=I(h=>W(h,{rescaleEvent:a.currentStateAsEvent(),layer:r}),{width:l,min:0,max:o.length});n.appendChild(e),n.appendChild(p),n.appendChild(C())}),n},c=()=>{const n=x(l),e=b(l,d);return z().then(t=>{const o=new E(t),i=new H("wellborepath",{order:3,strokeWidth:"2px",stroke:"red",referenceSystem:o}),r=new U({referenceSystem:o,axisOptions:N,scaleOptions:D,container:e}),a=new O("pointhighlighter",{order:105,referenceSystem:o,layerOpacity:.5});r.addLayer(i).addLayer(a),r.setBounds([0,1e3],[0,1e3]),r.adjustToSize(l,d),r.setViewport(1e3,1e3,5e3);const p=I(h=>W(h,{rescaleEvent:r.currentStateAsEvent,layer:a}),{width:l,min:-1e3,max:r.referenceSystem.length+1e3});n.appendChild(e),n.appendChild(p),n.appendChild(C())}),n};class O extends ${constructor(){super(...arguments),this.elements=[],this.elementCurveLength=0}onMount(e){super.onMount(e),this.addHighlightElement("wellborepath")}onRescale(e){super.onRescale(e);const t=this.elements[0];if(this.referenceSystem){const o=this.referenceSystem.project(this.elementCurveLength),i=e.xScale(o[0]),r=e.yScale(o[1]);t.style("left",`${i-V}px`),t.style("top",`${r-B}px`)}}addHighlightElement(e){const t=this.elm.append("div").attr("id",`${e}-highlight`);return t.style("visibility","visible"),t.style("height",`${R}px`),t.style("width",`${T}px`),t.style("display","inline-block"),t.style("padding",`${y}px`),t.style("border-radius","4px"),t.style("position","absolute"),t.style("background-color","red"),this.elements=[t],this}getElement(e){return this.elm.select(e)}onUpdateCurveLength(e){this.elementCurveLength=e}}const W=(n,e)=>{e.layer.onUpdateCurveLength(Number(n.target.value)),e.layer.onRescale(e.rescaleEvent)},I=(n,e)=>{const t=document.createElement("input");let o=0;return t.type="range",t.value=o.toString(),t.min=`${e.min||0}`,t.max=`${e.max||10}`,t.setAttribute("style",`width:${e.width}px`),t.oninput=n,t},q={title:"ESV Intersection/Features/Highlight",component:s};var u,w,S;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  getWellborePath().then(data => {
    const referenceSystem = new IntersectionReferenceSystem(data);
    const layer = new WellborepathLayer('wellborepath', {
      order: 3,
      strokeWidth: '2px',
      stroke: 'red',
      referenceSystem
    });
    layer.onMount({
      elm: container
    });
    layer.onUpdate({});
    const highlightLayer = new HighlightLayer('pointhighlighter', {
      order: 105,
      referenceSystem,
      layerOpacity: 0.5
    });
    highlightLayer.onMount({
      elm: container,
      width,
      height
    });
    const zoomHandler = new ZoomPanHandler(container, (event: OnRescaleEvent) => {
      layer.onRescale({
        ...event
      });
      highlightLayer.onRescale({
        ...event
      });
    });
    zoomHandler.setBounds([0, 1000], [0, 1000]);
    zoomHandler.adjustToSize(width, height);
    zoomHandler.zFactor = 1;
    zoomHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
    zoomHandler.enableTranslateExtent = false;
    zoomHandler.setViewport(1000, 1000, 5000);
    highlightLayer.onRescale(zoomHandler.currentStateAsEvent());
    const slider = createSlider((event: any) => onUpdate(event, {
      rescaleEvent: zoomHandler.currentStateAsEvent(),
      layer: highlightLayer
    }), {
      width,
      min: 0,
      max: referenceSystem.length
    });
    root.appendChild(container);
    root.appendChild(slider);
    root.appendChild(createFPSLabel());
  });
  return root;
}`,...(S=(w=s.parameters)==null?void 0:w.docs)==null?void 0:S.source}}};var L,v,f;c.parameters={...c.parameters,docs:{...(L=c.parameters)==null?void 0:L.docs,source:{originalSource:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  getWellborePath().then(data => {
    const referenceSystem = new IntersectionReferenceSystem(data);
    const layer = new WellborepathLayer('wellborepath', {
      order: 3,
      strokeWidth: '2px',
      stroke: 'red',
      referenceSystem
    });
    const controller = new Controller({
      referenceSystem,
      axisOptions,
      scaleOptions,
      container
    });
    const highlightLayer = new HighlightLayer('pointhighlighter', {
      order: 105,
      referenceSystem,
      layerOpacity: 0.5
    });
    controller.addLayer(layer).addLayer(highlightLayer);
    controller.setBounds([0, 1000], [0, 1000]);
    controller.adjustToSize(width, height);
    controller.setViewport(1000, 1000, 5000);

    // external event that calls the rescale event the highlighting should change
    const slider = createSlider((event: any) => onUpdate(event, {
      rescaleEvent: controller.currentStateAsEvent,
      layer: highlightLayer
    }), {
      width,
      min: -1000,
      max: controller.referenceSystem.length + 1000
    });
    root.appendChild(container);
    root.appendChild(slider);
    root.appendChild(createFPSLabel());
  });
  return root;
}`,...(f=(v=c.parameters)==null?void 0:v.docs)==null?void 0:f.source}}};s.parameters={storySource:{source:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  getWellborePath().then(data => {
    const referenceSystem = new IntersectionReferenceSystem(data);
    const layer = new WellborepathLayer('wellborepath', {
      order: 3,
      strokeWidth: '2px',
      stroke: 'red',
      referenceSystem
    });
    layer.onMount({
      elm: container
    });
    layer.onUpdate({});
    const highlightLayer = new HighlightLayer('pointhighlighter', {
      order: 105,
      referenceSystem,
      layerOpacity: 0.5
    });
    highlightLayer.onMount({
      elm: container,
      width,
      height
    });
    const zoomHandler = new ZoomPanHandler(container, (event: OnRescaleEvent) => {
      layer.onRescale({
        ...event
      });
      highlightLayer.onRescale({
        ...event
      });
    });
    zoomHandler.setBounds([0, 1000], [0, 1000]);
    zoomHandler.adjustToSize(width, height);
    zoomHandler.zFactor = 1;
    zoomHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
    zoomHandler.enableTranslateExtent = false;
    zoomHandler.setViewport(1000, 1000, 5000);
    highlightLayer.onRescale(zoomHandler.currentStateAsEvent());
    const slider = createSlider((event: any) => onUpdate(event, {
      rescaleEvent: zoomHandler.currentStateAsEvent(),
      layer: highlightLayer
    }), {
      width,
      min: 0,
      max: referenceSystem.length
    });
    root.appendChild(container);
    root.appendChild(slider);
    root.appendChild(createFPSLabel());
  });
  return root;
}`},...s.parameters};c.parameters={storySource:{source:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  getWellborePath().then(data => {
    const referenceSystem = new IntersectionReferenceSystem(data);
    const layer = new WellborepathLayer('wellborepath', {
      order: 3,
      strokeWidth: '2px',
      stroke: 'red',
      referenceSystem
    });
    const controller = new Controller({
      referenceSystem,
      axisOptions,
      scaleOptions,
      container
    });
    const highlightLayer = new HighlightLayer('pointhighlighter', {
      order: 105,
      referenceSystem,
      layerOpacity: 0.5
    });
    controller.addLayer(layer).addLayer(highlightLayer);
    controller.setBounds([0, 1000], [0, 1000]);
    controller.adjustToSize(width, height);
    controller.setViewport(1000, 1000, 5000);

    // external event that calls the rescale event the highlighting should change
    const slider = createSlider((event: any) => onUpdate(event, {
      rescaleEvent: controller.currentStateAsEvent,
      layer: highlightLayer
    }), {
      width,
      min: -1000,
      max: controller.referenceSystem.length + 1000
    });
    root.appendChild(container);
    root.appendChild(slider);
    root.appendChild(createFPSLabel());
  });
  return root;
}`},...c.parameters};const J=["HighlightWellborepath","HighlightWellborepathWithController"];export{s as HighlightWellborepath,c as HighlightWellborepathWithController,J as __namedExportsOrder,q as default};
//# sourceMappingURL=highlight.stories-fe0ae793.js.map
