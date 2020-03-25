import { CanvasLayer } from '../../src/layers/CanvasLayer';
import { OnUpdateEvent, OnRescaleEvent, LayerOptions } from '../../src/interfaces';
import { GridLayer } from '../../src/layers/GridLayer';
import { ZoomPanHandler } from '../../src/control/ZoomPanHandler';
import { createFPSLabel } from './utils';

const width = 600;
const height = 400;

function createButton(label: string, cb: any) {
  const btn = document.createElement('button');
  btn.innerHTML = label;
  btn.setAttribute('style', 'width: 100px;height:32px;margin-top:12px;');
  btn.onclick = cb;
  return btn;
}

class TestLayer extends CanvasLayer {
  constructor(id: String, options: LayerOptions) {
    super(id, options);

    this.render = this.render.bind(this);
  }

  onRescale(event: OnRescaleEvent) {
    super.onRescale(event);

    this.render(event);
  }

  onUpdate(event: OnUpdateEvent) {
    super.onUpdate(event);

    this.render(event);
  }

  render(event: OnRescaleEvent | OnUpdateEvent) {
    const { ctx } = this;

    if (!ctx) {
      return;
    }

    // Get the bounds area
    const [xb1, xb2] = event.xBounds;
    const [yb1, yb2] = event.yBounds;
    const x = event.xScale(xb1);
    const y = event.yScale(yb1);
    const w = event.xScale(xb2) - x;
    const h = event.yScale(yb2) - y;

    // Center
    const cx = x + w / 2;
    const cy = y + h / 2;

    const rx = Math.abs(x - event.xScale(event.xBounds[0] + 100));
    const ry = rx * event.zFactor;

    // Save and clear canvas
    ctx.save();
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

    // Draw bounds
    ctx.strokeStyle = 'green';
    ctx.fillStyle = '#00002f';
    ctx.lineWidth = event.transform.k;

    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.stroke();

    // Center of bounds
    ctx.strokeStyle = 'grey';
    ctx.fillStyle = 'dimgray';
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#bbb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx / 1.5, ry / 1.5, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Fixed rectangle scaled and moved by transform
    // Note: the transformation does not take bounds into account which means this is at a different scale the x/yScale(v)
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'lightgray';
    ctx.lineWidth = event.transform.k;

    ctx.beginPath();
    ctx.rect(
      10 * event.transform.k + event.transform.x,
      10 * event.transform.k + event.transform.y,
      300 * event.transform.k,
      200 * event.transform.k,
    );
    ctx.fill();
    ctx.stroke();

    // Draw some lines
    // Note: the transformation does not take bounds into account which means this is at a different scale the x/yScale(v)
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      ctx.moveTo(20 * event.transform.k + event.transform.x, (i + 1) * 40 * event.transform.k + event.transform.y);
      ctx.lineTo(300 * event.transform.k + event.transform.x, (i + 1) * 40 * event.transform.k + event.transform.y);
    }
    ctx.stroke();

    // Set the translation on canvas so we can draw in bounds(world) coordinates
    ctx.translate(event.transform.x, event.transform.y);
    ctx.scale(event.xRatio, event.yRatio);

    // Cross-hair at (0, 0)
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(-50, 0);
    ctx.lineTo(50, 0);
    ctx.moveTo(0, -50);
    ctx.lineTo(0, 50);
    ctx.stroke();

    // Cross-hair at corner of bounds
    ctx.beginPath();
    ctx.moveTo(950, 1000);
    ctx.lineTo(1050, 1000);
    ctx.moveTo(1000, 950);
    ctx.lineTo(1000, 1050);
    ctx.stroke();

    // Draw rectangle below center
    ctx.fillStyle = 'gray';
    ctx.beginPath();
    ctx.rect(470, 700, 60, 220);
    ctx.fill();
    ctx.stroke();

    //Restore canvas state
    ctx.restore();
  }
}

export default {
  title: 'Zoom',
};

export const Test = () => {
  const root = document.createElement('div');

  const container = document.createElement('div');
  container.className = 'test-container';
  container.setAttribute('style', `height: ${height}px; width: ${width}px;background-color: #eee;position: relative;`);
  container.setAttribute('height', `${height}`);
  container.setAttribute('width', `${width}`);
  root.appendChild(container);

  const testLayer = new TestLayer('test', { order: 1 });

  testLayer.onMount({ elm: container, width, height });

  const zoomHandler = new ZoomPanHandler(root, (event: OnRescaleEvent) => {
    testLayer.onRescale(event);
  });

  zoomHandler.setBounds([0, 1000], [0, 1000]);
  zoomHandler.adjustToSize(width, height);
  zoomHandler.zFactor = 1;
  zoomHandler.setTranslateBounds([-5000, 6000], [-5000, 6000]);
  zoomHandler.enableTranslateExtent = false;
  zoomHandler.setViewport(500, 500, 3000);

  const buttons = document.createElement('div');
  //root.appendChild(buttons);
  buttons.className = 'Buttons-container';
  root.appendChild(
    createButton('500x500', () => {
      const w = 500;
      const h = 500;
      container.setAttribute('style', `height: ${h}px; width: ${w}px;background-color: #eee;`);
      container.setAttribute('height', `${h}`);
      container.setAttribute('width', `${w}`);
      zoomHandler.adjustToSize(w, h);
    }),
  );
  root.appendChild(
    createButton('600x400', () => {
      const w = 600;
      const h = 400;
      container.setAttribute('style', `height: ${h}px; width: ${w}px;background-color: #eee;`);
      container.setAttribute('height', `${h}`);
      container.setAttribute('width', `${w}`);
      zoomHandler.adjustToSize(w, h);
    }),
  );
  root.appendChild(
    createButton('800x600', () => {
      const w = 800;
      const h = 600;
      container.setAttribute('style', `height: ${h}px; width: ${w}px;background-color: #eee;`);
      container.setAttribute('height', `${h}`);
      container.setAttribute('width', `${w}`);
      zoomHandler.adjustToSize(w, h);
    }),
  );

  root.appendChild(
    createButton('1:1', () => {
      zoomHandler.zFactor = 1;
    }),
  );
  root.appendChild(
    createButton('2:1', () => {
      zoomHandler.zFactor = 2;
    }),
  );
  root.appendChild(
    createButton('1:2', () => {
      zoomHandler.zFactor = 0.5;
    }),
  );
  root.appendChild(
    createButton('center', () => {
      zoomHandler.setViewport(500, 500, null, 500);
    }),
  );
  root.appendChild(
    createButton('reset', () => {
      zoomHandler.zFactor = 1;
      zoomHandler.setViewport(500, 500, 3000);
    }),
  );
  root.appendChild(createFPSLabel());

  return root;
};

export const Grid = () => {
  const root = document.createElement('div');
  root.className = 'Test-container';
  root.setAttribute('style', `height: ${height}px; width: ${width}px;background-color: #eee;`);
  root.setAttribute('height', `${height}`);
  root.setAttribute('width', `${width}`);

  const gridLayer = new GridLayer('grid', {
    majorColor: 'black',
    minorColor: 'black',
    majorWidth: 0.5,
    minorWidth: 0.5,
    order: 1,
  });

  gridLayer.onMount({ elm: root, width, height });

  const zoomHandler = new ZoomPanHandler(root, (event: OnRescaleEvent) => {
    gridLayer.onRescale(event);
  });

  zoomHandler.setBounds([0, 1000], [0, 1000]);
  zoomHandler.adjustToSize(width, height);

  root.appendChild(createFPSLabel());

  return root;
};
