import { Layer, OnUpdateEvent } from '../src';

class TestLayer extends Layer<string> {
  onOpacityChanged(_opacity: number): void {
    throw new Error('Method not implemented.');
  }
  onOrderChanged(_order: number): void {
    throw new Error('Method not implemented.');
  }
  onInteractivityChanged(_interactive: boolean): void {
    throw new Error('Method not implemented.');
  }
  testString: string = '';
  updateWasCalled: boolean = false;
  setData(data: string) {
    super.setData(data);
    this.testString = data;
  }

  onUpdate(_event: OnUpdateEvent<string>) {
    this.updateWasCalled = true;
  }
}

const data = 'test';

describe('Layer', () => {
  let elm: HTMLElement;
  beforeEach(() => {
    elm = document.createElement('div');
  });
  afterEach(() => {
    elm.remove();
  });

  it('should set data upon construction and not call update when no element has been mounted', () => {
    const layer = new TestLayer('id', { data });

    expect(layer.element).toEqual(null);
    expect(layer.data).toEqual('test');
    expect(layer.updateWasCalled).toEqual(false);
  });
  it('should set data and not call update if no element has been mounted', () => {
    const layer = new TestLayer();

    layer.setData(data);

    expect(layer.element).toEqual(null);
    expect(layer.data).toEqual('test');
    expect(layer.updateWasCalled).toEqual(false);
  });
  it('should set data and call update after element has been mounted', () => {
    const layer = new TestLayer();

    layer.onMount({ elm });
    layer.setData(data);

    expect(layer.element).toEqual(elm);
    expect(layer.data).toEqual('test');
    expect(layer.updateWasCalled).toEqual(true);
  });
});
