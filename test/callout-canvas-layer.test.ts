import { describe, expect, it, beforeEach, afterEach, vi, MockInstance } from 'vitest';
import { CanvasRenderingContext2DEvent } from 'jest-canvas-mock';
import createMockRaf from 'mock-raf';
import { CalloutCanvasLayer, IntersectionReferenceSystem } from '../src/index';
import { rescaleEventStub } from './test-helpers';

describe('CalloutCanvasLayer', () => {
  let elm: HTMLElement;
  const wp = [
    [30, 40, 4],
    [40, 70, 6],
    [45, 100, 8],
    [50, 110, 10],
  ];

  const mockRaf = createMockRaf();

  let mockRequestAnimationFrame: MockInstance<(callback: FrameRequestCallback) => number>;

  beforeEach(() => {
    elm = document.createElement('div');
    mockRequestAnimationFrame = vi.spyOn(window, 'requestAnimationFrame');
    mockRequestAnimationFrame.mockImplementation(mockRaf.raf);
  });

  afterEach(() => {
    elm.remove();
    mockRequestAnimationFrame.mockRestore();
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

    it('should render when reference system is set in constructor', () => {
      // Arrange
      const referenceSystem = new IntersectionReferenceSystem(wp);
      const layer = new CalloutCanvasLayer('calloutcanvaslayer', { referenceSystem });
      layer.onMount({ elm });
      layer.onUpdate({ data });
      layer.onRescale(rescaleEventStub());

      layer.ctx?.__clearEvents();

      // Act
      layer.data = data;
      mockRaf.step();

      // Assert
      const events: CanvasRenderingContext2DEvent[] = layer.ctx?.__getEvents() ?? [];
      const fillTextCalls = events.filter((call: CanvasRenderingContext2DEvent) => call.type === 'fillText');
      expect(fillTextCalls.length).toBeGreaterThanOrEqual(1);
    });

    it('should render when reference system is set after constructor', () => {
      // Arrange
      const layer = new CalloutCanvasLayer('calloutcanvaslayer', {});
      const referenceSystem = new IntersectionReferenceSystem(wp);
      layer.referenceSystem = referenceSystem;
      layer.onMount({ elm });
      layer.onUpdate({ data });
      layer.onRescale(rescaleEventStub());

      layer.ctx?.__clearEvents();

      // Act
      layer.data = data;
      mockRaf.step();

      // Assert
      const events: CanvasRenderingContext2DEvent[] = layer.ctx?.__getEvents() ?? [];
      const fillTextCalls = events.filter((call: CanvasRenderingContext2DEvent) => call.type === 'fillText');
      expect(fillTextCalls.length).toBeGreaterThanOrEqual(1);
    });

    it('should not throw exception when setting data without reference system', () => {
      // Arrange
      const layer = new CalloutCanvasLayer('calloutcanvaslayer', {});
      layer.onMount({ elm });
      layer.onUpdate({ data });
      layer.onRescale(rescaleEventStub());

      layer.ctx?.__clearEvents();

      // Act
      // Assert
      expect(() => {
        layer.data = data;
      }).not.toThrow();
    });
  });
});
