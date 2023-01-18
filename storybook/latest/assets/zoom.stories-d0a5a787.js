import{G as f,A as H}from"./GridLayer-052b3f5c.js";import{Z as y,e as z,c as T,d as B,s as Z,C as j}from"./elements-d59828a4.js";import"./_commonjsHelpers-28e086c5.js";const r=600,a=400;function i(n,e){const t=document.createElement("button");return t.innerHTML=n,t.setAttribute("style","width: 100px;height:32px;margin-top:12px;"),t.onclick=e,t}class M extends j{constructor(e,t){super(e,t),this.render=this.render.bind(this)}onRescale(e){super.onRescale(e),this.render(e)}onUpdate(e){super.onUpdate(e),this.render(null)}render(e){const{ctx:t}=this;if(!t||!e)return;const[o,m]=e.xBounds,[d,l]=e.yBounds,c=e.xScale(o),h=e.yScale(d),s=e.xScale(m)-c,u=e.yScale(l)-h,C=c+s/2,k=h+u/2,w=Math.abs(c-e.xScale(e.xBounds[0]+100)),A=w*e.zFactor;t.save(),t.clearRect(0,0,t.canvas.clientWidth,t.canvas.clientHeight),t.strokeStyle="green",t.fillStyle="#00002f",t.lineWidth=e.transform.k,t.beginPath(),t.rect(c,h,s,u),t.fill(),t.stroke(),t.strokeStyle="grey",t.fillStyle="dimgray",t.lineWidth=3,t.beginPath(),t.ellipse(C,k,w,A,0,0,2*Math.PI),t.fill(),t.stroke(),t.fillStyle="#bbb",t.lineWidth=1,t.beginPath(),t.ellipse(C,k,w/1.5,A/1.5,0,0,2*Math.PI),t.fill(),t.stroke(),t.strokeStyle="black",t.fillStyle="lightgray",t.lineWidth=e.transform.k,t.beginPath(),t.rect(10*e.transform.k+e.transform.x,10*e.transform.k+e.transform.y,300*e.transform.k,200*e.transform.k),t.fill(),t.stroke(),t.beginPath();for(let p=0;p<4;p++)t.moveTo(20*e.transform.k+e.transform.x,(p+1)*40*e.transform.k+e.transform.y),t.lineTo(300*e.transform.k+e.transform.x,(p+1)*40*e.transform.k+e.transform.y);t.stroke(),t.translate(e.transform.x,e.transform.y),t.scale(e.xRatio,e.yRatio),t.strokeStyle="black",t.lineWidth=1,t.beginPath(),t.moveTo(-50,0),t.lineTo(50,0),t.moveTo(0,-50),t.lineTo(0,50),t.stroke(),t.beginPath(),t.moveTo(950,1e3),t.lineTo(1050,1e3),t.moveTo(1e3,950),t.lineTo(1e3,1050),t.stroke(),t.fillStyle="gray",t.beginPath(),t.rect(470,700,60,220),t.fill(),t.stroke(),t.restore()}}const b=()=>{const n=document.createElement("div"),e=document.createElement("div");e.className="test-container",e.setAttribute("style",`height: ${a}px; width: ${r}px;background-color: #eee;position: relative;`),e.setAttribute("height",`${a}`),e.setAttribute("width",`${r}`),n.appendChild(e);const t=new M("test",{order:1});t.onMount({elm:e,width:r,height:a});const o=new y(n,d=>{t.onRescale(d)});o.setBounds([0,1e3],[0,1e3]),o.adjustToSize(r,a),o.zFactor=1,o.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),o.enableTranslateExtent=!1,o.setViewport(500,500,3e3);const m=document.createElement("div");return m.className="Buttons-container",n.appendChild(i("500x500",()=>{e.setAttribute("style",`height: ${500}px; width: ${500}px;background-color: #eee;`),e.setAttribute("height",`${500}`),e.setAttribute("width",`${500}`),o.adjustToSize(500,500)})),n.appendChild(i("600x400",()=>{e.setAttribute("style",`height: ${400}px; width: ${600}px;background-color: #eee;`),e.setAttribute("height",`${400}`),e.setAttribute("width",`${600}`),o.adjustToSize(600,400)})),n.appendChild(i("800x600",()=>{e.setAttribute("style",`height: ${600}px; width: ${800}px;background-color: #eee;`),e.setAttribute("height",`${600}`),e.setAttribute("width",`${800}`),o.adjustToSize(800,600)})),n.appendChild(i("1:1",()=>{o.zFactor=1})),n.appendChild(i("2:1",()=>{o.zFactor=2})),n.appendChild(i("1:2",()=>{o.zFactor=.5})),n.appendChild(i("center",()=>{o.setViewport(500,500,void 0,500)})),n.appendChild(i("reset",()=>{o.zFactor=1,o.setViewport(500,500,3e3)})),n.appendChild(z()),n},g=()=>{const n=document.createElement("div");n.className="Test-container",n.setAttribute("style",`height: ${a}px; width: ${r}px;background-color: #eee;`),n.setAttribute("height",`${a}`),n.setAttribute("width",`${r}`);const e=new f("grid",{majorColor:"black",minorColor:"black",majorWidth:.5,minorWidth:.5,order:1});e.onMount({elm:n,width:r,height:a});const t=new y(n,o=>{e.onRescale(o)});return t.setBounds([0,1e3],[0,1e3]),t.adjustToSize(r,a),n.appendChild(z()),n},x=()=>{const n=T(r),e=B(r,a),t=document.createElement("div"),o=40,m=30,d=Z(e).append("svg").attr("height",`${a}px`).attr("width",`${r}px`).style("position","absolute"),l=!0,c=new H(d,l,"Displacement","TVD MSL","m"),h=new f("grid",{majorColor:"black",minorColor:"black",majorWidth:.5,minorWidth:.5,order:1});h.onMount({elm:e,width:r,height:a});const s=new y(e,u=>{c.onRescale(u),h.onRescale(u)});return s.setMinZoomLevel(.1),s.setMaxZoomLevel(10),s.setBounds([0,1e3],[0,1e3]),s.adjustToSize(r-o,a-m),t.appendChild(i("min zoom 1",()=>{s.setMinZoomLevel(1)})),t.appendChild(i("max zoom 100",()=>{s.setMaxZoomLevel(100)})),t.appendChild(i("reset",()=>{s.setZoomLevelBoundary([.1,256])})),n.appendChild(e),n.appendChild(t),n.appendChild(z()),n},R={title:"ESV Intersection/Features/Zoom",component:b};var L;b.parameters={...b.parameters,storySource:{source:`() => {
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
}`,...(L=b.parameters)==null?void 0:L.storySource}};var $;g.parameters={...g.parameters,storySource:{source:`() => {
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
}`,...($=g.parameters)==null?void 0:$.storySource}};var S;x.parameters={...x.parameters,storySource:{source:`() => {
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
}`,...(S=x.parameters)==null?void 0:S.storySource}};const F=["ZoomWithTestLayer","ZoomWithGridLayer","ZoomWithGridAndAxis"];export{x as ZoomWithGridAndAxis,g as ZoomWithGridLayer,b as ZoomWithTestLayer,F as __namedExportsOrder,R as default};
//# sourceMappingURL=zoom.stories-d0a5a787.js.map
