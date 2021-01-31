import { Bounds } from './Bounds';
import { centreOffset } from './centreOffset';
import {
    add,
    halfMidpoint,
    scale,
    shrink,
    Vector2
} from './Vector2';

export function centreTranslation(outer: Vector2, bounds: Bounds, innerScale: number): Vector2 {
    let scaled = scale(bounds.size, innerScale);
    let centredWithinScaled = add(bounds.position, halfMidpoint(scaled, bounds.size));

    let centeredWithinOuter = centreOffset(outer, {
        position: centredWithinScaled,
        size: scaled
    });

    return shrink(centeredWithinOuter, innerScale);
}
