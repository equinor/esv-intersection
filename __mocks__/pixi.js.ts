import { vi } from 'vitest';
import { RendererType } from 'pixi.js';

vi.mock('pixi.js', async (importOriginal) => {
  const pixi = await importOriginal();
  class MockRenderer {
    destroy = vi.fn();
    render = vi.fn();
    view = document.createElement('div');
    type: RendererType.WEBGL | undefined;
  }

  class MockContainer {
    destroy = vi.fn();
    addChild = vi.fn();
    removeChildren = vi.fn((): unknown[] => []);
    position = { set: vi.fn() };
    scale = { set: vi.fn() };
  }

  return {
    ...(pixi as object),
    Container: MockContainer,
    autoDetectRenderer: () => new MockRenderer(),
  };
});
