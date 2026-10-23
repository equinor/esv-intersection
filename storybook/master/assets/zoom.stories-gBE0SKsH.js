import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{K as t,Q as n,Y as r,Z as i,a,i as o,n as s,o as c,tt as l,y as u}from"./elements-DVs0HI8I.js";import{t as d}from"./src-7j-v1osd.js";function f(e,t){let n=document.createElement(`button`);return n.innerHTML=e,n.setAttribute(`style`,`width: 100px;height:32px;margin-top:12px;`),n.onclick=t,n}var p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{i(),d(),c(),p=600,m=400,h=class extends t{constructor(e,t){super(e,t),this.render=this.render.bind(this)}onRescale(e){super.onRescale(e),this.render(e)}onUpdate(e){super.onUpdate(e),this.render(null)}render(e){let{ctx:t}=this;if(!t||!e)return;let[n,r]=e.xBounds,[i,a]=e.yBounds,o=e.xScale(n),s=e.yScale(i),c=e.xScale(r)-o,l=e.yScale(a)-s,u=o+c/2,d=s+l/2,f=Math.abs(o-e.xScale(e.xBounds[0]+100)),p=f*e.zFactor;t.save(),t.clearRect(0,0,t.canvas.clientWidth,t.canvas.clientHeight),t.strokeStyle=`green`,t.fillStyle=`#00002f`,t.lineWidth=e.transform.k,t.beginPath(),t.rect(o,s,c,l),t.fill(),t.stroke(),t.strokeStyle=`grey`,t.fillStyle=`dimgray`,t.lineWidth=3,t.beginPath(),t.ellipse(u,d,f,p,0,0,2*Math.PI),t.fill(),t.stroke(),t.fillStyle=`#bbb`,t.lineWidth=1,t.beginPath(),t.ellipse(u,d,f/1.5,p/1.5,0,0,2*Math.PI),t.fill(),t.stroke(),t.strokeStyle=`black`,t.fillStyle=`lightgray`,t.lineWidth=e.transform.k,t.beginPath(),t.rect(10*e.transform.k+e.transform.x,10*e.transform.k+e.transform.y,300*e.transform.k,200*e.transform.k),t.fill(),t.stroke(),t.beginPath();for(let n=0;n<4;n++)t.moveTo(20*e.transform.k+e.transform.x,(n+1)*40*e.transform.k+e.transform.y),t.lineTo(300*e.transform.k+e.transform.x,(n+1)*40*e.transform.k+e.transform.y);t.stroke(),t.translate(e.transform.x,e.transform.y),t.scale(e.xRatio,e.yRatio),t.strokeStyle=`black`,t.lineWidth=1,t.beginPath(),t.moveTo(-50,0),t.lineTo(50,0),t.moveTo(0,-50),t.lineTo(0,50),t.stroke(),t.beginPath(),t.moveTo(950,1e3),t.lineTo(1050,1e3),t.moveTo(1e3,950),t.lineTo(1e3,1050),t.stroke(),t.fillStyle=`gray`,t.beginPath(),t.rect(470,700,60,220),t.fill(),t.stroke(),t.restore()}},g=()=>{let e=document.createElement(`div`),t=document.createElement(`div`);t.className=`test-container`,t.setAttribute(`style`,`height: ${m}px; width: ${p}px;background-color: #eee;position: relative;`),t.setAttribute(`height`,`${m}`),t.setAttribute(`width`,`${p}`),e.appendChild(t);let n=new h(`test`,{order:1});n.onMount({elm:t,width:p,height:m});let i=new r(e,e=>{n.onRescale(e)});i.setBounds([0,1e3],[0,1e3]),i.adjustToSize(p,m),i.zFactor=1,i.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),i.enableTranslateExtent=!1,i.setViewport(500,500,3e3);let a=document.createElement(`div`);return a.className=`Buttons-container`,e.appendChild(f(`500x500`,()=>{t.setAttribute(`style`,`height: 500px; width: 500px;background-color: #eee;`),t.setAttribute(`height`,`500`),t.setAttribute(`width`,`500`),i.adjustToSize(500,500)})),e.appendChild(f(`600x400`,()=>{t.setAttribute(`style`,`height: 400px; width: 600px;background-color: #eee;`),t.setAttribute(`height`,`400`),t.setAttribute(`width`,`600`),i.adjustToSize(600,400)})),e.appendChild(f(`800x600`,()=>{t.setAttribute(`style`,`height: 600px; width: 800px;background-color: #eee;`),t.setAttribute(`height`,`600`),t.setAttribute(`width`,`800`),i.adjustToSize(800,600)})),e.appendChild(f(`1:1`,()=>{i.zFactor=1})),e.appendChild(f(`2:1`,()=>{i.zFactor=2})),e.appendChild(f(`1:2`,()=>{i.zFactor=.5})),e.appendChild(f(`center`,()=>{i.setViewport(500,500,void 0,500)})),e.appendChild(f(`reset`,()=>{i.zFactor=1,i.setViewport(500,500,3e3)})),e.appendChild(s()),e},_=()=>{let e=document.createElement(`div`);e.className=`Test-container`,e.setAttribute(`style`,`height: ${m}px; width: ${p}px;background-color: #eee;`),e.setAttribute(`height`,`${m}`),e.setAttribute(`width`,`${p}`);let t=new u(`grid`,{majorColor:`black`,minorColor:`black`,majorWidth:.5,minorWidth:.5,order:1});t.onMount({elm:e,width:p,height:m});let n=new r(e,e=>{t.onRescale(e)});return n.setBounds([0,1e3],[0,1e3]),n.adjustToSize(p,m),e.appendChild(s()),e},v=()=>{let e=a(p),t=o(p,m),i=document.createElement(`div`),c=n(t).append(`svg`).attr(`height`,`${m}px`).attr(`width`,`${p}px`).style(`position`,`absolute`),d=new l(c,!0,`Displacement`,`TVD MSL`,`m`),h=new u(`grid`,{majorColor:`black`,minorColor:`black`,majorWidth:.5,minorWidth:.5,order:1});h.onMount({elm:t,width:p,height:m});let g=new r(t,e=>{d.onRescale(e),h.onRescale(e)});return g.setMinZoomLevel(.1),g.setMaxZoomLevel(10),g.setBounds([0,1e3],[0,1e3]),g.adjustToSize(560,370),i.appendChild(f(`min zoom 1`,()=>{g.setMinZoomLevel(1)})),i.appendChild(f(`max zoom 100`,()=>{g.setMaxZoomLevel(100)})),i.appendChild(f(`reset`,()=>{g.setZoomLevelBoundary([.1,256])})),e.appendChild(t),e.appendChild(i),e.appendChild(s()),e},y={title:`ESV Intersection/Features/Zoom`,component:g},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`() => {
  const root = document.createElement('div');
  const container = document.createElement('div');
  container.className = 'test-container';
  container.setAttribute('style', \`height: \${height}px; width: \${width}px;background-color: #eee;position: relative;\`);
  container.setAttribute('height', \`\${height}\`);
  container.setAttribute('width', \`\${width}\`);
  root.appendChild(container);
  const testLayer = new TestLayer('test', {
    order: 1
  });
  testLayer.onMount({
    elm: container,
    width,
    height
  });
  const zoomHandler = new ZoomPanHandler(root, (event: OnRescaleEvent) => {
    testLayer.onRescale(event);
  });
  zoomHandler.setBounds([0, 1000], [0, 1000]);
  zoomHandler.adjustToSize(width, height);
  zoomHandler.zFactor = 1;
  zoomHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
  zoomHandler.enableTranslateExtent = false;
  zoomHandler.setViewport(500, 500, 3000);
  const buttons = document.createElement('div');
  //root.appendChild(buttons);
  buttons.className = 'Buttons-container';
  root.appendChild(createButton('500x500', () => {
    const w = 500;
    const h = 500;
    container.setAttribute('style', \`height: \${h}px; width: \${w}px;background-color: #eee;\`);
    container.setAttribute('height', \`\${h}\`);
    container.setAttribute('width', \`\${w}\`);
    zoomHandler.adjustToSize(w, h);
  }));
  root.appendChild(createButton('600x400', () => {
    const w = 600;
    const h = 400;
    container.setAttribute('style', \`height: \${h}px; width: \${w}px;background-color: #eee;\`);
    container.setAttribute('height', \`\${h}\`);
    container.setAttribute('width', \`\${w}\`);
    zoomHandler.adjustToSize(w, h);
  }));
  root.appendChild(createButton('800x600', () => {
    const w = 800;
    const h = 600;
    container.setAttribute('style', \`height: \${h}px; width: \${w}px;background-color: #eee;\`);
    container.setAttribute('height', \`\${h}\`);
    container.setAttribute('width', \`\${w}\`);
    zoomHandler.adjustToSize(w, h);
  }));
  root.appendChild(createButton('1:1', () => {
    zoomHandler.zFactor = 1;
  }));
  root.appendChild(createButton('2:1', () => {
    zoomHandler.zFactor = 2;
  }));
  root.appendChild(createButton('1:2', () => {
    zoomHandler.zFactor = 0.5;
  }));
  root.appendChild(createButton('center', () => {
    zoomHandler.setViewport(500, 500, undefined, 500);
  }));
  root.appendChild(createButton('reset', () => {
    zoomHandler.zFactor = 1;
    zoomHandler.setViewport(500, 500, 3000);
  }));
  root.appendChild(createFPSLabel());
  return root;
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`() => {
  const root = document.createElement('div');
  root.className = 'Test-container';
  root.setAttribute('style', \`height: \${height}px; width: \${width}px;background-color: #eee;\`);
  root.setAttribute('height', \`\${height}\`);
  root.setAttribute('width', \`\${width}\`);
  const gridLayer = new GridLayer('grid', {
    majorColor: 'black',
    minorColor: 'black',
    majorWidth: 0.5,
    minorWidth: 0.5,
    order: 1
  });
  gridLayer.onMount({
    elm: root,
    width,
    height
  });
  const zoomHandler = new ZoomPanHandler(root, (event: OnRescaleEvent) => {
    gridLayer.onRescale(event);
  });
  zoomHandler.setBounds([0, 1000], [0, 1000]);
  zoomHandler.adjustToSize(width, height);
  root.appendChild(createFPSLabel());
  return root;
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const buttons = document.createElement('div');
  const marginXAxis = 40;
  const marginYAxis = 30;
  const mainGroup = select(container).append('svg').attr('height', \`\${height}px\`).attr('width', \`\${width}px\`).style('position', 'absolute') as unknown as Selection<SVGElement, unknown, null, undefined>;
  const showLabels = true;
  const axis = new Axis(mainGroup, showLabels, 'Displacement', 'TVD MSL', 'm');
  const gridLayer = new GridLayer('grid', {
    majorColor: 'black',
    minorColor: 'black',
    majorWidth: 0.5,
    minorWidth: 0.5,
    order: 1
  });
  gridLayer.onMount({
    elm: container,
    width,
    height
  });
  const zoomHandler = new ZoomPanHandler(container, (event: OnRescaleEvent) => {
    axis.onRescale(event);
    gridLayer.onRescale(event);
  });
  zoomHandler.setMinZoomLevel(0.1);
  zoomHandler.setMaxZoomLevel(10);
  zoomHandler.setBounds([0, 1000], [0, 1000]);
  zoomHandler.adjustToSize(width - marginXAxis, height - marginYAxis);
  buttons.appendChild(createButton('min zoom 1', () => {
    zoomHandler.setMinZoomLevel(1);
  }));
  buttons.appendChild(createButton('max zoom 100', () => {
    zoomHandler.setMaxZoomLevel(100);
  }));
  buttons.appendChild(createButton('reset', () => {
    zoomHandler.setZoomLevelBoundary([0.1, 256]);
  }));
  root.appendChild(container);
  root.appendChild(buttons);
  root.appendChild(createFPSLabel());
  return root;
}`,...v.parameters?.docs?.source}}},b=[`ZoomWithTestLayer`,`ZoomWithGridLayer`,`ZoomWithGridAndAxis`]})))()}x();export{v as ZoomWithGridAndAxis,_ as ZoomWithGridLayer,g as ZoomWithTestLayer,b as __namedExportsOrder,y as default};