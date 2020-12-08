import { CementLayer, IntersectionReferenceSystem } from '../src/index';
import { rescaleEventStub } from './test-helpers';

describe('CementLayer', () => {
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
    const data = {
      casings: [{ casingId: '1', diameter: 30, end: 200, hasShoe: true, innerDiameter: 28, start: 100 }],
      cement: [{ casingIds: ['1'], toc: 250 }],
      holes: [{ start: 50, end: 250, diameter: 36 }],
    };

    it('should render when reference system is set in constructor', () => {
      // Arrange
      const referenceSystem = new IntersectionReferenceSystem(wp);
      const layer = new CementLayer('casing-layer', { referenceSystem });
      layer.onMount({ elm });
      layer.onUpdate({});
      layer.onRescale(rescaleEventStub(data));

      // Act
      layer.data = data;

      // Assert
      expect(layer.ctx.stage.addChild).toHaveBeenCalled();
    });

    it('should render when reference system is set after constructor', () => {
      // Arrange
      const layer = new CementLayer('casing-layer', {});
      const referenceSystem = new IntersectionReferenceSystem(wp);
      layer.referenceSystem = referenceSystem;
      layer.onMount({ elm });
      layer.onUpdate({});
      layer.onRescale(rescaleEventStub(data));

      // Act
      layer.data = data;

      // Assert
      expect(layer.ctx.stage.addChild).toHaveBeenCalled();
    });

    it('should not throw exception when setting data without reference system', () => {
      // Arrange
      const layer = new CementLayer('casing-layer', {});
      layer.onMount({ elm });
      layer.onUpdate({});
      layer.onRescale(rescaleEventStub(data));

      // Act
      // Assert
      expect(() => {
        layer.data = data;
      }).not.toThrow();
    });
  });
});
