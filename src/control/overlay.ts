import { select, event, Selection, mouse, ContainerElement } from 'd3-selection';
import { OverlayCallbacks } from './interfaces';

class Overlay {
  elm: Selection<Element, unknown, null, undefined>;
  source: Element;
  elements: { [propName: string]: Element } = {};
  listeners: { [propName: string]: OverlayCallbacks } = {};
  enabled = true;

  constructor(caller: any, container: HTMLElement) {
    const con = select(container);
    this.elm = con.append('div').attr('id', 'overlay').style('z-index', '11').style('position', 'absolute');

    this.source = this.elm.node();

    const { elm } = this;
    elm.on('resize', () => {
      const { width, height } = event.detail;
      elm.style('width', `${width}px`).style('height', `${height}px`);

      if (!this.enabled) {
        return;
      }

      Object.keys(this.listeners).forEach((key: string) => {
        const target = this.elements[key] || null;
        const ops = this.listeners[key];
        if (ops && ops.onResize) {
          requestAnimationFrame(() =>
            ops.onResize({
              target,
              source: this.source,
              caller,
              width,
              height,
            }),
          );
        }
      });
    });

    elm.on('mousemove', () => {
      if (!this.enabled) {
        return;
      }

      const [mx, my] = mouse(this.elm.node() as ContainerElement);
      Object.keys(this.listeners).forEach((key: string) => {
        const target = this.elements[key] || null;
        const ops = this.listeners[key];

        if (ops && ops.onMouseMove) {
          requestAnimationFrame(() =>
            ops.onMouseMove({
              x: mx,
              y: my,
              target,
              source: this.source,
              caller,
            }),
          );
        }
      });
    });

    elm.on('mouseout', () => {
      if (!this.enabled) {
        return;
      }
      Object.keys(this.listeners).forEach((key: string) => {
        const target = this.elements[key] || null;
        const ops = this.listeners[key];
        if (ops && ops.onMouseExit) {
          requestAnimationFrame(() =>
            ops.onMouseExit({
              target,
              source: this.source,
              caller,
            }),
          );
        }
      });
    });
  }

  create(key: string, callbacks?: OverlayCallbacks): HTMLElement {
    const newElm = this.elm.append('div').style('position', 'relative').style('pointer-events', 'none').node();
    this.elements[key] = newElm;
    if (callbacks) {
      this.listeners[key] = callbacks;
    }
    return newElm;
  }

  register(key: string, callbacks: OverlayCallbacks): void {
    this.listeners[key] = callbacks;
  }

  remove(key: string): void {
    const el = this.elements[key];
    if (el) {
      select(el).remove();
      delete this.elements[key];
    }
    delete this.listeners[key];
  }

  setZIndex(zIndex: number): void {
    this.elm.style('z-index', zIndex);
  }

  destroy(): void {
    this.source.remove();
  }
}

const overlay = (caller: any, container: HTMLElement): Overlay => new Overlay(caller, container);

export { overlay, Overlay };
