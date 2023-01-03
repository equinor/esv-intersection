import { vi } from 'vitest'
import { RENDERER_TYPE } from 'pixi.js';

vi.mock('pixi.js', async (importOriginal) => {
  const pixi = await importOriginal()
  class MockRenderer {
    destroy = vi.fn();
    render = vi.fn();
    view = document.createElement('div');
    type: RENDERER_TYPE.WEBGL;
  }
  
  class MockContainer {
    destroy = vi.fn();
    addChild = vi.fn();
    removeChildren = vi.fn((): any[] => []);
    position = { set: vi.fn() };
    scale = { set: vi.fn() };
  }
  
  return {
    ...pixi,
    Container: MockContainer,
    autoDetectRenderer: () => new MockRenderer(),
  };
})
