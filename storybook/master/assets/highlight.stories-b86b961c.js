import{L as M,D as A,m as P,s as $,c as v,d as f,Z as F,e as C}from"./elements-3bfbc1e4.js";import{W as H}from"./WellborePathLayer-8a5350d2.js";import{I as E,C as U}from"./MainController-a0113b3f.js";import{g as T}from"./data-e45bb153.js";import"./GridLayer-a4c9afad.js";class k extends M{onMount(e){super.onMount(e);const{elm:t}=e,o=e.width||parseInt((t==null?void 0:t.getAttribute("width"))??"",10)||A,i=e.height||parseInt((t==null?void 0:t.getAttribute("height"))??"",10)||P;this.elm||(this.elm=$(t).append("div"),this.elm.attr("id",`${this.id}`),this.elm.attr("class","html-layer"));const r=this.interactive?"auto":"none";this.elm.style("position","absolute").style("height",`${i}px`).style("width",`${o}px`).style("opacity",this.opacity).style("overflow","hidden").style("pointer-events",r).style("z-index",this.order)}onUnmount(){var e;super.onUnmount(),(e=this.elm)==null||e.remove(),this.elm=void 0}onResize(e){this.elm&&(super.onResize(e),this.elm.style("height",`${e.height}px`).style("width",`${e.width}px`))}setVisibility(e){super.setVisibility(e),this.elm&&this.elm.attr("visibility",e?"visible":"hidden")}onOpacityChanged(e){this.elm&&this.elm.style("opacity",e)}onOrderChanged(e){this.elm&&this.elm.style("z-index",e)}onInteractivityChanged(e){if(this.elm){const t=e?"auto":"none";this.elm.style("pointer-events",t)}}}const z=5,O=5,y=2,D=(O+y)/2,V=(z+y)/2,a=700,c=600,m=[0,1e3],g=[0,1e3],N={xMin:m[0],xMax:m[1],yMin:g[0],yMax:g[1]},_={xLabel:"Displacement",yLabel:"TVD MSL",unitOfMeasure:"m"},h=()=>{const n=v(a),e=f(a,c);return T().then(t=>{const o=new E(t),i=new H("wellborepath",{order:3,strokeWidth:"2px",stroke:"red",referenceSystem:o});i.onMount({elm:e}),i.onUpdate({});const r=new R("pointhighlighter",{order:105,referenceSystem:o,layerOpacity:.5});r.onMount({elm:e,width:a,height:c});const s=new F(e,l=>{i.onRescale({...l}),r.onRescale({...l})});s.setBounds([0,1e3],[0,1e3]),s.adjustToSize(a,c),s.zFactor=1,s.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),s.enableTranslateExtent=!1,s.setViewport(1e3,1e3,5e3),r.onRescale(s.currentStateAsEvent());const p=I(l=>W(l,{rescaleEvent:s.currentStateAsEvent(),layer:r}),{width:a,min:0,max:o.length});n.appendChild(e),n.appendChild(p),n.appendChild(C())}),n},d=()=>{const n=v(a),e=f(a,c);return T().then(t=>{const o=new E(t),i=new H("wellborepath",{order:3,strokeWidth:"2px",stroke:"red",referenceSystem:o}),r=new U({referenceSystem:o,axisOptions:_,scaleOptions:N,container:e}),s=new R("pointhighlighter",{order:105,referenceSystem:o,layerOpacity:.5});r.addLayer(i).addLayer(s),r.setBounds([0,1e3],[0,1e3]),r.adjustToSize(a,c),r.setViewport(1e3,1e3,5e3);const p=I(l=>W(l,{rescaleEvent:r.currentStateAsEvent,layer:s}),{width:a,min:-1e3,max:r.referenceSystem.length+1e3});n.appendChild(e),n.appendChild(p),n.appendChild(C())}),n};class R extends k{constructor(){super(...arguments),this.elements=[],this.elementCurveLength=0}onMount(e){super.onMount(e),this.addHighlightElement("wellborepath")}onRescale(e){super.onRescale(e);const t=this.elements[0];if(this.referenceSystem){const o=this.referenceSystem.project(this.elementCurveLength),i=e.xScale(o[0]),r=e.yScale(o[1]);t.style("left",`${i-D}px`),t.style("top",`${r-V}px`)}}addHighlightElement(e){const t=this.elm.append("div").attr("id",`${e}-highlight`);return t.style("visibility","visible"),t.style("height",`${z}px`),t.style("width",`${O}px`),t.style("display","inline-block"),t.style("padding",`${y}px`),t.style("border-radius","4px"),t.style("position","absolute"),t.style("background-color","red"),this.elements=[t],this}getElement(e){return this.elm.select(e)}onUpdateCurveLength(e){this.elementCurveLength=e}}const W=(n,e)=>{e.layer.onUpdateCurveLength(Number(n.target.value)),e.layer.onRescale(e.rescaleEvent)},I=(n,e)=>{const t=document.createElement("input");let o=0;return t.type="range",t.value=o.toString(),t.min=`${e.min||0}`,t.max=`${e.max||10}`,t.setAttribute("style",`width:${e.width}px`),t.oninput=n,t},X={title:"ESV Intersection/Features/Highlight",component:h};var u,w,L;h.parameters={...h.parameters,docs:{...(u=h.parameters)==null?void 0:u.docs,source:{originalSource:`() => {
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
}`,...(L=(w=h.parameters)==null?void 0:w.docs)==null?void 0:L.source}}};var S,x,b;d.parameters={...d.parameters,docs:{...(S=d.parameters)==null?void 0:S.docs,source:{originalSource:`() => {
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
}`,...(b=(x=d.parameters)==null?void 0:x.docs)==null?void 0:b.source}}};const q=["HighlightWellborepath","HighlightWellborepathWithController"];export{h as HighlightWellborepath,d as HighlightWellborepathWithController,q as __namedExportsOrder,X as default};
