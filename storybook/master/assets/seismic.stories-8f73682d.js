import{i as x,V as S,u as M,c as z,d as D,Z as O,e as H}from"./elements-bce68b8a.js";import{S as R,g as T,b as V,a as E,s as q}from"./seismic-colormap-4188b0b5.js";import{k as F,b as B}from"./data-e45bb153.js";import"./_commonjsHelpers-28e086c5.js";import"./findsample-f4fa7ca8.js";const P=.1,I=1e3,Z=150,_=30,k=10;function U(t,c){if(!t||t.length===0)return[];const a=t?t.map(h=>[h.easting,h.northing,h.tvd,h.md]):[],s=new x(a,{tension:.75,arcDivisions:5e3}),o=s.length,n=Math.round(o*k);let e=null;n>0?e=J(s.getPoints(n),5e-4,10):e=[[a[0][0],a[0][1]]];const r=e[0],l=e[e.length-1],g=S.distance(r,l);let i=null;if(g<Z){const v=c/180*Math.PI;i=new S(Math.cos(v),Math.sin(v)).mutable}else i=G(e,_);const m=Math.max(0,I-o),p=m+o,d=[];let u=[];const w=i.toArray();m>0&&(u=M(Math.ceil(m*P)).map(h=>i.set(w).scale(m*(1-h)).subFrom(r).toArray()),u.pop(),d.push(...u)),d.push(...e);const L=M(Math.ceil(I*P)).map(h=>i.set(w).scale(I*h).add(l).toArray()).splice(1);return d.push(...L),K(d,null,p)}function G(t,c){const a=S.zero.mutable;let s=0;const o=S.zero.mutable;for(let n=0;n<t.length-1;n++){const e=t.length-1-n;if(o.set(t[e]).sub(t[e-1]),a.add(o),s=a.magnitude,s>c)break}return s===0?new S([0,0]):a.scale(1/s)}function J(t,c=.001,a=10){if(t.length<=4)return t;const[s,o]=t[0],n=t.map(i=>[i[0]-s,i[1]-o]);let[e,r]=n[0];const l=[t[0]];for(let i=1;i+1<n.length;i++){const[m,p]=n[i],[d,u]=n[i+1];if(d-m!==0||u-p!==0){const w=Math.abs(e*u-r*d+d*p-u*m+r*m-e*p)/Math.sqrt((d-e)**2+(u-r)**2),L=[e-m,r-p],C=Math.sqrt(L[0]**2+L[1]**2);(w>c||C>=a)&&(l.push([m+s,p+o]),[e,r]=[m,p])}}const g=n[n.length-1];return l.push([g[0]+s,g[1]+o]),l}function K(t,c=null,a=0){let s=c||t[0],o=0;return t.map(e=>{const r=e[0]-s[0],l=e[1]-s[1];return o+=Math.sqrt(r**2+l**2),s=e,[a>0?a-o:o,e[2]||0]})}const f=700,y=600,j=()=>{const t=z(f),c=D(f,y);return Promise.all([F(),B()]).then(a=>{const[s,o]=a,n=new R("seismic",{order:2,layerOpacity:1}),e={elm:c,width:f,height:y};n.onMount({...e});const r=U(s,45),l=T(o,r);V(o,r,q).then(i=>{n.data={image:i,options:E(l)}});const g=new O(c,i=>{n.onRescale(i)});g.setBounds([0,f],[0,y]),g.adjustToSize(f,y),g.setViewport(f/2,y/2,f/2)}),t.appendChild(c),t.appendChild(H()),t},$={title:"ESV Intersection/Features/Seismic",component:j};var b;j.parameters={...j.parameters,storySource:{source:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  Promise.all([getPositionLog(), getSeismic()]).then(values => {
    const [poslog, seismic] = values;
    const seismicLayer = new SeismicCanvasLayer('seismic', {
      order: 2,
      layerOpacity: 1
    });
    const ev = {
      elm: container,
      width,
      height
    };
    seismicLayer.onMount({
      ...ev
    });
    const trajectory: number[][] = generateProjectedTrajectory(poslog, 45);
    const seismicInfo = getSeismicInfo(seismic, trajectory);
    generateSeismicSliceImage(seismic, trajectory, seismicColorMap).then((seismicImage: ImageBitmap) => {
      seismicLayer.data = {
        image: seismicImage,
        options: getSeismicOptions(seismicInfo)
      };
    });
    const zoomHandler = new ZoomPanHandler(container, (event: OnRescaleEvent) => {
      seismicLayer.onRescale(event);
    });
    zoomHandler.setBounds([0, width], [0, height]);
    zoomHandler.adjustToSize(width, height);
    zoomHandler.setViewport(width / 2, height / 2, width / 2);
  });
  root.appendChild(container);
  root.appendChild(createFPSLabel());
  return root;
}`,...(b=j.parameters)==null?void 0:b.storySource}};const A=["SeismicUsingLowLevelInterface"];export{j as SeismicUsingLowLevelInterface,A as __namedExportsOrder,$ as default};
//# sourceMappingURL=seismic.stories-8f73682d.js.map
