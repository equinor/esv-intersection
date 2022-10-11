/* eslint-disable no-magic-numbers */
import { Point } from 'pixi.js';
import { createComplexRopeSegmentsForCement } from '../src/datautils/wellboreItemShapeGenerator';
import { CementLayer, IntersectionReferenceSystem, PixiRenderApplication } from '../src/index';
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
      const pixiRenderApplication = new PixiRenderApplication();
      const referenceSystem = new IntersectionReferenceSystem(wp);
      const layer = new CementLayer(pixiRenderApplication, 'casing-layer', { referenceSystem });
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
      const layer = new CementLayer(pixiRenderApplication, 'casing-layer', {});
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
      const layer = new CementLayer(pixiRenderApplication, 'casing-layer', {});
      layer.onMount({ elm });
      layer.onUpdate({ data });
      layer.onRescale(rescaleEventStub());

      // Act
      // Assert
      expect(() => {
        layer.data = data;
      }).not.toThrow();
    });
  });

  describe('createComplexRopeSegmentsForCement', () => {
    const getMockPoints = (start: number, end: number) => [
      {
        point: [0, start],
        md: start,
      },
      {
        point: [0, end],
        md: end,
      },
    ];

    it('Give correct diameter for data set 1', () => {
      const casings = [{ casingId: '1', diameter: 30, end: 200, hasShoe: true, innerDiameter: 28, start: 100 }];
      const cement = { casingIds: ['1'], toc: 150 };
      const holes = [{ start: 50, end: 250, diameter: 36 }];

      const ropeSegments = createComplexRopeSegmentsForCement(cement, casings, holes, 1, getMockPoints);

      expect(ropeSegments).toEqual([
        {
          diameter: 36,
          points: [new Point(0, 150), new Point(0, 200)],
        },
      ]);
    });

    it('Give correct diameter for data set 2', () => {
      const casings = [
        { id: 'casing1', casingId: '1', diameter: 30, hasShoe: true, innerDiameter: 30, start: 50, end: 150 },
        { id: 'casing2', casingId: '2', diameter: 26, hasShoe: true, innerDiameter: 26, start: 50, end: 200 },
      ];
      const cement = { casingIds: ['2'], toc: 100 };
      const holes = [{ start: 50, end: 250, diameter: 36 }];

      const ropeSegments = createComplexRopeSegmentsForCement(cement, casings, holes, 1, getMockPoints);

      expect(ropeSegments).toEqual([
        {
          diameter: 30,
          points: [new Point(0, 100), new Point(0, 150)],
        },
        {
          diameter: 36,
          points: [new Point(0, 150), new Point(0, 200)],
        },
      ]);
    });

    it('Give correct diameter for data set 3', () => {
      const casings = [
        { id: 'casing1', casingId: '1', diameter: 16, hasShoe: true, innerDiameter: 16, start: 0, end: 200 },
        { id: 'casing2', casingId: '2', diameter: 30, hasShoe: true, innerDiameter: 30, start: 50, end: 100 },
        { id: 'casing3', casingId: '2', diameter: 20, hasShoe: true, innerDiameter: 20, start: 100, end: 150 },
      ];
      const cement = { casingIds: ['1'], toc: 25 };
      const holes = [{ start: 0, end: 250, diameter: 36 }];

      const ropeSegments = createComplexRopeSegmentsForCement(cement, casings, holes, 1, getMockPoints);

      expect(ropeSegments).toEqual([
        {
          diameter: 30,
          points: [new Point(0, 25), new Point(0, 50)],
        },
        {
          diameter: 20,
          points: [new Point(0, 50), new Point(0, 100)],
        },
        {
          diameter: 20,
          points: [new Point(0, 100), new Point(0, 150)],
        },
        {
          diameter: 36,
          points: [new Point(0, 150), new Point(0, 200)],
        },
      ]);
    });
  });
});
