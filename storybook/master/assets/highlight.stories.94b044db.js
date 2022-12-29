var R=Object.defineProperty;var W=(r,n,e)=>n in r?R(r,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[n]=e;var c=(r,n,e)=>(W(r,typeof n!="symbol"?n+"":n,e),e);import{L as I,D as M,j as A,s as P,c as L,b as x,Z as $,d as b}from"./elements.87f68392.js";import{W as f}from"./WellborePathLayer.e026dac6.js";import{I as v,C as F}from"./MainController.5bd28a66.js";import{g as C}from"./data.640a7923.js";import"./_commonjsHelpers.c10bf6cb.js";import"./GridLayer.439d0b2f.js";class U extends I{constructor(){super(...arguments);c(this,"elm")}onMount(e){super.onMount(e);const{elm:t}=e,i=e.width||parseInt(t.getAttribute("width"),10)||M,o=e.height||parseInt(t.getAttribute("height"),10)||A;this.elm||(this.elm=P(t).append("div"),this.elm.attr("id",`${this.id}`),this.elm.attr("class","html-layer"));const s=this.interactive?"auto":"none";this.elm.style("position","absolute").style("height",`${o}px`).style("width",`${i}px`).style("opacity",this.opacity).style("overflow","hidden").style("pointer-events",s).style("z-index",this.order)}onUnmount(){super.onUnmount(),this.elm.remove(),this.elm=null}onResize(e){!this.elm||(super.onResize(e),this.elm.style("height",`${e.height}px`).style("width",`${e.width}px`))}setVisibility(e){super.setVisibility(e),this.elm&&this.elm.attr("visibility",e?"visible":"hidden")}onOpacityChanged(e){this.elm&&this.elm.style("opacity",e)}onOrderChanged(e){this.elm&&this.elm.style("z-index",e)}onInteractivityChanged(e){if(this.elm){const t=e?"auto":"none";this.elm.style("pointer-events",t)}}}const H=5,E=5,m=2,k=(E+m)/2,D=(H+m)/2,a=700,h=600,g=[0,1e3],u=[0,1e3],V={xMin:g[0],xMax:g[1],yMin:u[0],yMax:u[1]},N={xLabel:"Displacement",yLabel:"TVD MSL",unitOfMeasure:"m"},d=()=>{const r=L(a),n=x(a,h);return C().then(e=>{const t=new v(e),i=new f("wellborepath",{order:3,strokeWidth:"2px",stroke:"red",referenceSystem:t});i.onMount({elm:n}),i.onUpdate({});const o=new T("pointhighlighter",{order:105,referenceSystem:t,layerOpacity:.5});o.onMount({elm:n,width:a,height:h});const s=new $(n,l=>{i.onRescale({...l}),o.onRescale({...l})});s.setBounds([0,1e3],[0,1e3]),s.adjustToSize(a,h),s.zFactor=1,s.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),s.enableTranslateExtent=!1,s.setViewport(1e3,1e3,5e3),o.onRescale(s.currentStateAsEvent());const p=O(l=>z(l,{rescaleEvent:s.currentStateAsEvent(),layer:o}),{width:a,min:0,max:t.length});r.appendChild(n),r.appendChild(p),r.appendChild(b())}),r},y=()=>{const r=L(a),n=x(a,h);return C().then(e=>{const t=new v(e),i=new f("wellborepath",{order:3,strokeWidth:"2px",stroke:"red",referenceSystem:t}),o=new F({referenceSystem:t,axisOptions:N,scaleOptions:V,container:n}),s=new T("pointhighlighter",{order:105,referenceSystem:t,layerOpacity:.5});o.addLayer(i).addLayer(s),o.setBounds([0,1e3],[0,1e3]),o.adjustToSize(a,h),o.setViewport(1e3,1e3,5e3);const p=O(l=>z(l,{rescaleEvent:o.currentStateAsEvent,layer:s}),{width:a,min:-1e3,max:o.referenceSystem.length+1e3});r.appendChild(n),r.appendChild(p),r.appendChild(b())}),r};class T extends U{constructor(){super(...arguments);c(this,"elements",[]);c(this,"elementCurveLength",0)}onMount(e){super.onMount(e),this.addHighlightElement("wellborepath")}onRescale(e){super.onRescale(e);const t=this.elements[0];if(this.referenceSystem){const i=this.referenceSystem.project(this.elementCurveLength),o=e.xScale(i[0]),s=e.yScale(i[1]);t.style("left",`${o-k}px`),t.style("top",`${s-D}px`)}}addHighlightElement(e){const t=this.elm.append("div").attr("id",`${e}-highlight`);return t.style("visibility","visible"),t.style("height",`${H}px`),t.style("width",`${E}px`),t.style("display","inline-block"),t.style("padding",`${m}px`),t.style("border-radius","4px"),t.style("position","absolute"),t.style("background-color","red"),this.elements=[t],this}getElement(e){return this.elm.select(e)}onUpdateCurveLength(e){this.elementCurveLength=e}}const z=(r,n)=>{n.layer.onUpdateCurveLength(Number(r.target.value)),n.layer.onRescale(n.rescaleEvent)},O=(r,n)=>{const e=document.createElement("input");let t=0;return e.type="range",e.value=t.toString(),e.min=`${n.min||0}`,e.max=`${n.max||10}`,e.setAttribute("style",`width:${n.width}px`),e.oninput=r,e},q={title:"ESV Intersection/Features/Highlight",component:d};var w;d.parameters={...d.parameters,storySource:{source:`() => {
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
}`,...(w=d.parameters)==null?void 0:w.storySource}};var S;y.parameters={...y.parameters,storySource:{source:`() => {
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
}`,...(S=y.parameters)==null?void 0:S.storySource}};const J=["HighlightWellborepath","HighlightWellborepathWithController"];export{d as HighlightWellborepath,y as HighlightWellborepathWithController,J as __namedExportsOrder,q as default};
//# sourceMappingURL=highlight.stories.94b044db.js.map
