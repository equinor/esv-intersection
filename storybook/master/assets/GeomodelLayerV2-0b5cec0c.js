import{C as K,j as E,k as $,h as Q,l as tt,G as k}from"./elements-c4666437.js";import{f as y}from"./findsample-f4fa7ca8.js";const et=18,st=8,nt=13,it="black",ot="Arial",at=70;class ct extends K{constructor(t,e){super(t,e),this.defaultMargins=et,this.defaultMinFontSize=st,this.defaultMaxFontSize=nt,this.defaultTextColor=it,this.defaultFont=ot,this.isLabelsOnLeftSide=!0,this.maxFontSizeInWorldCoordinates=at,this.isXFlipped=!1,this.areasWithAvgTopDepth=null,this.drawAreaLabel=(n,s,o,i)=>{const{data:h}=n,{ctx:a,maxFontSizeInWorldCoordinates:d,isXFlipped:r}=this,{xScale:c,yScale:l,xRatio:x,yRatio:u,zFactor:p}=this.rescaleEvent;let g=this.checkDrawLabelsOnLeftSide();const F=(this.options.margins||this.defaultMargins)*(r?-1:1)/x,v=this.options.minFontSize||this.defaultMinFontSize;let f=(this.options.maxFontSize||this.defaultMaxFontSize)/u;f>d&&(f=d,f*u<v&&(f=v/u));const I=c.invert(c.range()[0])+F,m=c.invert(c.range()[1])-F,[S,A]=this.getSurfacesAreaEdges();a.save(),a.font=`${f*u}px ${this.options.font||this.defaultFont}`;let L=a.measureText(n.label),M=L.width/x;if(g){const b=I+(r?-M:M);(!r&&b>A||r&&b<A)&&(g=!1)}else{const b=m+(r?M:-M);(!r&&b<S||r&&b>S)&&(g=!0)}let C;const R=.07;g?C=r?Math.min(S,I):Math.max(S,I):C=r?Math.max(A,m):Math.min(A,m);const O=l.invert(l.range()[0]),P=l.invert(l.range()[1]),_=5,z=3,Y=R*(M/z)*(g?1:-1)*(r?-1:1),G=M/_*(g?1:-1)*(r?-1:1),U=h.map(b=>[b[0],b[1]]),W=this.calcPos(U,C,z,Y,O,P);if(!W)return;const N=h.map(b=>[b[0],b[2]]);let w=this.calcPos(N,C,z,Y,O,P,s?s.data.map(b=>[b[0],b[1]]):null,o,i);w||(w=new E(W.x,P));const X=w.y-W.y;if(X<f){if(X*u<v)return;f=X,a.font=`${f*u}px ${this.options.font||this.defaultFont}`,L=a.measureText(n.label),M=L.width/x}const Z=g!==r?E.right:E.left,j=this.calcAreaDir(U,N,C,_,G,Z,O,P,0,Math.PI/4,4,s?s.data.map(b=>[b[0],b[1]]):null,o,i),V=Math.atan(Math.tan(j)*p),q=C,H=(W.y+w.y)/2,J=r?-V:V;a.textAlign=g?"left":"right",a.translate(c(q),l(H)),a.rotate(J),a.fillStyle=this.options.textColor||this.defaultTextColor,a.font=`${f*u}px ${this.options.font||this.defaultFont}`,a.textBaseline="middle",a.fillText(n.label,0,0),a.restore()},this.drawLineLabel=n=>{const{ctx:s,isXFlipped:o}=this,{xScale:i,yScale:h,xRatio:a,yRatio:d,zFactor:r}=this.rescaleEvent,c=this.checkDrawLabelsOnLeftSide(),l=this.getMarginsInWorldCoordinates(),u=(this.options.maxFontSize||this.defaultMaxFontSize)/d;s.save(),s.font=`${u*d}px ${this.options.font||this.defaultFont}`;const g=s.measureText(n.label).width/a,D=i.invert(i.range()[0])+l,F=i.invert(i.range()[1])-l,[v,T]=this.getSurfacesAreaEdges();let f;const I=5;c?f=o?Math.max(T,F):Math.min(T,F):f=o?Math.min(v,D):Math.max(v,D);const m=g/I*(c?-1:1),{data:S}=n,A=this.calcPos(S,f,I,m),L=this.calcLineDir(S,f,I,m,r,c?E.left:E.right);if(!A||!L)return;const M=f,C=A.y-$-u/2,R=E.angleRight(L)-(c?Math.PI:0);s.textAlign=c?"right":"left",s.translate(i(M),h(C)),s.rotate(R),s.fillStyle=this.colorToCSSColor(n.color),s.textBaseline="middle",s.fillText(n.label,0,0),s.restore()},this.render=this.render.bind(this),this.getMarginsInWorldCoordinates=this.getMarginsInWorldCoordinates.bind(this),this.getSurfacesAreaEdges=this.getSurfacesAreaEdges.bind(this),this.updateXFlipped=this.updateXFlipped.bind(this),this.generateSurfacesWithAvgDepth=this.generateSurfacesWithAvgDepth.bind(this)}get options(){return this._options}setData(t){super.setData(t),this.areasWithAvgTopDepth=null}generateSurfacesWithAvgDepth(){const{areas:t}=this.data;this.areasWithAvgTopDepth=t.reduce((e,n)=>{if(!n.label)return e;const s=n.data.reduce((i,h)=>(h[1]!=null&&(i.sum+=h[1],i.count++),i),{sum:0,count:0});if(s.count===0)return e;const o=s.sum/s.count;return e.push({...n,avgTopDepth:o}),e},[])}onMount(t){super.onMount(t)}onUpdate(t){super.onUpdate(t),this.render()}onRescale(t){this.rescaleEvent=t,this.updateXFlipped(),this.resetTransform(),this.render()}render(){this.rescaleEvent&&requestAnimationFrame(()=>{this.clearCanvas(),this.data&&(this.areasWithAvgTopDepth||this.generateSurfacesWithAvgDepth(),this.drawAreaLabels(),this.drawLineLabels())})}drawAreaLabels(){this.areasWithAvgTopDepth.forEach((t,e,n)=>{const s=n.reduce((o,i,h)=>(h>e&&(o==null||i.avgTopDepth<o.avgTopDepth)&&(o=i),o),null);this.drawAreaLabel(t,s,n,e)})}drawLineLabels(){this.data.lines.filter(t=>t.label).forEach(t=>this.drawLineLabel(t))}colorToCSSColor(t){if(typeof t=="string")return t;let e=t.toString(16);return e="000000".substr(0,6-e.length)+e,`#${e}`}calcPos(t,e,n,s,o=null,i=null,h=null,a=null,d=null){const r=E.zero.mutable;let c=0;for(let l=0;l<n;l++){const x=e+l*s,u=y(t,x,o,i);if(u){const p=this.getAlternativeYValueIfAvailable(x,o,i,h,a,d),g=p?Math.min(u,p):u;r.add(x,g),c++}}return c===0?null:E.divide(r,c)}getAlternativeYValueIfAvailable(t,e,n,s,o,i){if(!s)return null;let h=y(s,t,e,n);if(h==null&&o&&i!=null){let a=i+1;for(;h==null&&a<o.length;){const d=o[a++];h=y(d.data.map(r=>[r[0],r[1]]),t,e,n)}}return h}calcLineDir(t,e,n,s,o,i=E.left,h=null,a=null){const d=i.mutable,r=y(t,e,h,a);if(r===null)return d;const c=new E(e,r*o),l=E.zero.mutable;for(let x=1;x<=n;x++){const u=e+x*s,p=y(t,e,h,a);p!==null&&(l.set(u,p*o),l.sub(c),d.add(l))}return d}calcAreaDir(t,e,n,s,o,i=E.left,h=null,a=null,d=0,r=Math.PI/4,c=4,l=null,x=null,u=null){const p=[],g=E.zero.mutable;let D;for(let m=0;m<=s;m++){const S=n+m*o,A=y(t,S,h,a),L=y(e,S,h,a)||a,M=this.getAlternativeYValueIfAvailable(S,h,a,l,x,u),C=M?Math.min(L,M):L;if(m===0){if(A===null)return E.angleRight(i);const R=(A+C)/2;D=new E(n,R)}else A!==null?(g.set(S,(A+C)/2),g.sub(D),p.push(E.angleRight(g))):p.push(E.angleRight(i))}const F=p[0],v=p.map(m=>m-F);let T=0;return v.reduce((m,S)=>{const A=(Math.abs(S)-d)/r,L=Math.pow(1-Q(A,0,1),c);return T+=L,m+S*L},0)/T+F}updateXFlipped(){const{xBounds:t}=this.rescaleEvent;this.isXFlipped=t[0]>t[1]}getMarginsInWorldCoordinates(){const{xRatio:t}=this.rescaleEvent;return(this.options.margins||this.defaultMargins)*(this.isXFlipped?-1:1)/t}getSurfacesAreaEdges(){const t=this.data.areas.reduce((a,d)=>{const{data:r}=d,c=r.find(l=>l[1]!=null);c&&a.push(c[0]);for(let l=r.length-1;l>=0;l--)if(r[l][1]!=null){a.push(r[l][0]);break}return a},[]);t.push(...this.data.lines.reduce((a,d)=>{const{data:r}=d,c=r.find(l=>l[1]!=null);c&&a.push(c[0]);for(let l=r.length-1;l>=0;l--)if(r[l][1]!=null){a.push(r[l][0]);break}return a},[]));const e=Math.min(...t),n=Math.max(...t),s=this.getMarginsInWorldCoordinates(),{isXFlipped:o}=this,i=o?n+s:e+s,h=o?e-s:n-s;return[i,h]}checkDrawLabelsOnLeftSide(){const{referenceSystem:t,isXFlipped:e}=this;if(!t)return!0;const{xScale:n,yScale:s,xRatio:o}=this.rescaleEvent,i=200,[h,a]=n.domain(),[d,r]=s.domain();let c=t.interpolators.curtain.getIntersects(d,1,0);c.length===0&&(c=[t.interpolators.curtain.getPointAt(0)]);let l=t.interpolators.curtain.getIntersects(r,1,0);l.length===0&&(l=[t.interpolators.curtain.getPointAt(1)]);const x=Math.max(c[0][0],l[0][0]),u=Math.min(c[0][0],l[0][0]),p={left:e?x:u,right:e?u:x},g=this.getMarginsInWorldCoordinates(),D=h+g,F=a-g,[v,T]=this.getSurfacesAreaEdges(),f=e?Math.min(D,v):Math.max(D,v),I=e?Math.max(F,T):Math.min(F,T),m=Math.max(e?f-p.left:p.left-f,0),S=Math.max(e?p.right-I:I-p.right,0),A=m*o,L=S*o;return m>S||A>i||A<i&&L<i&&e||l[0][1]<d}}const rt=1e4;class dt extends tt{constructor(){super(...arguments),this.isPreRendered=!1,this.createPolygons=t=>{const e=[];let n=null;for(let s=0;s<t.length;s++){const o=!!t[s][1];o&&(n===null&&(n=[]),n.push(t[s][0],t[s][1]));const i=s===t.length-1;if((!o||i)&&n){for(let h=o?s:s-1;h>=0&&t[h][1];h--)n.push(t[h][0],t[h][2]||rt);e.push(n),n=null}}return e},this.generateAreaPolygon=t=>{const e=new k;e.lineStyle(1,t.color,1),e.beginFill(t.color),this.createPolygons(t.data).forEach(s=>e.drawPolygon(s)),e.endFill(),this.addChild(e)},this.generateSurfaceLine=t=>{const e=new k,{data:n}=t,s=.5;e.lineStyle($,t.color,1,s,!0);let o=!1;for(let i=0;i<n.length;i++)n[i][1]?o?e.lineTo(n[i][0],n[i][1]):(e.moveTo(n[i][0],n[i][1]),o=!0):o=!1;this.addChild(e)}}onRescale(t){super.onRescale(t),this.isPreRendered||(this.clearLayer(),this.preRender()),this.render()}onUpdate(t){super.onUpdate(t),this.isPreRendered=!1,this.clearLayer(),this.preRender(),this.render()}preRender(){const{data:t}=this;t&&(t.areas.forEach(e=>this.generateAreaPolygon(e)),t.lines.forEach(e=>this.generateSurfaceLine(e)),this.isPreRendered=!0)}}export{dt as G,ct as a};
//# sourceMappingURL=GeomodelLayerV2-0b5cec0c.js.map
