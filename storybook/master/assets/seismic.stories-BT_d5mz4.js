import{v as D,m as v,w as M,c as O,a as H,Z as R,d as T}from"./elements-bFXFHGGJ.js";import{S as E,g as V,b as q,a as F,s as B}from"./seismic-colormap-B0PkGQhJ.js";import{g as Z,j as _}from"./data-D8Ls4_G-.js";import"./preload-helper-Dp1pzeXC.js";import"./_commonjsHelpers-CqkleIqs.js";import"./findsample-BL-n9qHX.js";const P=.1,I=1e3,U=150,k=30,G=10;function J(t,m){if(!t||t.length===0)return[];const a=t?t.map(h=>[h.easting,h.northing,h.tvd,h.md]):[],s=new D(a,{tension:.75,arcDivisions:5e3}),o=s.length,n=Math.round(o*G);let e;n>0?e=N(s.getPoints(n),5e-4,10):e=[[a[0][0],a[0][1]]];const r=e[0],l=e[e.length-1],u=v.distance(r,l);let i;if(u<U){const L=m/180*Math.PI;i=new v(Math.cos(L),Math.sin(L)).mutable}else i=K(e,k);const c=Math.max(0,I-o),g=c+o,d=[];let p=[];const w=i.toArray();c>0&&(p=M(Math.ceil(c*P)).map(h=>i.set(w).scale(c*(1-h)).subFrom(r).toArray()),p.pop(),d.push(...p)),d.push(...e);const j=M(Math.ceil(I*P)).map(h=>i.set(w).scale(I*h).add(l).toArray()).splice(1);return d.push(...j),Q(d,void 0,g)}function K(t,m){const a=v.zero.mutable;let s=0;const o=v.zero.mutable;for(let n=0;n<t.length-1;n++){const e=t.length-1-n;if(o.set(t[e]).sub(t[e-1]),a.add(o),s=a.magnitude,s>m)break}return s===0?new v([0,0]):a.scale(1/s)}function N(t,m=.001,a=10){if(t.length<=4)return t;const[s,o]=t[0],n=t.map(i=>[i[0]-s,i[1]-o]);let[e,r]=n[0];const l=[t[0]];for(let i=1;i+1<n.length;i++){const[c,g]=n[i]??[],[d,p]=n[i+1]??[];if(c!=null&&g!=null&&d!=null&&p!=null&&(d-c!==0||p-g!==0)){const w=Math.abs(e*p-r*d+d*g-p*c+r*c-e*g)/Math.sqrt((d-e)**2+(p-r)**2),j=[e-c,r-g],C=Math.sqrt(j[0]**2+j[1]**2);(w>m||C>=a)&&(l.push([c+s,g+o]),[e,r]=[c,g])}}const u=n[n.length-1];return l.push([u[0]+s,u[1]+o]),l}function Q(t,m,a=0){let s=t[0],o=0;return t.map(e=>{const r=e[0]-s[0],l=e[1]-s[1];return o+=Math.sqrt(r**2+l**2),s=e,[a>0?a-o:o,e[2]??0]})}const f=700,y=600,S=()=>{const t=O(f),m=H(f,y);return Promise.all([Z(),_()]).then(a=>{const[s,o]=a,n=new E("seismic",{order:2,layerOpacity:1}),e={elm:m,width:f,height:y};n.onMount({...e});const r=J(s,45),l=V(o,r);q(o,r,B).then(i=>{n.data={image:i,options:F(l)}});const u=new R(m,i=>{n.onRescale(i)});u.setBounds([0,f],[0,y]),u.adjustToSize(f,y),u.setViewport(f/2,y/2,f/2)}),t.appendChild(m),t.appendChild(T()),t},te={title:"ESV Intersection/Features/Seismic",component:S};var b,x,z;S.parameters={...S.parameters,docs:{...(b=S.parameters)==null?void 0:b.docs,source:{originalSource:`() => {
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
}`,...(z=(x=S.parameters)==null?void 0:x.docs)==null?void 0:z.source}}};const ne=["SeismicUsingLowLevelInterface"];export{S as SeismicUsingLowLevelInterface,ne as __namedExportsOrder,te as default};
