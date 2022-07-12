import { RENDERER_TYPE } from 'pixi.js';

const pixi = jest.requireActual('pixi.js');
class MockRenderer {
  destroy = jest.fn();
  render = jest.fn();
  view = document.createElement('div');
  type: RENDERER_TYPE.WEBGL;
}

class MockContainer {
  destroy = jest.fn();
  addChild = jest.fn();
  removeChildren = jest.fn((): any[] => []);
  position = { set: jest.fn() };
  scale = { set: jest.fn() };
}

module.exports = {
  ...pixi,
  Container: MockContainer,
  autoDetectRenderer: () => new MockRenderer(),
};
