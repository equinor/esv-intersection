import{L as T,t as z,u as O,s as R,c as u,a as w,Z as W,d as L}from"./elements-DUrmcn_5.js";import{W as S}from"./WellborePathLayer-D36AqAmi.js";import{I as x,C as I}from"./MainController-BII56cSM.js";import{c as b}from"./data-D8Ls4_G-.js";import"./preload-helper-PPVm8Dsz.js";import"./_commonjsHelpers-CqkleIqs.js";import"./GridLayer-COqgr0cg.js";class M extends T{onMount(e){super.onMount(e);const{elm:t}=e,o=e.width||parseInt(t?.getAttribute("width")??"",10)||z,i=e.height||parseInt(t?.getAttribute("height")??"",10)||O;this.elm||(this.elm=R(t).append("div"),this.elm.attr("id",`${this.id}`),this.elm.attr("class","html-layer"));const r=this.interactive?"auto":"none";this.elm.style("position","absolute").style("height",`${i}px`).style("width",`${o}px`).style("opacity",this.opacity).style("overflow","hidden").style("pointer-events",r).style("z-index",this.order)}onUnmount(){super.onUnmount(),this.elm?.remove(),this.elm=void 0}onResize(e){this.elm&&(super.onResize(e),this.elm.style("height",`${e.height}px`).style("width",`${e.width}px`))}setVisibility(e){super.setVisibility(e),this.elm&&this.elm.attr("visibility",e?"visible":"hidden")}onOpacityChanged(e){this.elm&&this.elm.style("opacity",e)}onOrderChanged(e){this.elm&&this.elm.style("z-index",e)}onInteractivityChanged(e){if(this.elm){const t=e?"auto":"none";this.elm.style("pointer-events",t)}}}const v=5,f=5,m=2,A=(f+m)/2,P=(v+m)/2,a=700,c=600,y=[0,1e3],g=[0,1e3],$={xMin:y[0],xMax:y[1],yMin:g[0],yMax:g[1]},F={xLabel:"Displacement",yLabel:"TVD MSL",unitOfMeasure:"m"},h=()=>{const n=u(a),e=w(a,c);return b().then(t=>{const o=new x(t),i=new S("wellborepath",{order:3,strokeWidth:"2px",stroke:"red",referenceSystem:o});i.onMount({elm:e}),i.onUpdate({});const r=new C("pointhighlighter",{order:105,referenceSystem:o,layerOpacity:.5});r.onMount({elm:e,width:a,height:c});const s=new W(e,l=>{i.onRescale({...l}),r.onRescale({...l})});s.setBounds([0,1e3],[0,1e3]),s.adjustToSize(a,c),s.zFactor=1,s.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),s.enableTranslateExtent=!1,s.setViewport(1e3,1e3,5e3),r.onRescale(s.currentStateAsEvent());const p=E(l=>H(l,{rescaleEvent:s.currentStateAsEvent(),layer:r}),{width:a,min:0,max:o.length});n.appendChild(e),n.appendChild(p),n.appendChild(L())}),n},d=()=>{const n=u(a),e=w(a,c);return b().then(t=>{const o=new x(t),i=new S("wellborepath",{order:3,strokeWidth:"2px",stroke:"red",referenceSystem:o}),r=new I({referenceSystem:o,axisOptions:F,scaleOptions:$,container:e}),s=new C("pointhighlighter",{order:105,referenceSystem:o,layerOpacity:.5});r.addLayer(i).addLayer(s),r.setBounds([0,1e3],[0,1e3]),r.adjustToSize(a,c),r.setViewport(1e3,1e3,5e3);const p=E(l=>H(l,{rescaleEvent:r.currentStateAsEvent,layer:s}),{width:a,min:-1e3,max:r.referenceSystem.length+1e3});n.appendChild(e),n.appendChild(p),n.appendChild(L())}),n};class C extends M{constructor(){super(...arguments),this.elements=[],this.elementCurveLength=0}onMount(e){super.onMount(e),this.addHighlightElement("wellborepath")}onRescale(e){super.onRescale(e);const t=this.elements[0];if(this.referenceSystem){const o=this.referenceSystem.project(this.elementCurveLength),i=e.xScale(o[0]),r=e.yScale(o[1]);t.style("left",`${i-A}px`),t.style("top",`${r-P}px`)}}addHighlightElement(e){const t=this.elm.append("div").attr("id",`${e}-highlight`);return t.style("visibility","visible"),t.style("height",`${v}px`),t.style("width",`${f}px`),t.style("display","inline-block"),t.style("padding",`${m}px`),t.style("border-radius","4px"),t.style("position","absolute"),t.style("background-color","red"),this.elements=[t],this}getElement(e){return this.elm.select(e)}onUpdateCurveLength(e){this.elementCurveLength=e}}const H=(n,e)=>{e.layer.onUpdateCurveLength(Number(n.target.value)),e.layer.onRescale(e.rescaleEvent)},E=(n,e)=>{const t=document.createElement("input");let o=0;return t.type="range",t.value=o.toString(),t.min=`${e.min||0}`,t.max=`${e.max||10}`,t.setAttribute("style",`width:${e.width}px`),t.oninput=n,t},Y={title:"ESV Intersection/Features/Highlight",component:h};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`() => {
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
}`,...h.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => {
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
}`,...d.parameters?.docs?.source}}};const j=["HighlightWellborepath","HighlightWellborepathWithController"];export{h as HighlightWellborepath,d as HighlightWellborepathWithController,j as __namedExportsOrder,Y as default};
