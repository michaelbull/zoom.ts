import { Bounds } from '../math/bounds';
import { Vector2 } from '../math/vector2';
export declare class ScaleAndTranslate {
    static centreOf(target: Vector2, bounds: Bounds): ScaleAndTranslate;
    private readonly scale;
    private readonly translation;
    constructor(scale: number, translation: Vector2);
    toString2d(): string;
    toString3d(): string;
}
