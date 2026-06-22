import{i as e}from"./preload-helper-xPQekRTU.js";import{a as t,at as n,c as r,d as i,dt as a,ht as o,l as s,m as c,o as l,r as u,t as d,ut as f}from"./utils-CwHZxYAM.js";import{d as p,f as m}from"./data-DjlWSgKa.js";var h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M;e((()=>{i(),r(),a(),d(),m(),h=5,g=5,_=2,v=7/2,y=7/2,b=700,x=600,S=[0,1e3],C=[0,1e3],w={xMin:S[0],xMax:S[1],yMin:C[0],yMax:C[1]},T={xLabel:`Displacement`,yLabel:`TVD MSL`,unitOfMeasure:`m`},E=()=>{let e=l(b),n=t(b,x);return p().then(t=>{let r=new o(t),i=new c(`wellborepath`,{order:3,strokeWidth:`2px`,stroke:`red`,referenceSystem:r});i.onMount({elm:n}),i.onUpdate({});let a=new O(`pointhighlighter`,{order:105,referenceSystem:r,layerOpacity:.5});a.onMount({elm:n,width:b,height:x});let s=new f(n,e=>{i.onRescale({...e}),a.onRescale({...e})});s.setBounds([0,1e3],[0,1e3]),s.adjustToSize(b,x),s.zFactor=1,s.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),s.enableTranslateExtent=!1,s.setViewport(1e3,1e3,5e3),a.onRescale(s.currentStateAsEvent());let l=A(e=>k(e,{rescaleEvent:s.currentStateAsEvent(),layer:a}),{width:b,min:0,max:r.length});e.appendChild(n),e.appendChild(l),e.appendChild(u())}),e},D=()=>{let e=l(b),n=t(b,x);return p().then(t=>{let r=new o(t),i=new c(`wellborepath`,{order:3,strokeWidth:`2px`,stroke:`red`,referenceSystem:r}),a=new s({referenceSystem:r,axisOptions:T,scaleOptions:w,container:n}),l=new O(`pointhighlighter`,{order:105,referenceSystem:r,layerOpacity:.5});a.addLayer(i).addLayer(l),a.setBounds([0,1e3],[0,1e3]),a.adjustToSize(b,x),a.setViewport(1e3,1e3,5e3);let d=A(e=>k(e,{rescaleEvent:a.currentStateAsEvent,layer:l}),{width:b,min:-1e3,max:a.referenceSystem.length+1e3});e.appendChild(n),e.appendChild(d),e.appendChild(u())}),e},O=class extends n{constructor(...e){super(...e),this.elements=[],this.elementCurveLength=0}onMount(e){super.onMount(e),this.addHighlightElement(`wellborepath`)}onRescale(e){super.onRescale(e);let t=this.elements[0];if(this.referenceSystem){let n=this.referenceSystem.project(this.elementCurveLength),r=e.xScale(n[0]),i=e.yScale(n[1]);t.style(`left`,`${r-v}px`),t.style(`top`,`${i-y}px`)}}addHighlightElement(e){let t=this.elm.append(`div`).attr(`id`,`${e}-highlight`);return t.style(`visibility`,`visible`),t.style(`height`,`${h}px`),t.style(`width`,`${g}px`),t.style(`display`,`inline-block`),t.style(`padding`,`${_}px`),t.style(`border-radius`,`4px`),t.style(`position`,`absolute`),t.style(`background-color`,`red`),this.elements=[t],this}getElement(e){return this.elm.select(e)}onUpdateCurveLength(e){this.elementCurveLength=e}},k=(e,t)=>{t.layer.onUpdateCurveLength(Number(e.target.value)),t.layer.onRescale(t.rescaleEvent)},A=(e,t)=>{let n=document.createElement(`input`);return n.type=`range`,n.value=`0`,n.min=`${t.min||0}`,n.max=`${t.max||10}`,n.setAttribute(`style`,`width:${t.width}px`),n.oninput=e,n},j={title:`ESV Intersection/Features/Highlight`,component:E},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`() => {
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
}`,...D.parameters?.docs?.source}}},M=[`HighlightWellborepath`,`HighlightWellborepathWithController`]}))();export{E as HighlightWellborepath,D as HighlightWellborepathWithController,M as __namedExportsOrder,j as default};