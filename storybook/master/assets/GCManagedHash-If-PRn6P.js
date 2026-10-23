import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{F as t,I as n,N as r,P as i,S as a,St as o,a as s,at as c,b as l,bt as u,c as d,g as f,h as p,i as m,m as h,n as g,nt as _,o as v,ot as y,p as b,r as ee,s as te,t as ne,tt as re,x as ie,y as ae}from"./Geometry-BZZCidYw.js";var x;function oe(){return(oe=e((()=>{x=class{constructor(e){this.rawBinaryData=typeof e==`number`?new ArrayBuffer(e):e instanceof Uint8Array?e.buffer:e,this.uint32View=new Uint32Array(this.rawBinaryData),this.float32View=new Float32Array(this.rawBinaryData),this.size=this.rawBinaryData.byteLength}get int8View(){return this._int8View||=new Int8Array(this.rawBinaryData),this._int8View}get uint8View(){return this._uint8View||=new Uint8Array(this.rawBinaryData),this._uint8View}get int16View(){return this._int16View||=new Int16Array(this.rawBinaryData),this._int16View}get int32View(){return this._int32View||=new Int32Array(this.rawBinaryData),this._int32View}get float64View(){return this._float64Array||=new Float64Array(this.rawBinaryData),this._float64Array}get bigUint64View(){return this._bigUint64Array||=new BigUint64Array(this.rawBinaryData),this._bigUint64Array}view(e){return this[`${e}View`]}destroy(){this.rawBinaryData=null,this.uint32View=null,this.float32View=null,this.uint16View=null,this._int8View=null,this._uint8View=null,this._int16View=null,this._int32View=null,this._float64Array=null,this._bigUint64Array=null}static sizeOf(e){switch(e){case`int8`:case`uint8`:return 1;case`int16`:case`uint16`:return 2;case`int32`:case`uint32`:case`float32`:return 4;default:throw Error(`${e} isn't a valid view type`)}}}})))()}function S(e,t,n,r){if(n??=0,r??=Math.min(e.byteLength-n,t.byteLength),!(n&7)&&!(r&7)){let i=r/8;new Float64Array(t,0,i).set(new Float64Array(e,n,i))}else if(!(n&3)&&!(r&3)){let i=r/4;new Float32Array(t,0,i).set(new Float32Array(e,n,i))}else new Uint8Array(t).set(new Uint8Array(e,n,r))}function se(){return(se=e((()=>{})))()}var ce,C;function w(){return(w=e((()=>{ce={normal:`normal-npm`,add:`add-npm`,screen:`screen-npm`},C=(e=>(e[e.DISABLED=0]=`DISABLED`,e[e.RENDERING_MASK_ADD=1]=`RENDERING_MASK_ADD`,e[e.MASK_ACTIVE=2]=`MASK_ACTIVE`,e[e.INVERSE_MASK_ACTIVE=3]=`INVERSE_MASK_ACTIVE`,e[e.RENDERING_MASK_REMOVE=4]=`RENDERING_MASK_REMOVE`,e[e.NONE=5]=`NONE`,e))(C||{})})))()}function T(e,t){return t.alphaMode===`no-premultiply-alpha`&&ce[e]||e}function E(){return(E=e((()=>{w()})))()}function le(e){let t=``;for(let n=0;n<e;++n)n>0&&(t+=`
else `),n<e-1&&(t+=`if(test == ${n}.0){}`);return t}function ue(e,t){if(e===0)throw Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");let n=t.createShader(t.FRAGMENT_SHADER);try{for(;;){let r=D.replace(/%forloop%/gi,le(e));if(t.shaderSource(n,r),t.compileShader(n),!t.getShaderParameter(n,t.COMPILE_STATUS))e=e/2|0;else break}}finally{t.deleteShader(n)}return e}var D;function O(){return(O=e((()=>{D=`precision mediump float;
void main(void){
float test = 0.1;
%forloop%
gl_FragColor = vec4(0.0);
}`})))()}function de(){if(k)return k;let e=ie();return k=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),k=ue(k,e),e.getExtension(`WEBGL_lose_context`)?.loseContext(),k}var k;function fe(){return(fe=e((()=>{a(),O(),k=null})))()}var pe;function me(){return(me=e((()=>{pe=class{constructor(){this.ids=Object.create(null),this.textures=[],this.count=0}clear(){for(let e=0;e<this.count;e++){let t=this.textures[e];this.textures[e]=null,this.ids[t.uid]=null}this.count=0}}})))()}function he(){return j>0?A[--j]:new _e}function ge(e){e.elements=null,A[j++]=e}var _e,A,j,M,N,P;function F(){return(F=e((()=>{c(),oe(),_(),i(),E(),fe(),me(),_e=class{constructor(){this.renderPipeId=`batch`,this.action=`startBatch`,this.start=0,this.size=0,this.textures=new pe,this.blendMode=`normal`,this.topology=`triangle-strip`,this.canBundle=!0}destroy(){this.textures=null,this.gpuBindGroup=null,this.bindGroup=null,this.batcher=null,this.elements=null}},A=[],j=0,r.register({clear:()=>{if(A.length>0)for(let e of A)e&&e.destroy();A.length=0,j=0}}),M=0,N=class e{constructor(t){this.uid=y(`batcher`),this.dirty=!0,this.batchIndex=0,this.batches=[],this._elements=[],t={...e.defaultOptions,...t},t.maxTextures||(re(`v8.8.0`,`maxTextures is a required option for Batcher now, please pass it in the options`),t.maxTextures=de());let{maxTextures:n,attributesInitialSize:r,indicesInitialSize:i}=t;this.attributeBuffer=new x(r*4),this.indexBuffer=new Uint16Array(i),this.maxTextures=n}begin(){this.elementSize=0,this.elementStart=0,this.indexSize=0,this.attributeSize=0;for(let e=0;e<this.batchIndex;e++)ge(this.batches[e]);this.batchIndex=0,this._batchIndexStart=0,this._batchIndexSize=0,this.dirty=!0}add(e){this._elements[this.elementSize++]=e,e._indexStart=this.indexSize,e._attributeStart=this.attributeSize,e._batcher=this,this.indexSize+=e.indexSize,this.attributeSize+=e.attributeSize*this.vertexSize}checkAndUpdateTexture(e,t){let n=e._batch.textures.ids[t._source.uid];return!n&&n!==0?!1:(e._textureId=n,e.texture=t,!0)}updateElement(e){this.dirty=!0;let t=this.attributeBuffer;e.packAsQuad?this.packQuadAttributes(e,t.float32View,t.uint32View,e._attributeStart,e._textureId):this.packAttributes(e,t.float32View,t.uint32View,e._attributeStart,e._textureId)}break(e){let t=this._elements;if(!t[this.elementStart])return;let n=he(),r=n.textures;r.clear();let i=t[this.elementStart],a=T(i.blendMode,i.texture._source),o=i.topology;this.attributeSize*4>this.attributeBuffer.size&&this._resizeAttributeBuffer(this.attributeSize*4),this.indexSize>this.indexBuffer.length&&this._resizeIndexBuffer(this.indexSize);let s=this.attributeBuffer.float32View,c=this.attributeBuffer.uint32View,l=this.indexBuffer,u=this._batchIndexSize,d=this._batchIndexStart,f=`startBatch`,p=[],m=this.maxTextures;for(let i=this.elementStart;i<this.elementSize;++i){let h=t[i];t[i]=null;let g=h.texture._source,_=T(h.blendMode,g),v=a!==_||o!==h.topology;g._batchTick===M&&!v?(h._textureId=g._textureBindLocation,u+=h.indexSize,h.packAsQuad?(this.packQuadAttributes(h,s,c,h._attributeStart,h._textureId),this.packQuadIndex(l,h._indexStart,h._attributeStart/this.vertexSize)):(this.packAttributes(h,s,c,h._attributeStart,h._textureId),this.packIndex(h,l,h._indexStart,h._attributeStart/this.vertexSize)),h._batch=n,p.push(h)):(g._batchTick=M,(r.count>=m||v)&&(this._finishBatch(n,d,u-d,r,a,o,e,f,p),f=`renderBatch`,d=u,a=_,o=h.topology,n=he(),r=n.textures,r.clear(),p=[],++M),h._textureId=g._textureBindLocation=r.count,r.ids[g.uid]=r.count,r.textures[r.count++]=g,h._batch=n,p.push(h),u+=h.indexSize,h.packAsQuad?(this.packQuadAttributes(h,s,c,h._attributeStart,h._textureId),this.packQuadIndex(l,h._indexStart,h._attributeStart/this.vertexSize)):(this.packAttributes(h,s,c,h._attributeStart,h._textureId),this.packIndex(h,l,h._indexStart,h._attributeStart/this.vertexSize)))}r.count>0&&(this._finishBatch(n,d,u-d,r,a,o,e,f,p),d=u,++M),this.elementStart=this.elementSize,this._batchIndexStart=d,this._batchIndexSize=u}_finishBatch(e,t,n,r,i,a,o,s,c){e.gpuBindGroup=null,e.bindGroup=null,e.action=s,e.batcher=this,e.textures=r,e.blendMode=i,e.topology=a,e.start=t,e.size=n,e.elements=c,++M,this.batches[this.batchIndex++]=e,o.add(e)}finish(e){this.break(e)}ensureAttributeBuffer(e){e*4<=this.attributeBuffer.size||this._resizeAttributeBuffer(e*4)}ensureIndexBuffer(e){e<=this.indexBuffer.length||this._resizeIndexBuffer(e)}_resizeAttributeBuffer(e){let t=Math.max(e,this.attributeBuffer.size*2),n=new x(t);S(this.attributeBuffer.rawBinaryData,n.rawBinaryData),this.attributeBuffer=n}_resizeIndexBuffer(e){let t=this.indexBuffer,n=Math.max(e,t.length*1.5);n+=n%2;let r=n>65535?new Uint32Array(n):new Uint16Array(n);if(r.BYTES_PER_ELEMENT!==t.BYTES_PER_ELEMENT)for(let e=0;e<t.length;e++)r[e]=t[e];else S(t.buffer,r.buffer);this.indexBuffer=r}packQuadIndex(e,t,n){e[t]=n+0,e[t+1]=n+1,e[t+2]=n+2,e[t+3]=n+0,e[t+4]=n+2,e[t+5]=n+3}packIndex(e,t,n,r){let i=e.indices,a=e.indexSize,o=e.indexOffset,s=e.attributeOffset;for(let e=0;e<a;e++)t[n++]=r+i[e+o]-s}destroy(e={}){if(this.batches!==null){for(let e=0;e<this.batchIndex;e++)ge(this.batches[e]);this.batches=null,this.geometry.destroy(!0),this.geometry=null,e.shader&&(this.shader?.destroy(),this.shader=null);for(let e=0;e<this._elements.length;e++)this._elements[e]&&(this._elements[e]._batch=null);this._elements=null,this.indexBuffer=null,this.attributeBuffer.destroy(),this.attributeBuffer=null}}},N.defaultOptions={maxTextures:null,attributesInitialSize:4,indicesInitialSize:6},P=N})))()}var I,ve,ye;function be(){return(be=e((()=>{m(),v(),g(),I=new Float32Array(1),ve=new Uint32Array(1),ye=class extends ne{constructor(){let e=new ee({data:I,label:`attribute-batch-buffer`,usage:s.VERTEX|s.COPY_DST,shrinkToFit:!1}),t=new ee({data:ve,label:`index-batch-buffer`,usage:s.INDEX|s.COPY_DST,shrinkToFit:!1});super({attributes:{aPosition:{buffer:e,format:`float32x2`,stride:24,offset:0},aUV:{buffer:e,format:`float32x2`,stride:24,offset:8},aColor:{buffer:e,format:`unorm8x4`,stride:24,offset:16},aTextureIdAndRound:{buffer:e,format:`uint16x2`,stride:24,offset:20}},indexBuffer:t})}}})))()}function xe(e,t,r){if(e)for(let i in e){let a=t[i.toLocaleLowerCase()];if(a){let t=e[i];i===`header`&&(t=t.replace(/@in\s+[^;]+;\s*/g,``).replace(/@out\s+[^;]+;\s*/g,``)),r&&a.push(`//----${r}----//`),a.push(t)}else n(`${i} placement hook does not exist in shader`)}}function Se(){return(Se=e((()=>{t()})))()}function Ce(e){let t={};return(e.match(we)?.map(e=>e.replace(/[{()}]/g,``))??[]).forEach(e=>{t[e]=[]}),t}var we;function Te(){return(Te=e((()=>{we=/\{\{(.*?)\}\}/g})))()}function Ee(e,t){let n,r=/@in\s+([^;]+);/g;for(;(n=r.exec(e))!==null;)t.push(n[1])}function De(e,t,n=!1){let r=[];Ee(t,r),e.forEach(e=>{e.header&&Ee(e.header,r)});let i=r;n&&i.sort();let a=i.map((e,t)=>`       @location(${t}) ${e},`).join(`
`),o=t.replace(/@in\s+[^;]+;\s*/g,``);return o=o.replace(`{{in}}`,`
${a}
`),o}function Oe(e,t){let n,r=/@out\s+([^;]+);/g;for(;(n=r.exec(e))!==null;)t.push(n[1])}function ke(e){let t=/\b(\w+)\s*:/g.exec(e);return t?t[1]:``}function Ae(e){return e.replace(/@.*?\s+/g,``)}function je(e,t){let n=[];Oe(t,n),e.forEach(e=>{e.header&&Oe(e.header,n)});let r=0,i=n.sort().map(e=>e.indexOf(`builtin`)>-1?e:`@location(${r++}) ${e}`).join(`,
`),a=n.sort().map(e=>`       var ${Ae(e)};`).join(`
`),o=`return VSOutput(
            ${n.sort().map(e=>` ${ke(e)}`).join(`,
`)});`,s=t.replace(/@out\s+[^;]+;\s*/g,``);return s=s.replace(`{{struct}}`,`
${i}
`),s=s.replace(`{{start}}`,`
${a}
`),s=s.replace(`{{return}}`,`
${o}
`),s}function Me(e,t){let n=e;for(let e in t){let r=t[e];n=r.join(`
`).length?n.replace(`{{${e}}}`,`//-----${e} START-----//
${r.join(`
`)}
//----${e} FINISH----//`):n.replace(`{{${e}}}`,``)}return n}function Ne({template:e,bits:t}){let n=Ie(e,t);if(L[n])return L[n];let{vertex:r,fragment:i}=Fe(e,t);return L[n]=Le(r,i,t),L[n]}function Pe({template:e,bits:t}){let n=Ie(e,t);return L[n]||(L[n]=Le(e.vertex,e.fragment,t)),L[n]}function Fe(e,t){let n=t.map(e=>e.vertex).filter(e=>!!e),r=t.map(e=>e.fragment).filter(e=>!!e),i=De(n,e.vertex,!0);i=je(n,i);let a=De(r,e.fragment,!0);return{vertex:i,fragment:a}}function Ie(e,t){return t.map(e=>(R.has(e)||R.set(e,Re++),R.get(e))).sort((e,t)=>e-t).join(`-`)+e.vertex+e.fragment}function Le(e,t,n){let r=Ce(e),i=Ce(t);return n.forEach(e=>{xe(e.vertex,r,e.name),xe(e.fragment,i,e.name)}),{vertex:Me(e,r),fragment:Me(t,i)}}var L,R,Re;function ze(){return(ze=e((()=>{Se(),Te(),L=Object.create(null),R=new Map,Re=0})))()}var Be,Ve,He,Ue;function We(){return(We=e((()=>{Be=`
    @in aPosition: vec2<f32>;
    @in aUV: vec2<f32>;

    @out @builtin(position) vPosition: vec4<f32>;
    @out vUV : vec2<f32>;
    @out vColor : vec4<f32>;

    {{header}}

    struct VSOutput {
        {{struct}}
    };

    @vertex
    fn main( {{in}} ) -> VSOutput {

        var worldTransformMatrix = globalUniforms.uWorldTransformMatrix;
        var modelMatrix = mat3x3<f32>(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        var position = aPosition;
        var uv = aUV;

        {{start}}

        vColor = vec4<f32>(1., 1., 1., 1.);

        {{main}}

        vUV = uv;

        var modelViewProjectionMatrix = globalUniforms.uProjectionMatrix * worldTransformMatrix * modelMatrix;

        vPosition =  vec4<f32>((modelViewProjectionMatrix *  vec3<f32>(position, 1.0)).xy, 0.0, 1.0);

        vColor *= globalUniforms.uWorldColorAlpha;

        {{end}}

        {{return}}
    };
`,Ve=`
    @in vUV : vec2<f32>;
    @in vColor : vec4<f32>;

    {{header}}

    @fragment
    fn main(
        {{in}}
      ) -> @location(0) vec4<f32> {

        {{start}}

        var outColor:vec4<f32>;

        {{main}}

        var finalColor:vec4<f32> = outColor * vColor;

        {{end}}

        return finalColor;
      };
`,He=`
    in vec2 aPosition;
    in vec2 aUV;

    out vec4 vColor;
    out vec2 vUV;

    {{header}}

    void main(void){

        mat3 worldTransformMatrix = uWorldTransformMatrix;
        mat3 modelMatrix = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        vec2 position = aPosition;
        vec2 uv = aUV;

        {{start}}

        vColor = vec4(1.);

        {{main}}

        vUV = uv;

        mat3 modelViewProjectionMatrix = uProjectionMatrix * worldTransformMatrix * modelMatrix;

        gl_Position = vec4((modelViewProjectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);

        vColor *= uWorldColorAlpha;

        {{end}}
    }
`,Ue=`

    in vec4 vColor;
    in vec2 vUV;

    out vec4 finalColor;

    {{header}}

    void main(void) {

        {{start}}

        vec4 outColor;

        {{main}}

        finalColor = outColor * vColor;

        {{end}}
    }
`})))()}var Ge,Ke;function qe(){return(qe=e((()=>{Ge={name:`global-uniforms-bit`,vertex:{header:`
        struct GlobalUniforms {
            uProjectionMatrix:mat3x3<f32>,
            uWorldTransformMatrix:mat3x3<f32>,
            uWorldColorAlpha: vec4<f32>,
            uResolution: vec2<f32>,
        }

        @group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;
        `}},Ke={name:`global-uniforms-bit`,vertex:{header:`
          uniform mat3 uProjectionMatrix;
          uniform mat3 uWorldTransformMatrix;
          uniform vec4 uWorldColorAlpha;
          uniform vec2 uResolution;
        `}}})))()}function Je({bits:e,name:t}){let n=Ne({template:{fragment:Ve,vertex:Be},bits:[Ge,...e]});return p.from({name:t,vertex:{source:n.vertex,entryPoint:`main`},fragment:{source:n.fragment,entryPoint:`main`}})}function Ye({bits:e,name:t}){return new ae({name:t,...Pe({template:{vertex:He,fragment:Ue},bits:[Ke,...e]})})}function z(){return(z=e((()=>{l(),f(),ze(),We(),qe()})))()}var B,V;function H(){return(H=e((()=>{B={name:`color-bit`,vertex:{header:`
            @in aColor: vec4<f32>;
        `,main:`
            vColor *= vec4<f32>(aColor.rgb * aColor.a, aColor.a);
        `}},V={name:`color-bit`,vertex:{header:`
            in vec4 aColor;
        `,main:`
            vColor *= vec4(aColor.rgb * aColor.a, aColor.a);
        `}}})))()}function Xe(e){let t=[];if(e===1)t.push(`@group(1) @binding(0) var textureSource1: texture_2d<f32>;`),t.push(`@group(1) @binding(1) var textureSampler1: sampler;`);else{let n=0;for(let r=0;r<e;r++)t.push(`@group(1) @binding(${n++}) var textureSource${r+1}: texture_2d<f32>;`),t.push(`@group(1) @binding(${n++}) var textureSampler${r+1}: sampler;`)}return t.join(`
`)}function Ze(e){let t=[];if(e===1)t.push(`outColor = textureSampleGrad(textureSource1, textureSampler1, vUV, uvDx, uvDy);`);else{t.push(`switch vTextureId {`);for(let n=0;n<e;n++)n===e-1?t.push(`  default:{`):t.push(`  case ${n}:{`),t.push(`      outColor = textureSampleGrad(textureSource${n+1}, textureSampler${n+1}, vUV, uvDx, uvDy);`),t.push(`      break;}`);t.push(`}`)}return t.join(`
`)}function Qe(e){return U[e]||(U[e]={name:`texture-batch-bit`,vertex:{header:`
                @in aTextureIdAndRound: vec2<u32>;
                @out @interpolate(flat) vTextureId : u32;
            `,main:`
                vTextureId = aTextureIdAndRound.y;
            `,end:`
                if(aTextureIdAndRound.x == 1)
                {
                    vPosition = vec4<f32>(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
                }
            `},fragment:{header:`
                @in @interpolate(flat) vTextureId: u32;

                ${Xe(e)}
            `,main:`
                var uvDx = dpdx(vUV);
                var uvDy = dpdy(vUV);

                ${Ze(e)}
            `}}),U[e]}function $e(e){let t=[];for(let n=0;n<e;n++)n>0&&t.push(`else`),n<e-1&&t.push(`if(vTextureId < ${n}.5)`),t.push(`{`),t.push(`	outColor = texture(uTextures[${n}], vUV);`),t.push(`}`);return t.join(`
`)}function et(e){return W[e]||(W[e]={name:`texture-batch-bit`,vertex:{header:`
                in vec2 aTextureIdAndRound;
                out float vTextureId;

            `,main:`
                vTextureId = aTextureIdAndRound.y;
            `,end:`
                if(aTextureIdAndRound.x == 1.)
                {
                    gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
                }
            `},fragment:{header:`
                in float vTextureId;

                uniform sampler2D uTextures[${e}];

            `,main:`

                ${$e(e)}
            `}}),W[e]}var U,W;function G(){return(G=e((()=>{U={},W={}})))()}var K,q;function J(){return(J=e((()=>{K={name:`round-pixels-bit`,vertex:{header:`
            fn roundPixels(position: vec2<f32>, targetSize: vec2<f32>) -> vec2<f32>
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}},q={name:`round-pixels-bit`,vertex:{header:`
            vec2 roundPixels(vec2 position, vec2 targetSize)
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}}})))()}function tt(e){let t=Y[e];if(t)return t;let n=new Int32Array(e);for(let t=0;t<e;t++)n[t]=t;return t=Y[e]=new b({uTextures:{value:n,type:`i32`,size:e}},{isStatic:!0}),t}var Y;function X(){return(X=e((()=>{h(),Y={}})))()}var Z;function nt(){return(nt=e((()=>{z(),H(),G(),J(),X(),d(),Z=class extends te{constructor(e){let t=Ye({name:`batch`,bits:[V,et(e),q]}),n=Je({name:`batch`,bits:[B,Qe(e),K]});super({glProgram:t,gpuProgram:n,resources:{batchSamplers:tt(e)}}),this.maxTextures=e}}})))()}var Q,$,rt;function it(){return(it=e((()=>{o(),F(),be(),nt(),Q=null,$=class e extends P{constructor(t){super(t),this.geometry=new ye,this.name=e.extension.name,this.vertexSize=6,Q??=new Z(t.maxTextures),this.shader=Q}packAttributes(e,t,n,r,i){let a=i<<16|e.roundPixels&65535,o=e.transform,s=o.a,c=o.b,l=o.c,u=o.d,d=o.tx,f=o.ty,{positions:p,uvs:m}=e,h=e.color,g=e.attributeOffset,_=g+e.attributeSize;for(let e=g;e<_;e++){let i=e*2,o=p[i],g=p[i+1];t[r++]=s*o+l*g+d,t[r++]=u*g+c*o+f,t[r++]=m[i],t[r++]=m[i+1],n[r++]=h,n[r++]=a}}packQuadAttributes(e,t,n,r,i){let a=e.texture,o=e.transform,s=o.a,c=o.b,l=o.c,u=o.d,d=o.tx,f=o.ty,p=e.bounds,m=p.maxX,h=p.minX,g=p.maxY,_=p.minY,v=a.uvs,y=e.color,b=i<<16|e.roundPixels&65535;t[r+0]=s*h+l*_+d,t[r+1]=u*_+c*h+f,t[r+2]=v.x0,t[r+3]=v.y0,n[r+4]=y,n[r+5]=b,t[r+6]=s*m+l*_+d,t[r+7]=u*_+c*m+f,t[r+8]=v.x1,t[r+9]=v.y1,n[r+10]=y,n[r+11]=b,t[r+12]=s*m+l*g+d,t[r+13]=u*g+c*m+f,t[r+14]=v.x2,t[r+15]=v.y2,n[r+16]=y,n[r+17]=b,t[r+18]=s*h+l*g+d,t[r+19]=u*g+c*h+f,t[r+20]=v.x3,t[r+21]=v.y3,n[r+22]=y,n[r+23]=b}_updateMaxTextures(e){this.shader.maxTextures!==e&&(Q=new Z(e),this.shader=Q)}destroy(){this.shader=null,super.destroy()}},$.extension={type:[u.Batcher],name:`default`},rt=$})))()}var at;function ot(){return(ot=e((()=>{at=class{constructor(e){this.items=Object.create(null);let{renderer:t,type:n,onUnload:r,priority:i,name:a}=e;this._renderer=t,t.gc.addResourceHash(this,`items`,n,i??0),this._onUnload=r,this.name=a}add(e){return!this.items[e.uid]&&(this.items[e.uid]=e,e.once(`unload`,this.remove,this),e._gcLastUsed=this._renderer.gc.now,!0)}remove(e,...t){if(!this.items[e.uid])return;let n=e._gpuData[this._renderer.uid];n&&(this._onUnload?.(e,...t),n.destroy(),e._gpuData[this._renderer.uid]=null,this.items[e.uid]=null)}removeAll(...e){Object.values(this.items).forEach(t=>t&&this.remove(t,...e))}destroy(...e){this.removeAll(...e),this.items=Object.create(null),this._renderer=null,this._onUnload=null}}})))()}export{C,se as E,E as S,S as T,Je as _,tt as a,O as b,K as c,et as d,G as f,Ye as g,H as h,it as i,q as l,V as m,ot as n,X as o,B as p,rt as r,J as s,at as t,Qe as u,z as v,w,T as x,ue as y};