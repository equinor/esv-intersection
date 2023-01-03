import{I as D,C as Z}from"./MainController.bb1db3a7.js";import{c as A,b as G,a as W,e as g,d as h}from"./elements.b2968f38.js";import{P as L}from"./PixiLayer.23a66b84.js";import{S as B}from"./SchematicLayer.c4e748ce.js";import{g as v,f as k,e as u,h as T,a as H,j as F}from"./data.640a7923.js";import"./GridLayer.fc0b255b.js";import"./_commonjsHelpers.4e997714.js";const I=700,l=600,r=()=>{const n=A(I),c=G(I,l),t=W(I);return Promise.all([v(),k(),u(),T(),H(),F()]).then(([e,a,y,p,j,b])=>{const s=new D(e);s.offset=e[0][2];const S=new L({width:I,height:l}),C={completionSymbol1:"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xMCAwSDkwVjEwMEgxMFYwWiIgZmlsbD0iI0Q5RDlEOSIvPgo8cGF0aCBkPSJNMCAyNUgxMFY3NUgwVjI1WiIgZmlsbD0iI0I1QjJCMiIvPgo8cGF0aCBkPSJNNDUgMjVINTVWNzVINDVWMjVaIiBmaWxsPSIjQjVCMkIyIi8+CjxwYXRoIGQ9Ik05MCAyNUgxMDBWNzVIOTBWMjVaIiBmaWxsPSIjQjVCMkIyIi8+Cjwvc3ZnPgo=",completionSymbol2:"tubing1.svg",completionSymbol3:"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xMCAwSDkwVjEwMEgxMFYwWiIgZmlsbD0iI0Q5RDlEOSIvPgo8cGF0aCBkPSJNMCAyNUgxMFY3NUgwVjI1WiIgZmlsbD0iI0I1QjJCMiIvPgo8cGF0aCBkPSJNNDUgMjVINTVWNzVINDVWMjVaIiBmaWxsPSIjQjVCMkIyIi8+CjxwYXRoIGQ9Ik0yNSA2NUgzMFY4MEgyNVY2NVoiIGZpbGw9IiMzMTMxMzEiLz4KPHBhdGggZD0iTTI1IDQySDMwVjU3SDI1VjQyWiIgZmlsbD0iIzMxMzEzMSIvPgo8cGF0aCBkPSJNMjUgMjFIMzBWMzZIMjVWMjFaIiBmaWxsPSIjMzEzMTMxIi8+CjxwYXRoIGQ9Ik03MCA2NEg3NVY3OUg3MFY2NFoiIGZpbGw9IiMzMTMxMzEiLz4KPHBhdGggZD0iTTcwIDQxSDc1VjU2SDcwVjQxWiIgZmlsbD0iIzMxMzEzMSIvPgo8cGF0aCBkPSJNNzAgMjBINzVWMzVINzBWMjBaIiBmaWxsPSIjMzEzMTMxIi8+CjxwYXRoIGQ9Ik05MCAyNUgxMDBWNzVIOTBWMjVaIiBmaWxsPSIjQjVCMkIyIi8+Cjwvc3ZnPgo="},P=[{kind:"completionSymbol",id:"completion-svg-1",start:5250,end:5252,diameter:8.5,symbolKey:"completionSymbol1"},{kind:"completionSymbol",id:"completion-svg-2",start:5252,end:5274,diameter:8.5,symbolKey:"completionSymbol2"},{kind:"completionSymbol",id:"completion-svg-3",start:5274,end:5276,diameter:8.5,symbolKey:"completionSymbol3"}],N={mechanicalPlug:"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMSAxSDk5Vjk5SDFWMVoiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl81MF81KSIvPgo8cGF0aCBkPSJNMSAxSDk5Vjk5SDFWMVoiIGZpbGw9InVybCgjcGFpbnQxX2xpbmVhcl81MF81KSIgZmlsbC1vcGFjaXR5PSIwLjIiLz4KPHBhdGggZD0iTTEgMUg5OVY5OUgxVjFaIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiLz4KPGxpbmUgeDE9IjEuNzEwNzIiIHkxPSIxLjI5NjUzIiB4Mj0iOTguNzEwNyIgeTI9Ijk5LjI5NjUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIvPgo8bGluZSB4MT0iOTguNzA3MSIgeTE9IjAuNzA3MTA3IiB4Mj0iMC43MDcxIiB5Mj0iOTguNzA3MSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfNTBfNSIgeDE9IjAiIHkxPSI1MCIgeDI9IjUwIiB5Mj0iNTAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0NDMjYyNiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGRjQ3MUEiLz4KPC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDFfbGluZWFyXzUwXzUiIHgxPSI1MCIgeTE9IjUwIiB4Mj0iMTAwIiB5Mj0iNTAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0ZGNDcxQSIvPgo8c3RvcCBvZmZzZXQ9IjAuOTk5OSIgc3RvcC1jb2xvcj0iI0NDMjYyNiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGRjQ3MUEiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K"},w=[{kind:"pAndASymbol",id:"mechanical-plug-1",start:5100,end:5110,diameter:8.5,symbolKey:"mechanicalPlug"},{kind:"cementPlug",id:"cement-plug-2",start:5e3,end:5110,referenceIds:["casing-07"]}],z=[{kind:"perforation",subKind:"Perforation",id:"PerforationDemo1",start:4e3,end:4500,isOpen:!0},{kind:"perforation",subKind:"Open hole frac pack",id:"PerforationDemo2",start:3500,end:4500,isOpen:!0}],m={holeSizes:a,cements:p,casings:y,completion:[...j,...P],pAndA:[...w,...b],symbols:{...C,...N},perforations:z},i={holeLayerId:"hole-id",casingLayerId:"casing-id",completionLayerId:"completion-id",cementLayerId:"cement-id",pAndALayerId:"pAndA-id",perforationLayerId:"perforation-id"},x={order:1,referenceSystem:s,internalLayerOptions:i,data:m},d=new B(S,"schematic-webgl-layer",x),o=new Z({container:c,layers:[d]});d.setData(m),o.setBounds([0,1e3],[0,1e3]),o.adjustToSize(I,l),o.zoomPanHandler.zFactor=1,o.zoomPanHandler.setTranslateBounds([-5e3,6e3],[-5e3,6e3]),o.zoomPanHandler.enableTranslateExtent=!1,o.setViewport(1e3,1e3,5e3);const V=[["Holes",i.holeLayerId],["Casings",i.casingLayerId],["Cement",i.cementLayerId],["Completion",i.completionLayerId],["Plug & Abandonment",i.pAndALayerId],["Perforations",i.perforationLayerId]];t.append(...V.map(R(o)))}),n.appendChild(g("High level interface for creating and displaying a wellbore schematic. This layer is made using webGL.")),n.appendChild(c),n.appendChild(h()),n.appendChild(g("Schematic layer toggles")),n.appendChild(t),n},R=n=>([c,t])=>{const e=document.createElement("button");e.innerHTML=`${c}`,e.setAttribute("style","width: 170px;height:32px;margin-top:12px;background: lightblue;");let a=!1;return e.onclick=()=>{a?(n.showLayer(t),e.style.backgroundColor="lightblue",e.style.color=""):(n.hideLayer(t),e.style.backgroundColor="red",e.style.color="white"),a=!a},e},O={title:"ESV Intersection/Features/Schematic",component:r};var M;r.parameters={...r.parameters,storySource:{source:`() => {
  const root = createRootContainer(width);
  const container = createLayerContainer(width, height);
  const btnContainer = createButtonContainer(width);
  Promise.all([getWellborePath(), getHolesize(), getCasings(), getCement(), getCompletion(), getCementSqueezes()]).then(([wbp, holeSizes, casings, cements, completion, cementSqueezes]) => {
    const referenceSystem = new IntersectionReferenceSystem(wbp);
    referenceSystem.offset = wbp[0][2];
    const renderer = new PixiRenderApplication({
      width,
      height
    });
    const CSDSVGs = {
      completionSymbol1: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xMCAwSDkwVjEwMEgxMFYwWiIgZmlsbD0iI0Q5RDlEOSIvPgo8cGF0aCBkPSJNMCAyNUgxMFY3NUgwVjI1WiIgZmlsbD0iI0I1QjJCMiIvPgo8cGF0aCBkPSJNNDUgMjVINTVWNzVINDVWMjVaIiBmaWxsPSIjQjVCMkIyIi8+CjxwYXRoIGQ9Ik05MCAyNUgxMDBWNzVIOTBWMjVaIiBmaWxsPSIjQjVCMkIyIi8+Cjwvc3ZnPgo=',
      completionSymbol2: 'tubing1.svg',
      // Fetched from URL. Full URL with protocol and hostname is allowed.
      completionSymbol3: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xMCAwSDkwVjEwMEgxMFYwWiIgZmlsbD0iI0Q5RDlEOSIvPgo8cGF0aCBkPSJNMCAyNUgxMFY3NUgwVjI1WiIgZmlsbD0iI0I1QjJCMiIvPgo8cGF0aCBkPSJNNDUgMjVINTVWNzVINDVWMjVaIiBmaWxsPSIjQjVCMkIyIi8+CjxwYXRoIGQ9Ik0yNSA2NUgzMFY4MEgyNVY2NVoiIGZpbGw9IiMzMTMxMzEiLz4KPHBhdGggZD0iTTI1IDQySDMwVjU3SDI1VjQyWiIgZmlsbD0iIzMxMzEzMSIvPgo8cGF0aCBkPSJNMjUgMjFIMzBWMzZIMjVWMjFaIiBmaWxsPSIjMzEzMTMxIi8+CjxwYXRoIGQ9Ik03MCA2NEg3NVY3OUg3MFY2NFoiIGZpbGw9IiMzMTMxMzEiLz4KPHBhdGggZD0iTTcwIDQxSDc1VjU2SDcwVjQxWiIgZmlsbD0iIzMxMzEzMSIvPgo8cGF0aCBkPSJNNzAgMjBINzVWMzVINzBWMjBaIiBmaWxsPSIjMzEzMTMxIi8+CjxwYXRoIGQ9Ik05MCAyNUgxMDBWNzVIOTBWMjVaIiBmaWxsPSIjQjVCMkIyIi8+Cjwvc3ZnPgo='
    };
    const completionSymbols: CompletionSymbol[] = [{
      kind: 'completionSymbol',
      id: 'completion-svg-1',
      start: 5250,
      end: 5252,
      diameter: 8.5,
      symbolKey: 'completionSymbol1'
    }, {
      kind: 'completionSymbol',
      id: 'completion-svg-2',
      start: 5252,
      end: 5274,
      diameter: 8.5,
      symbolKey: 'completionSymbol2'
    }, {
      kind: 'completionSymbol',
      id: 'completion-svg-3',
      start: 5274,
      end: 5276,
      diameter: 8.5,
      symbolKey: 'completionSymbol3'
    }];
    const pAndASVGs = {
      mechanicalPlug: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMSAxSDk5Vjk5SDFWMVoiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl81MF81KSIvPgo8cGF0aCBkPSJNMSAxSDk5Vjk5SDFWMVoiIGZpbGw9InVybCgjcGFpbnQxX2xpbmVhcl81MF81KSIgZmlsbC1vcGFjaXR5PSIwLjIiLz4KPHBhdGggZD0iTTEgMUg5OVY5OUgxVjFaIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiLz4KPGxpbmUgeDE9IjEuNzEwNzIiIHkxPSIxLjI5NjUzIiB4Mj0iOTguNzEwNyIgeTI9Ijk5LjI5NjUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIvPgo8bGluZSB4MT0iOTguNzA3MSIgeTE9IjAuNzA3MTA3IiB4Mj0iMC43MDcxIiB5Mj0iOTguNzA3MSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfNTBfNSIgeDE9IjAiIHkxPSI1MCIgeDI9IjUwIiB5Mj0iNTAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0NDMjYyNiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGRjQ3MUEiLz4KPC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDFfbGluZWFyXzUwXzUiIHgxPSI1MCIgeTE9IjUwIiB4Mj0iMTAwIiB5Mj0iNTAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0ZGNDcxQSIvPgo8c3RvcCBvZmZzZXQ9IjAuOTk5OSIgc3RvcC1jb2xvcj0iI0NDMjYyNiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGRjQ3MUEiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K'
    };
    const pAndASymbols = [({
      kind: ('pAndASymbol' as const),
      id: 'mechanical-plug-1',
      start: 5100,
      end: 5110,
      diameter: 8.5,
      symbolKey: 'mechanicalPlug'
    } as PAndASymbol), ({
      kind: ('cementPlug' as const),
      id: 'cement-plug-2',
      start: 5000,
      end: 5110,
      referenceIds: ['casing-07']
    } as CementPlug)];
    const perforations: Perforation[] = [{
      kind: 'perforation',
      subKind: 'Perforation',
      id: 'PerforationDemo1',
      start: 4000,
      end: 4500,
      isOpen: true
    }, {
      kind: 'perforation',
      subKind: 'Open hole frac pack',
      id: 'PerforationDemo2',
      start: 3500,
      end: 4500,
      isOpen: true
    }];
    const schematicData: SchematicData = {
      holeSizes,
      cements,
      casings,
      completion: [...completion, ...completionSymbols],
      pAndA: [...pAndASymbols, ...cementSqueezes],
      symbols: {
        ...CSDSVGs,
        ...pAndASVGs
      },
      perforations
    };
    const internalLayerIds: InternalLayerOptions = {
      holeLayerId: 'hole-id',
      casingLayerId: 'casing-id',
      completionLayerId: 'completion-id',
      cementLayerId: 'cement-id',
      pAndALayerId: 'pAndA-id',
      perforationLayerId: 'perforation-id'
    };
    const schematicLayerOptions: SchematicLayerOptions<SchematicData> = {
      order: 1,
      referenceSystem,
      internalLayerOptions: internalLayerIds,
      data: schematicData
    };
    const schematicLayer = new SchematicLayer(renderer, 'schematic-webgl-layer', schematicLayerOptions);
    const controller = new Controller({
      container,
      layers: [schematicLayer]
    });
    schematicLayer.setData(schematicData);
    controller.setBounds([0, 1000], [0, 1000]);
    controller.adjustToSize(width, height);
    controller.zoomPanHandler.zFactor = 1;
    controller.zoomPanHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
    controller.zoomPanHandler.enableTranslateExtent = false;
    controller.setViewport(1000, 1000, 5000);
    const internalLayerVisibilityButtons: [string, string][] = [['Holes', internalLayerIds.holeLayerId], ['Casings', internalLayerIds.casingLayerId], ['Cement', internalLayerIds.cementLayerId], ['Completion', internalLayerIds.completionLayerId], ['Plug & Abandonment', internalLayerIds.pAndALayerId], ['Perforations', internalLayerIds.perforationLayerId]];
    btnContainer.append(...internalLayerVisibilityButtons.map(createInternalLayerVisibilityButton(controller)));
  });
  root.appendChild(createHelpText('High level interface for creating and displaying a wellbore schematic. This layer is made using webGL.'));
  root.appendChild(container);
  root.appendChild(createFPSLabel());
  root.appendChild(createHelpText('Schematic layer toggles'));
  root.appendChild(btnContainer);
  return root;
}`,...(M=r.parameters)==null?void 0:M.storySource}};const K=["SchematicLayerUsingHighLevelInterface"];export{r as SchematicLayerUsingHighLevelInterface,K as __namedExportsOrder,O as default};
//# sourceMappingURL=schematic-layer.stories.d20b56a2.js.map
