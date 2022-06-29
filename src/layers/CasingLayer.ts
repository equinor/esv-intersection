import { Point, Rectangle, RENDERER_TYPE, Texture } from 'pixi.js';
import { zip } from 'd3-array';
import { WellboreBaseComponentLayer } from './WellboreBaseComponentLayer';
import { CasingLayerOptions, Casing } from '..';
import { makeTubularPolygon } from '../datautils/wellboreItemShapeGenerator';
import { createNormals, offsetPoint, offsetPoints } from '../utils/vectorUtils';
import { SHOE_LENGTH, SHOE_WIDTH } from '../constants';

export interface CasingRenderObject {
  pathPoints: number[][];
  polygon: Point[];
  leftPath: Point[];
  rightPath: Point[];
  radius: number;
  diameter: number;
  casingWallWidth: number;
}

export class CasingLayer extends WellboreBaseComponentLayer {
  constructor(id?: string, options?: CasingLayerOptions) {
    super(id, options);
    this.options = {
      ...this.options,
      solidColor: 0xdcdcdc,
      lineColor: 0x575757,
      ...options,
    };
  }

  preRender(): void {
    const { data }: { data: Casing[] } = this;

    if (!data || !this.rescaleEvent || !this.referenceSystem) {
      return;
    }

    // draw smaller casings and holes on top of bigger ones if overlapping
    const sortedCasings = data.sort((a: Casing, b: Casing) => b.diameter - a.diameter);
    const casingRenderObjects = sortedCasings.map((casing: Casing) => this.prepareCasingRenderObject(casing));
    // @ts-ignore
    const zippedRenderObjects: [Casing, CasingRenderObject][] = zip(sortedCasings, casingRenderObjects);
    zippedRenderObjects.forEach((zippedRenderObject) => this.drawCasing(zippedRenderObject));
  }

  prepareCasingRenderObject = (casing: Casing): CasingRenderObject => {
    if (casing == null) {
      return;
    }
    const { exaggerationFactor } = this.options as CasingLayerOptions;

    const diameter = casing.diameter * exaggerationFactor;
    const innerDiameter = casing.innerDiameter * exaggerationFactor;

    const radius = diameter / 2;
    const innerRadius = innerDiameter / 2;

    const path = this.getZFactorScaledPathForPoints(casing.start, casing.end, [casing.start, casing.end]);

    const pathPoints = path.map((p) => p.point);
    const normals = createNormals(pathPoints);
    const rightPath = offsetPoints(pathPoints, normals, radius);
    const leftPath = offsetPoints(pathPoints, normals, -radius);

    const polygon = makeTubularPolygon(leftPath, rightPath);

    const casingWallWidth = Math.abs(radius - innerRadius);

    return {
      pathPoints,
      polygon,
      leftPath,
      rightPath,
      radius,
      diameter,
      casingWallWidth,
    };
  };

  drawCasing = (zippedRenderObject: [Casing, CasingRenderObject]): void => {
    const { lineColor, solidColor } = this.options as CasingLayerOptions;
    const [casing, { pathPoints, polygon, leftPath, rightPath, radius, diameter, casingWallWidth }] = zippedRenderObject;

    // Pixi.js-legacy handles SimpleRope and advanced render methods poorly
    if (this.renderType() === RENDERER_TYPE.CANVAS) {
      this.drawBigPolygon(polygon, solidColor);
    } else {
      const texture = this.createTexture(diameter);
      this.drawRope(
        pathPoints.map((p) => new Point(p[0], p[1])),
        texture,
        solidColor,
      );
    }

    this.drawOutline(leftPath, rightPath, lineColor, casingWallWidth, true);

    if (casing.hasShoe) {
      this.drawShoe(casing.end, radius);
    }
  };

  drawShoe(casingEnd: number, casingRadius: number): void {
    const { exaggerationFactor } = this.options as CasingLayerOptions;

    const shoeWidth = SHOE_WIDTH * exaggerationFactor;
    const shoeLength = SHOE_LENGTH * exaggerationFactor;
    const shoeCoords = this.generateShoe(casingEnd, casingRadius, shoeLength, shoeWidth);
    const shoeCoords2 = this.generateShoe(casingEnd, casingRadius, shoeLength, -shoeWidth);
    this.drawBigPolygon(shoeCoords2);
    this.drawBigPolygon(shoeCoords);
  }

  generateShoe = (casingEnd: number, casingRadius: number, length: number, width: number): Point[] => {
    const start = casingEnd - length;
    const end = casingEnd;
    const path = this.getZFactorScaledPathForPoints(start, end, [start, end]);

    const points = path.map((p) => p.point);
    const normal = createNormals(points);
    const shoeEdge: Point[] = offsetPoints(points, normal, casingRadius * (width < 0 ? -1 : 1));

    const shoeTipPoint = points[points.length - 1];
    const shoeTipNormal = normal[normal.length - 1];
    const shoeTip: Point = offsetPoint(shoeTipPoint, shoeTipNormal, width);

    return [...shoeEdge, shoeTip];
  };

  createTexture(diameter: number): Texture {
    const textureWidthPO2 = 16;
    return new Texture(Texture.WHITE.baseTexture, null, new Rectangle(0, 0, textureWidthPO2, diameter));
  }
}
