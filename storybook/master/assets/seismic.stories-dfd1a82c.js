import{i as H,V as w,u as P,c as O,d as D,Z as R,e as T}from"./elements-c9ae7b8d.js";import{S as V,g as E,b as B,a as F,s as q}from"./seismic-colormap-f1825c7f.js";import{k as Z,b as _}from"./data-e45bb153.js";import"./_commonjsHelpers-28e086c5.js";import"./findsample-f4fa7ca8.js";const M=.1,I=1e3,k=150,U=30,G=10;function J(t,c){if(!t||t.length===0)return[];const a=t?t.map(d=>[d.easting,d.northing,d.tvd,d.md]):[],o=new H(a,{tension:.75,arcDivisions:5e3}),s=o.length,n=Math.round(s*G);let e=null;n>0?e=N(o.getPoints(n),5e-4,10):e=[[a[0][0],a[0][1]]];const r=e[0],l=e[e.length-1],g=w.distance(r,l);let i=null;if(g<k){const j=c/180*Math.PI;i=new w(Math.cos(j),Math.sin(j)).mutable}else i=K(e,U);const m=Math.max(0,I-s),p=m+s,h=[];let u=[];const L=i.toArray();m>0&&(u=P(Math.ceil(m*M)).map(d=>i.set(L).scale(m*(1-d)).subFrom(r).toArray()),u.pop(),h.push(...u)),h.push(...e);const v=P(Math.ceil(I*M)).map(d=>i.set(L).scale(I*d).add(l).toArray()).splice(1);return h.push(...v),Q(h,null,p)}function K(t,c){const a=w.zero.mutable;let o=0;const s=w.zero.mutable;for(let n=0;n<t.length-1;n++){const e=t.length-1-n;if(s.set(t[e]).sub(t[e-1]),a.add(s),o=a.magnitude,o>c)break}return o===0?new w([0,0]):a.scale(1/o)}function N(t,c=.001,a=10){if(t.length<=4)return t;const[o,s]=t[0],n=t.map(i=>[i[0]-o,i[1]-s]);let[e,r]=n[0];const l=[t[0]];for(let i=1;i+1<n.length;i++){const[m,p]=n[i],[h,u]=n[i+1];if(h-m!==0||u-p!==0){const L=Math.abs(e*u-r*h+h*p-u*m+r*m-e*p)/Math.sqrt((h-e)**2+(u-r)**2),v=[e-m,r-p],C=Math.sqrt(v[0]**2+v[1]**2);(L>c||C>=a)&&(l.push([m+o,p+s]),[e,r]=[m,p])}}const g=n[n.length-1];return l.push([g[0]+o,g[1]+s]),l}function Q(t,c=null,a=0){let o=c||t[0],s=0;return t.map(e=>{const r=e[0]-o[0],l=e[1]-o[1];return s+=Math.sqrt(r**2+l**2),o=e,[a>0?a-s:s,e[2]||0]})}const y=700,S=600,f=()=>{const t=O(y),c=D(y,S);return Promise.all([Z(),_()]).then(a=>{const[o,s]=a,n=new V("seismic",{order:2,layerOpacity:1}),e={elm:c,width:y,height:S};n.onMount({...e});const r=J(o,45),l=E(s,r);B(s,r,q).then(i=>{n.data={image:i,options:F(l)}});const g=new R(c,i=>{n.onRescale(i)});g.setBounds([0,y],[0,S]),g.adjustToSize(y,S),g.setViewport(y/2,S/2,y/2)}),t.appendChild(c),t.appendChild(T()),t},ee={title:"ESV Intersection/Features/Seismic",component:f};var b,z,x;f.parameters={...f.parameters,docs:{...(b=f.parameters)==null?void 0:b.docs,source:{originalSource:`() => {
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
}`,...(x=(z=f.parameters)==null?void 0:z.docs)==null?void 0:x.source}}};f.parameters={storySource:{source:`() => {
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
}`},...f.parameters};const te=["SeismicUsingLowLevelInterface"];export{f as SeismicUsingLowLevelInterface,te as __namedExportsOrder,ee as default};
//# sourceMappingURL=seismic.stories-dfd1a82c.js.map
