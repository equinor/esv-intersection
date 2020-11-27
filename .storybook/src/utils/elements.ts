import { Layer } from '../../../src/layers';
import { ZoomPanHandler } from '../../../src/control/ZoomPanHandler';
import { OnUpdateEvent } from '../../../src/interfaces';

export const createRootContainer = (width: number) => {
  const root = document.createElement('div');
  root.setAttribute('style', `display: flex;flex:1;flex-direction:column; width: ${width}px;height:100%; background-color: white; padding: 12px;`);

  return root;
};

export const createLayerContainer = (width: number, height: number) => {
  const container = document.createElement('div');
  container.className = 'story-layer-container';
  container.setAttribute('style', `height: ${height}px; width: ${width}px;background-color: #eee;`);
  container.setAttribute('height', `${height}`);
  container.setAttribute('width', `${width}`);

  return container;
};

export const createButtonContainer = (width: number) => {
  const container = document.createElement('div');
  container.className = 'button-container';
  container.setAttribute('style', `width: ${width}px;background-color: white;`);

  return container;
};

export const createButton = (layer: Layer, zoomHandler: ZoomPanHandler, title: string, additionalEventParams: any, onMount: any) => {
  const btn = document.createElement('button');
  btn.innerHTML = `Toggle ${title}`;
  btn.setAttribute('style', 'width: 130px;height:32px;margin-top:12px;');
  let show = false;
  btn.onclick = () => {
    if (show) {
      layer.onMount({
        ...onMount,
        ...additionalEventParams,
      });
      layer.onUpdate({
        ...additionalEventParams,
        ...zoomHandler.currentStateAsEvent(),
      });
      layer.onRescale({
        ...additionalEventParams,
        ...zoomHandler.currentStateAsEvent(),
      });
    } else {
      layer.onUnmount();
    }
    show = !show;
  };
  return btn;
};

export const createFPSLabel = () => {
  const label = document.createElement('p');
  const times: number[] = [];
  let fps: number;

  function refreshLoop() {
    window.requestAnimationFrame(() => {
      const now = performance.now();
      while (times.length > 0 && times[0] <= now - 1000) {
        times.shift();
      }
      times.push(now);
      fps = times.length;

      label.innerHTML = `FPS: ${fps}`;
      refreshLoop();
    });
  }

  refreshLoop();
  return label;
};

export const createHelpText = (description: string) => {
  const text = document.createElement('p');
  text.innerHTML = description;
  return text;
};

export const createSlider = (layer: Layer, event: OnUpdateEvent, width: number) => {
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.value = `${layer.opacity.valueOf() * 10}`;
  slider.min = '0';
  slider.max = '10';
  slider.setAttribute('style', `width:${width}px`);
  slider.oninput = () => {
    layer.opacity = parseInt(slider.value) / 10;
  };
  return slider;
};
