import{G as Z,A as E}from"./GridLayer-7caf88fb.js";import{Z as z,e as y,c as M,d as R,s as F,C as P}from"./elements-879199e9.js";import"./_commonjsHelpers-28e086c5.js";const r=600,a=400;function i(n,e){const t=document.createElement("button");return t.innerHTML=n,t.setAttribute("style","width: 100px;height:32px;margin-top:12px;"),t.onclick=e,t}class W extends P{constructor(e,t){super(e,t),this.render=this.render.bind(this)}onRescale(e){super.onRescale(e),this.render(e)}onUpdate(e){super.onUpdate(e),this.render(null)}render(e){const{ctx:t}=this;if(!t||!e)return;const[o,w]=e.xBounds,[d,l]=e.yBounds,h=e.xScale(o),m=e.yScale(d),s=e.xScale(w)-h,b=e.yScale(l)-m,C=h+s/2,L=m+b/2,x=Math.abs(h-e.xScale(e.xBounds[0]+100)),H=x*e.zFactor;t.save(),t.clearRect(0,0,t.canvas.clientWidth,t.canvas.clientHeight),t.strokeStyle="green",t.fillStyle="#00002f",t.lineWidth=e.transform.k,t.beginPath(),t.rect(h,m,s,b),t.fill(),t.stroke(),t.strokeStyle="grey",t.fillStyle="dimgray",t.lineWidth=3,t.beginPath(),t.ellipse(C,L,x,H,0,0,2*Math.PI),t.fill(),t.stroke(),t.fillStyle="#bbb",t.lineWidth=1,t.beginPath(),t.ellipse(C,L,x/1.5,H/1.5,0,0,2*Math.PI),t.fill(),t.stroke(),t.strokeStyle="black",t.fillStyle="lightgray",t.lineWidth=e.transform.k,t.beginPath(),t.rect(10*e.transform.k+e.transform.x,10*e.transform.k+e.transform.y,300*e.transform.k,200*e.transform.k),t.fill(),t.stroke(),t.beginPath();for(let g=0;g<4;g++)t.moveTo(20*e.transform.k+e.transform.x,(g+1)*40*e.transform.k+e.transform.y),t.lineTo(300*e.transform.k+e.transform.x,(g+1)*40*e.transform.k+e.transform.y);t.stroke(),t.translate(e.transform.x,e.transform.y),t.scale(e.xRatio,e.yRatio),t.strokeStyle="black",t.lineWidth=1,t.beginPath(),t.moveTo(-50,0),t.lineTo(50,0),t.moveTo(0,-50),t.lineTo(0,50),t.stroke(),t.beginPath(),t.moveTo(950,1e3),t.lineTo(1050,1e3),t.moveTo(1e3,950),t.lineTo(1e3,1050),t.stroke(),t.fillStyle="gray",t.beginPath(),t.rect(470,700,60,220),t.fill(),t.stroke(),t.restore()}}const c=()=>{const n=document.createElement("div"),e=document.createElement("div");e.className="test-container",e.setAttribute("style",`height: ${a}px; width: ${r}px;background-color: #eee;position: relative;`),e.setAttribute("height",`${a}`),e.setAttribute("width",`${r}`),n.appendChild(e);const t=new W("test",{order:1});t.onMount({elm:e,width:r,height:a});const o=new z(n,d=>{t.onRescale(d)});o.setBounds([0,1e3],[0,1e3]),o.adjustToSize(r,a),o.zFactor=1,o.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),o.enableTranslateExtent=!1,o.setViewport(500,500,3e3);const w=document.createElement("div");return w.className="Buttons-container",n.appendChild(i("500x500",()=>{e.setAttribute("style",`height: ${500}px; width: ${500}px;background-color: #eee;`),e.setAttribute("height",`${500}`),e.setAttribute("width",`${500}`),o.adjustToSize(500,500)})),n.appendChild(i("600x400",()=>{e.setAttribute("style",`height: ${400}px; width: ${600}px;background-color: #eee;`),e.setAttribute("height",`${400}`),e.setAttribute("width",`${600}`),o.adjustToSize(600,400)})),n.appendChild(i("800x600",()=>{e.setAttribute("style",`height: ${600}px; width: ${800}px;background-color: #eee;`),e.setAttribute("height",`${600}`),e.setAttribute("width",`${800}`),o.adjustToSize(800,600)})),n.appendChild(i("1:1",()=>{o.zFactor=1})),n.appendChild(i("2:1",()=>{o.zFactor=2})),n.appendChild(i("1:2",()=>{o.zFactor=.5})),n.appendChild(i("center",()=>{o.setViewport(500,500,void 0,500)})),n.appendChild(i("reset",()=>{o.zFactor=1,o.setViewport(500,500,3e3)})),n.appendChild(y()),n},u=()=>{const n=document.createElement("div");n.className="Test-container",n.setAttribute("style",`height: ${a}px; width: ${r}px;background-color: #eee;`),n.setAttribute("height",`${a}`),n.setAttribute("width",`${r}`);const e=new Z("grid",{majorColor:"black",minorColor:"black",majorWidth:.5,minorWidth:.5,order:1});e.onMount({elm:n,width:r,height:a});const t=new z(n,o=>{e.onRescale(o)});return t.setBounds([0,1e3],[0,1e3]),t.adjustToSize(r,a),n.appendChild(y()),n},p=()=>{const n=M(r),e=R(r,a),t=document.createElement("div"),o=40,w=30,d=F(e).append("svg").attr("height",`${a}px`).attr("width",`${r}px`).style("position","absolute"),l=!0,h=new E(d,l,"Displacement","TVD MSL","m"),m=new Z("grid",{majorColor:"black",minorColor:"black",majorWidth:.5,minorWidth:.5,order:1});m.onMount({elm:e,width:r,height:a});const s=new z(e,b=>{h.onRescale(b),m.onRescale(b)});return s.setMinZoomLevel(.1),s.setMaxZoomLevel(10),s.setBounds([0,1e3],[0,1e3]),s.adjustToSize(r-o,a-w),t.appendChild(i("min zoom 1",()=>{s.setMinZoomLevel(1)})),t.appendChild(i("max zoom 100",()=>{s.setMaxZoomLevel(100)})),t.appendChild(i("reset",()=>{s.setZoomLevelBoundary([.1,256])})),n.appendChild(e),n.appendChild(t),n.appendChild(y()),n},O={title:"ESV Intersection/Features/Zoom",component:c};var $,A,k;c.parameters={...c.parameters,docs:{...($=c.parameters)==null?void 0:$.docs,source:{originalSource:`() => {
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
}`,...(k=(A=c.parameters)==null?void 0:A.docs)==null?void 0:k.source}}};var S,T,B;u.parameters={...u.parameters,docs:{...(S=u.parameters)==null?void 0:S.docs,source:{originalSource:`() => {
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
}`,...(B=(T=u.parameters)==null?void 0:T.docs)==null?void 0:B.source}}};var f,v,j;p.parameters={...p.parameters,docs:{...(f=p.parameters)==null?void 0:f.docs,source:{originalSource:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const buttons = document.createElement('div');
  const marginXAxis = 40;
  const marginYAxis = 30;
  const mainGroup = ((select(container).append('svg').attr('height', \`\${height}px\`).attr('width', \`\${width}px\`).style('position', 'absolute') as unknown) as Selection<SVGElement, unknown, null, undefined>);
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
}`,...(j=(v=p.parameters)==null?void 0:v.docs)==null?void 0:j.source}}};c.parameters={storySource:{source:`() => {
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
}`},...c.parameters};u.parameters={storySource:{source:`() => {
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
}`},...u.parameters};p.parameters={storySource:{source:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const buttons = document.createElement('div');
  const marginXAxis = 40;
  const marginYAxis = 30;
  const mainGroup = ((select(container).append('svg').attr('height', \`\${height}px\`).attr('width', \`\${width}px\`).style('position', 'absolute') as unknown) as Selection<SVGElement, unknown, null, undefined>);
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
}`},...p.parameters};const D=["ZoomWithTestLayer","ZoomWithGridLayer","ZoomWithGridAndAxis"];export{p as ZoomWithGridAndAxis,u as ZoomWithGridLayer,c as ZoomWithTestLayer,D as __namedExportsOrder,O as default};
//# sourceMappingURL=zoom.stories-3e44c06e.js.map
