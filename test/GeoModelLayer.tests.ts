import { GeomodelLayer } from '../src/index';
import { GeomodelLayerOptions, GeoModelData } from '../src/interfaces';
import { scaleLinear } from 'd3-scale';

describe('Layer', () => {
  describe('GeoModel', () => {
    let elm: HTMLElement;
    let geoModelLayer: GeomodelLayer;
    beforeEach(() => {
      const options: GeomodelLayerOptions = { order: 1 };
      geoModelLayer = new GeomodelLayer('webgl', options);
      const height = 500;
      const width = 500;

      const root = document.createElement('div');
      root.className = 'grid-container';
      root.setAttribute(
        'style',
        `height: ${height}px; width: ${width}px;background-color: #eee;`,
      );
      root.setAttribute('height', `${height}`);
      root.setAttribute('width', `${width}`);

      geoModelLayer.onMount({ elm: root, height, width });
      // geoModelLayer.onUpdate(createEventObj(root));

      elm = root;
    });
    it('performance on small dataset input', () => {
      // Arrange
      const options: GeomodelLayerOptions = { order: 1 };
      const smallData: GeoModelData[] = [
        {
          name: 'strat 1',
          color: 0xff000,
          md: [70, 90, 100, 110, 100, 100],
          bottomMd: [
            100 + 50,
            120 + 50,
            100 + 50,
            140 + 50,
            100 + 50,
            120 + 50,
          ],
          pos: [
            [0, 99],
            [100, 99],
            [200, 99],
            [450, 99],
            [600, 99],
            [1000, 99],
          ],
          bottomPos: [
            [0, 99],
            [140, 99],
            [200, 99],
            [400, 99],
            [750, 99],
            [1000, 99],
          ],
        },
        {
          name: 'strat 2',
          color: 0xffff0,
          md: [100 + 50, 120 + 50, 100 + 50, 140 + 50, 100 + 50, 120 + 50],
          bottomMd: null,
          pos: [
            [0, 99],
            [140, 99],
            [200, 99],
            [400, 99],
            [750, 99],
            [1000, 99],
          ],
          bottomPos: null,
        },
        {
          name: 'strat 3',
          color: 0xff00ff,
          md: [
            100 + 150,
            120 + 120,
            100 + 170,
            140 + 150,
            100 + 150,
            177 + 150,
          ],
          bottomMd: [
            100 + 250,
            120 + 220,
            100 + 270,
            100 + 250,
            140 + 250,
            177 + 250,
          ],
          pos: [
            [0, 99],
            [190, 99],
            [200, 99],
            [520, 99],
            [850, 99],
            [1000, 99],
          ],
          bottomPos: [
            [0, 99],
            [200, 99],
            [210, 99],
            [300, 99],
            [750, 99],
            [1000, 99],
          ],
        },
        {
          name: 'strat 4',
          color: 0x0330ff,
          md: [
            100 + 250,
            120 + 220,
            100 + 270,
            100 + 250,
            140 + 250,
            177 + 250,
          ],
          bottomMd: [
            100 + 250 + 50,
            120 + 220 + 50,
            100 + 270 + 50,
            100 + 250 + 50,
            140 + 250 + 50,
            177 + 250 + 40,
          ],
          pos: [
            [0, 99],
            [200, 99],
            [210, 99],
            [300, 99],
            [750, 99],
            [1000, 99],
          ],
          bottomPos: [
            [0, 99],
            [250, 99],
            [270, 99],
            [400, 99],
            [750, 99],
            [1000, 99],
          ],
        },
        {
          name: 'strat 5',
          color: 0x113322,
          md: [
            100 + 250 + 50,
            120 + 220 + 50,
            190 + 270 + 50,
            100 + 250 + 50,
            170 + 250 + 50,
            177 + 250 + 40,
          ],
          pos: [
            [0, 99],
            [200, 99],
            [210, 99],
            [300, 99],
            [750, 99],
            [1000, 99],
          ],
          bottomMd: null,
          bottomPos: null,
        },
      ];

      const xScale = scaleLinear()
        .domain([0, 500])
        .range([0, 500]);
      const yScale = scaleLinear()
        .domain([0, 500])
        .range([0, 500]);

      geoModelLayer.onUpdate({
        xScale,
        yScale,
        elm,
        data: smallData,
      });
      const start = performance.now();

      // Act

      const end = performance.now();

      // Assert
      expect(end - start).toBeLessThan(100);
    });
  });
});
