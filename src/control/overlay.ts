import { select, Selection, pointer, ContainerElement } from 'd3-selection';
import { OverlayCallbacks } from './interfaces';

export class Overlay<T> {
  elm: Selection<HTMLDivElement, unknown, null, undefined>;
  source: HTMLDivElement | undefined;
  elements: { [propName: string]: Element } = {};
  listeners: { [propName: string]: OverlayCallbacks<T> } = {};
  enabled = true;

  constructor(caller: T, container: HTMLElement) {
    const con = select(container);
    this.elm = con.append('div').attr('id', 'overlay').style('z-index', '11').style('position', 'absolute');
    this.source = this.elm.node() ?? undefined;

    const { elm } = this;
    elm.on('resize', (event) => {
      const { width, height } = event.detail;
      elm.style('width', `${width}px`).style('height', `${height}px`);

      if (!this.enabled) {
        return;
      }

      Object.keys(this.listeners).forEach((key: string) => {
        const target = this.elements[key] ?? undefined;
        const ops = this.listeners[key];
        if (ops && ops.onResize) {
          requestAnimationFrame(() =>
            ops.onResize?.({
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

    elm.on('mousemove', (event) => {
      if (!this.enabled) {
        return;
      }

      const [mx, my] = pointer(event, this.elm.node() as ContainerElement);
      Object.keys(this.listeners).forEach((key: string) => {
        const target = this.elements[key] ?? undefined;
        const ops = this.listeners[key];

        if (ops && ops.onMouseMove) {
          requestAnimationFrame(() =>
            ops.onMouseMove?.({
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
        const target = this.elements[key] || undefined;
        const ops = this.listeners[key];
        if (ops && ops.onMouseExit) {
          requestAnimationFrame(() =>
            ops.onMouseExit?.({
              target,
              source: this.source,
              caller,
            }),
          );
        }
      });
    });
  }

  create(key: string, callbacks?: OverlayCallbacks<T>): HTMLElement | undefined {
    const newElm = this.elm.append('div').style('position', 'relative').style('pointer-events', 'none').node();

    if (newElm != null) {
      this.elements[key] = newElm;
      if (callbacks) {
        this.listeners[key] = callbacks;
      }
      return newElm;
    } else {
      return undefined;
    }
  }

  register(key: string, callbacks: OverlayCallbacks<T>): void {
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
    this.source?.remove();
  }
}

export const overlay = <T>(caller: T, container: HTMLElement): Overlay<T> => new Overlay<T>(caller, container);
