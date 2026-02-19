import { Point, MeshGeometry } from 'pixi.js';
export declare class FixedWidthSimpleRopeGeometry extends MeshGeometry {
    points: Point[];
    _width: number;
    /**
     * @param {number} [width=200] - The width (i.e., thickness) of the rope.
     * @param {Point[]} [points] - An array of Point objects to construct this rope.
     */
    constructor(points: Point[], width?: number);
    /**
     * The width (i.e., thickness) of the rope.
     * @member {number}
     * @readOnly
     */
    get width(): number;
    /**
     * Refreshes Rope indices and uvs
     * @private
     */
    private build;
    /**
     * refreshes vertices of Rope mesh
     */
    updateVertices(): void;
    update(): void;
}
//# sourceMappingURL=FixedWidthSimpleRopeGeometry.d.ts.map