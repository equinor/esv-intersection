import { Point, Rectangle, RENDERER_TYPE, Texture, groupD8 } from 'pixi.js';
import { WellboreBaseComponentLayer, WellComponentBaseOptions } from './WellboreBaseComponentLayer';
import { ImageComponent, PixiRenderApplication } from '..';
import { UniformTextureStretchRope } from './CustomDisplayObjects/UniformTextureStretchRope';

interface ComponentRenderObject {
  pathPoints: number[][];
  diameter: number;
  imageKey: string;
}

export interface ImageComponentLayerOptions<T extends ImageComponent[]> extends WellComponentBaseOptions<T> {
  images: {
    [key: string]: string;
  };
}

export class ImageComponentLayer<T extends ImageComponent[]> extends WellboreBaseComponentLayer<T> {
  _textureCacheArray: { [key: string]: Texture };

  constructor(ctx: PixiRenderApplication, id?: string, options?: ImageComponentLayerOptions<T>) {
    super(ctx, id, options);
    this.options = {
      ...this.options,
      ...options,
    };

    const { images } = this.options as ImageComponentLayerOptions<T>;
    this._textureCacheArray = Object.entries(images).reduce((list: { [key: string]: Texture }, [key, image]) => {
      list[key] = Texture.from(image);
      return list;
    }, {});
  }

  preRender(): void {
    const { data } = this;

    if (!data || !this.rescaleEvent || !this.referenceSystem) {
      return;
    }

    // draw smaller components on top of bigger ones if overlapping
    const sortedComponents = data.sort((a: ImageComponent, b: ImageComponent) => b.diameter - a.diameter);
    const renderObjects = sortedComponents.map((component: ImageComponent) => this.prepareImageRenderObject(component));

    renderObjects.forEach((renderObject) => this.drawComponent(renderObject));
  }

  prepareImageRenderObject = (component: ImageComponent): ComponentRenderObject => {
    if (component == null) {
      return;
    }
    const { exaggerationFactor } = this.options as ImageComponentLayerOptions<T>;

    const diameter = component.diameter * exaggerationFactor;

    const pathPoints = this.getZFactorScaledPathForPoints(component.start, component.end, [component.start, component.end]).map((d) => d.point);

    return {
      pathPoints,
      diameter,
      imageKey: component.imageKey,
    };
  };

  drawComponent = (renderObject: ComponentRenderObject): void => {
    const { pathPoints, diameter } = renderObject;

    // Pixi.js-legacy with Canvas render type handles advanced render methods poorly
    if (this.renderType() === RENDERER_TYPE.CANVAS) {
      // TODO implement this
      // this.drawBigPolygon(polygon, solidColor);
    } else {
      const texture = this.createTexture(renderObject.imageKey, diameter);
      this.drawSVGRope(
        pathPoints.map((p) => new Point(p[0], p[1])),
        texture,
      );
    }
  };

  drawSVGRope(path: Point[], texture: Texture): void {
    if (path.length === 0) {
      return null;
    }

    const rope: UniformTextureStretchRope = new UniformTextureStretchRope(texture, path);

    this.addChild(rope);
  }

  createTexture(imageKey: string, diameter: number): Texture {
    return new Texture(this._textureCacheArray[imageKey].baseTexture, null, new Rectangle(0, 0, 0, diameter), null, groupD8.MAIN_DIAGONAL);
  }

  getInternalLayerIds(): string[] {
    return [];
  }
}
