import { centreOffset } from './centreOffset';
import {
    add,
    halfMidpoint,
    scale,
    shrink,
    Vector2
} from './Vector2';

export function centreTranslation(outer: Vector2, position: Vector2, size: Vector2, innerScale: number): Vector2 {
    let scaled = scale(size, innerScale);
    let centredWithinScaled = add(position, halfMidpoint(scaled, size));
    let centeredWithinOuter = centreOffset(outer, centredWithinScaled, scaled);
    return shrink(centeredWithinOuter, innerScale);
}
