import { scaleLinear } from 'd3-scale';
import { zoomIdentity } from 'd3-zoom';
import { CanvasRenderingContext2DEvent } from 'jest-canvas-mock';
import { CalloutCanvasLayer, IntersectionReferenceSystem } from '../src/index';

describe('CalloutCanvasLayer', () => {
  let elm: HTMLElement;
  const wp = [
    [30, 40, 4],
    [40, 70, 6],
    [45, 100, 8],
    [50, 110, 10],
  ];

  beforeEach(() => {
    elm = document.createElement('div');
  });
  afterEach(() => {
    elm.remove();
  });
  describe('when setting reference system', () => {
    const data = [
      {
        title: 'Seabed',
        group: 'ref-picks',
        label: '91.1 m RKB',
        color: 'rgba(0,0,0,0.8)',
        md: 91.1,
      },
    ];
    const xBounds = [0, 1000] as [number, number];
    const yBounds = [0, 1000] as [number, number];
    const layerEvent = {
      xBounds,
      yBounds,
      zFactor: 1,
      viewportRatio: 1,
      xRatio: 1,
      yRatio: 1,
      width: 1,
      height: 1,
      transform: zoomIdentity,
      xScale: scaleLinear().domain(xBounds).range([0, 1]),
      yScale: scaleLinear().domain(yBounds).range([0, 1]),
    };

    it('should render when reference system is set in constructor', () => {
      // Arrange
      const referenceSystem = new IntersectionReferenceSystem(wp);
      const layer = new CalloutCanvasLayer('calloutcanvaslayer', { referenceSystem });
      layer.onMount({ elm });
      layer.onUpdate({});
      layer.onRescale(layerEvent);

      layer.ctx.__clearEvents();

      // Act
      layer.data = data;

      // Assert
      const events: CanvasRenderingContext2DEvent[] = layer.ctx.__getEvents();
      const fillTextCalls = events.filter((call: any) => call.type === 'fillText');
      expect(fillTextCalls.length).toBeGreaterThanOrEqual(1);
    });

    it('should render when reference system is set after constructor', () => {
      // Arrange
      const layer = new CalloutCanvasLayer('calloutcanvaslayer', {});
      const referenceSystem = new IntersectionReferenceSystem(wp);
      layer.referenceSystem = referenceSystem;
      layer.onMount({ elm });
      layer.onUpdate({});
      layer.onRescale(layerEvent);

      layer.ctx.__clearEvents();

      // Act
      layer.data = data;

      // Assert
      const events: CanvasRenderingContext2DEvent[] = layer.ctx.__getEvents();
      const fillTextCalls = events.filter((call: any) => call.type === 'fillText');
      expect(fillTextCalls.length).toBeGreaterThanOrEqual(1);
    });

    it('should not throw exception when setting data without reference system', () => {
      // Arrange
      const layer = new CalloutCanvasLayer('calloutcanvaslayer', {});
      layer.onMount({ elm });
      layer.onUpdate({});
      layer.onRescale(layerEvent);

      layer.ctx.__clearEvents();

      // Act
      // Assert
      expect(() => {
        layer.data = data;
      }).not.toThrow();
    });
  });
});
