import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{$ as t,W as n,X as r,Y as i,a,c as o,i as s,n as c,o as l,p as u,s as d,u as f}from"./elements-DhEJT-72.js";import{d as p,f as m}from"./data-5ctOw4ip.js";var h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M;function N(){return(N=e((()=>{f(),d(),r(),l(),m(),h=5,g=5,_=2,v=7/2,y=7/2,b=700,x=600,S=[0,1e3],C=[0,1e3],w={xMin:S[0],xMax:S[1],yMin:C[0],yMax:C[1]},T={xLabel:`Displacement`,yLabel:`TVD MSL`,unitOfMeasure:`m`},E=()=>{let e=a(b),n=s(b,x);return p().then(r=>{let a=new t(r),o=new u(`wellborepath`,{order:3,strokeWidth:`2px`,stroke:`red`,referenceSystem:a});o.onMount({elm:n}),o.onUpdate({});let s=new O(`pointhighlighter`,{order:105,referenceSystem:a,layerOpacity:.5});s.onMount({elm:n,width:b,height:x});let l=new i(n,e=>{o.onRescale({...e}),s.onRescale({...e})});l.setBounds([0,1e3],[0,1e3]),l.adjustToSize(b,x),l.zFactor=1,l.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),l.enableTranslateExtent=!1,l.setViewport(1e3,1e3,5e3),s.onRescale(l.currentStateAsEvent());let d=A(e=>k(e,{rescaleEvent:l.currentStateAsEvent(),layer:s}),{width:b,min:0,max:a.length});e.appendChild(n),e.appendChild(d),e.appendChild(c())}),e},D=()=>{let e=a(b),n=s(b,x);return p().then(r=>{let i=new t(r),a=new u(`wellborepath`,{order:3,strokeWidth:`2px`,stroke:`red`,referenceSystem:i}),s=new o({referenceSystem:i,axisOptions:T,scaleOptions:w,container:n}),l=new O(`pointhighlighter`,{order:105,referenceSystem:i,layerOpacity:.5});s.addLayer(a).addLayer(l),s.setBounds([0,1e3],[0,1e3]),s.adjustToSize(b,x),s.setViewport(1e3,1e3,5e3);let d=A(e=>k(e,{rescaleEvent:s.currentStateAsEvent,layer:l}),{width:b,min:-1e3,max:s.referenceSystem.length+1e3});e.appendChild(n),e.appendChild(d),e.appendChild(c())}),e},O=class extends n{elements=[];elementCurveLength=0;onMount(e){super.onMount(e),this.addHighlightElement(`wellborepath`)}onRescale(e){super.onRescale(e);let t=this.elements[0];if(this.referenceSystem){let n=this.referenceSystem.project(this.elementCurveLength),r=e.xScale(n[0]),i=e.yScale(n[1]);t.style(`left`,`${r-v}px`),t.style(`top`,`${i-y}px`)}}addHighlightElement(e){let t=this.elm.append(`div`).attr(`id`,`${e}-highlight`);return t.style(`visibility`,`visible`),t.style(`height`,`${h}px`),t.style(`width`,`${g}px`),t.style(`display`,`inline-block`),t.style(`padding`,`${_}px`),t.style(`border-radius`,`4px`),t.style(`position`,`absolute`),t.style(`background-color`,`red`),this.elements=[t],this}getElement(e){return this.elm.select(e)}onUpdateCurveLength(e){this.elementCurveLength=e}},k=(e,t)=>{t.layer.onUpdateCurveLength(Number(e.target.value)),t.layer.onRescale(t.rescaleEvent)},A=(e,t)=>{let n=document.createElement(`input`);return n.type=`range`,n.value=`0`,n.min=`${t.min||0}`,n.max=`${t.max||10}`,n.setAttribute(`style`,`width:${t.width}px`),n.oninput=e,n},j={title:`ESV Intersection/Features/Highlight`,component:E},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`() => {
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
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`() => {
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
}`,...D.parameters?.docs?.source}}},M=[`HighlightWellborepath`,`HighlightWellborepathWithController`]})))()}N();export{E as HighlightWellborepath,D as HighlightWellborepathWithController,M as __namedExportsOrder,j as default};