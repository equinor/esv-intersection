import{n as D,j,o as M,c as O,d as H,Z as R,e as T}from"./elements-c4666437.js";import{S as E,g as V,b as q,a as F,s as B}from"./seismic-colormap-2c207f25.js";import{k as Z,b as _}from"./data-e45bb153.js";import"./_commonjsHelpers-725317a4.js";import"./findsample-f4fa7ca8.js";const P=.1,I=1e3,k=150,U=30,G=10;function J(t,c){if(!t||t.length===0)return[];const a=t?t.map(d=>[d.easting,d.northing,d.tvd,d.md]):[],s=new D(a,{tension:.75,arcDivisions:5e3}),o=s.length,n=Math.round(o*G);let e=null;n>0?e=N(s.getPoints(n),5e-4,10):e=[[a[0][0],a[0][1]]];const r=e[0],l=e[e.length-1],g=j.distance(r,l);let i=null;if(g<k){const v=c/180*Math.PI;i=new j(Math.cos(v),Math.sin(v)).mutable}else i=K(e,U);const m=Math.max(0,I-o),p=m+o,h=[];let u=[];const w=i.toArray();m>0&&(u=M(Math.ceil(m*P)).map(d=>i.set(w).scale(m*(1-d)).subFrom(r).toArray()),u.pop(),h.push(...u)),h.push(...e);const L=M(Math.ceil(I*P)).map(d=>i.set(w).scale(I*d).add(l).toArray()).splice(1);return h.push(...L),Q(h,null,p)}function K(t,c){const a=j.zero.mutable;let s=0;const o=j.zero.mutable;for(let n=0;n<t.length-1;n++){const e=t.length-1-n;if(o.set(t[e]).sub(t[e-1]),a.add(o),s=a.magnitude,s>c)break}return s===0?new j([0,0]):a.scale(1/s)}function N(t,c=.001,a=10){if(t.length<=4)return t;const[s,o]=t[0],n=t.map(i=>[i[0]-s,i[1]-o]);let[e,r]=n[0];const l=[t[0]];for(let i=1;i+1<n.length;i++){const[m,p]=n[i],[h,u]=n[i+1];if(h-m!==0||u-p!==0){const w=Math.abs(e*u-r*h+h*p-u*m+r*m-e*p)/Math.sqrt((h-e)**2+(u-r)**2),L=[e-m,r-p],C=Math.sqrt(L[0]**2+L[1]**2);(w>c||C>=a)&&(l.push([m+s,p+o]),[e,r]=[m,p])}}const g=n[n.length-1];return l.push([g[0]+s,g[1]+o]),l}function Q(t,c=null,a=0){let s=c||t[0],o=0;return t.map(e=>{const r=e[0]-s[0],l=e[1]-s[1];return o+=Math.sqrt(r**2+l**2),s=e,[a>0?a-o:o,e[2]||0]})}const f=700,y=600,S=()=>{const t=O(f),c=H(f,y);return Promise.all([Z(),_()]).then(a=>{const[s,o]=a,n=new E("seismic",{order:2,layerOpacity:1}),e={elm:c,width:f,height:y};n.onMount({...e});const r=J(s,45),l=V(o,r);q(o,r,B).then(i=>{n.data={image:i,options:F(l)}});const g=new R(c,i=>{n.onRescale(i)});g.setBounds([0,f],[0,y]),g.adjustToSize(f,y),g.setViewport(f/2,y/2,f/2)}),t.appendChild(c),t.appendChild(T()),t},ee={title:"ESV Intersection/Features/Seismic",component:S};var b,x,z;S.parameters={...S.parameters,docs:{...(b=S.parameters)==null?void 0:b.docs,source:{originalSource:`() => {
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
}`,...(z=(x=S.parameters)==null?void 0:x.docs)==null?void 0:z.source}}};const te=["SeismicUsingLowLevelInterface"];export{S as SeismicUsingLowLevelInterface,te as __namedExportsOrder,ee as default};
//# sourceMappingURL=seismic.stories-f0c09662.js.map
