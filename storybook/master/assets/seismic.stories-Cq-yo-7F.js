import{v as b,m as v,w as M,c as x,a as z,Z as D,d as O}from"./elements-DUrmcn_5.js";import{S as H,g as R,b as T,a as E,s as V}from"./seismic-colormap-W6ME7l9p.js";import{g as q,j as F}from"./data-D8Ls4_G-.js";import"./preload-helper-PPVm8Dsz.js";import"./_commonjsHelpers-CqkleIqs.js";import"./findsample-BBxmZGgX.js";const P=.1,I=1e3,B=150,Z=30,_=10;function U(t,m){if(!t||t.length===0)return[];const a=t?t.map(h=>[h.easting,h.northing,h.tvd,h.md]):[],s=new b(a,{tension:.75,arcDivisions:5e3}),o=s.length,n=Math.round(o*_);let e;n>0?e=G(s.getPoints(n),5e-4,10):e=[[a[0][0],a[0][1]]];const r=e[0],l=e[e.length-1],u=v.distance(r,l);let i;if(u<B){const L=m/180*Math.PI;i=new v(Math.cos(L),Math.sin(L)).mutable}else i=k(e,Z);const c=Math.max(0,I-o),g=c+o,d=[];let p=[];const w=i.toArray();c>0&&(p=M(Math.ceil(c*P)).map(h=>i.set(w).scale(c*(1-h)).subFrom(r).toArray()),p.pop(),d.push(...p)),d.push(...e);const j=M(Math.ceil(I*P)).map(h=>i.set(w).scale(I*h).add(l).toArray()).splice(1);return d.push(...j),J(d,void 0,g)}function k(t,m){const a=v.zero.mutable;let s=0;const o=v.zero.mutable;for(let n=0;n<t.length-1;n++){const e=t.length-1-n;if(o.set(t[e]).sub(t[e-1]),a.add(o),s=a.magnitude,s>m)break}return s===0?new v([0,0]):a.scale(1/s)}function G(t,m=.001,a=10){if(t.length<=4)return t;const[s,o]=t[0],n=t.map(i=>[i[0]-s,i[1]-o]);let[e,r]=n[0];const l=[t[0]];for(let i=1;i+1<n.length;i++){const[c,g]=n[i]??[],[d,p]=n[i+1]??[];if(c!=null&&g!=null&&d!=null&&p!=null&&(d-c!==0||p-g!==0)){const w=Math.abs(e*p-r*d+d*g-p*c+r*c-e*g)/Math.sqrt((d-e)**2+(p-r)**2),j=[e-c,r-g],C=Math.sqrt(j[0]**2+j[1]**2);(w>m||C>=a)&&(l.push([c+s,g+o]),[e,r]=[c,g])}}const u=n[n.length-1];return l.push([u[0]+s,u[1]+o]),l}function J(t,m,a=0){let s=t[0],o=0;return t.map(e=>{const r=e[0]-s[0],l=e[1]-s[1];return o+=Math.sqrt(r**2+l**2),s=e,[a>0?a-o:o,e[2]??0]})}const f=700,y=600,S=()=>{const t=x(f),m=z(f,y);return Promise.all([q(),F()]).then(a=>{const[s,o]=a,n=new H("seismic",{order:2,layerOpacity:1}),e={elm:m,width:f,height:y};n.onMount({...e});const r=U(s,45),l=R(o,r);T(o,r,V).then(i=>{n.data={image:i,options:E(l)}});const u=new D(m,i=>{n.onRescale(i)});u.setBounds([0,f],[0,y]),u.adjustToSize(f,y),u.setViewport(f/2,y/2,f/2)}),t.appendChild(m),t.appendChild(O()),t},$={title:"ESV Intersection/Features/Seismic",component:S};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`() => {
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
}`,...S.parameters?.docs?.source}}};const A=["SeismicUsingLowLevelInterface"];export{S as SeismicUsingLowLevelInterface,A as __namedExportsOrder,$ as default};
