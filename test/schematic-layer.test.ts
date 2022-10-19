/* eslint-disable no-magic-numbers */
import { SchematicLayer, SchematicData, SchematicLayerOptions, IntersectionReferenceSystem, PixiRenderApplication } from '../src/index';
import { rescaleEventStub } from './test-helpers';

describe('SchematicLayer', () => {
  let elm: HTMLElement;
  const wp = [
    [30, 40, 0],
    [40, 70, 600],
    [45, 100, 800],
    [50, 110, 1000],
  ];

  beforeEach(() => {
    elm = document.createElement('div');
  });
  afterEach(() => {
    elm.remove();
  });
  describe('when setting reference system', () => {
    const data: SchematicData = {
      holeSizes: [{ start: 50, end: 500, diameter: 36 }],
      casings: [],
      cements: [],
      completion: [],
      pAndA: [],
      symbols: {},
    };

    it('should render when reference system is set in constructor', () => {
      // Arrange
      const pixiRenderApplication = new PixiRenderApplication();
      const referenceSystem = new IntersectionReferenceSystem(wp);
      const options: SchematicLayerOptions<SchematicData> = {
        referenceSystem,
      };
      const layer = new SchematicLayer(pixiRenderApplication, 'schematic-layer', options);
      layer.onMount({ elm });
      layer.onUpdate({ data });
      layer.onRescale(rescaleEventStub());
      jest.spyOn(layer, 'addChild');

      // Act
      layer.data = data;

      // Assert
      expect(layer.addChild).toHaveBeenCalled();
    });

    it('should render when reference system is set after constructor', () => {
      // Arrange
      const pixiRenderApplication = new PixiRenderApplication();
      const layer = new SchematicLayer(pixiRenderApplication, 'casing-layer', {});
      const referenceSystem = new IntersectionReferenceSystem(wp);
      layer.referenceSystem = referenceSystem;
      layer.onMount({ elm });
      layer.onUpdate({ data });
      layer.onRescale(rescaleEventStub());
      jest.spyOn(layer, 'addChild');

      // Act
      layer.data = data;

      // Assert
      expect(layer.addChild).toHaveBeenCalled();
    });

    it('should not throw exception when setting data without reference system', () => {
      // Arrange
      const pixiRenderApplication = new PixiRenderApplication();
      const layer = new SchematicLayer(pixiRenderApplication, 'casing-layer', {});
      layer.onMount({ elm });
      layer.onUpdate({ data });
      layer.onRescale(rescaleEventStub());
      jest.spyOn(layer, 'addChild');

      // Act
      // Assert
      expect(() => {
        layer.data = data;
      }).not.toThrow();
    });
  });
});
