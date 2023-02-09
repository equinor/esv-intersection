import{L as O,D as R,q as W,s as I,c as S,d as L,Z as M,e as x}from"./elements-bb7591df.js";import{W as b}from"./WellborePathLayer-7fc87996.js";import{I as f,C as A}from"./MainController-6de464fc.js";import{g as v}from"./data-e45bb153.js";import"./_commonjsHelpers-28e086c5.js";import"./GridLayer-c7ca5df2.js";class P extends O{onMount(e){super.onMount(e);const{elm:t}=e,o=e.width||parseInt(t.getAttribute("width"),10)||R,i=e.height||parseInt(t.getAttribute("height"),10)||W;this.elm||(this.elm=I(t).append("div"),this.elm.attr("id",`${this.id}`),this.elm.attr("class","html-layer"));const r=this.interactive?"auto":"none";this.elm.style("position","absolute").style("height",`${i}px`).style("width",`${o}px`).style("opacity",this.opacity).style("overflow","hidden").style("pointer-events",r).style("z-index",this.order)}onUnmount(){super.onUnmount(),this.elm.remove(),this.elm=null}onResize(e){this.elm&&(super.onResize(e),this.elm.style("height",`${e.height}px`).style("width",`${e.width}px`))}setVisibility(e){super.setVisibility(e),this.elm&&this.elm.attr("visibility",e?"visible":"hidden")}onOpacityChanged(e){this.elm&&this.elm.style("opacity",e)}onOrderChanged(e){this.elm&&this.elm.style("z-index",e)}onInteractivityChanged(e){if(this.elm){const t=e?"auto":"none";this.elm.style("pointer-events",t)}}}const C=5,H=5,y=2,$=(H+y)/2,F=(C+y)/2,a=700,h=600,m=[0,1e3],g=[0,1e3],U={xMin:m[0],xMax:m[1],yMin:g[0],yMax:g[1]},k={xLabel:"Displacement",yLabel:"TVD MSL",unitOfMeasure:"m"},c=()=>{const n=S(a),e=L(a,h);return v().then(t=>{const o=new f(t),i=new b("wellborepath",{order:3,strokeWidth:"2px",stroke:"red",referenceSystem:o});i.onMount({elm:e}),i.onUpdate({});const r=new E("pointhighlighter",{order:105,referenceSystem:o,layerOpacity:.5});r.onMount({elm:e,width:a,height:h});const s=new M(e,l=>{i.onRescale({...l}),r.onRescale({...l})});s.setBounds([0,1e3],[0,1e3]),s.adjustToSize(a,h),s.zFactor=1,s.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),s.enableTranslateExtent=!1,s.setViewport(1e3,1e3,5e3),r.onRescale(s.currentStateAsEvent());const d=z(l=>T(l,{rescaleEvent:s.currentStateAsEvent(),layer:r}),{width:a,min:0,max:o.length});n.appendChild(e),n.appendChild(d),n.appendChild(x())}),n},p=()=>{const n=S(a),e=L(a,h);return v().then(t=>{const o=new f(t),i=new b("wellborepath",{order:3,strokeWidth:"2px",stroke:"red",referenceSystem:o}),r=new A({referenceSystem:o,axisOptions:k,scaleOptions:U,container:e}),s=new E("pointhighlighter",{order:105,referenceSystem:o,layerOpacity:.5});r.addLayer(i).addLayer(s),r.setBounds([0,1e3],[0,1e3]),r.adjustToSize(a,h),r.setViewport(1e3,1e3,5e3);const d=z(l=>T(l,{rescaleEvent:r.currentStateAsEvent,layer:s}),{width:a,min:-1e3,max:r.referenceSystem.length+1e3});n.appendChild(e),n.appendChild(d),n.appendChild(x())}),n};class E extends P{constructor(){super(...arguments),this.elements=[],this.elementCurveLength=0}onMount(e){super.onMount(e),this.addHighlightElement("wellborepath")}onRescale(e){super.onRescale(e);const t=this.elements[0];if(this.referenceSystem){const o=this.referenceSystem.project(this.elementCurveLength),i=e.xScale(o[0]),r=e.yScale(o[1]);t.style("left",`${i-$}px`),t.style("top",`${r-F}px`)}}addHighlightElement(e){const t=this.elm.append("div").attr("id",`${e}-highlight`);return t.style("visibility","visible"),t.style("height",`${C}px`),t.style("width",`${H}px`),t.style("display","inline-block"),t.style("padding",`${y}px`),t.style("border-radius","4px"),t.style("position","absolute"),t.style("background-color","red"),this.elements=[t],this}getElement(e){return this.elm.select(e)}onUpdateCurveLength(e){this.elementCurveLength=e}}const T=(n,e)=>{e.layer.onUpdateCurveLength(Number(n.target.value)),e.layer.onRescale(e.rescaleEvent)},z=(n,e)=>{const t=document.createElement("input");let o=0;return t.type="range",t.value=o.toString(),t.min=`${e.min||0}`,t.max=`${e.max||10}`,t.setAttribute("style",`width:${e.width}px`),t.oninput=n,t},j={title:"ESV Intersection/Features/Highlight",component:c};var u;c.parameters={...c.parameters,storySource:{source:`() => {
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
}`,...(u=c.parameters)==null?void 0:u.storySource}};var w;p.parameters={...p.parameters,storySource:{source:`() => {
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
}`,...(w=p.parameters)==null?void 0:w.storySource}};const G=["HighlightWellborepath","HighlightWellborepathWithController"];export{c as HighlightWellborepath,p as HighlightWellborepathWithController,G as __namedExportsOrder,j as default};
//# sourceMappingURL=highlight.stories-6d511cc3.js.map
