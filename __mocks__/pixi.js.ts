import { RENDERER_TYPE } from 'pixi.js';

const pixi = jest.requireActual('pixi.js');

module.exports = {
  ...pixi,
  Application: class Application {
    view = document.createElement('div');
    renderer = { type: RENDERER_TYPE.WEBGL };
    stage = {
      addChild: jest.fn(),
      removeChildren: jest.fn((): any[] => []),
      position: { set: jest.fn() },
      scale: { set: jest.fn() },
    };
  },
};
