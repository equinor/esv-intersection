import{o as F,C as v}from"./elements-861b6ce3.js";const p=4,E=2;function A(o){const[e]=o.domain();return Math.abs(o(e+1))}function T(o,e,t,r){return F(A(r)*o,e,t)}function P(o,e,t=p,r=E){const i=o.x+o.width+t,n=e.x+e.width+t,s=o.y+o.height+r,l=e.y+e.height+r;return!(e.x-t>i||e.y-r>s||n+t<o.x||l+r<o.y)}function k(o,e,t=p,r=E){const i=o.x+o.width,n=e.x+e.width,s=o.y+o.height,l=e.y+e.height;if(e.x-t>i||e.y-r>s||n+t<o.x||l+r<o.y)return;const c=o.x+o.width-e.x+t,a=o.y+o.height-e.y+r;return{dx:c,dy:a}}const B=7,C=11,S=7,U=20,w=120,R=19,_="rgba(0, 0, 0, 0.5)",D=5,$=5;function O(o,e){return o??e}const g={topleft:"topleft",topright:"topright",bottomleft:"bottomleft",bottomright:"bottomright"};class Y extends v{constructor(e,t){super(e,t),this.callouts=[],this.groupFilter=[],this.renderAnnotation=(r,i,n,s,l,c)=>{this.renderText(r,n,s-l,l,c,"arial","bold"),this.renderText(i,n,s,l,c)},this.renderLine=(r,i,n,s,l,c,a=!0)=>{const{ctx:f}=this,d=a?r:r+n,h=a?r+n:r,u=i+2;f!=null&&(f.strokeStyle=c,f.lineWidth=1,f.beginPath(),f.moveTo(s,l),f.lineTo(d,u),f.lineTo(h,u),f.stroke())},this.minFontSize=(t==null?void 0:t.minFontSize)||B,this.maxFontSize=(t==null?void 0:t.maxFontSize)||C,this.fontSizeFactor=(t==null?void 0:t.fontSizeFactor)||S,this.offsetMin=(t==null?void 0:t.offsetMin)||U,this.offsetMax=(t==null?void 0:t.offsetMax)||w,this.offsetFactor=(t==null?void 0:t.offsetFactor)||R,this.fontColor=t==null?void 0:t.fontColor,t!=null&&t.backgroundColor?(this.backgroundActive=!0,this.backgroundColor=t.backgroundColor):(this.backgroundActive=!1,this.backgroundColor=_),this.backgroundPadding=(t==null?void 0:t.backgroundPadding)||D,this.backgroundBorderRadius=O(t==null?void 0:t.backgroundBorderRadius,$)}setGroupFilter(e){this.groupFilter=e,this.callouts=[],this.render()}onUpdate(e){super.onUpdate(e),this.callouts=[],this.render()}onRescale(e){super.onRescale(e);const t=this.rescaleEvent&&this.rescaleEvent.xRatio===e.xRatio;this.rescaleEvent=e,this.render(t)}render(e=!1){requestAnimationFrame(()=>{if(this.clearCanvas(),!this.data||!this.rescaleEvent||!this.referenceSystem)return;const{xScale:t,yScale:r,xBounds:i}=this.rescaleEvent,n=T(this.fontSizeFactor,this.minFontSize,this.maxFontSize,t);if(!e||this.callouts.length<=0){const{data:s,ctx:l,groupFilter:c}=this,{calculateDisplacementFromBottom:a}=this.referenceSystem.options,f=a?i[0]<i[1]:i[0]>i[1],d=0;l!=null&&(l.font=`bold ${n}px arial`);const h=s.filter(m=>c.length<=0||c.includes(m.group)),u=T(this.offsetFactor,this.offsetMin,this.offsetMax,t);this.callouts=this.positionCallouts(h,f,t,r,d,n,u)}this.callouts.forEach(s=>{const{pos:l,title:c,color:a}=s,f=t(l.x),d=r(l.y),h={x:f,y:d,width:s.boundingBox.width,height:n,offsetX:s.dx,offsetY:s.dy};this.renderCallout(c,s.label,h,a,s.alignment)})})}renderBackground(e,t,r,i,n){const{ctx:s}=this;if(s==null)return;const l=this.backgroundPadding,c=this.backgroundBorderRadius,a=this.measureTextWidth(e,n,"arial","bold"),f=this.measureTextWidth(t,n),d=Math.max(a,f)+l*2,h=(n+l)*2,u=r-l,m=i-2*n-l;if(s.fillStyle=this.backgroundColor,c>0){const x=u+d,b=m+h;s.beginPath(),s.moveTo(u+c,m),s.lineTo(x-c,m),s.quadraticCurveTo(x,m,x,m+c),s.lineTo(x,b-c),s.quadraticCurveTo(x,b,x-c,b),s.lineTo(u+c,b),s.quadraticCurveTo(u,b,u,b-c),s.lineTo(u,m+c),s.quadraticCurveTo(u,m,u+c,m),s.fill()}else s.fillRect(u,m,d,h)}renderText(e,t,r,i,n,s="arial",l="normal"){const{ctx:c}=this;c!=null&&(c.font=`${l} ${i}px ${s}`,c.fillStyle=this.fontColor||n,c.fillText(e,t,r))}measureTextWidth(e,t,r="arial",i="normal"){const{ctx:n}=this;return n==null?0:(n.font=`${i} ${t}px ${r}`,n.measureText(e).width)}renderPoint(e,t,r,i=3){const{ctx:n}=this;n!=null&&(n.fillStyle=r,n.beginPath(),n.moveTo(e,t),n.arc(e,t,i,0,Math.PI*2),n.fill())}renderCallout(e,t,r,i,n){const s=this.getPosition(r,n),{x:l,y:c}=s,{height:a,width:f,x:d,y:h}=r,u=n===g.topright||n===g.bottomright;this.backgroundActive&&this.renderBackground(e,t,l,c,a),this.renderAnnotation(e,t,l,c,a,i),this.renderPoint(d,h,i),this.renderLine(l,c,f,d,h,i,u)}getPosition(e,t){const{x:r,y:i,offsetX:n=0,offsetY:s=0,width:l}=e;switch(t){case g.topleft:return{x:r-l-n,y:i-s};case g.topright:return{x:r+n,y:i-s};case g.bottomleft:return{x:r-l-n,y:i+s};case g.bottomright:return{x:r+n,y:i+s};default:return{x:r,y:i}}}positionCallouts(e,t,r,i,n,s,l=20){if(e.length===0)return[];const c=t?g.topleft:g.topright,a=e.map(h=>{var m;const u=h.pos?h.pos:(m=this.referenceSystem)==null?void 0:m.project(h.md);return{title:h.title,label:h.label,color:h.color,pos:{x:u==null?void 0:u[0],y:u==null?void 0:u[1]},group:h.group,alignment:c,boundingBox:this.getAnnotationBoundingBox(h.title,h.label,u,r,i,s),dx:l,dy:l}}),f=[a[a.length-1]],d=[];return this.chooseTopOrBottomPosition(a,d,f),this.adjustTopPositions(f),this.adjustBottomPositions(d),a}getAnnotationBoundingBox(e,t,r,i,n,s){const{ctx:l}=this,c=i(r[0]),a=n(r[1]),f=(l==null?void 0:l.measureText(t).width)??0,d=(l==null?void 0:l.measureText(e).width)??0,h=Math.max(f,d);return{x:c,y:a,width:h,height:s*2+4}}chooseTopOrBottomPosition(e,t,r){for(let i=e.length-2;i>=0;--i){const n=e[i],s=r[0];P(n.boundingBox,s.boundingBox)?(n.alignment=n.alignment===g.topleft?g.bottomright:g.bottomleft,t.push(n),i>0&&r.unshift(e[--i])):r.unshift(n)}}adjustTopPositions(e){for(let t=e.length-2;t>=0;--t){const r=e[t];for(let i=e.length-1;i>t;--i){const n=e[i],s=k(r.boundingBox,n.boundingBox);s&&(r.dy+=s.dy,r.boundingBox.y-=s.dy)}}}adjustBottomPositions(e){for(let t=e.length-2;t>=0;--t){const r=e[t];for(let i=e.length-1;i>t;--i){const n=e[i],s=k(n.boundingBox,r.boundingBox);s&&(r.dy+=s.dy,r.boundingBox.y+=s.dy)}}}}const y=(o,e)=>({title:o.pickIdentifier||o.identifier,group:e,label:`${o.md} ${o.mdUnit} ${o.depthReferencePoint}`,color:e==="strat-picks"?"#227":"rgba(0,0,0,0.8)",md:o.md});function M(o){return o?o.map(e=>y(e,"ref-picks")):[]}function L(o){return o?o.filter(e=>e.entryPick.md===e.from).map(e=>y(e.entryPick,"strat-picks")):[]}function N(o){return o?o.filter(e=>o.findIndex(t=>Math.abs(t.entryPick.md-e.exitPick.md)<.5)===-1).map(e=>y(e.exitPick,"strat-picks")).filter((e,t,r)=>t===r.findIndex(i=>i.title===e.title&&i.md===e.md)):[]}const Z=o=>[...M(o.nonUnitPicks),...L(o.unitPicks),...N(o.unitPicks)].sort((e,t)=>e.md-t.md),I=o=>({unitName:o.identifier,topSurface:o.top,baseSurface:o.base,ageBase:o.baseAge,ageTop:o.topAge,color:{r:o.colorR===null?255:o.colorR,g:o.colorG===null?255:o.colorG,b:o.colorB===null?255:o.colorB},level:o.stratUnitLevel,lithType:o.lithologyType,parent:o.stratUnitParent});function G(o,e,t){if(t.length===0)return[[o,e]];const r=[];let i=o,n=0;for(;i<e&&n<t.length;){const s=t[n];s.from>i&&r.push([i,Math.min(s.from,e)]),i=Math.min(e,Math.max(o,s.to)),n+=1}return i<e&&r.push([i,e]),r}const W=o=>o.map(I);function j(o,e){const t=W(e),r=[],i=[];return o.forEach(n=>{const s=t.filter(l=>{var c;return((c=n.pickIdentifier)==null?void 0:c.search(new RegExp(`(${l.topSurface}|${l.baseSurface})`,"i")))!==-1});s.length>0?s.forEach(l=>i.push({md:n.md,tvd:n.tvd,identifier:n.pickIdentifier,confidence:n.confidence,mdUnit:n.mdUnit,depthReferencePoint:n.depthReferencePoint,...l})):r.push({identifier:n.pickIdentifier,...n})}),{joined:i,nonUnitPicks:r}}function X(o){const e=[];let t=null;const r=o.filter(i=>i.level).sort((i,n)=>i.unitName.localeCompare(n.unitName)||i.md-n.md||i.ageTop-n.ageTop);for(;r.length>0;){t=r.shift();const i=t.identifier;let n;const s=i===t.topSurface,l=i===t.baseSurface;if(s)n=t.baseSurface;else if(l)n=t.topSurface;else{console.warn(`Unable to match ${i} with top or base surface, ignored`);continue}let c,a;const f=r.find(d=>d.identifier===n);if(f)c=s?t:f,a=s?f:t,c.md>a.md&&([c,a]=[a,c]),r.splice(r.indexOf(f),1);else if(console.warn(`Unable to find ${n} pick for ${i}`),s)if(c=t,a=o.filter(d=>d.level).sort((d,h)=>d.md-h.md).find(d=>d.md>c.md),a)console.warn(`Using ${a.identifier} as base for ${i}`);else{console.warn(`Unable to find a base pick for ${i} pick at ${c.md}, ignored`);continue}else if(l)if(a=t,c=o.filter(d=>d.level).sort((d,h)=>h.md-d.md).find(d=>d.md<a.md),c)console.warn(`Using ${c.identifier} as top for ${i}`);else{console.warn(`Unable to find a top pick for ${i} pick at ${a.md}, ignored`);continue}else{console.warn(`${i} ignored`);continue}e.push({name:c.unitName,mdEntry:c.md,tvdEntry:c.tvd,color:c.color,level:c.level,entryPick:c,mdExit:a.md,tvdExit:a.tvd,exitPick:a,confidenceEntry:c.confidence,confidenceExit:a.confidence})}return e}function K(o,e){var l;const{joined:t,nonUnitPicks:r}=j(o,e),n=X(t).filter(c=>c.mdEntry<c.mdExit).sort((c,a)=>c.mdEntry-a.mdEntry||c.level-a.level).reverse(),s=[];for(;n.length>0;){const c=n.pop(),a=[];for(;n.length>0&&((l=n[n.length-1])==null?void 0:l.level)>c.level;)a.push(n.pop());a.reverse(),a.push(c);const f=[];a.forEach(d=>{const h=G(d.mdEntry,d.mdExit,f);f.push(...h.map(u=>({from:u[0],to:u[1],itm:d})))}),f.sort((d,h)=>d.from-h.from),s.push(...f.map(d=>({from:d.from,to:d.to,...d.itm})))}return{unitPicks:s,nonUnitPicks:r}}export{Y as C,T as c,Z as g,K as t};
//# sourceMappingURL=picks-b0b737e9.js.map
